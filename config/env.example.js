/**
 * Example environment variables for PlaceListed
 * Copy this file to .env.local and fill in your actual values
 */

module.exports = {
  // Firebase Configuration
  NEXT_PUBLIC_FIREBASE_API_KEY: 'your-api-key',
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: 'your-auth-domain.firebaseapp.com',
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: 'your-project-id',
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: 'your-storage-bucket.appspot.com',
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: 'your-messaging-sender-id',
  NEXT_PUBLIC_FIREBASE_APP_ID: 'your-app-id',
  NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: 'your-measurement-id',
  
  // Algolia Configuration
  NEXT_PUBLIC_ALGOLIA_APP_ID: 'your-algolia-app-id',
  NEXT_PUBLIC_ALGOLIA_API_KEY: 'your-algolia-api-key',
  
  // Application Settings
  NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
  NEXT_PUBLIC_APP_ENV: 'development',
};
