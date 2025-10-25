import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth.middleware.js';
import * as appointmentService from '../services/appointment.service.js';

const appointments = new Hono();

// All routes require authentication
appointments.use('/*', authMiddleware);

// Book an appointment
appointments.post('/book', async (c) => {
  try {
    const user = c.get('user');
    const data = await c.req.json();

    const result = await appointmentService.bookAppointment(user.uid, data);
    return c.json(result, 201);
  } catch (error) {
    return c.json({ error: error.message }, 400);
  }
});

// Get patient's appointments
appointments.get('/my-appointments', async (c) => {
  try {
    const user = c.get('user');
    const appointments = await appointmentService.getPatientAppointments(user.uid);
    return c.json({ appointments });
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// Cancel an appointment
appointments.patch('/:id/cancel', async (c) => {
  try {
    const user = c.get('user');
    const appointmentId = c.req.param('id');

    const result = await appointmentService.cancelAppointment(appointmentId, user.uid);
    return c.json(result);
  } catch (error) {
    return c.json({ error: error.message }, 400);
  }
});

export default appointments;

