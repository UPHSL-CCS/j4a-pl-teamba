import { ObjectId } from 'mongodb';
import { collections } from '../config/database.js';

/**
 * Health Records Service
 * Manages patient health records, consultation notes, vital signs, and medical documents
 * Demonstrates: Control Flow, Subprograms, Abstraction
 */

/**
 * Helper function to get patient by Firebase UID
 * Returns the most recently updated patient record to handle duplicates
 */
export async function getPatientByFirebaseUid(firebaseUid) {
  const patient = await collections.patients()
    .find({ firebase_uid: firebaseUid })
    .sort({ updated_at: -1 })
    .limit(1)
    .toArray()
    .then(results => results[0]);
  
  return patient || null;
}

/**
 * Get complete health profile for a patient
 * Abstraction: Abstract interface for retrieving all health data
 */
export async function getHealthProfile(firebaseUid) {
  try {
    const patient = await getPatientByFirebaseUid(firebaseUid);
    
    if (!patient) {
      return null; // Return null instead of throwing to allow profile creation flow
    }

    // Parallel data fetching for better performance
    const [consultations, vitalSigns, documents, conditions] = await Promise.all([
      getConsultationHistory(patient._id),
      getVitalSignsHistory(patient._id),
      getMedicalDocuments(patient._id),
      getPatientConditions(patient._id)
    ]);

    return {
      patient_info: {
        id: patient._id,
        name: patient.name,
        age: patient.age,
        gender: patient.gender,
        blood_type: patient.blood_type,
        allergies: patient.allergies || [],
        contact: patient.contact_number
      },
      consultations,
      vital_signs: vitalSigns,
      documents,
      conditions,
      summary: {
        total_consultations: consultations.length,
        total_vital_records: vitalSigns.length,
        total_documents: documents.length,
        active_conditions: conditions.filter(c => c.status === 'active').length
      }
    };
  } catch (error) {
    console.error('Error fetching health profile:', error);
    throw error;
  }
}

/**
 * Create or update patient health profile
 * Used for new user registration and existing users who don't have profiles
 */
export async function createOrUpdateHealthProfile(firebaseUid, profileData) {
  try {
    const now = new Date();
    const updateData = {
      firebase_uid: firebaseUid,
      name: profileData.name || 'Unnamed User',
      email: profileData.email || null,
      dob: profileData.dob || null,
      gender: profileData.gender || null,
      blood_type: profileData.blood_type || null,
      contact_number: profileData.contact_number || null,
      address: profileData.address || null,
      updated_at: now
    };

    const result = await collections.patients().findOneAndUpdate(
      { firebase_uid: firebaseUid },
      {
        $set: updateData,
        $setOnInsert: { created_at: now }
      },
      { upsert: true, returnDocument: 'after' }
    );

    return result;
  } catch (error) {
    console.error('Error creating/updating health profile:', error);
    throw error;
  }
}

/**
 * Get consultation history for a patient
 * Subprogram: Dedicated function for consultation retrieval
 */
export async function getConsultationHistory(patientId, limit = 50) {
  try {
    const consultations = await collections.consultationNotes()
      .aggregate([
        { $match: { patient_id: new ObjectId(patientId) } },
        {
          $lookup: {
            from: 'doctors',
            localField: 'doctor_id',
            foreignField: '_id',
            as: 'doctor'
          }
        },
        { $unwind: { path: '$doctor', preserveNullAndEmptyArrays: true } },
        { $sort: { consultation_date: -1 } },
        { $limit: limit }
      ])
      .toArray();

    return consultations;
  } catch (error) {
    console.error('Error fetching consultation history:', error);
    throw error;
  }
}

/**
 * Add consultation note
 * Control Flow: Validation before insertion
 */
export async function addConsultationNote(data) {
  try {
    const { patient_id, doctor_id, consultation_date, chief_complaint, diagnosis, treatment_plan, prescription, notes } = data;

    // Validate required fields
    if (!patient_id || !doctor_id || !consultation_date) {
      throw new Error('Missing required fields: patient_id, doctor_id, consultation_date');
    }

    const consultationNote = {
      patient_id: new ObjectId(patient_id),
      doctor_id: new ObjectId(doctor_id),
      consultation_date: new Date(consultation_date),
      chief_complaint: chief_complaint || '',
      diagnosis: diagnosis || '',
      treatment_plan: treatment_plan || '',
      prescription: prescription || [],
      notes: notes || '',
      created_at: new Date(),
      updated_at: new Date()
    };

    const result = await collections.consultationNotes().insertOne(consultationNote);

    return {
      message: 'Consultation note added successfully',
      consultation_id: result.insertedId,
      consultation: consultationNote
    };
  } catch (error) {
    console.error('Error adding consultation note:', error);
    throw error;
  }
}

/**
 * Get vital signs history
 * Subprogram: Dedicated function for vital signs retrieval with filtering
 */
export async function getVitalSignsHistory(patientId, options = {}) {
  try {
    const { startDate, endDate, limit = 100 } = options;

    // Build query with conditional date filtering (Control Flow)
    const query = { patient_id: new ObjectId(patientId) };
    
    if (startDate || endDate) {
      query.recorded_at = {};
      if (startDate) {
        query.recorded_at.$gte = new Date(startDate);
      }
      if (endDate) {
        query.recorded_at.$lte = new Date(endDate);
      }
    }

    const vitalSigns = await collections.vitalSigns()
      .find(query)
      .sort({ recorded_at: -1 })
      .limit(limit)
      .toArray();

    return vitalSigns;
  } catch (error) {
    console.error('Error fetching vital signs:', error);
    throw error;
  }
}

/**
 * Add vital signs record
 * Control Flow: Validation and health assessment logic
 */
export async function addVitalSigns(firebaseUid, data) {
  try {
    const patient = await collections.patients().findOne({ firebase_uid: firebaseUid });
    
    if (!patient) {
      throw new Error('Patient profile not found');
    }

    const { blood_pressure, heart_rate, temperature, weight, height, oxygen_saturation, notes } = data;

    // Validate vital signs (Control Flow - IF-ELSE)
    const assessment = assessVitalSigns({
      blood_pressure,
      heart_rate,
      temperature,
      oxygen_saturation
    });

    const vitalSign = {
      patient_id: patient._id,
      blood_pressure: blood_pressure || null, // e.g., "120/80"
      heart_rate: heart_rate || null, // bpm
      temperature: temperature || null, // Celsius
      weight: weight || null, // kg
      height: height || null, // cm
      oxygen_saturation: oxygen_saturation || null, // %
      bmi: (weight && height) ? calculateBMI(weight, height) : null,
      assessment: assessment,
      notes: notes || '',
      recorded_at: new Date(),
      recorded_by: 'patient' // or 'doctor' if added by doctor
    };

    const result = await collections.vitalSigns().insertOne(vitalSign);

    return {
      message: 'Vital signs recorded successfully',
      vital_sign_id: result.insertedId,
      vital_sign: vitalSign
    };
  } catch (error) {
    console.error('Error adding vital signs:', error);
    throw error;
  }
}

/**
 * Calculate BMI
 * Subprogram: Pure calculation function
 */
function calculateBMI(weight, height) {
  // weight in kg, height in cm
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  return Math.round(bmi * 10) / 10; // Round to 1 decimal
}

/**
 * Assess vital signs for abnormalities
 * Control Flow: Multiple IF-ELSE conditions for health assessment
 * Subprogram: Dedicated assessment logic
 */
function assessVitalSigns(vitals) {
  const warnings = [];
  
  // Blood pressure assessment
  if (vitals.blood_pressure) {
    const [systolic, diastolic] = vitals.blood_pressure.split('/').map(Number);
    
    if (systolic >= 140 || diastolic >= 90) {
      warnings.push('High blood pressure detected');
    } else if (systolic < 90 || diastolic < 60) {
      warnings.push('Low blood pressure detected');
    }
  }
  
  // Heart rate assessment
  if (vitals.heart_rate) {
    if (vitals.heart_rate > 100) {
      warnings.push('Elevated heart rate (tachycardia)');
    } else if (vitals.heart_rate < 60) {
      warnings.push('Low heart rate (bradycardia)');
    }
  }
  
  // Temperature assessment
  if (vitals.temperature) {
    if (vitals.temperature >= 38) {
      warnings.push('Fever detected');
    } else if (vitals.temperature < 36) {
      warnings.push('Low body temperature');
    }
  }
  
  // Oxygen saturation assessment
  if (vitals.oxygen_saturation) {
    if (vitals.oxygen_saturation < 95) {
      warnings.push('Low oxygen saturation');
    }
  }
  
  return {
    status: warnings.length > 0 ? 'needs_attention' : 'normal',
    warnings: warnings,
    assessed_at: new Date()
  };
}

/**
 * Get medical documents
 * Subprogram: Retrieve uploaded medical documents
 */
export async function getMedicalDocuments(patientId, options = {}) {
  try {
    const { document_type, limit = 50 } = options;

    // Build query with optional filtering (Control Flow)
    const query = { patient_id: new ObjectId(patientId) };
    
    if (document_type) {
      query.document_type = document_type;
    }

    const documents = await collections.medicalDocuments()
      .find(query)
      .sort({ uploaded_at: -1 })
      .limit(limit)
      .toArray();

    return documents;
  } catch (error) {
    console.error('Error fetching medical documents:', error);
    throw error;
  }
}

/**
 * Upload medical document
 * Control Flow: File validation before storage
 */
export async function uploadMedicalDocument(firebaseUid, data) {
  try {
    const patient = await collections.patients().findOne({ firebase_uid: firebaseUid });
    
    if (!patient) {
      throw new Error('Patient profile not found');
    }

    const { document_type, document_name, file_url, file_size, description } = data;

    // Validate required fields
    if (!document_type || !document_name || !file_url) {
      throw new Error('Missing required fields: document_type, document_name, file_url');
    }

    // Validate file size (Control Flow - IF condition)
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    if (file_size && file_size > maxFileSize) {
      throw new Error('File size exceeds 10MB limit');
    }

    const document = {
      patient_id: patient._id,
      document_type: document_type, // 'lab_result', 'xray', 'prescription', 'other'
      document_name: document_name,
      file_url: file_url,
      file_size: file_size || 0,
      description: description || '',
      uploaded_at: new Date(),
      uploaded_by: 'patient'
    };

    const result = await collections.medicalDocuments().insertOne(document);

    return {
      message: 'Medical document uploaded successfully',
      document_id: result.insertedId,
      document: document
    };
  } catch (error) {
    console.error('Error uploading medical document:', error);
    throw error;
  }
}

/**
 * Get patient conditions (diagnoses)
 * Subprogram: Retrieve patient's medical conditions
 */
export async function getPatientConditions(patientId) {
  try {
    const conditions = await collections.patientConditions()
      .find({ patient_id: new ObjectId(patientId) })
      .sort({ diagnosed_date: -1 })
      .toArray();

    return conditions;
  } catch (error) {
    console.error('Error fetching patient conditions:', error);
    throw error;
  }
}

/**
 * Add patient condition
 * Control Flow: Status validation before insertion
 */
export async function addPatientCondition(data) {
  try {
    const { patient_id, condition_name, diagnosed_date, status, severity, notes } = data;

    // Validate required fields
    if (!patient_id || !condition_name || !diagnosed_date) {
      throw new Error('Missing required fields: patient_id, condition_name, diagnosed_date');
    }

    // Validate status (Control Flow - IF-ELSE)
    const validStatuses = ['active', 'resolved', 'monitoring'];
    if (status && !validStatuses.includes(status)) {
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const condition = {
      patient_id: new ObjectId(patient_id),
      condition_name: condition_name,
      diagnosed_date: new Date(diagnosed_date),
      status: status || 'active',
      severity: severity || 'moderate', // 'mild', 'moderate', 'severe'
      notes: notes || '',
      created_at: new Date(),
      updated_at: new Date()
    };

    const result = await collections.patientConditions().insertOne(condition);

    return {
      message: 'Patient condition added successfully',
      condition_id: result.insertedId,
      condition: condition
    };
  } catch (error) {
    console.error('Error adding patient condition:', error);
    throw error;
  }
}

/**
 * Analyze health trends
 * Subprogram: Calculate health trends from vital signs data
 * Demonstrates: Data analysis and trend detection
 */
export async function analyzeHealthTrends(firebaseUid, days = 30) {
  try {
    const patient = await collections.patients().findOne({ firebase_uid: firebaseUid });
    
    if (!patient) {
      throw new Error('Patient profile not found');
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const vitalSigns = await getVitalSignsHistory(patient._id, { startDate, limit: 1000 });

    if (vitalSigns.length === 0) {
      return {
        message: 'No vital signs data available for analysis',
        trends: null
      };
    }

    // Calculate trends (Control Flow - data processing)
    const trends = {
      weight: calculateTrend(vitalSigns, 'weight'),
      blood_pressure: analyzeBPTrend(vitalSigns),
      heart_rate: calculateTrend(vitalSigns, 'heart_rate'),
      temperature: calculateTrend(vitalSigns, 'temperature'),
      bmi: calculateTrend(vitalSigns, 'bmi'),
      period: `${days} days`,
      data_points: vitalSigns.length
    };

    return trends;
  } catch (error) {
    console.error('Error analyzing health trends:', error);
    throw error;
  }
}

/**
 * Calculate trend for a specific vital sign
 * Subprogram: Statistical analysis helper
 */
function calculateTrend(vitalSigns, field) {
  const values = vitalSigns
    .filter(v => v[field] != null)
    .map(v => ({
      value: v[field],
      date: v.recorded_at
    }));

  if (values.length === 0) {
    return { status: 'no_data', average: null, min: null, max: null, trend: null };
  }

  const numericValues = values.map(v => v.value);
  const average = numericValues.reduce((sum, val) => sum + val, 0) / numericValues.length;
  const min = Math.min(...numericValues);
  const max = Math.max(...numericValues);

  // Simple trend: compare first half vs second half average
  const midpoint = Math.floor(values.length / 2);
  const firstHalf = numericValues.slice(0, midpoint);
  const secondHalf = numericValues.slice(midpoint);

  const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;

  let trend = 'stable';
  const changePercent = ((secondAvg - firstAvg) / firstAvg) * 100;

  if (changePercent > 5) trend = 'increasing';
  else if (changePercent < -5) trend = 'decreasing';

  return {
    status: 'available',
    average: Math.round(average * 10) / 10,
    min: Math.round(min * 10) / 10,
    max: Math.round(max * 10) / 10,
    trend: trend,
    change_percent: Math.round(changePercent * 10) / 10,
    data_points: values.length
  };
}

/**
 * Analyze blood pressure trend
 * Subprogram: Specialized BP analysis
 */
function analyzeBPTrend(vitalSigns) {
  const bpValues = vitalSigns
    .filter(v => v.blood_pressure)
    .map(v => {
      const [systolic, diastolic] = v.blood_pressure.split('/').map(Number);
      return {
        systolic,
        diastolic,
        date: v.recorded_at
      };
    });

  if (bpValues.length === 0) {
    return { status: 'no_data' };
  }

  const avgSystolic = bpValues.reduce((sum, v) => sum + v.systolic, 0) / bpValues.length;
  const avgDiastolic = bpValues.reduce((sum, v) => sum + v.diastolic, 0) / bpValues.length;

  return {
    status: 'available',
    average: `${Math.round(avgSystolic)}/${Math.round(avgDiastolic)}`,
    systolic: {
      average: Math.round(avgSystolic),
      min: Math.min(...bpValues.map(v => v.systolic)),
      max: Math.max(...bpValues.map(v => v.systolic))
    },
    diastolic: {
      average: Math.round(avgDiastolic),
      min: Math.min(...bpValues.map(v => v.diastolic)),
      max: Math.max(...bpValues.map(v => v.diastolic))
    },
    data_points: bpValues.length
  };
}

/**
 * Get health records for a specific date range
 * Abstraction: Unified interface for date-ranged queries
 */
export async function getHealthRecordsByDateRange(firebaseUid, startDate, endDate) {
  try {
    const patient = await collections.patients().findOne({ firebase_uid: firebaseUid });
    
    if (!patient) {
      throw new Error('Patient profile not found');
    }

    const [consultations, vitalSigns] = await Promise.all([
      collections.consultationNotes()
        .find({
          patient_id: patient._id,
          consultation_date: { $gte: new Date(startDate), $lte: new Date(endDate) }
        })
        .sort({ consultation_date: -1 })
        .toArray(),
      
      collections.vitalSigns()
        .find({
          patient_id: patient._id,
          recorded_at: { $gte: new Date(startDate), $lte: new Date(endDate) }
        })
        .sort({ recorded_at: -1 })
        .toArray()
    ]);

    return {
      consultations,
      vital_signs: vitalSigns,
      period: { start: startDate, end: endDate }
    };
  } catch (error) {
    console.error('Error fetching health records by date range:', error);
    throw error;
  }
}

/**
 * Delete medical document
 * Control Flow: Authorization check before deletion
 */
export async function deleteMedicalDocument(firebaseUid, documentId) {
  try {
    const patient = await collections.patients().findOne({ firebase_uid: firebaseUid });
    
    if (!patient) {
      throw new Error('Patient profile not found');
    }

    const document = await collections.medicalDocuments().findOne({ 
      _id: new ObjectId(documentId),
      patient_id: patient._id 
    });

    if (!document) {
      throw new Error('Document not found or unauthorized');
    }

    await collections.medicalDocuments().deleteOne({ _id: new ObjectId(documentId) });

    return {
      message: 'Medical document deleted successfully',
      document_id: documentId
    };
  } catch (error) {
    console.error('Error deleting medical document:', error);
    throw error;
  }
}
