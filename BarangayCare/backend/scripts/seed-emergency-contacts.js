import { collections } from '../src/config/database.js';

// Sample emergency contacts for the barangay area
// Using coordinates around a typical Metro Manila barangay
const emergencyContacts = [
  // Hospitals
  {
    category: 'hospital',
    name: 'Barangay Health Center',
    description: 'Primary healthcare facility',
    phone: '(02) 8123-4567',
    address: '123 Main St, Barangay Centro',
    location: {
      type: 'Point',
      coordinates: [121.0244, 14.5547] // [longitude, latitude]
    },
    available_24_7: true,
    services: ['Emergency Room', 'Consultation', 'Laboratory', 'Pharmacy'],
    priority: 1,
    is_active: true,
    created_at: new Date()
  },
  {
    category: 'hospital',
    name: 'Metro General Hospital',
    description: 'Tertiary hospital with full emergency services',
    phone: '(02) 8234-5678',
    emergency_hotline: '911',
    address: '456 Hospital Ave, Metro Manila',
    location: {
      type: 'Point',
      coordinates: [121.0344, 14.5647]
    },
    available_24_7: true,
    services: ['Emergency Room', 'ICU', 'Surgery', 'Trauma Center', 'Ambulance'],
    priority: 2,
    is_active: true,
    created_at: new Date()
  },
  {
    category: 'hospital',
    name: 'Community Medical Center',
    description: 'Community hospital with emergency department',
    phone: '(02) 8345-6789',
    address: '789 Health Road, Metro Manila',
    location: {
      type: 'Point',
      coordinates: [121.0144, 14.5447]
    },
    available_24_7: true,
    services: ['Emergency Room', 'Consultation', 'X-Ray', 'Laboratory'],
    priority: 3,
    is_active: true,
    created_at: new Date()
  },

  // Ambulance Services
  {
    category: 'ambulance',
    name: 'Barangay Ambulance Service',
    description: 'Free ambulance for barangay residents',
    phone: '(02) 8456-7890',
    emergency_hotline: '123',
    address: '123 Main St, Barangay Centro',
    location: {
      type: 'Point',
      coordinates: [121.0244, 14.5547]
    },
    available_24_7: true,
    services: ['Emergency Transport', 'Basic Life Support'],
    priority: 1,
    is_active: true,
    created_at: new Date()
  },
  {
    category: 'ambulance',
    name: 'Red Cross Ambulance',
    description: 'Philippine Red Cross emergency ambulance',
    phone: '(02) 8527-0000',
    emergency_hotline: '143',
    address: 'Red Cross Building, Metro Manila',
    location: {
      type: 'Point',
      coordinates: [121.0294, 14.5597]
    },
    available_24_7: true,
    services: ['Emergency Transport', 'Advanced Life Support', 'Disaster Response'],
    priority: 2,
    is_active: true,
    created_at: new Date()
  },

  // Police Stations
  {
    category: 'police',
    name: 'Barangay Police Outpost',
    description: 'Local police assistance',
    phone: '(02) 8567-8901',
    emergency_hotline: '117',
    address: '123 Main St, Barangay Centro',
    location: {
      type: 'Point',
      coordinates: [121.0244, 14.5547]
    },
    available_24_7: true,
    services: ['Emergency Response', 'Crime Prevention', 'Traffic Management'],
    priority: 1,
    is_active: true,
    created_at: new Date()
  },
  {
    category: 'police',
    name: 'Metro Manila Police Station 5',
    description: 'Main police station',
    phone: '(02) 8678-9012',
    emergency_hotline: '911',
    address: '321 Police St, Metro Manila',
    location: {
      type: 'Point',
      coordinates: [121.0194, 14.5497]
    },
    available_24_7: true,
    services: ['Emergency Response', 'Investigation', 'Community Service'],
    priority: 2,
    is_active: true,
    created_at: new Date()
  },

  // Fire Stations
  {
    category: 'fire',
    name: 'Barangay Fire Brigade',
    description: 'Local fire and rescue services',
    phone: '(02) 8789-0123',
    emergency_hotline: '160',
    address: '456 Fire Lane, Barangay Centro',
    location: {
      type: 'Point',
      coordinates: [121.0244, 14.5547]
    },
    available_24_7: true,
    services: ['Fire Response', 'Rescue Operations', 'Fire Prevention'],
    priority: 1,
    is_active: true,
    created_at: new Date()
  },
  {
    category: 'fire',
    name: 'Bureau of Fire Protection - District 3',
    description: 'Main fire station with full equipment',
    phone: '(02) 8890-1234',
    emergency_hotline: '160',
    address: '789 Firefighter Ave, Metro Manila',
    location: {
      type: 'Point',
      coordinates: [121.0344, 14.5647]
    },
    available_24_7: true,
    services: ['Fire Response', 'Rescue Operations', 'Hazmat Response', 'Fire Prevention'],
    priority: 2,
    is_active: true,
    created_at: new Date()
  },

  // Other Emergency Services
  {
    category: 'emergency',
    name: 'National Emergency Hotline',
    description: 'Unified emergency response system',
    phone: '911',
    emergency_hotline: '911',
    address: 'Nationwide Service',
    location: {
      type: 'Point',
      coordinates: [121.0244, 14.5547]
    },
    available_24_7: true,
    services: ['Police', 'Fire', 'Medical', 'Rescue'],
    priority: 1,
    is_active: true,
    created_at: new Date()
  },
  {
    category: 'emergency',
    name: 'NDRRMC Emergency Operations',
    description: 'National disaster response and management',
    phone: '(02) 8911-1406',
    emergency_hotline: '136',
    address: 'Camp Aguinaldo, Quezon City',
    location: {
      type: 'Point',
      coordinates: [121.0544, 14.6047]
    },
    available_24_7: true,
    services: ['Disaster Response', 'Rescue', 'Evacuation'],
    priority: 3,
    is_active: true,
    created_at: new Date()
  },
  {
    category: 'emergency',
    name: 'Coast Guard Emergency',
    description: 'Maritime emergency and rescue',
    phone: '(02) 8527-8481',
    emergency_hotline: '136',
    address: 'Coast Guard Headquarters',
    location: {
      type: 'Point',
      coordinates: [120.9744, 14.5347]
    },
    available_24_7: true,
    services: ['Maritime Rescue', 'Water Emergency', 'Disaster Response'],
    priority: 4,
    is_active: true,
    created_at: new Date()
  }
];

/**
 * Auto-seed emergency contacts if collection is empty
 * Called automatically on server startup
 */
export async function seedEmergencyContactsIfEmpty() {
  try {
    const contactCount = await collections.emergencyContacts().countDocuments();
    
    if (contactCount > 0) {
      console.log('📞 Emergency contacts already exist. Skipping seed.');
      return;
    }

    console.log('📞 Seeding emergency contacts...');
    
    // Create geospatial index for location-based queries
    await collections.emergencyContacts().createIndex({ location: '2dsphere' });
    
    const result = await collections.emergencyContacts().insertMany(emergencyContacts);
    
    console.log(`✅ Seeded ${result.insertedCount} emergency contacts!`);
    console.log('\n📋 Emergency Contacts Summary:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🏥 Hospitals: ${emergencyContacts.filter(c => c.category === 'hospital').length}`);
    console.log(`🚑 Ambulance: ${emergencyContacts.filter(c => c.category === 'ambulance').length}`);
    console.log(`👮 Police: ${emergencyContacts.filter(c => c.category === 'police').length}`);
    console.log(`🚒 Fire: ${emergencyContacts.filter(c => c.category === 'fire').length}`);
    console.log(`🆘 Other Emergency: ${emergencyContacts.filter(c => c.category === 'emergency').length}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  } catch (error) {
    console.error('Error auto-seeding emergency contacts:', error.message);
  }
}

/**
 * Manual seed function for npm run seed:emergency-contacts
 */
async function seedEmergencyContacts() {
  try {
    const { connectDB } = await import('../src/config/database.js');
    console.log('Connecting to MongoDB...');
    await connectDB();

    console.log('Checking for existing emergency contacts...');
    const existingCount = await collections.emergencyContacts().countDocuments();

    if (existingCount > 0) {
      console.log(`⚠️  ${existingCount} emergency contacts already exist!`);
      console.log('Clear the collection first or update existing contacts.');
      process.exit(0);
    }

    console.log('Creating geospatial index...');
    await collections.emergencyContacts().createIndex({ location: '2dsphere' });

    console.log('Inserting emergency contacts...');
    const result = await collections.emergencyContacts().insertMany(emergencyContacts);

    console.log(`\n✅ Successfully seeded ${result.insertedCount} emergency contacts!`);
    console.log('\n📋 Emergency Contacts Summary:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`🏥 Hospitals: ${emergencyContacts.filter(c => c.category === 'hospital').length}`);
    console.log(`🚑 Ambulance: ${emergencyContacts.filter(c => c.category === 'ambulance').length}`);
    console.log(`👮 Police: ${emergencyContacts.filter(c => c.category === 'police').length}`);
    console.log(`🚒 Fire: ${emergencyContacts.filter(c => c.category === 'fire').length}`);
    console.log(`🆘 Other Emergency: ${emergencyContacts.filter(c => c.category === 'emergency').length}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding emergency contacts:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedEmergencyContacts();
}
