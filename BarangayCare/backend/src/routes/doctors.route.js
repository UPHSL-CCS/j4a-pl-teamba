import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth.middleware.js';
import * as doctorService from '../services/doctor.service.js';

const doctors = new Hono();

// All routes require authentication
doctors.use('/*', authMiddleware);

// Get all doctors
doctors.get('/', async (c) => {
  try {
    const doctors = await doctorService.getAllDoctors();
    return c.json({ doctors });
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// Get doctor by ID
doctors.get('/:id', async (c) => {
  try {
    const doctorId = c.req.param('id');
    const doctor = await doctorService.getDoctorById(doctorId);
    return c.json({ doctor });
  } catch (error) {
    return c.json({ error: error.message }, 404);
  }
});

// Check doctor availability for a specific date
doctors.get('/:id/availability/:date', async (c) => {
  try {
    const doctorId = c.req.param('id');
    const date = c.req.param('date');

    const availability = await doctorService.checkAvailability(doctorId, date);
    return c.json({ availability });
  } catch (error) {
    return c.json({ error: error.message }, 400);
  }
});

export default doctors;

