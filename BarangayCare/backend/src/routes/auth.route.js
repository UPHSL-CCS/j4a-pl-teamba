import { Hono } from 'hono';
import { collections } from '../config/database.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const auth = new Hono();

// Register patient profile (after Firebase authentication)
auth.post('/register-patient', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const { name, barangay, contact } = await c.req.json();

    // Validate input
    if (!name || !barangay || !contact) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Check if patient already exists
    const existing = await collections.patients().findOne({ firebase_uid: user.uid });
    if (existing) {
      return c.json({ error: 'Patient profile already exists' }, 400);
    }

    // Create patient profile
    const patient = {
      firebase_uid: user.uid,
      email: user.email,
      name,
      barangay,
      contact,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const result = await collections.patients().insertOne(patient);

    return c.json({
      message: 'Patient registered successfully',
      patient_id: result.insertedId,
    }, 201);
  } catch (error) {
    console.error('Registration error:', error);
    return c.json({ error: 'Registration failed' }, 500);
  }
});

// Get current patient profile
auth.get('/profile', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    
    const patient = await collections.patients().findOne(
      { firebase_uid: user.uid },
      { projection: { _id: 1, name: 1, barangay: 1, contact: 1, email: 1 } }
    );

    if (!patient) {
      return c.json({ error: 'Patient profile not found' }, 404);
    }

    return c.json({ patient });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return c.json({ error: 'Failed to fetch profile' }, 500);
  }
});

// Update patient profile
auth.put('/profile', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const { name, barangay, contact } = await c.req.json();

    // Validate input
    if (!name || !barangay || !contact) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Validate name
    if (name.trim().length < 2) {
      return c.json({ error: 'Name must be at least 2 characters' }, 400);
    }

    // Validate Philippine mobile number format
    const phoneRegex = /^09\d{9}$/;
    if (!phoneRegex.test(contact.trim())) {
      return c.json({ error: 'Invalid Philippine mobile number format' }, 400);
    }

    // Check if patient exists
    const existing = await collections.patients().findOne({ firebase_uid: user.uid });
    if (!existing) {
      return c.json({ error: 'Patient profile not found' }, 404);
    }

    // Update patient profile
    const result = await collections.patients().updateOne(
      { firebase_uid: user.uid },
      {
        $set: {
          name: name.trim(),
          barangay: barangay.trim(),
          contact: contact.trim(),
          updated_at: new Date(),
        }
      }
    );

    if (result.matchedCount === 0) {
      return c.json({ error: 'Failed to update profile' }, 500);
    }

    // Return updated profile
    const updatedPatient = await collections.patients().findOne(
      { firebase_uid: user.uid },
      { projection: { _id: 1, name: 1, barangay: 1, contact: 1, email: 1 } }
    );

    return c.json({
      message: 'Profile updated successfully',
      patient: updatedPatient
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return c.json({ error: 'Failed to update profile' }, 500);
  }
});

export default auth;

