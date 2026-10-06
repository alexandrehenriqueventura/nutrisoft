import * as admin from "firebase-admin";

// Ensure environment variables from .env.local are loaded when running in standalone Node scripts
if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID && !process.env.FIREBASE_ADMIN_PROJECT_ID) {
  try {
    const dotenv = require("dotenv");
    dotenv.config({ path: ".env.local" });
  } catch (e) {
    // Ignore if dotenv is not available
  }
}

function getAdminApp() {
  if (admin.apps.length > 0) {
    return admin.apps[0]!;
  }

  // Option 1: Full JSON string in FIREBASE_SERVICE_ACCOUNT_KEY
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      return admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET,
      });
    } catch (e) {
      console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY JSON:", e);
    }
  }

  // Option 2: Individual Admin Credentials
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "nutrisoft-df543";
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (projectId && clientEmail && privateKey) {
    return admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || `${projectId}.firebasestorage.app`,
    });
  }

  // Option 3: Default application credentials or project ID fallback
  return admin.initializeApp({
    projectId,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || `${projectId}.firebasestorage.app`,
  });
}

const adminApp = getAdminApp();
const adminAuth = admin.auth(adminApp);
const adminDb = admin.firestore(adminApp);
const adminStorage = admin.storage(adminApp);

export { adminApp, adminAuth, adminDb, adminStorage };
