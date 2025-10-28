import { collections } from '../config/database.js';

/**
 * Middleware to check if the authenticated user is an admin
 * Must be used after the authenticate middleware
 */
export const adminOnly = async (c, next) => {
  try {
    const user = c.get('user');
    
    if (!user) {
      return c.json({ error: 'Authentication required' }, 401);
    }

    // Check if user is an admin
    const admin = await collections.admins().findOne({ 
      firebase_uid: user.uid,
      is_active: true
    });

    if (!admin) {
      return c.json({ 
        error: 'Admin access required',
        message: 'You do not have permission to access this resource'
      }, 403);
    }

    // Attach admin info to context
    c.set('admin', admin);
    
    await next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    return c.json({ error: 'Authorization check failed' }, 500);
  }
};

/**
 * Middleware to check for super admin role
 * Must be used after adminOnly middleware
 */
export const superAdminOnly = async (c, next) => {
  try {
    const admin = c.get('admin');
    
    if (!admin || admin.role !== 'super_admin') {
      return c.json({ 
        error: 'Super admin access required',
        message: 'You do not have permission to access this resource'
      }, 403);
    }
    
    await next();
  } catch (error) {
    console.error('Super admin middleware error:', error);
    return c.json({ error: 'Authorization check failed' }, 500);
  }
};
