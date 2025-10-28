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
        appointment_date: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0)),
          $lt: new Date(new Date().setHours(23, 59, 59, 999))
        }
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
        .sort({ appointment_date: -1, created_at: -1 })
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
          patient_name: patient ? `${patient.first_name} ${patient.last_name}` : 'Unknown',
          patient_contact: patient?.contact_number,
          doctor_name: doctor?.doctor_name,
          doctor_specialization: doctor?.specialization
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

export default admin;
