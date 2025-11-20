import { Hono } from 'hono';
import { uploadPrescription } from '../middleware/upload.js';
import { collections } from '../config/database.js';
import { ObjectId } from 'mongodb';
import { authMiddleware as authenticate } from '../middleware/auth.middleware.js';

const prescription = new Hono();

// Upload prescription for a medicine request
prescription.post('/upload/:requestId', authenticate, async (c) => {
  try {
    const requestId = c.req.param('requestId');
    const userId = c.get('user').uid;

    // Validate request ID
    if (!ObjectId.isValid(requestId)) {
      return c.json({ error: 'Invalid request ID' }, 400);
    }

    // Check if medicine request exists and belongs to user
    const medicineRequest = await collections.medicine_requests.findOne({
      _id: new ObjectId(requestId),
      patient_uid: userId
    });

    if (!medicineRequest) {
      return c.json({ error: 'Medicine request not found or unauthorized' }, 404);
    }

    // Handle file upload using multer middleware
    await new Promise((resolve, reject) => {
      uploadPrescription(c.req.raw, {}, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    // Get uploaded file info
    const file = c.req.raw.file;
    
    if (!file) {
      return c.json({ error: 'No file uploaded' }, 400);
    }

    // Update medicine request with prescription URL
    const prescriptionUrl = `/uploads/prescriptions/${file.filename}`;
    
    const result = await collections.medicine_requests.updateOne(
      { _id: new ObjectId(requestId) },
      { 
        $set: { 
          prescription_url: prescriptionUrl,
          prescription_uploaded_at: new Date()
        } 
      }
    );

    if (result.modifiedCount === 0) {
      return c.json({ error: 'Failed to update medicine request' }, 500);
    }

    return c.json({
      message: 'Prescription uploaded successfully',
      prescription_url: prescriptionUrl,
      filename: file.filename
    });

  } catch (error) {
    console.error('Error uploading prescription:', error);
    return c.json({ error: error.message || 'Failed to upload prescription' }, 500);
  }
});

// Get prescription URL for a medicine request
prescription.get('/:requestId', authenticate, async (c) => {
  try {
    const requestId = c.req.param('requestId');
    const userId = c.get('user').uid;

    // Validate request ID
    if (!ObjectId.isValid(requestId)) {
      return c.json({ error: 'Invalid request ID' }, 400);
    }

    // Check if user is admin or request owner
    const isAdmin = c.get('user').isAdmin;
    
    const query = {
      _id: new ObjectId(requestId)
    };

    // If not admin, restrict to own requests
    if (!isAdmin) {
      query.patient_uid = userId;
    }

    const medicineRequest = await collections.medicine_requests.findOne(query);

    if (!medicineRequest) {
      return c.json({ error: 'Medicine request not found or unauthorized' }, 404);
    }

    if (!medicineRequest.prescription_url) {
      return c.json({ error: 'No prescription uploaded for this request' }, 404);
    }

    return c.json({
      prescription_url: medicineRequest.prescription_url,
      uploaded_at: medicineRequest.prescription_uploaded_at
    });

  } catch (error) {
    console.error('Error retrieving prescription:', error);
    return c.json({ error: 'Failed to retrieve prescription' }, 500);
  }
});

export default prescription;
