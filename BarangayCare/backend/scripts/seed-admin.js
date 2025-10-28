import { collections } from '../src/config/database.js';

// Default admin account
// Email: admin@barangaycare.ph
// Password: Admin@123456
const defaultAdmin = {
  firebase_uid: 'REPLACE_WITH_FIREBASE_UID', // Will be updated after Firebase signup
  email: 'admin@barangaycare.ph',
  full_name: 'System Administrator',
  role: 'super_admin',
  is_active: true,
  created_at: new Date(),
  updated_at: new Date()
};

/**
 * Auto-seed admin account if admins collection is empty
 * Called automatically on server startup
 */
export async function seedAdminIfEmpty() {
  try {
    const adminCount = await collections.admins().countDocuments();
    
    if (adminCount > 0) {
      console.log('👤 Admin accounts already exist. Skipping seed.');
      return;
    }

    console.log('👤 Creating default admin account...');
    await collections.admins().insertOne(defaultAdmin);

    console.log('✅ Default admin account created!');
    console.log('\n📋 Admin Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Email:    ${defaultAdmin.email}`);
    console.log(`Password: Admin@123456`);
    console.log(`Role:     ${defaultAdmin.role}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n⚠️  IMPORTANT: Link Firebase UID using npm run update:admin-uid\n');
  } catch (error) {
    console.error('Error auto-seeding admin:', error.message);
  }
}

/**
 * Manual seed function for npm run seed:admin
 */
async function seedAdmin() {
  try {
    const { connectDB } = await import('../src/config/database.js');
    console.log('Connecting to MongoDB...');
    await connectDB();

    console.log('Checking for existing admin...');
    const existingAdmin = await collections.admins().findOne({ 
      email: defaultAdmin.email 
    });

    if (existingAdmin) {
      console.log('⚠️  Admin account already exists!');
      console.log(`Email: ${existingAdmin.email}`);
      console.log(`Role: ${existingAdmin.role}`);
      console.log(`Firebase UID: ${existingAdmin.firebase_uid}`);
      process.exit(0);
    }

    console.log('Creating admin account...');
    const result = await collections.admins().insertOne(defaultAdmin);

    console.log('\n✅ Admin account created successfully!');
    console.log('\n📋 Admin Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Email:    ${defaultAdmin.email}`);
    console.log(`Password: Admin@123456`);
    console.log(`Role:     ${defaultAdmin.role}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n⚠️  IMPORTANT SETUP STEPS:');
    console.log('1. Go to Firebase Console > Authentication');
    console.log('2. Add a new user with email: admin@barangaycare.ph');
    console.log('3. Set password: Admin@123456');
    console.log('4. Copy the User UID from Firebase');
    console.log('5. Update the admin record in MongoDB:');
    console.log(`   db.admins.updateOne(
     { email: "admin@barangaycare.ph" },
     { $set: { firebase_uid: "PASTE_FIREBASE_UID_HERE" } }
   )`);
    console.log('\n💡 Or use the update-admin-uid.js script after creating the Firebase user');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  }
}

// Only run manual seed if this script is executed directly
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  seedAdmin();
}
