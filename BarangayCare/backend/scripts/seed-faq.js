import dotenv from 'dotenv';
import { connectDB, collections } from '../src/config/database.js';

dotenv.config();

const faqEntries = [
  {
    question: 'How do I book a consultation with a doctor?',
    answer:
      'You can book a consultation through the BarangayCare app. Go to Book Consultation, choose an available doctor, select your preferred schedule, then confirm the appointment.',
    category: 'appointments',
    keywords: ['book', 'consultation', 'doctor', 'schedule', 'appointment'],
    language: 'en',
    created_at: new Date(),
  },
  {
    question: 'Pwede po bang mag-request ng maintenance medicine?',
    answer:
      'Oo, pumunta lamang sa Request Medicine section ng app, piliin ang gamot at ilagay ang tamang detalye. May admin na mag-a-approve bago ma-release ang gamot.',
    category: 'medicines',
    keywords: ['gamot', 'medicine', 'request', 'maintenance'],
    language: 'fil',
    created_at: new Date(),
  },
  {
    question: 'What should I do if I feel severe chest pain?',
    answer:
      'For chest pain, difficulty breathing, or sudden weakness, seek emergency medical help immediately or call your local emergency hotline.',
    category: 'emergency',
    keywords: ['chest', 'pain', 'emergency', 'breathing'],
    language: 'en',
    created_at: new Date(),
  },
  {
    question: 'How can I view my appointment history?',
    answer:
      'Tap on My Appointments from the home screen to view upcoming and past consultations, including doctor notes once completed.',
    category: 'appointments',
    keywords: ['history', 'appointments', 'records'],
    language: 'en',
    created_at: new Date(),
  },
  {
    question: 'Kailan dapat magpatingin kapag may lagnat at ubo?',
    answer:
      'Kapag tumagal na ng higit sa tatlong araw ang lagnat at ubo, may hirap sa paghinga, o matinding panghihina, magpakonsulta agad sa barangay health center.',
    category: 'symptoms',
    keywords: ['lagnat', 'ubo', 'fever', 'cough', 'symptom'],
    language: 'fil',
    created_at: new Date(),
  },
  {
    question: 'Can the chatbot help with medicine information?',
    answer:
      'Yes. Ask about a medicine name and the chatbot will check the FAQ database for dosage guidance, common side effects, and availability.',
    category: 'medicines',
    keywords: ['chatbot', 'medicine', 'information', 'faq'],
    language: 'en',
    created_at: new Date(),
  },
];

export async function seedFaqIfEmpty() {
  const count = await collections.faqDatabase().countDocuments();
  if (count > 0) {
    console.log('💬 FAQ collection already has data. Skipping seed.');
    return { skipped: true, count };
  }

  const result = await collections.faqDatabase().insertMany(faqEntries);
  console.log(`✅ Seeded ${result.insertedCount} FAQ entries`);
  return { seeded: true, count: result.insertedCount };
}

async function runSeed() {
  try {
    await connectDB();
    await collections.faqDatabase().deleteMany({});
    const result = await collections.faqDatabase().insertMany(faqEntries);
    console.log(`✅ Inserted ${result.insertedCount} FAQ documents`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to seed FAQ database:', error);
    process.exit(1);
  }
}

if (process.argv[1]?.includes('seed-faq')) {
  runSeed();
}


