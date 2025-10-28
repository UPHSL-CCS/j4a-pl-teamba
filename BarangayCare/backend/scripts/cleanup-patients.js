import dotenv from 'dotenv';
import { MongoClient, ObjectId } from 'mongodb';

dotenv.config();

async function cleanupPatients() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB...\n');
    
    const db = client.db('barangaycare');
    const patientsCollection = db.collection('patients');
    
    // Show current count
    const beforeCount = await patientsCollection.countDocuments();
    console.log(`📊 Patients before cleanup: ${beforeCount}\n`);
    
    // 1. Remove admin entries from patients collection
    console.log('1️⃣ Removing admin entries...');
    const adminResult = await patientsCollection.deleteMany({
      email: 'admin@barangaycare.ph'
    });
    console.log(`   ✅ Removed ${adminResult.deletedCount} admin entries\n`);
    
    // 2. Remove duplicate test entries by email patterns
    console.log('2️⃣ Removing duplicate/test entries...');
    
    // Remove by specific criteria
    const deleteResult = await patientsCollection.deleteMany({
      $or: [
        { email: 'anthony@gmail.com' }, // mark - test entry
        { name: '1234' }, // duplicate Larie entry
        { email: 'test123@gmail.com' }, // Agatha duplicate
        { email: 'test@gmail.com' }, // test entry
        { email: 'test222@gmail.com' }, // test entry
        { email: 'sample99@gmail.com' }, // sample test
        { email: 'trulalu@gmail.com' }, // pedro test
        { email: 'jerome@gmail.com' }, // Jerome test
        { email: 'larie@gmail.com' } // Larie duplicate (keeping Larie Besabe with amimirog email)
      ]
    });
    console.log(`   ✅ Removed ${deleteResult.deletedCount} duplicate/test entries\n`);
    
    // Show final count
    const afterCount = await patientsCollection.countDocuments();
    console.log(`📊 Patients after cleanup: ${afterCount}\n`);
    console.log(`🗑️  Total removed: ${beforeCount - afterCount}\n`);
    
    // Show remaining patients
    console.log('=== REMAINING PATIENTS ===');
    const remainingPatients = await patientsCollection.find({}).toArray();
    remainingPatients.forEach((p, i) => {
      console.log(`${i+1}. ${p.name} (${p.email}) - ${p.barangay}`);
    });
    
    console.log('\n✅ Cleanup completed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    process.exit(0);
  }
}

cleanupPatients();
