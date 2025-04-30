'use client';

// Mock implementation for Algolia client
// We're using a simplified approach until we set up real Algolia credentials

// Mock data for search results
export const mockBusinesses = [
  {
    id: "1",
    slug: "mediterraneo",
    name: "Mediterraneo",
    description: "Hotel and Restaurant with beautiful ocean views",
    category: "Hotel",
    address: "123 Ocean Drive, Kinondoni",
    location: "Kinondoni TZ",
    rating: 4.8,
    reviewCount: 24,
    imageUrl: "/images/placeholders/category.jpg",
    isVerified: true,
    tags: ["Hotel", "Restaurant", "Bar"],
  },
  {
    id: "2",
    slug: "zanzibar-hotel",
    name: "The Zanzibari Hotel",
    description: "Luxury accommodations with stunning views",
    category: "Hotel",
    address: "45 Beach Road, Zanzibar",
    location: "Zanzibar",
    rating: 4.7,
    reviewCount: 18,
    imageUrl: "/images/placeholders/category.jpg",
    tags: ["Hotel", "Restaurant"],
  },
  {
    id: "3",
    slug: "mojjo-restaurant",
    name: "Mojjo Restaurant & Gastropub",
    description: "MUYENGA's Freshest Culinary Experience",
    category: "Restaurant",
    address: "78 Muyenga Hill, Kampala",
    location: "Kampala",
    rating: 4.5,
    reviewCount: 32,
    imageUrl: "/images/placeholders/category.jpg",
    isVerified: true,
    tags: ["Restaurant", "Bar"],
  },
  {
    id: "4",
    slug: "taste-me-desserts",
    name: "Taste Me Desserts and Café",
    description: "Delicious desserts and coffee in a beachside setting",
    category: "Cafe",
    address: "12 Coastal Road, Dar es Salaam",
    location: "Dar es Salaam",
    rating: 4.3,
    reviewCount: 15,
    imageUrl: "/images/placeholders/category.jpg",
    tags: ["Cafe", "Desserts"],
  },
  {
    id: "5",
    slug: "ali-barbour-cave",
    name: "Ali Barbour's Cave",
    description: "Seafood Restaurant in a natural cave setting",
    category: "Restaurant",
    address: "Diani Beach Road, Diani Beach, Kenya",
    location: "Diani Beach, Kenya",
    rating: 4.9,
    reviewCount: 42,
    imageUrl: "/images/placeholders/category.jpg",
    tags: ["Seafood", "Restaurant"],
  },
  {
    id: "6",
    slug: "club-africando",
    name: "Club Africando",
    description: "From Master Chef Fred Uisso",
    category: "Restaurant",
    address: "123 Libya Street, Dar es Salaam",
    location: "Dar es Salaam",
    rating: 4.7,
    reviewCount: 28,
    imageUrl: "/images/placeholders/category.jpg",
    isVerified: true,
    tags: ["Restaurant", "Bar"],
  },
];

// Mock search function that simulates Algolia search
export const searchBusinesses = async (query: string, filters?: { category?: string, location?: string }) => {
  console.log(`[Mock Search] Searching for "${query}" with filters:`, filters);
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let results = [...mockBusinesses];
  
  // Filter by search query
  if (query) {
    results = results.filter(business => 
      business.name.toLowerCase().includes(query.toLowerCase()) || 
      business.description.toLowerCase().includes(query.toLowerCase()) ||
      business.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
  }
  
  // Filter by category
  if (filters?.category) {
    results = results.filter(business => 
      business.category.toLowerCase() === filters.category?.toLowerCase() ||
      business.tags.some(tag => tag.toLowerCase() === filters.category?.toLowerCase())
    );
  }
  
  // Filter by location
  if (filters?.location) {
    results = results.filter(business => 
      (business.location && business.location.toLowerCase().includes(filters.location?.toLowerCase() || '')) ||
      business.address.toLowerCase().includes(filters.location?.toLowerCase() || '')
    );
  }
  
  return {
    hits: results.map(business => ({
      objectID: business.id,
      ...business
    })),
    nbHits: results.length,
    page: 0,
    nbPages: 1,
    hitsPerPage: 20,
    processingTimeMS: 1,
    exhaustiveNbHits: true,
    query
  };
};

// Export mock interfaces to match Algolia's API shape
export const algoliaClient = {
  initIndex: (indexName: string) => ({
    search: async (query: string, options?: any) => searchBusinesses(query, options?.filters),
    saveObject: async (object: any) => ({ objectID: object.id || 'mock-id', taskID: 'mock-task' }),
    saveObjects: async (objects: any[]) => ({ 
      objectIDs: objects.map(obj => obj.id || 'mock-id'),
      taskID: 'mock-task'
    }),
    deleteObject: async (objectID: string) => ({ objectID, taskID: 'mock-task' })
  })
};

// Create an index for businesses
export const businessIndex = algoliaClient.initIndex('businesses');
