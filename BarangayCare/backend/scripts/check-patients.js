import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

async function checkPatients() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB...\n');
    
    const db = client.db('barangaycare');
    const patients = await db.collection('patients').find({}).toArray();
    
    console.log(`📊 Total patients in DB: ${patients.length}\n`);
    console.log('=== ALL PATIENTS ===');
    patients.forEach((p, i) => {
      console.log(`${i+1}. ${p.name || 'No name'} (${p.email || 'No email'})`);
      console.log(`   UID: ${p.uid || 'No UID'}`);
      console.log(`   Barangay: ${p.barangay || 'N/A'}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    process.exit(0);
  }
}

checkPatients();
