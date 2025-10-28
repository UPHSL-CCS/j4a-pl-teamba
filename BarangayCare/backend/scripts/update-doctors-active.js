import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

async function updateDoctorsActiveStatus() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB...');
    
    const db = client.db('barangaycare');
    
    // Update all doctors to have is_active: true
    const result = await db.collection('doctors').updateMany(
      { is_active: { $exists: false } },
      { 
        $set: { 
          is_active: true,
          updated_at: new Date() 
        } 
      }
    );
    
    console.log(`✅ Updated ${result.modifiedCount} doctors with is_active: true`);
    
    // Show current counts
    const totalDoctors = await db.collection('doctors').countDocuments();
    const activeDoctors = await db.collection('doctors').countDocuments({ is_active: true });
    const inactiveDoctors = await db.collection('doctors').countDocuments({ is_active: false });
    
    console.log('\n📊 Doctor status counts:');
    console.log(`   Total: ${totalDoctors}`);
    console.log(`   Active: ${activeDoctors}`);
    console.log(`   Inactive: ${inactiveDoctors}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    process.exit(0);
  }
}

updateDoctorsActiveStatus();
