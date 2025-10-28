import dotenv from 'dotenv';
import { connectDB } from '../src/config/database.js';
import { collections } from '../src/config/database.js';

dotenv.config();

const sampleMedicines = [
  {
    med_name: 'Paracetamol 500mg',
    description: 'Pain reliever and fever reducer',
    stock_qty: 100,
    reorder_level: 20,
    is_prescription_required: false,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    med_name: 'Amoxicillin 500mg',
    description: 'Antibiotic for bacterial infections',
    stock_qty: 50,
    reorder_level: 20,
    is_prescription_required: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    med_name: 'Ibuprofen 400mg',
    description: 'Anti-inflammatory pain reliever',
    stock_qty: 75,
    reorder_level: 20,
    is_prescription_required: false,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    med_name: 'Cetirizine 10mg',
    description: 'Antihistamine for allergies',
    stock_qty: 60,
    reorder_level: 20,
    is_prescription_required: false,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    med_name: 'Omeprazole 20mg',
    description: 'Proton pump inhibitor for stomach acid',
    stock_qty: 40,
    reorder_level: 20,
    is_prescription_required: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    med_name: 'Vitamin C 500mg',
    description: 'Immune system support',
    stock_qty: 150,
    reorder_level: 30,
    is_prescription_required: false,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    med_name: 'Multivitamins',
    description: 'Daily vitamin supplement',
    stock_qty: 80,
    reorder_level: 25,
    is_prescription_required: false,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    med_name: 'Losartan 50mg',
    description: 'Blood pressure medication',
    stock_qty: 30,
    reorder_level: 15,
    is_prescription_required: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    med_name: 'Metformin 500mg',
    description: 'Diabetes medication',
    stock_qty: 45,
    reorder_level: 20,
    is_prescription_required: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    med_name: 'Salbutamol Inhaler',
    description: 'Asthma relief inhaler',
    stock_qty: 20,
    reorder_level: 10,
    is_prescription_required: true,
    created_at: new Date(),
    updated_at: new Date()
  }
];

// Exportable function that only seeds if collection is empty
export async function seedMedicinesIfEmpty() {
  try {
    // Check if medicines already exist
    const count = await collections.medicineInventory().countDocuments();
    
    if (count > 0) {
      console.log('💊 Medicine inventory already contains data. Skipping seed.');
      return { skipped: true, count };
    }

    console.log('🌱 Medicine inventory is empty. Starting seed...');
    
    // Insert sample medicines
    const result = await collections.medicineInventory().insertMany(sampleMedicines);
    console.log(`✅ Successfully seeded ${result.insertedCount} medicines`);
    
    return { seeded: true, count: result.insertedCount };
  } catch (error) {
    console.error('❌ Error seeding medicines:', error);
    throw error;
  }
}

// Script execution (only when run directly)
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
      console.log(`${index + 1}. ${med.med_name} - Stock: ${med.stock_qty} ${med.is_prescription_required ? '(Rx Required)' : ''}`);
    });
    
    console.log('\n✨ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding medicines:', error);
    process.exit(1);
  }
}

// Only run if this file is executed directly (not when imported)
if (import.meta.url === `file://${process.argv[1].replace(/\\/g, '/')}`) {
  seedMedicines();
}
