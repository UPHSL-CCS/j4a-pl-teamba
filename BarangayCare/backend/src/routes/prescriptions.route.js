import { Hono } from 'hono';
import { collections } from '../config/database.js';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { adminOnly } from '../middleware/admin.js';
import { ObjectId } from 'mongodb';

const prescriptions = new Hono();

/**
 * POST /api/prescriptions/create
 * Admin creates prescription after consultation
 * Body: {
 *   appointment_id: string,
 *   patient_id: string,
 *   medicines: [{ medicine_id, medicine_name, dosage, quantity, instructions }],
 *   diagnosis: string,
 *   notes: string,
 *   valid_days: number
 * }
 */
prescriptions.post('/create', authMiddleware, adminOnly, async (c) => {
  try {
    const { 
      appointment_id, 
      patient_id, 
      medicines, 
      diagnosis, 
      notes,
      valid_days = 30 
    } = await c.req.json();

    // Validation
    if (!appointment_id || !patient_id || !medicines || medicines.length === 0) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Verify appointment exists and is completed
    const appointment = await collections.appointments().findOne({
      _id: new ObjectId(appointment_id),
      status: 'completed'
    });

    if (!appointment) {
      return c.json({ error: 'Appointment not found or not completed' }, 404);
    }

    // Verify patient exists
    const patient = await collections.patients().findOne({
      _id: new ObjectId(patient_id)
    });

    if (!patient) {
      return c.json({ error: 'Patient not found' }, 404);
    }

    // Calculate expiry date
    const issued_date = new Date();
    const expiry_date = new Date();
    expiry_date.setDate(expiry_date.getDate() + valid_days);

    // Validate medicines exist
    const medicineIds = medicines.map(m => new ObjectId(m.medicine_id));
    const medicineRecords = await collections.medicineInventory()
      .find({ _id: { $in: medicineIds } })
      .toArray();

    if (medicineRecords.length !== medicines.length) {
      return c.json({ error: 'One or more medicines not found' }, 404);
    }

    // Create prescription
    const prescriptionData = {
      appointment_id: new ObjectId(appointment_id),
      patient_id: new ObjectId(patient_id),
      patient_name: patient.name,
      patient_email: patient.email,
      doctor_name: appointment.doctor_name || 'Barangay Health Worker',
      medicines: medicines.map(med => ({
        medicine_id: new ObjectId(med.medicine_id),
        medicine_name: med.medicine_name,
        dosage: med.dosage, // e.g., "500mg"
        quantity: parseInt(med.quantity),
        instructions: med.instructions || 'Take as directed', // e.g., "Take 1 tablet twice daily"
        frequency: med.frequency || '', // e.g., "2x daily"
      })),
      diagnosis: diagnosis || '',
      notes: notes || '',
      issued_date,
      expiry_date,
      valid_days: parseInt(valid_days),
      status: 'active', // active, used, expired, cancelled
      created_at: new Date(),
      updated_at: new Date(),
      created_by: c.get('user').uid,
    };

    const result = await collections.prescriptions().insertOne(prescriptionData);

    // Update appointment to mark prescription created
    await collections.appointments().updateOne(
      { _id: new ObjectId(appointment_id) },
      { 
        $set: { 
          prescription_created: true,
          prescription_id: result.insertedId,
          updated_at: new Date()
        } 
      }
    );

    return c.json({
      success: true,
      message: 'Prescription created successfully',
      prescription_id: result.insertedId,
      data: prescriptionData
    }, 201);
  } catch (error) {
    console.error('Error creating prescription:', error);
    return c.json({ error: 'Failed to create prescription' }, 500);
  }
});

/**
 * GET /api/prescriptions/patient/:patient_id
 * Get all prescriptions for a patient
 * Query params: status (optional) - filter by status (active, used, expired, cancelled)
 */
prescriptions.get('/patient/:patient_id', authMiddleware, async (c) => {
  try {
    const { patient_id } = c.req.param();
    const status = c.req.query('status');
    const userId = c.get('user').uid;

    // Verify patient access (user can only see their own prescriptions unless admin)
    const patient = await collections.patients().findOne({
      _id: new ObjectId(patient_id)
    });

    if (!patient) {
      return c.json({ error: 'Patient not found' }, 404);
    }

    // Check if user is accessing their own prescriptions
    if (patient.user_id !== userId && !c.get('isAdmin')) {
      return c.json({ error: 'Unauthorized access' }, 403);
    }

    const query = { patient_id: new ObjectId(patient_id) };
    if (status) {
      query.status = status;
    }

    // Check for expired prescriptions and update them
    const now = new Date();
    await collections.prescriptions().updateMany(
      { 
        patient_id: new ObjectId(patient_id),
        status: 'active',
        expiry_date: { $lt: now }
      },
      { 
        $set: { 
          status: 'expired',
          updated_at: now
        } 
      }
    );

    const prescriptions = await collections.prescriptions()
      .find(query)
      .sort({ issued_date: -1 })
      .toArray();

    return c.json({
      success: true,
      count: prescriptions.length,
      prescriptions
    });
  } catch (error) {
    console.error('Error fetching prescriptions:', error);
    return c.json({ error: 'Failed to fetch prescriptions' }, 500);
  }
});

/**
 * GET /api/prescriptions/:id
 * Get prescription details by ID
 */
prescriptions.get('/:id', authMiddleware, async (c) => {
  try {
    const { id } = c.req.param();
    const userId = c.get('user').uid;

    if (!ObjectId.isValid(id)) {
      return c.json({ error: 'Invalid prescription ID' }, 400);
    }

    const prescriptionData = await collections.prescriptions().findOne({
      _id: new ObjectId(id)
    });

    if (!prescriptionData) {
      return c.json({ error: 'Prescription not found' }, 404);
    }

    // Verify patient access
    const patient = await collections.patients().findOne({
      _id: prescriptionData.patient_id
    });

    if (patient && patient.user_id !== userId && !c.get('isAdmin')) {
      return c.json({ error: 'Unauthorized access' }, 403);
    }

    // Check if expired and update status
    if (prescriptionData.status === 'active' && new Date() > prescriptionData.expiry_date) {
      prescriptionData.status = 'expired';
      await collections.prescriptions().updateOne(
        { _id: new ObjectId(id) },
        { 
          $set: { 
            status: 'expired',
            updated_at: new Date()
          } 
        }
      );
    }

    return c.json({
      success: true,
      prescription: prescriptionData
    });
  } catch (error) {
    console.error('Error fetching prescription:', error);
    return c.json({ error: 'Failed to fetch prescription' }, 500);
  }
});

/**
 * PATCH /api/prescriptions/:id/status
 * Update prescription status
 * Body: { status: 'used' | 'cancelled', reason: string }
 */
prescriptions.patch('/:id/status', authMiddleware, async (c) => {
  try {
    const { id } = c.req.param();
    const { status, reason } = await c.req.json();

    if (!ObjectId.isValid(id)) {
      return c.json({ error: 'Invalid prescription ID' }, 400);
    }

    if (!['used', 'cancelled', 'expired'].includes(status)) {
      return c.json({ error: 'Invalid status' }, 400);
    }

    const prescriptionData = await collections.prescriptions().findOne({
      _id: new ObjectId(id)
    });

    if (!prescriptionData) {
      return c.json({ error: 'Prescription not found' }, 404);
    }

    const updateData = {
      status,
      updated_at: new Date()
    };

    if (reason) {
      updateData.status_reason = reason;
    }

    if (status === 'used') {
      updateData.used_date = new Date();
    }

    await collections.prescriptions().updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    return c.json({
      success: true,
      message: `Prescription marked as ${status}`,
      prescription_id: id
    });
  } catch (error) {
    console.error('Error updating prescription:', error);
    return c.json({ error: 'Failed to update prescription' }, 500);
  }
});

/**
 * GET /api/prescriptions/appointment/:appointment_id
 * Get prescription for specific appointment
 */
prescriptions.get('/appointment/:appointment_id', authMiddleware, async (c) => {
  try {
    const { appointment_id } = c.req.param();

    if (!ObjectId.isValid(appointment_id)) {
      return c.json({ error: 'Invalid appointment ID' }, 400);
    }

    const prescriptionData = await collections.prescriptions().findOne({
      appointment_id: new ObjectId(appointment_id)
    });

    if (!prescriptionData) {
      return c.json({ 
        success: true,
        prescription: null,
        message: 'No prescription found for this appointment'
      });
    }

    return c.json({
      success: true,
      prescription: prescriptionData
    });
  } catch (error) {
    console.error('Error fetching prescription:', error);
    return c.json({ error: 'Failed to fetch prescription' }, 500);
  }
});

export default prescriptions;
