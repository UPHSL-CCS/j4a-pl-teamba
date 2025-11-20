import dotenv from 'dotenv';
import { collections, connectDB } from '../src/config/database.js';

// Load environment variables
dotenv.config();

async function checkEmergencyContacts() {
  try {
    // Connect to database first
    await connectDB();
    
    console.log('🔍 Checking emergency contacts in database...\n');
    
    const contacts = await collections.emergencyContacts().find({}).toArray();
    
    console.log(`📊 Total contacts found: ${contacts.length}\n`);
    
    if (contacts.length > 0) {
      console.log('✅ Emergency contacts available:');
      console.log(`🏥 Hospitals: ${contacts.filter(c => c.category === 'hospital').length}`);
      console.log(`🚑 Ambulance: ${contacts.filter(c => c.category === 'ambulance').length}`);
      console.log(`👮 Police: ${contacts.filter(c => c.category === 'police').length}`);
      console.log(`🚒 Fire: ${contacts.filter(c => c.category === 'fire').length}`);
      console.log(`🆘 Emergency: ${contacts.filter(c => c.category === 'emergency').length}`);
      
      console.log('\n📋 Sample contacts:');
      contacts.slice(0, 3).forEach(contact => {
        console.log(`  - ${contact.name} (${contact.category}) - ${contact.phone}`);
      });
    } else {
      console.log('❌ No emergency contacts found in database!');
      console.log('Run: node scripts/seed-emergency-contacts.js');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error checking contacts:', error);
    process.exit(1);
  }
}

checkEmergencyContacts();
