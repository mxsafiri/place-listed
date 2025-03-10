/**
 * Configuration loader for PlaceListed
 * This file loads the appropriate configuration based on the current environment
 */

const development = require('./development');
const production = require('./production');

// Determine the current environment
const environment = process.env.NEXT_PUBLIC_APP_ENV || 'development';

// Load the appropriate configuration
const environmentConfig = environment === 'production' ? production : development;

// Create the final configuration by merging environment-specific config
const config = {
  // Common configuration across all environments
  appName: 'PlaceListed',
  version: process.env.npm_package_version || '0.1.0',
  environment,
  
  // Firebase configuration from environment variables
  firebase: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    ...environmentConfig.firebase,
  },
  
  // Algolia configuration from environment variables
  algolia: {
    appId: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    apiKey: process.env.NEXT_PUBLIC_ALGOLIA_API_KEY,
    ...environmentConfig.algolia,
  },
  
  // Merge the rest of the environment-specific configuration
  ...environmentConfig,
};

module.exports = config;
