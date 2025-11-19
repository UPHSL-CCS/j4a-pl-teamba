import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { cors } from 'hono/cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import { initializeFirebase } from './config/firebase.js';
import { seedMedicinesIfEmpty } from '../scripts/seed-medicines.js';
import { seedDoctorsIfEmpty } from '../scripts/seed-doctors.js';
import { seedAdminIfEmpty } from '../scripts/seed-admin.js';
import { seedAppointmentsIfEmpty } from '../scripts/seed-appointments.js';
import { seedFaqIfEmpty } from '../scripts/seed-faq.js';
import { seedSymptomsIfEmpty } from '../scripts/seed-symptoms.js';
import { seedSampleRecordsIfEmpty } from '../scripts/seed-sample-records.js';

// Import routes
import authRoutes from './routes/auth.route.js';
import appointmentsRoutes from './routes/appointments.route.js';
import doctorsRoutes from './routes/doctors.route.js';
import medicineRoutes from './routes/medicine.route.js';
import adminRoutes from './routes/admin.js';
import chatbotRoutes from './routes/chatbot.route.js';
import healthRecordsRoutes from './routes/healthRecords.route.js';

// Import middleware
import { authMiddleware as authenticate } from './middleware/auth.middleware.js';
import { adminOnly } from './middleware/admin.js';

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
app.route('/api/chatbot', chatbotRoutes);
app.route('/api/health-records', healthRecordsRoutes);

// Admin routes - protected by authentication and admin middleware
app.use('/api/admin/*', authenticate, adminOnly);
app.route('/api/admin', adminRoutes);

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

    // Auto-seed medicine inventory if empty
    await seedMedicinesIfEmpty();

    // Auto-seed doctors if empty
    await seedDoctorsIfEmpty();

    // Auto-seed admin account if empty
    await seedAdminIfEmpty();

    // Auto-seed appointments with sample patients if empty
    await seedAppointmentsIfEmpty();

    // Auto-seed chatbot knowledge base
    await seedFaqIfEmpty();
    await seedSymptomsIfEmpty();

    // Auto-seed sample health records
    await seedSampleRecordsIfEmpty();

    // Start server - listen on all network interfaces (0.0.0.0)
    // This allows connections from physical devices on the same network
    console.log(`🚀 Starting server on http://0.0.0.0:${PORT}`);
    console.log(`📱 Physical devices can connect to: http://192.168.68.100:${PORT}`);
    console.log(`💻 Local access: http://localhost:${PORT}`);
    
    serve(
      {
        fetch: app.fetch,
        port: PORT,
        hostname: '0.0.0.0',
      },
      (info) => {
        console.log(`✅ Server is listening on port ${info.port}`);
      }
    );
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
})();

