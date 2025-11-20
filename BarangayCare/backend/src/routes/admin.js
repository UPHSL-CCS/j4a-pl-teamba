import { Hono } from 'hono';
import { collections } from '../config/database.js';
import { ObjectId } from 'mongodb';

const admin = new Hono();

/**
 * Get admin dashboard statistics
 */
admin.get('/dashboard/stats', async (c) => {
  try {
    const [
      pendingAppointments,
      todayAppointments,
      pendingMedicineRequests,
      lowStockMedicines,
      totalPatients,
      totalDoctors
    ] = await Promise.all([
      collections.appointments().countDocuments({ status: 'pending' }),
      collections.appointments().countDocuments({ 
        status: { $in: ['pending', 'approved'] },
        date: new Date().toISOString().split('T')[0] // Match today's date string (YYYY-MM-DD)
      }),
      collections.medicineRequests().countDocuments({ status: 'pending' }),
      collections.medicineInventory().countDocuments({ 
        $expr: { $lte: ['$stock_qty', '$reorder_level'] }
      }),
      collections.patients().countDocuments(),
      collections.doctors().countDocuments({ is_active: true })
    ]);

    return c.json({
      pending_appointments: pendingAppointments,
      today_appointments: todayAppointments,
      pending_medicine_requests: pendingMedicineRequests,
      low_stock_medicines: lowStockMedicines,
      total_patients: totalPatients,
      total_doctors: totalDoctors
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return c.json({ error: 'Failed to fetch dashboard statistics' }, 500);
  }
});

/**
 * Get all appointments with filters
 */
admin.get('/appointments', async (c) => {
  try {
    const status = c.req.query('status');
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '20');
    const skip = (page - 1) * limit;

    const filter = {};
    if (status) {
      filter.status = status;
    }

    const [appointments, total] = await Promise.all([
      collections.appointments()
        .find(filter)
        .sort({ date: -1, time: -1, created_at: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      collections.appointments().countDocuments(filter)
    ]);

    // Populate patient and doctor info
    const enrichedAppointments = await Promise.all(
      appointments.map(async (apt) => {
        const [patient, doctor] = await Promise.all([
          collections.patients().findOne({ _id: new ObjectId(apt.patient_id) }),
          collections.doctors().findOne({ _id: new ObjectId(apt.doctor_id) })
        ]);

        return {
          ...apt,
          patient_name: patient?.name || 'Unknown',
          patient_contact: patient?.contact || patient?.contact_number || 'N/A',
          doctor_name: doctor?.name || 'Unknown',
          doctor_specialization: doctor?.expertise || 'N/A'
        };
      })
    );

    return c.json({
      appointments: enrichedAppointments,
      pagination: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return c.json({ error: 'Failed to fetch appointments' }, 500);
  }
});

/**
 * Approve appointment
 */
admin.patch('/appointments/:id/approve', async (c) => {
  try {
    const id = c.req.param('id');
    const { admin_notes } = await c.req.json();
    const adminInfo = c.get('admin');

    const result = await collections.appointments().updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          status: 'approved',
          admin_notes: admin_notes || '',
          approved_by: adminInfo._id,
          approved_at: new Date(),
          updated_at: new Date()
        } 
      }
    );

    if (result.matchedCount === 0) {
      return c.json({ error: 'Appointment not found' }, 404);
    }

    return c.json({ 
      message: 'Appointment approved successfully',
      appointment_id: id
    });
  } catch (error) {
    console.error('Error approving appointment:', error);
    return c.json({ error: 'Failed to approve appointment' }, 500);
  }
});

/**
 * Reject appointment
 */
admin.patch('/appointments/:id/reject', async (c) => {
  try {
    const id = c.req.param('id');
    const { admin_notes, reason } = await c.req.json();
    const adminInfo = c.get('admin');

    if (!reason) {
      return c.json({ error: 'Rejection reason is required' }, 400);
    }

    const result = await collections.appointments().updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          status: 'rejected',
          admin_notes: admin_notes || reason,
          rejection_reason: reason,
          rejected_by: adminInfo._id,
          rejected_at: new Date(),
          updated_at: new Date()
        } 
      }
    );

    if (result.matchedCount === 0) {
      return c.json({ error: 'Appointment not found' }, 404);
    }

    return c.json({ 
      message: 'Appointment rejected',
      appointment_id: id
    });
  } catch (error) {
    console.error('Error rejecting appointment:', error);
    return c.json({ error: 'Failed to reject appointment' }, 500);
  }
});

/**
 * Complete appointment (mark as finished after consultation)
 */
admin.patch('/appointments/:id/complete', async (c) => {
  try {
    const id = c.req.param('id');
    const { admin_notes } = await c.req.json();
    const adminInfo = c.get('admin');

    const result = await collections.appointments().updateOne(
      { _id: new ObjectId(id), status: 'approved' },
      { 
        $set: { 
          status: 'completed',
          admin_notes: admin_notes || '',
          completed_by: adminInfo._id,
          completed_at: new Date(),
          updated_at: new Date()
        } 
      }
    );

    if (result.matchedCount === 0) {
      return c.json({ error: 'Appointment not found or not approved' }, 404);
    }

    return c.json({ 
      message: 'Appointment marked as completed',
      appointment_id: id
    });
  } catch (error) {
    console.error('Error completing appointment:', error);
    return c.json({ error: 'Failed to complete appointment' }, 500);
  }
});

/**
 * Get low stock medicines
 */
admin.get('/medicines/low-stock', async (c) => {
  try {
    const medicines = await collections.medicineInventory()
      .find({
        $expr: { $lte: ['$stock_qty', '$reorder_level'] }
      })
      .sort({ stock_qty: 1 })
      .toArray();

    return c.json({ medicines });
  } catch (error) {
    console.error('Error fetching low stock medicines:', error);
    return c.json({ error: 'Failed to fetch low stock medicines' }, 500);
  }
});

/**
 * Add new medicine
 */
admin.post('/medicines', async (c) => {
  try {
    const medicineData = await c.req.json();
    
    const newMedicine = {
      ...medicineData,
      stock_qty: medicineData.stock_qty || 0,
      reorder_level: medicineData.reorder_level || 20,
      created_at: new Date(),
      updated_at: new Date()
    };

    const result = await collections.medicineInventory().insertOne(newMedicine);

    return c.json({ 
      message: 'Medicine added successfully',
      medicine_id: result.insertedId
    }, 201);
  } catch (error) {
    console.error('Error adding medicine:', error);
    return c.json({ error: 'Failed to add medicine' }, 500);
  }
});

/**
 * Update medicine
 */
admin.put('/medicines/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const updateData = await c.req.json();
    
    const { stock_qty, ...otherData } = updateData;
    
    const result = await collections.medicineInventory().updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          ...otherData,
          updated_at: new Date()
        } 
      }
    );

    if (result.matchedCount === 0) {
      return c.json({ error: 'Medicine not found' }, 404);
    }

    return c.json({ message: 'Medicine updated successfully' });
  } catch (error) {
    console.error('Error updating medicine:', error);
    return c.json({ error: 'Failed to update medicine' }, 500);
  }
});

/**
 * Adjust medicine stock
 */
admin.post('/medicines/:id/adjust', async (c) => {
  try {
    const id = c.req.param('id');
    const { quantity_change, reason, change_type } = await c.req.json();
    const adminInfo = c.get('admin');

    if (!quantity_change || !reason || !change_type) {
      return c.json({ error: 'quantity_change, reason, and change_type are required' }, 400);
    }

    const medicine = await collections.medicineInventory().findOne({ 
      _id: new ObjectId(id) 
    });

    if (!medicine) {
      return c.json({ error: 'Medicine not found' }, 404);
    }

    const newStock = medicine.stock_qty + quantity_change;

    if (newStock < 0) {
      return c.json({ error: 'Insufficient stock' }, 400);
    }

    // Record stock history
    await collections.stockHistory().insertOne({
      medicine_id: new ObjectId(id),
      change_type,
      quantity_change,
      previous_stock: medicine.stock_qty,
      new_stock: newStock,
      reason,
      admin_id: adminInfo._id,
      timestamp: new Date()
    });

    // Update stock
    await collections.medicineInventory().updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          stock_qty: newStock,
          updated_at: new Date()
        }
      }
    );

    return c.json({ 
      message: 'Stock adjusted successfully',
      previous_stock: medicine.stock_qty,
      new_stock: newStock
    });
  } catch (error) {
    console.error('Error adjusting stock:', error);
    return c.json({ error: 'Failed to adjust stock' }, 500);
  }
});

/**
 * Delete medicine
 */
admin.delete('/medicines/:id', async (c) => {
  try {
    const id = c.req.param('id');

    const result = await collections.medicineInventory().deleteOne({ 
      _id: new ObjectId(id) 
    });

    if (result.deletedCount === 0) {
      return c.json({ error: 'Medicine not found' }, 404);
    }

    return c.json({ message: 'Medicine deleted successfully' });
  } catch (error) {
    console.error('Error deleting medicine:', error);
    return c.json({ error: 'Failed to delete medicine' }, 500);
  }
});

/**
 * Get all medicine requests with filters
 */
admin.get('/medicine-requests', async (c) => {
  try {
    const status = c.req.query('status');
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '20');
    const skip = (page - 1) * limit;

    const filter = {};
    if (status && status !== 'all') {
      filter.status = status;
    }

    const [requests, total] = await Promise.all([
      collections.medicineRequests()
        .find(filter)
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      collections.medicineRequests().countDocuments(filter)
    ]);

    // Populate patient and medicine info
    const enrichedRequests = await Promise.all(
      requests.map(async (req) => {
        const [patient, medicine] = await Promise.all([
          collections.patients().findOne({ _id: new ObjectId(req.patient_id) }),
          collections.medicineInventory().findOne({ _id: new ObjectId(req.medicine_id) })
        ]);

        return {
          ...req,
          patient_name: patient?.name || 'Unknown Patient',
          patient_contact: patient?.contact || patient?.contact_number || 'N/A',
          medicine_name: medicine?.med_name || req.medicine_name || 'Unknown Medicine',
          current_stock: medicine?.stock_qty || 0
        };
      })
    );

    return c.json({
      requests: enrichedRequests,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error fetching medicine requests:', error);
    return c.json({ error: 'Failed to fetch medicine requests' }, 500);
  }
});

/**
 * Get single medicine request detail
 */
admin.get('/medicine-requests/:id', async (c) => {
  try {
    const requestId = c.req.param('id');
    
    const request = await collections.medicineRequests().findOne({
      _id: new ObjectId(requestId)
    });

    if (!request) {
      return c.json({ error: 'Medicine request not found' }, 404);
    }

    // Populate patient and medicine info
    const [patient, medicine] = await Promise.all([
      collections.patients().findOne({ _id: new ObjectId(request.patient_id) }),
      collections.medicineInventory().findOne({ _id: new ObjectId(request.medicine_id) })
    ]);

    const enrichedRequest = {
      ...request,
      patient_name: patient?.name || 'Unknown Patient',
      patient_contact: patient?.contact || patient?.contact_number || 'N/A',
      medicine_name: medicine?.med_name || request.medicine_name || 'Unknown Medicine',
      current_stock: medicine?.stock_qty || 0
    };

    return c.json(enrichedRequest);
  } catch (error) {
    console.error('Error fetching medicine request detail:', error);
    return c.json({ error: 'Failed to fetch medicine request detail' }, 500);
  }
});

/**
 * Approve medicine request
 */
admin.patch('/medicine-requests/:id/approve', async (c) => {
  try {
    const requestId = c.req.param('id');
    const body = await c.req.json().catch(() => ({}));
    const { admin_notes } = body;

    // Get the request
    const request = await collections.medicineRequests().findOne({
      _id: new ObjectId(requestId)
    });

    if (!request) {
      return c.json({ error: 'Medicine request not found' }, 404);
    }

    if (request.status !== 'pending') {
      return c.json({ error: 'Only pending requests can be approved' }, 400);
    }

    // Check if medicine has enough stock
    const medicine = await collections.medicineInventory().findOne({
      _id: new ObjectId(request.medicine_id)
    });

    if (!medicine) {
      return c.json({ error: 'Medicine not found in inventory' }, 404);
    }

    // If medicine requires prescription, verify either prescription_id or prescription_url exists
    if (medicine.is_prescription_required) {
      if (!request.prescription_id && !request.prescription_url) {
        return c.json({ 
          error: 'Prescription required: This medicine requires either a doctor-issued prescription or an uploaded prescription image',
          requires_prescription: true
        }, 400);
      }
      
      // If prescription_id exists, verify it's still valid
      if (request.prescription_id) {
        const prescription = await collections.prescriptions().findOne({
          _id: new ObjectId(request.prescription_id),
          status: 'active'
        });
        
        if (!prescription) {
          return c.json({ 
            error: 'Linked prescription is invalid or has expired',
            requires_prescription: true
          }, 400);
        }
        
        // Check expiry
        if (new Date() > prescription.expiry_date) {
          await collections.prescriptions().updateOne(
            { _id: new ObjectId(request.prescription_id) },
            { $set: { status: 'expired', updated_at: new Date() } }
          );
          return c.json({ 
            error: 'Linked prescription has expired',
            requires_prescription: true
          }, 400);
        }
      }
    }

    if (medicine.stock_qty < request.quantity) {
      return c.json({ 
        error: 'Insufficient stock',
        available: medicine.stock_qty,
        requested: request.quantity
      }, 400);
    }

    // Deduct stock atomically
    const stockUpdate = await collections.medicineInventory().updateOne(
      {
        _id: new ObjectId(request.medicine_id),
        stock_qty: { $gte: request.quantity }
      },
      {
        $inc: { stock_qty: -request.quantity },
        $set: { updated_at: new Date() }
      }
    );

    if (stockUpdate.matchedCount === 0) {
      return c.json({ error: 'Failed to update stock. Insufficient quantity.' }, 400);
    }

    // Record stock history
    await collections.stockHistory().insertOne({
      medicine_id: request.medicine_id,
      change_type: 'dispense',
      quantity_change: -request.quantity,
      previous_stock: medicine.stock_qty,
      new_stock: medicine.stock_qty - request.quantity,
      reason: `Medicine request approved for patient ${request.patient_id}`,
      request_id: request._id,
      timestamp: new Date()
    });

    // Update request status
    const result = await collections.medicineRequests().updateOne(
      { _id: new ObjectId(requestId) },
      {
        $set: {
          status: 'approved',
          approved_at: new Date(),
          admin_notes: admin_notes || null,
          updated_at: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return c.json({ error: 'Failed to update request status' }, 500);
    }

    return c.json({ 
      message: 'Medicine request approved successfully',
      remaining_stock: medicine.stock_qty - request.quantity
    });
  } catch (error) {
    console.error('Error approving medicine request:', error);
    return c.json({ error: 'Failed to approve medicine request' }, 500);
  }
});

/**
 * Reject medicine request
 */
admin.patch('/medicine-requests/:id/reject', async (c) => {
  try {
    const requestId = c.req.param('id');
    const body = await c.req.json();
    const { reason } = body;

    if (!reason || reason.trim().length === 0) {
      return c.json({ error: 'Rejection reason is required' }, 400);
    }

    // Get the request
    const request = await collections.medicineRequests().findOne({
      _id: new ObjectId(requestId)
    });

    if (!request) {
      return c.json({ error: 'Medicine request not found' }, 404);
    }

    if (request.status !== 'pending') {
      return c.json({ error: 'Only pending requests can be rejected' }, 400);
    }

    // Update request status
    const result = await collections.medicineRequests().updateOne(
      { _id: new ObjectId(requestId) },
      {
        $set: {
          status: 'rejected',
          rejection_reason: reason,
          rejected_at: new Date(),
          updated_at: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return c.json({ error: 'Medicine request not found' }, 404);
    }

    return c.json({ message: 'Medicine request rejected successfully' });
  } catch (error) {
    console.error('Error rejecting medicine request:', error);
    return c.json({ error: 'Failed to reject medicine request' }, 500);
  }
});

export default admin;
