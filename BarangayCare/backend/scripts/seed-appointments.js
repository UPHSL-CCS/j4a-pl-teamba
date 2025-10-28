import { collections } from '../src/config/database.js';

// Sample patients for demo appointments
const samplePatients = [
  {
    firebase_uid: 'SAMPLE_PATIENT_1',
    first_name: 'Maria',
    last_name: 'Santos',
    middle_name: 'Cruz',
    date_of_birth: '1990-05-15',
    gender: 'Female',
    contact_number: '09171234567',
    email: 'maria.santos@email.com',
    barangay: 'Barangay Santo Niño',
    address: '123 Main Street, Barangay Santo Niño',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    firebase_uid: 'SAMPLE_PATIENT_2',
    first_name: 'Juan',
    last_name: 'Dela Cruz',
    middle_name: 'Reyes',
    date_of_birth: '1985-08-20',
    gender: 'Male',
    contact_number: '09189876543',
    email: 'juan.delacruz@email.com',
    barangay: 'Barangay San Jose',
    address: '456 Rizal Avenue, Barangay San Jose',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    firebase_uid: 'SAMPLE_PATIENT_3',
    first_name: 'Ana',
    last_name: 'Garcia',
    middle_name: 'Reyes',
    date_of_birth: '1995-03-10',
    gender: 'Female',
    contact_number: '09175551234',
    email: 'ana.garcia@email.com',
    barangay: 'Barangay Santa Cruz',
    address: '789 Del Pilar Street, Barangay Santa Cruz',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    firebase_uid: 'SAMPLE_PATIENT_4',
    first_name: 'Pedro',
    last_name: 'Ramos',
    middle_name: 'Santos',
    date_of_birth: '1988-11-25',
    gender: 'Male',
    contact_number: '09191234567',
    email: 'pedro.ramos@email.com',
    barangay: 'Barangay San Miguel',
    address: '321 Bonifacio Street, Barangay San Miguel',
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    firebase_uid: 'SAMPLE_PATIENT_5',
    first_name: 'Sofia',
    last_name: 'Villanueva',
    middle_name: 'Torres',
    date_of_birth: '1992-07-18',
    gender: 'Female',
    contact_number: '09177778888',
    email: 'sofia.villanueva@email.com',
    barangay: 'Barangay Santa Maria',
    address: '654 Luna Street, Barangay Santa Maria',
    created_at: new Date(),
    updated_at: new Date()
  }
];

/**
 * Auto-seed sample appointments if appointments collection is empty
 */
export async function seedAppointmentsIfEmpty() {
  try {
    const appointmentCount = await collections.appointments().countDocuments();
    
    if (appointmentCount > 0) {
      console.log('📅 Appointments already exist. Skipping seed.');
      return;
    }

    console.log('📅 Creating sample appointments...');

    // First, ensure sample patients exist
    const existingPatients = await collections.patients().find({
      firebase_uid: { $in: samplePatients.map(p => p.firebase_uid) }
    }).toArray();

    let patients;
    if (existingPatients.length === 0) {
      console.log('👥 Creating sample patients...');
      const patientResult = await collections.patients().insertMany(samplePatients);
      patients = await collections.patients().find({
        _id: { $in: Object.values(patientResult.insertedIds) }
      }).toArray();
      console.log(`✅ Created ${patients.length} sample patients`);
    } else {
      patients = existingPatients;
      console.log(`✅ Using ${patients.length} existing sample patients`);
    }

    // Get all doctors
    const doctors = await collections.doctors().find({ is_active: true }).limit(5).toArray();
    
    if (doctors.length === 0) {
      console.log('⚠️  No doctors found. Please seed doctors first.');
      return;
    }

    // Create sample appointments with various statuses
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const formatDate = (date) => date.toISOString().split('T')[0];

    const sampleAppointments = [
      // Pending appointments
      {
        patient_id: patients[0]._id,
        doctor_id: doctors[0]._id,
        date: formatDate(tomorrow),
        time: '09:00',
        status: 'pending',
        pre_screening: {
          symptoms: 'Fever and cough',
          temperature: '38.5°C'
        },
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        patient_id: patients[1]._id,
        doctor_id: doctors[1]._id,
        date: formatDate(tomorrow),
        time: '10:00',
        status: 'pending',
        pre_screening: {
          symptoms: 'Headache and dizziness',
          duration: '2 days'
        },
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        patient_id: patients[2]._id,
        doctor_id: doctors[0]._id,
        date: formatDate(nextWeek),
        time: '14:00',
        status: 'pending',
        pre_screening: {
          symptoms: 'Regular checkup',
          notes: 'Annual physical exam'
        },
        created_at: new Date(),
        updated_at: new Date()
      },
      // Approved appointment
      {
        patient_id: patients[3]._id,
        doctor_id: doctors[2] ? doctors[2]._id : doctors[0]._id,
        date: formatDate(tomorrow),
        time: '11:00',
        status: 'approved',
        pre_screening: {
          symptoms: 'Follow-up consultation',
          previous_visit: 'Last month'
        },
        admin_notes: 'Approved for follow-up',
        created_at: new Date(),
        updated_at: new Date()
      },
      // Completed appointment (yesterday)
      {
        patient_id: patients[4]._id,
        doctor_id: doctors[0]._id,
        date: formatDate(new Date(today.setDate(today.getDate() - 1))),
        time: '09:00',
        status: 'completed',
        pre_screening: {
          symptoms: 'Skin rash',
          duration: '1 week'
        },
        admin_notes: 'Consultation completed',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        updated_at: new Date()
      }
    ];

    const result = await collections.appointments().insertMany(sampleAppointments);
    console.log(`✅ Created ${Object.keys(result.insertedIds).length} sample appointments`);
    console.log('   - 3 Pending appointments');
    console.log('   - 1 Approved appointment');
    console.log('   - 1 Completed appointment');
  } catch (error) {
    console.error('Error auto-seeding appointments:', error.message);
  }
}

/**
 * Manual seed function for npm run seed:appointments
 */
async function seedAppointments() {
  try {
    const { connectDB } = await import('../src/config/database.js');
    console.log('Connecting to MongoDB...');
    await connectDB();

    console.log('Checking for existing appointments...');
    const existingCount = await collections.appointments().countDocuments();

    if (existingCount > 0) {
      console.log(`⚠️  ${existingCount} appointments already exist!`);
      console.log('Do you want to continue? This will add more sample data.');
      process.exit(0);
    }

    await seedAppointmentsIfEmpty();
    
    console.log('\n✅ Sample data seeding complete!');
    console.log('\n📊 Summary:');
    const patientCount = await collections.patients().countDocuments();
    const appointmentCount = await collections.appointments().countDocuments();
    console.log(`   Patients: ${patientCount}`);
    console.log(`   Appointments: ${appointmentCount}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding appointments:', error);
    process.exit(1);
  }
}

// Only run manual seed if this script is executed directly
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  seedAppointments();
}
