import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

async function addReorderLevelToMedicines() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB...');
    
    const db = client.db('barangaycare');
    
    // Update all medicines to have reorder_level field
    // Set default reorder level based on medicine type or use a standard value
    const result = await db.collection('medicine_inventory').updateMany(
      { reorder_level: { $exists: false } },
      { 
        $set: { 
          reorder_level: 20, // Default reorder level
          updated_at: new Date() 
        } 
      }
    );
    
    console.log(`✅ Added reorder_level to ${result.modifiedCount} medicines`);
    
    // Show current low stock count
    const lowStockCount = await db.collection('medicine_inventory').countDocuments({
      $expr: { $lte: ['$stock_qty', '$reorder_level'] }
    });
    
    console.log(`\n📊 Low stock medicines: ${lowStockCount}`);
    
    // Show all medicines with their stock status
    const medicines = await db.collection('medicine_inventory').find({}).toArray();
    console.log('\n📦 Medicine stock levels:');
    medicines.forEach(m => {
      const isLow = m.stock_qty <= m.reorder_level;
      const status = isLow ? '⚠️  LOW' : '✅ OK';
      console.log(`   ${status} ${m.med_name}: stock=${m.stock_qty}, reorder=${m.reorder_level}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    process.exit(0);
  }
}

addReorderLevelToMedicines();
