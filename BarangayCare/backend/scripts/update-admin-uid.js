import dotenv from 'dotenv';
import { connectDB } from '../src/config/database.js';
import { collections } from '../src/config/database.js';
import readline from 'readline';

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function updateAdminUID() {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();

    const email = await question('Enter admin email (default: admin@barangaycare.ph): ') || 'admin@barangaycare.ph';
    const firebaseUID = await question('Enter Firebase UID: ');

    if (!firebaseUID || firebaseUID.trim() === '') {
      console.error('❌ Firebase UID is required!');
      process.exit(1);
    }

    const result = await collections.admins().updateOne(
      { email: email },
      { 
        $set: { 
          firebase_uid: firebaseUID.trim(),
          updated_at: new Date()
        } 
      }
    );

    if (result.matchedCount === 0) {
      console.error(`❌ No admin found with email: ${email}`);
      process.exit(1);
    }

    console.log('\n✅ Admin Firebase UID updated successfully!');
    console.log(`Email: ${email}`);
    console.log(`Firebase UID: ${firebaseUID.trim()}`);
    console.log('\n🎉 You can now login with the admin credentials!');

    rl.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating admin UID:', error);
    rl.close();
    process.exit(1);
  }
}

updateAdminUID();
