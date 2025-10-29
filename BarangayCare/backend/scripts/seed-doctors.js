import dotenv from 'dotenv';
import { connectDB } from '../src/config/database.js';
import { collections } from '../src/config/database.js';

dotenv.config();

const sampleDoctors = [
  {
    name: 'Dr. Maria Santos',
    expertise: 'General Practice',
    license_number: 'PRC-GP-2015-001234',
    image: 'assets/images/girl 1.jpg',
    is_active: true,
    schedule: [
      { day: 'Mon', start: '08:00', end: '17:00' },
      { day: 'Wed', start: '08:00', end: '17:00' },
      { day: 'Fri', start: '08:00', end: '17:00' }
    ],
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'Dr. Juan Dela Cruz',
    expertise: 'Pediatrics',
    license_number: 'PRC-PD-2016-005678',
    image: 'assets/images/male 1.jpg',
    is_active: true,
    schedule: [
      { day: 'Tue', start: '09:00', end: '16:00' },
      { day: 'Thu', start: '09:00', end: '16:00' },
      { day: 'Sat', start: '09:00', end: '13:00' }
    ],
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'Dr. Ana Reyes',
    expertise: 'Internal Medicine',
    license_number: 'PRC-IM-2017-009012',
    image: 'assets/images/girl 2.jpeg',
    is_active: true,
    schedule: [
      { day: 'Mon', start: '10:00', end: '18:00' },
      { day: 'Tue', start: '10:00', end: '18:00' },
      { day: 'Thu', start: '10:00', end: '18:00' }
    ],
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'Dr. Roberto Garcia',
    expertise: 'Family Medicine',
    license_number: 'PRC-FM-2018-003456',
    image: 'assets/images/male 2.jpg',
    is_active: true,
    schedule: [
      { day: 'Mon', start: '08:00', end: '16:00' },
      { day: 'Wed', start: '08:00', end: '16:00' },
      { day: 'Fri', start: '08:00', end: '16:00' },
      { day: 'Sat', start: '08:00', end: '12:00' }
    ],
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'Dr. Carmen Lopez',
    expertise: 'Obstetrics and Gynecology',
    license_number: 'PRC-OB-2019-007890',
    image: 'assets/images/girl 3.jpg',
    is_active: true,
    schedule: [
      { day: 'Tue', start: '13:00', end: '19:00' },
      { day: 'Thu', start: '13:00', end: '19:00' },
      { day: 'Fri', start: '13:00', end: '19:00' }
    ],
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'Dr. Pedro Martinez',
    expertise: 'Cardiology',
    license_number: 'PRC-CD-2014-002345',
    image: 'assets/images/male 3.jpg',
    is_active: true,
    schedule: [
      { day: 'Wed', start: '14:00', end: '18:00' },
      { day: 'Fri', start: '14:00', end: '18:00' }
    ],
    created_at: new Date(),
    updated_at: new Date()
  }
];

// Exportable function that only seeds if collection is empty
export async function seedDoctorsIfEmpty() {
  try {
    // Check if doctors already exist
    const count = await collections.doctors().countDocuments();
    
    if (count > 0) {
      console.log('👨‍⚕️ Doctors collection already contains data. Skipping seed.');
      return { skipped: true, count };
    }

    console.log('🌱 Doctors collection is empty. Starting seed...');
    
    // Insert sample doctors
    const result = await collections.doctors().insertMany(sampleDoctors);
    console.log(`✅ Successfully seeded ${result.insertedCount} doctors`);
    
    return { seeded: true, count: result.insertedCount };
  } catch (error) {
    console.error('❌ Error seeding doctors:', error);
    throw error;
  }
}

// Script execution (only when run directly)
async function seedDoctors() {
  try {
    console.log('🌱 Starting doctor seeding...');
    
    // Connect to database
    await connectDB();
    
    // Clear existing doctors (optional - comment out if you want to keep existing data)
    const deleteResult = await collections.doctors().deleteMany({});
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing doctors`);
    
    // Insert sample doctors
    const result = await collections.doctors().insertMany(sampleDoctors);
    console.log(`✅ Successfully seeded ${result.insertedCount} doctors`);
    
    // Display seeded doctors
    const doctors = await collections.doctors().find({}).toArray();
    console.log('\n👨‍⚕️ Seeded Doctors:');
    doctors.forEach((doctor, index) => {
      console.log(`${index + 1}. Dr. ${doctor.name} - ${doctor.expertise}`);
      console.log(`   License: ${doctor.license_number}`);
      console.log(`   Schedule: ${doctor.schedule.map(s => s.day).join(', ')}`);
    });
    
    console.log('\n✨ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding doctors:', error);
    process.exit(1);
  }
}

// Only run if this file is executed directly (not when imported)
const isMainModule = process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'));
if (isMainModule || process.argv[1]?.includes('seed-doctors')) {
  seedDoctors();
}
