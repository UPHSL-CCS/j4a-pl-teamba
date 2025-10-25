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

export default auth;

