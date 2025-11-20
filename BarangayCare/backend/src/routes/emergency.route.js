import { Hono } from 'hono';
import { collections } from '../config/database.js';
import { authMiddleware as authenticate } from '../middleware/auth.middleware.js';
import { ObjectId } from 'mongodb';

const emergency = new Hono();

/**
 * GET /api/emergency/contacts
 * Get all emergency contacts
 * Query params: category (optional) - filter by category (hospital, ambulance, police, fire, emergency)
 */
emergency.get('/contacts', authenticate, async (c) => {
  try {
    const category = c.req.query('category');
    
    const query = { is_active: true };
    if (category) {
      query.category = category;
    }

    const contacts = await collections.emergency_contacts
      .find(query)
      .sort({ priority: 1, name: 1 })
      .toArray();

    return c.json({
      success: true,
      count: contacts.length,
      contacts
    });
  } catch (error) {
    console.error('Error fetching emergency contacts:', error);
    return c.json({ error: 'Failed to fetch emergency contacts' }, 500);
  }
});

/**
 * GET /api/emergency/nearest
 * Find nearest emergency contacts based on user's location
 * Query params: 
 *   - latitude (required)
 *   - longitude (required)
 *   - category (optional)
 *   - maxDistance (optional, default: 10000 meters = 10km)
 *   - limit (optional, default: 5)
 */
emergency.get('/nearest', authenticate, async (c) => {
  try {
    const latitude = parseFloat(c.req.query('latitude'));
    const longitude = parseFloat(c.req.query('longitude'));
    const category = c.req.query('category');
    const maxDistance = parseInt(c.req.query('maxDistance')) || 10000; // 10km default
    const limit = parseInt(c.req.query('limit')) || 5;

    // Validate coordinates
    if (isNaN(latitude) || isNaN(longitude)) {
      return c.json({ error: 'Valid latitude and longitude are required' }, 400);
    }

    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return c.json({ error: 'Invalid coordinates' }, 400);
    }

    // Build query with geospatial search
    const query = {
      is_active: true,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          },
          $maxDistance: maxDistance
        }
      }
    };

    if (category) {
      query.category = category;
    }

    const nearestContacts = await collections.emergency_contacts
      .find(query)
      .limit(limit)
      .toArray();

    // Calculate distances for each contact (in meters and kilometers)
    const contactsWithDistance = nearestContacts.map(contact => {
      const distance = calculateDistance(
        latitude,
        longitude,
        contact.location.coordinates[1],
        contact.location.coordinates[0]
      );

      return {
        ...contact,
        distance: {
          meters: Math.round(distance),
          kilometers: (distance / 1000).toFixed(2),
          formatted: formatDistance(distance)
        }
      };
    });

    return c.json({
      success: true,
      userLocation: { latitude, longitude },
      count: contactsWithDistance.length,
      contacts: contactsWithDistance
    });
  } catch (error) {
    console.error('Error finding nearest emergency contacts:', error);
    return c.json({ error: 'Failed to find nearest contacts' }, 500);
  }
});

/**
 * POST /api/emergency/log
 * Log an emergency call or contact
 * Body: { contact_id, action_type ('call' | 'sms' | 'view'), notes }
 */
emergency.post('/log', authenticate, async (c) => {
  try {
    const userId = c.get('user').uid;
    const body = await c.req.json();
    const { contact_id, action_type, notes, user_location } = body;

    // Validate input
    if (!contact_id || !action_type) {
      return c.json({ error: 'contact_id and action_type are required' }, 400);
    }

    if (!['call', 'sms', 'view'].includes(action_type)) {
      return c.json({ error: 'action_type must be call, sms, or view' }, 400);
    }

    // Validate contact exists
    if (!ObjectId.isValid(contact_id)) {
      return c.json({ error: 'Invalid contact_id' }, 400);
    }

    const contact = await collections.emergency_contacts.findOne({
      _id: new ObjectId(contact_id)
    });

    if (!contact) {
      return c.json({ error: 'Emergency contact not found' }, 404);
    }

    // Create emergency log
    const emergencyLog = {
      user_id: userId,
      contact_id: new ObjectId(contact_id),
      contact_name: contact.name,
      contact_category: contact.category,
      action_type,
      notes: notes || '',
      user_location: user_location || null,
      timestamp: new Date(),
      created_at: new Date()
    };

    const result = await collections.emergency_logs.insertOne(emergencyLog);

    return c.json({
      success: true,
      message: `Emergency ${action_type} logged successfully`,
      log_id: result.insertedId
    });
  } catch (error) {
    console.error('Error logging emergency contact:', error);
    return c.json({ error: 'Failed to log emergency contact' }, 500);
  }
});

/**
 * GET /api/emergency/logs
 * Get emergency contact logs for current user
 * Query params: limit (optional, default: 50)
 */
emergency.get('/logs', authenticate, async (c) => {
  try {
    const userId = c.get('user').uid;
    const limit = parseInt(c.req.query('limit')) || 50;

    const logs = await collections.emergency_logs
      .find({ user_id: userId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray();

    return c.json({
      success: true,
      count: logs.length,
      logs
    });
  } catch (error) {
    console.error('Error fetching emergency logs:', error);
    return c.json({ error: 'Failed to fetch emergency logs' }, 500);
  }
});

/**
 * GET /api/emergency/categories
 * Get available emergency contact categories with counts
 */
emergency.get('/categories', authenticate, async (c) => {
  try {
    const categories = await collections.emergency_contacts.aggregate([
      { $match: { is_active: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          services: { $addToSet: '$services' }
        }
      },
      { $sort: { count: -1 } }
    ]).toArray();

    const categoryMap = {
      hospital: { name: 'Hospitals', icon: '🏥', priority: 1 },
      ambulance: { name: 'Ambulance', icon: '🚑', priority: 2 },
      police: { name: 'Police', icon: '👮', priority: 3 },
      fire: { name: 'Fire Department', icon: '🚒', priority: 4 },
      emergency: { name: 'Emergency Services', icon: '🆘', priority: 5 }
    };

    const categoriesWithInfo = categories.map(cat => ({
      category: cat._id,
      name: categoryMap[cat._id]?.name || cat._id,
      icon: categoryMap[cat._id]?.icon || '📞',
      priority: categoryMap[cat._id]?.priority || 99,
      count: cat.count,
      services: cat.services.flat()
    })).sort((a, b) => a.priority - b.priority);

    return c.json({
      success: true,
      categories: categoriesWithInfo
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return c.json({ error: 'Failed to fetch categories' }, 500);
  }
});

/**
 * Haversine formula to calculate distance between two coordinates
 * Returns distance in meters
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

/**
 * Format distance for display
 */
function formatDistance(meters) {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  } else {
    return `${(meters / 1000).toFixed(1)} km`;
  }
}

export default emergency;
