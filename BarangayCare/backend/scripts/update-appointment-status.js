import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

async function updateAppointmentStatus() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB...');
    
    const db = client.db('barangaycare');
    
    // Update 'booked' appointments to 'pending'
    const result = await db.collection('appointments').updateMany(
      { status: 'booked' },
      { 
        $set: { 
          status: 'pending', 
          updated_at: new Date() 
        } 
      }
    );
    
    console.log(`✅ Updated ${result.modifiedCount} appointments from 'booked' to 'pending'`);
    
    // Show current status counts
    const statusCounts = await db.collection('appointments').aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]).toArray();
    
    console.log('\n📊 Appointment status counts:');
    statusCounts.forEach(s => console.log(`   ${s._id}: ${s.count}`));
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    process.exit(0);
  }
}

updateAppointmentStatus();
