import { createAlgoliaClient } from 'algoliasearch';

// Initialize the Algolia client
const algoliaClient = createAlgoliaClient(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || '',
  process.env.NEXT_PUBLIC_ALGOLIA_API_KEY || ''
);

// Create an index for businesses
const businessIndex = algoliaClient.initIndex('businesses');

export { algoliaClient, businessIndex };
