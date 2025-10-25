import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth.middleware.js';
import * as medicineService from '../services/medicine.service.js';

const medicine = new Hono();

// All routes require authentication
medicine.use('/*', authMiddleware);

// Get all available medicines
medicine.get('/', async (c) => {
  try {
    const medicines = await medicineService.getAllMedicines();
    return c.json({ medicines });
  } catch (error) {
    return c.json({ error: error.message }, 500);
  }
});

// Request medicine
medicine.post('/request', async (c) => {
  try {
    const user = c.get('user');
    const data = await c.req.json();

    const result = await medicineService.requestMedicine(user.uid, data);
    return c.json(result, 201);
  } catch (error) {
    return c.json({ error: error.message }, 400);
  }
});

export default medicine;

