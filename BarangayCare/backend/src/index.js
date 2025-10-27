import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import { initializeFirebase } from './config/firebase.js';

// Import routes
import authRoutes from './routes/auth.route.js';
import appointmentsRoutes from './routes/appointments.route.js';
import doctorsRoutes from './routes/doctors.route.js';
import medicineRoutes from './routes/medicine.route.js';

// Load environment variables
dotenv.config();

const app = new Hono();

// CORS middleware
app.use('/*', cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['*'],
  credentials: true,
}));

// Health check
app.get('/', (c) => {
  return c.json({
    message: 'BarangayCare API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.route('/api/auth', authRoutes);
app.route('/api/appointments', appointmentsRoutes);
app.route('/api/doctors', doctorsRoutes);
app.route('/api/medicine', medicineRoutes);

// Error handling
app.onError((err, c) => {
  console.error('Error:', err);
  return c.json({
    error: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString()
  }, 500);
});

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Route not found' }, 404);
});

// Initialize and start server
const PORT = process.env.PORT || 3000;

(async () => {
  try {
    // Initialize Firebase Admin
    await initializeFirebase();
    console.log('✅ Firebase Admin initialized');

    // Connect to MongoDB
    await connectDB();
    console.log('✅ MongoDB connected');

    // Start server - listen on all network interfaces (0.0.0.0)
    // This allows connections from physical devices on the same network
    serve({
      fetch: app.fetch,
      port: PORT,
      hostname: '0.0.0.0',
    });

    console.log(`🚀 Server is running on http://0.0.0.0:${PORT}`);
    console.log(`📱 Physical devices can connect to: http://192.168.68.100:${PORT}`);
    console.log(`💻 Local access: http://localhost:${PORT}`);
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
})();

