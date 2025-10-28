import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

async function checkMedicineRequests() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB...\n');
    
    const db = client.db('barangaycare');
    const requests = await db.collection('medicine_requests').find({}).toArray();
    
    console.log(`📊 Total medicine requests: ${requests.length}\n`);
    console.log('=== BY STATUS ===');
    
    const pending = requests.filter(r => r.status === 'pending');
    const approved = requests.filter(r => r.status === 'approved');
    const fulfilled = requests.filter(r => r.status === 'fulfilled');
    const rejected = requests.filter(r => r.status === 'rejected');
    
    console.log(`✋ Pending: ${pending.length}`);
    console.log(`✅ Approved: ${approved.length}`);
    console.log(`📦 Fulfilled: ${fulfilled.length}`);
    console.log(`❌ Rejected: ${rejected.length}`);
    
    console.log('\n=== ALL REQUESTS ===');
    requests.forEach((r, i) => {
      console.log(`\n${i+1}. Request ID: ${r._id}`);
      console.log(`   Patient ID: ${r.patient_id}`);
      console.log(`   Medicine ID: ${r.medicine_id}`);
      console.log(`   Quantity: ${r.quantity_requested}`);
      console.log(`   Status: ${r.status}`);
      console.log(`   Requested: ${r.requested_at}`);
      if (r.approved_at) console.log(`   Approved: ${r.approved_at}`);
      if (r.rejected_at) console.log(`   Rejected: ${r.rejected_at}`);
      if (r.admin_notes) console.log(`   Admin Notes: ${r.admin_notes}`);
      if (r.rejection_reason) console.log(`   Rejection Reason: ${r.rejection_reason}`);
    });
    
    // Check prescription required medicines
    console.log('\n\n=== PRESCRIPTION REQUIRED MEDICINES ===');
    const medicines = await db.collection('medicine_inventory').find({ is_prescription_required: true }).toArray();
    medicines.forEach(m => {
      console.log(`- ${m.med_name} (Stock: ${m.stock_qty})`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
    process.exit(0);
  }
}

checkMedicineRequests();
