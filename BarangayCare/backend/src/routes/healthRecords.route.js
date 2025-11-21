import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { collections } from '../config/database.js';
import {
  getHealthProfile,
  createOrUpdateHealthProfile,
  getConsultationHistory,
  addConsultationNote,
  getVitalSignsHistory,
  addVitalSigns,
  getMedicalDocuments,
  uploadMedicalDocument,
  deleteMedicalDocument,
  getPatientConditions,
  addPatientCondition,
  analyzeHealthTrends,
  getHealthRecordsByDateRange,
  getPatientByFirebaseUid
} from '../services/healthRecordsService.js';
import { generateHealthReport, generateQuickSummary } from '../services/reportService.js';

const healthRecords = new Hono();

// Apply authentication to all routes
healthRecords.use('/*', authMiddleware);

/**
 * GET /api/health-records/profile
 * Get complete health profile for authenticated patient
 */
healthRecords.get('/profile', async (c) => {
  try {
    const firebaseUid = c.get('firebaseUid');
    const profile = await getHealthProfile(firebaseUid);

    if (!profile) {
      return c.json({
        success: false,
        error: 'Patient profile not found'
      }, 404);
    }

    return c.json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Error fetching health profile:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

/**
 * POST /api/health-records/profile
 * Create or update patient health profile
 */
healthRecords.post('/profile', async (c) => {
  try {
    const firebaseUid = c.get('firebaseUid');
    const body = await c.req.json();

    const profile = await createOrUpdateHealthProfile(firebaseUid, body);

    return c.json({
      success: true,
      data: profile
    }, 201);
  } catch (error) {
    console.error('Error creating/updating health profile:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

/**
 * GET /api/health-records/consultations
 * Get consultation history for authenticated patient
 */
healthRecords.get('/consultations', async (c) => {
  try {
    const firebaseUid = c.get('firebaseUid');
    const limit = parseInt(c.req.query('limit')) || 50;

    const patient = await getPatientByFirebaseUid(firebaseUid);
    if (!patient) {
      return c.json({
        success: false,
        error: 'Patient profile not found'
      }, 404);
    }

    const consultations = await getConsultationHistory(patient._id, limit);

    return c.json({
      success: true,
      data: consultations
    });
  } catch (error) {
    console.error('Error fetching consultations:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

/**
 * POST /api/health-records/consultations
 * Add consultation note (admin/doctor only)
 */
healthRecords.post('/consultations', async (c) => {
  try {
    const data = await c.req.json();
    const result = await addConsultationNote(data);

    return c.json({
      success: true,
      ...result
    }, 201);
  } catch (error) {
    console.error('Error adding consultation note:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

/**
 * GET /api/health-records/vital-signs
 * Get vital signs history for authenticated patient
 */
healthRecords.get('/vital-signs', async (c) => {
  try {
    const firebaseUid = c.get('firebaseUid');
    const startDate = c.req.query('startDate');
    const endDate = c.req.query('endDate');
    const limit = parseInt(c.req.query('limit')) || 100;

    const patient = await getPatientByFirebaseUid(firebaseUid);
    if (!patient) {
      return c.json({
        success: false,
        error: 'Patient profile not found'
      }, 404);
    }

    const vitalSigns = await getVitalSignsHistory(patient._id, { startDate, endDate, limit });

    return c.json({
      success: true,
      data: vitalSigns
    });
  } catch (error) {
    console.error('Error fetching vital signs:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

/**
 * POST /api/health-records/vital-signs
 * Add vital signs record
 */
healthRecords.post('/vital-signs', async (c) => {
  try {
    const firebaseUid = c.get('firebaseUid');
    const data = await c.req.json();
    
    const result = await addVitalSigns(firebaseUid, data);

    return c.json({
      success: true,
      ...result
    }, 201);
  } catch (error) {
    console.error('Error adding vital signs:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

/**
 * GET /api/health-records/documents
 * Get medical documents for authenticated patient
 */
healthRecords.get('/documents', async (c) => {
  try {
    const firebaseUid = c.get('firebaseUid');
    const documentType = c.req.query('type');
    const limit = parseInt(c.req.query('limit')) || 50;

    const patient = await getPatientByFirebaseUid(firebaseUid);
    if (!patient) {
      return c.json({
        success: false,
        error: 'Patient profile not found'
      }, 404);
    }

    const documents = await getMedicalDocuments(patient._id, { document_type: documentType, limit });

    return c.json({
      success: true,
      data: documents
    });
  } catch (error) {
    console.error('Error fetching medical documents:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

/**
 * POST /api/health-records/documents
 * Upload medical document
 */
healthRecords.post('/documents', async (c) => {
  try {
    const firebaseUid = c.get('firebaseUid');
    const data = await c.req.json();
    
    const result = await uploadMedicalDocument(firebaseUid, data);

    return c.json({
      success: true,
      ...result
    }, 201);
  } catch (error) {
    console.error('Error uploading medical document:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

/**
 * DELETE /api/health-records/documents/:id
 * Delete medical document
 */
healthRecords.delete('/documents/:id', async (c) => {
  try {
    const firebaseUid = c.get('firebaseUid');
    const documentId = c.req.param('id');
    
    const result = await deleteMedicalDocument(firebaseUid, documentId);

    return c.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error deleting medical document:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

/**
 * GET /api/health-records/conditions
 * Get patient conditions for authenticated patient
 */
healthRecords.get('/conditions', async (c) => {
  try {
    const firebaseUid = c.get('firebaseUid');

    const patient = await getPatientByFirebaseUid(firebaseUid);
    if (!patient) {
      return c.json({
        success: false,
        error: 'Patient profile not found'
      }, 404);
    }

    const conditions = await getPatientConditions(patient._id);

    return c.json({
      success: true,
      data: conditions
    });
  } catch (error) {
    console.error('Error fetching patient conditions:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

/**
 * POST /api/health-records/conditions
 * Add patient condition (admin/doctor only)
 */
healthRecords.post('/conditions', async (c) => {
  try {
    const data = await c.req.json();
    const result = await addPatientCondition(data);

    return c.json({
      success: true,
      ...result
    }, 201);
  } catch (error) {
    console.error('Error adding patient condition:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

/**
 * GET /api/health-records/trends
 * Analyze health trends for authenticated patient
 */
healthRecords.get('/trends', async (c) => {
  try {
    const firebaseUid = c.get('firebaseUid');
    const days = parseInt(c.req.query('days')) || 30;

    const trends = await analyzeHealthTrends(firebaseUid, days);

    return c.json({
      success: true,
      data: trends
    });
  } catch (error) {
    console.error('Error analyzing health trends:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

/**
 * GET /api/health-records/date-range
 * Get health records for a specific date range
 */
healthRecords.get('/date-range', async (c) => {
  try {
    const firebaseUid = c.get('firebaseUid');
    const startDate = c.req.query('startDate');
    const endDate = c.req.query('endDate');

    if (!startDate || !endDate) {
      return c.json({
        success: false,
        error: 'Missing required parameters: startDate, endDate'
      }, 400);
    }

    const records = await getHealthRecordsByDateRange(firebaseUid, startDate, endDate);

    return c.json({
      success: true,
      data: records
    });
  } catch (error) {
    console.error('Error fetching health records by date range:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

/**
 * POST /api/health-records/reports/generate
 * Generate comprehensive health report PDF
 */
healthRecords.post('/reports/generate', async (c) => {
  try {
    const firebaseUid = c.get('firebaseUid');
    const options = await c.req.json();

    const report = await generateHealthReport(firebaseUid, options);

    // Set headers for PDF download
    c.header('Content-Type', 'application/pdf');
    c.header('Content-Disposition', `attachment; filename="health-report-${new Date().toISOString().split('T')[0]}.pdf"`);

    return c.body(report.pdf_buffer);
  } catch (error) {
    console.error('Error generating health report:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

/**
 * GET /api/health-records/reports/quick-summary
 * Generate quick summary PDF
 */
healthRecords.get('/reports/quick-summary', async (c) => {
  try {
    const firebaseUid = c.get('firebaseUid');

    const report = await generateQuickSummary(firebaseUid);

    // Set headers for PDF download
    c.header('Content-Type', 'application/pdf');
    c.header('Content-Disposition', `attachment; filename="health-summary-${new Date().toISOString().split('T')[0]}.pdf"`);

    return c.body(report.pdf_buffer);
  } catch (error) {
    console.error('Error generating quick summary:', error);
    return c.json({
      success: false,
      error: error.message
    }, 500);
  }
});

export default healthRecords;
