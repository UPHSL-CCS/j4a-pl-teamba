import { MongoClient } from 'mongodb';

let db = null;
let client = null;

export async function connectDB() {
  try {
    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    client = new MongoClient(uri);
    await client.connect();
    
    db = client.db('barangaycare');
    
    // Test connection
    await db.command({ ping: 1 });
    
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

export function getDB() {
  if (!db) {
    throw new Error('Database not initialized. Call connectDB first.');
  }
  return db;
}

export async function closeDB() {
  if (client) {
    await client.close();
    db = null;
    client = null;
  }
}

// Collections getters
export const collections = {
  patients: () => getDB().collection('patients'),
  doctors: () => getDB().collection('doctors'),
  appointments: () => getDB().collection('appointments'),
  medicineInventory: () => getDB().collection('medicine_inventory'),
  admins: () => getDB().collection('admins'),
  medicineRequests: () => getDB().collection('medicine_requests'),
  stockHistory: () => getDB().collection('stock_history'),
  chatMessages: () => getDB().collection('chat_messages'),
  faqDatabase: () => getDB().collection('faq_database'),
  symptomDatabase: () => getDB().collection('symptom_database'),
  // Health Records collections
  consultationNotes: () => getDB().collection('consultation_notes'),
  vitalSigns: () => getDB().collection('vital_signs'),
  medicalDocuments: () => getDB().collection('medical_documents'),
  patientConditions: () => getDB().collection('patient_conditions'),
  // Emergency contacts collections
  emergencyContacts: () => getDB().collection('emergency_contacts'),
  emergencyLogs: () => getDB().collection('emergency_logs'),
};

