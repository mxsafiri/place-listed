/**
 * Example environment variables for PlaceListed
 * Copy this file to .env.local and fill in your actual values
 */

module.exports = {
  // Supabase Configuration
  NEXT_PUBLIC_SUPABASE_URL: 'your-supabase-url',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'your-supabase-anon-key',
  
  // Database URL for Supabase (non-pooling)
  DATABASE_URL: 'postgresql://postgres:password@db.your-project-ref.supabase.co:5432/postgres?sslmode=require',
  
  // Algolia Configuration
  NEXT_PUBLIC_ALGOLIA_APP_ID: 'your-algolia-app-id',
  NEXT_PUBLIC_ALGOLIA_API_KEY: 'your-algolia-api-key',
  
  // Application Settings
  NEXT_PUBLIC_APP_URL: 'http://localhost:3000', // Use your production URL in production
  NEXT_PUBLIC_APP_ENV: 'development',
};
