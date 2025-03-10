# PlaceListed Configuration

This directory contains configuration files for the PlaceListed application.

## Environment Variables

The application requires several environment variables to be set for proper functionality. These include:

### Firebase Configuration
- `NEXT_PUBLIC_FIREBASE_API_KEY`: Your Firebase API key
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`: Your Firebase auth domain
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`: Your Firebase project ID
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`: Your Firebase storage bucket
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`: Your Firebase messaging sender ID
- `NEXT_PUBLIC_FIREBASE_APP_ID`: Your Firebase app ID
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`: Your Firebase measurement ID

### Algolia Configuration
- `NEXT_PUBLIC_ALGOLIA_APP_ID`: Your Algolia app ID
- `NEXT_PUBLIC_ALGOLIA_API_KEY`: Your Algolia API key

### Application Settings
- `NEXT_PUBLIC_APP_URL`: The URL of your application
- `NEXT_PUBLIC_APP_ENV`: The environment (development, staging, production)

## Setup Instructions

1. Copy the `env.example.js` file to a new file named `.env.local` in the root directory of the project
2. Fill in your actual values for each environment variable
3. The application will automatically load these variables at runtime

## Development Configuration

The `development.js` file contains configuration specific to the development environment, such as:
- API endpoints
- Feature flags
- Debug settings

## Production Configuration

The `production.js` file contains configuration specific to the production environment, such as:
- CDN URLs
- Cache settings
- Performance optimizations
