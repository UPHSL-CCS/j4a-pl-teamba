import { connectDB, collections, closeDB } from '../src/config/database.js';
import { ObjectId } from 'mongodb';

/**
 * Seed sample health records for testing
 * Creates consultation notes, vital signs, medical documents, and patient conditions
 */

const sampleHealthRecords = {
  // Sample consultation notes
  consultationNotes: [
    {
      chief_complaint: 'Persistent headache for 3 days',
      diagnosis: 'Tension headache',
      treatment_plan: 'Rest, hydration, pain reliever as needed',
      prescription: [
        { medicine: 'Paracetamol', dosage: '500mg', frequency: 'Every 6 hours as needed' }
      ],
      notes: 'Patient advised to reduce screen time and ensure adequate sleep. Follow up if symptoms persist beyond 1 week.',
      consultation_date: new Date('2025-11-10')
    },
    {
      chief_complaint: 'Fever and cough',
      diagnosis: 'Upper respiratory tract infection',
      treatment_plan: 'Antibiotic therapy, rest, fluids',
      prescription: [
        { medicine: 'Amoxicillin', dosage: '500mg', frequency: '3 times daily for 7 days' },
        { medicine: 'Paracetamol', dosage: '500mg', frequency: 'Every 6 hours for fever' }
      ],
      notes: 'Patient should complete full course of antibiotics. Return if fever persists beyond 3 days.',
      consultation_date: new Date('2025-11-05')
    },
    {
      chief_complaint: 'Annual check-up',
      diagnosis: 'Generally healthy',
      treatment_plan: 'Continue healthy lifestyle',
      prescription: [],
      notes: 'Blood pressure slightly elevated. Advised to monitor salt intake and exercise regularly.',
      consultation_date: new Date('2025-10-20')
    }
  ],

  // Sample vital signs
  vitalSigns: [
    {
      blood_pressure: '120/80',
      heart_rate: 72,
      temperature: 36.5,
      weight: 65,
      height: 165,
      oxygen_saturation: 98,
      notes: 'Normal vital signs',
      recorded_at: new Date('2025-11-18')
    },
    {
      blood_pressure: '125/82',
      heart_rate: 78,
      temperature: 37.2,
      weight: 65.5,
      height: 165,
      oxygen_saturation: 97,
      notes: 'Slight temperature elevation',
      recorded_at: new Date('2025-11-10')
    },
    {
      blood_pressure: '118/78',
      heart_rate: 70,
      temperature: 38.5,
      weight: 64.5,
      height: 165,
      oxygen_saturation: 96,
      notes: 'Fever present',
      recorded_at: new Date('2025-11-05')
    },
    {
      blood_pressure: '130/85',
      heart_rate: 75,
      temperature: 36.8,
      weight: 66,
      height: 165,
      oxygen_saturation: 98,
      notes: 'Annual check-up vitals',
      recorded_at: new Date('2025-10-20')
    },
    {
      blood_pressure: '122/80',
      heart_rate: 74,
      temperature: 36.6,
      weight: 65,
      height: 165,
      oxygen_saturation: 98,
      notes: 'Regular monitoring',
      recorded_at: new Date('2025-10-15')
    }
  ],

  // Sample medical documents
  medicalDocuments: [
    {
      document_type: 'lab_result',
      document_name: 'Complete Blood Count - Nov 2025',
      file_url: 'https://example.com/documents/cbc-nov2025.pdf',
      file_size: 245678,
      description: 'Annual CBC test results - all values within normal range',
      uploaded_at: new Date('2025-11-01')
    },
    {
      document_type: 'xray',
      document_name: 'Chest X-ray - Oct 2025',
      file_url: 'https://example.com/documents/xray-oct2025.pdf',
      file_size: 1234567,
      description: 'Chest X-ray for annual check-up - no abnormalities detected',
      uploaded_at: new Date('2025-10-25')
    },
    {
      document_type: 'prescription',
      document_name: 'Prescription - Amoxicillin',
      file_url: 'https://example.com/documents/prescription-amox.pdf',
      file_size: 89012,
      description: 'Prescription for upper respiratory tract infection',
      uploaded_at: new Date('2025-11-05')
    }
  ],

  // Sample patient conditions
  patientConditions: [
    {
      condition_name: 'Hypertension (Stage 1)',
      diagnosed_date: new Date('2024-06-15'),
      status: 'monitoring',
      severity: 'mild',
      notes: 'Blood pressure controlled with lifestyle modifications. No medication required at this time.'
    },
    {
      condition_name: 'Seasonal Allergies',
      diagnosed_date: new Date('2023-03-20'),
      status: 'active',
      severity: 'mild',
      notes: 'Primarily during spring season. Managed with antihistamines as needed.'
    },
    {
      condition_name: 'Tension Headaches',
      diagnosed_date: new Date('2025-11-10'),
      status: 'active',
      severity: 'moderate',
      notes: 'Recurring headaches related to stress and screen time. Management includes stress reduction and regular breaks.'
    }
  ]
};

async function seedSampleHealthRecords() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    // Check if we have any patients to attach records to
    const patients = await collections.patients().find().limit(5).toArray();
    
    if (patients.length === 0) {
      console.log('⚠️  No patients found in database. Please seed patients first.');
      await closeDB();
      return;
    }

    // Get a random patient for demo purposes
    const demoPatient = patients[0];
    console.log(`Using patient: ${demoPatient.name} (${demoPatient._id})`);

    // Get a doctor for consultation notes
    const doctors = await collections.doctors().find().limit(1).toArray();
    const demoDoctor = doctors.length > 0 ? doctors[0] : null;

    // Seed consultation notes
    console.log('\n📋 Seeding consultation notes...');
    const consultationNotesCount = await collections.consultationNotes().countDocuments({
      patient_id: demoPatient._id
    });

    if (consultationNotesCount === 0 && demoDoctor) {
      const consultationNotesToInsert = sampleHealthRecords.consultationNotes.map(note => ({
        ...note,
        patient_id: demoPatient._id,
        doctor_id: demoDoctor._id,
        created_at: new Date(),
        updated_at: new Date()
      }));

      const result = await collections.consultationNotes().insertMany(consultationNotesToInsert);
      console.log(`✅ Created ${result.insertedCount} consultation notes`);
    } else {
      console.log('ℹ️  Consultation notes already exist for this patient');
    }

    // Seed vital signs
    console.log('\n💓 Seeding vital signs...');
    const vitalSignsCount = await collections.vitalSigns().countDocuments({
      patient_id: demoPatient._id
    });

    if (vitalSignsCount === 0) {
      const vitalSignsToInsert = sampleHealthRecords.vitalSigns.map(vital => {
        const bmi = (vital.weight && vital.height) ? 
          Math.round((vital.weight / Math.pow(vital.height / 100, 2)) * 10) / 10 : null;
        
        return {
          ...vital,
          patient_id: demoPatient._id,
          bmi: bmi,
          assessment: {
            status: vital.temperature >= 38 ? 'needs_attention' : 'normal',
            warnings: vital.temperature >= 38 ? ['Fever detected'] : [],
            assessed_at: vital.recorded_at
          },
          recorded_by: 'patient'
        };
      });

      const result = await collections.vitalSigns().insertMany(vitalSignsToInsert);
      console.log(`✅ Created ${result.insertedCount} vital signs records`);
    } else {
      console.log('ℹ️  Vital signs already exist for this patient');
    }

    // Seed medical documents
    console.log('\n📄 Seeding medical documents...');
    const documentsCount = await collections.medicalDocuments().countDocuments({
      patient_id: demoPatient._id
    });

    if (documentsCount === 0) {
      const documentsToInsert = sampleHealthRecords.medicalDocuments.map(doc => ({
        ...doc,
        patient_id: demoPatient._id,
        uploaded_by: 'patient'
      }));

      const result = await collections.medicalDocuments().insertMany(documentsToInsert);
      console.log(`✅ Created ${result.insertedCount} medical documents`);
    } else {
      console.log('ℹ️  Medical documents already exist for this patient');
    }

    // Seed patient conditions
    console.log('\n🏥 Seeding patient conditions...');
    const conditionsCount = await collections.patientConditions().countDocuments({
      patient_id: demoPatient._id
    });

    if (conditionsCount === 0) {
      const conditionsToInsert = sampleHealthRecords.patientConditions.map(condition => ({
        ...condition,
        patient_id: demoPatient._id,
        created_at: new Date(),
        updated_at: new Date()
      }));

      const result = await collections.patientConditions().insertMany(conditionsToInsert);
      console.log(`✅ Created ${result.insertedCount} patient conditions`);
    } else {
      console.log('ℹ️  Patient conditions already exist for this patient');
    }

    console.log('\n✅ Sample health records seeded successfully!');
    console.log(`\n📊 Summary for patient: ${demoPatient.name}`);
    console.log(`   - Consultation Notes: ${await collections.consultationNotes().countDocuments({ patient_id: demoPatient._id })}`);
    console.log(`   - Vital Signs: ${await collections.vitalSigns().countDocuments({ patient_id: demoPatient._id })}`);
    console.log(`   - Medical Documents: ${await collections.medicalDocuments().countDocuments({ patient_id: demoPatient._id })}`);
    console.log(`   - Patient Conditions: ${await collections.patientConditions().countDocuments({ patient_id: demoPatient._id })}`);

  } catch (error) {
    console.error('Error seeding sample health records:', error);
  } finally {
    await closeDB();
  }
}

// Export for auto-seeding in index.js
export async function seedSampleRecordsIfEmpty() {
  try {
    const consultationsCount = await collections.consultationNotes().countDocuments();
    const vitalSignsCount = await collections.vitalSigns().countDocuments();
    
    if (consultationsCount === 0 && vitalSignsCount === 0) {
      console.log('🏥 Auto-seeding sample health records...');
      await seedSampleHealthRecords();
    }
  } catch (error) {
    console.error('Error in auto-seed health records:', error);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedSampleHealthRecords();
}
