import dotenv from 'dotenv';
import { connectDB, collections } from '../src/config/database.js';

dotenv.config();

const symptomEntries = [
  {
    symptom: 'flu_like',
    keywords: ['fever', 'cough', 'cold', 'body pain'],
    severity: 'moderate',
    recommendations:
      'Monitor your temperature, stay hydrated, and isolate if necessary. Visit the clinic if fever persists beyond 3 days.',
    recommended_actions: ['Book Appointment', 'Request Medicine'],
    requires_immediate_attention: false,
    related_conditions: ['Seasonal Flu', 'Viral Infection'],
    language: 'en',
    created_at: new Date(),
  },
  {
    symptom: 'respiratory_distress',
    keywords: ['shortness of breath', 'wheezing', 'chest tightness'],
    severity: 'emergency',
    recommendations:
      'Seek emergency care immediately. Difficulty breathing can be life threatening.',
    recommended_actions: ['Emergency Contacts', 'Call Hotline'],
    requires_immediate_attention: true,
    related_conditions: ['Asthma attack', 'Cardiac event'],
    language: 'en',
    created_at: new Date(),
  },
  {
    symptom: 'maternal_health',
    keywords: ['pregnant', 'prenatal', 'baby', 'contraction'],
    severity: 'advisory',
    recommendations:
      'Coordinate with maternal health services. Track fetal movement and consult an OB-GYN for prenatal concerns.',
    recommended_actions: ['Book Appointment', 'Contact Clinic'],
    requires_immediate_attention: false,
    related_conditions: ['Prenatal Care'],
    language: 'en',
    created_at: new Date(),
  },
  {
    symptom: 'lagnat_ubo',
    keywords: ['lagnat', 'ubo', 'sipon'],
    severity: 'moderate',
    recommendations:
      'Panatilihing hydrated at magpahinga. Kung tumagal ang sintomas ng higit tatlong araw o nahihirapan huminga, magpakonsulta agad.',
    recommended_actions: ['Book Appointment', 'View FAQ'],
    requires_immediate_attention: false,
    related_conditions: ['Trangkaso'],
    language: 'fil',
    created_at: new Date(),
  },
];

export async function seedSymptomsIfEmpty() {
  const count = await collections.symptomDatabase().countDocuments();
  if (count > 0) {
    console.log('🩺 Symptom database already contains data. Skipping seed.');
    return { skipped: true, count };
  }

  const result = await collections.symptomDatabase().insertMany(symptomEntries);
  console.log(`✅ Seeded ${result.insertedCount} symptom records`);
  return { seeded: true, count: result.insertedCount };
}

async function runSeed() {
  try {
    await connectDB();
    await collections.symptomDatabase().deleteMany({});
    const result = await collections.symptomDatabase().insertMany(symptomEntries);
    console.log(`✅ Inserted ${result.insertedCount} symptom documents`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to seed symptom database:', error);
    process.exit(1);
  }
}

if (process.argv[1]?.includes('seed-symptoms')) {
  runSeed();
}


