import { verifyFirebaseToken } from '../config/firebase.js';

export async function authMiddleware(c, next) {
  try {
    const authHeader = c.req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'No token provided' }, 401);
    }

    const token = authHeader.substring(7);
    const decodedToken = await verifyFirebaseToken(token);
    
    // Attach user info to context
    c.set('user', {
      uid: decodedToken.uid,
      email: decodedToken.email,
    });

    await next();
  } catch (error) {
    return c.json({ error: 'Unauthorized: ' + error.message }, 401);
  }
}

