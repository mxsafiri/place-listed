# Firebase Configuration Guide for PlaceListed

## Setup Instructions

1. Create a `.env.local` file in the root of your project with the following variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

2. Replace the placeholder values with your actual Firebase configuration values.

3. Make sure `.env.local` is in your `.gitignore` file to prevent exposing your credentials.

## How to Get Firebase Configuration

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Click on the web app icon (</>) to add a web app to your Firebase project
4. Register your app with a nickname
5. Copy the configuration object provided
6. Use those values in your `.env.local` file

## Firebase Services Used in PlaceListed

- **Authentication**: For user sign-up, login, and password reset
- **Firestore**: For storing user profiles, business data, and reviews
- **Storage**: For storing images and other media files

## Testing Your Configuration

After setting up your Firebase configuration, restart your development server and test the authentication flow by:

1. Creating a new account at `/auth/register`
2. Logging in with that account at `/auth/login`
3. Testing the password reset functionality at `/auth/forgot-password`

If you encounter any issues, check your browser console for error messages related to Firebase initialization.
