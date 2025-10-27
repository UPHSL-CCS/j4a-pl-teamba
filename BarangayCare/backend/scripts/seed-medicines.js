import dotenv from 'dotenv';
import { connectDB } from '../src/config/database.js';
import { collections } from '../src/config/database.js';

dotenv.config();

const sampleMedicines = [
  {
    name: 'Paracetamol 500mg',
    description: 'Pain reliever and fever reducer',
    stock: 100,
    requires_prescription: false,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'Amoxicillin 500mg',
    description: 'Antibiotic for bacterial infections',
    stock: 50,
    requires_prescription: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'Ibuprofen 400mg',
    description: 'Anti-inflammatory pain reliever',
    stock: 75,
    requires_prescription: false,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'Cetirizine 10mg',
    description: 'Antihistamine for allergies',
    stock: 60,
    requires_prescription: false,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'Omeprazole 20mg',
    description: 'Proton pump inhibitor for stomach acid',
    stock: 40,
    requires_prescription: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'Vitamin C 500mg',
    description: 'Immune system support',
    stock: 150,
    requires_prescription: false,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'Multivitamins',
    description: 'Daily vitamin supplement',
    stock: 80,
    requires_prescription: false,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'Losartan 50mg',
    description: 'Blood pressure medication',
    stock: 30,
    requires_prescription: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'Metformin 500mg',
    description: 'Diabetes medication',
    stock: 45,
    requires_prescription: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    name: 'Salbutamol Inhaler',
    description: 'Asthma relief inhaler',
    stock: 20,
    requires_prescription: true,
    created_at: new Date(),
    updated_at: new Date()
  }
];

async function seedMedicines() {
  try {
    console.log('🌱 Starting medicine seeding...');
    
    // Connect to database
    await connectDB();
    
    // Clear existing medicines (optional - comment out if you want to keep existing data)
    const deleteResult = await collections.medicineInventory().deleteMany({});
    console.log(`🗑️  Deleted ${deleteResult.deletedCount} existing medicines`);
    
    // Insert sample medicines
    const result = await collections.medicineInventory().insertMany(sampleMedicines);
    console.log(`✅ Successfully seeded ${result.insertedCount} medicines`);
    
    // Display seeded medicines
    const medicines = await collections.medicineInventory().find({}).toArray();
    console.log('\n📦 Seeded Medicines:');
    medicines.forEach((med, index) => {
      console.log(`${index + 1}. ${med.name} - Stock: ${med.stock} ${med.requires_prescription ? '(Rx Required)' : ''}`);
    });
    
    console.log('\n✨ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding medicines:', error);
    process.exit(1);
  }
}

seedMedicines();
