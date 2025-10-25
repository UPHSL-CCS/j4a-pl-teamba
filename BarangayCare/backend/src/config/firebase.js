import admin from 'firebase-admin';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let firebaseApp = null;

export async function initializeFirebase() {
  try {
    // Try to load service account from file
    const serviceAccountPath = join(__dirname, '../../firebase-service-account.json');
    
    let credential;
    try {
      const serviceAccount = JSON.parse(await readFile(serviceAccountPath, 'utf8'));
      credential = admin.credential.cert(serviceAccount);
    } catch (error) {
      console.warn('⚠️  firebase-service-account.json not found, using application default credentials');
      credential = admin.credential.applicationDefault();
    }

    firebaseApp = admin.initializeApp({
      credential: credential,
      projectId: process.env.FIREBASE_PROJECT_ID,
    });

    return firebaseApp;
  } catch (error) {
    console.error('Firebase initialization error:', error);
    throw error;
  }
}

export function getFirebaseApp() {
  if (!firebaseApp) {
    throw new Error('Firebase not initialized. Call initializeFirebase first.');
  }
  return firebaseApp;
}

export async function verifyFirebaseToken(token) {
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

