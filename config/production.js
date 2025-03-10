/**
 * Production environment configuration for PlaceListed
 */

module.exports = {
  // API endpoints
  api: {
    baseUrl: 'https://api.placelisted.com',
    timeout: 5000, // 5 seconds
  },
  
  // Feature flags
  features: {
    enableMockData: false,
    enableDebugLogging: false,
    enablePerformanceMonitoring: true,
  },
  
  // Firebase production settings
  firebase: {
    useEmulator: false,
  },
  
  // Algolia production settings
  algolia: {
    searchParameters: {
      hitsPerPage: 10,
      attributesToRetrieve: ['name', 'description', 'category', 'location', 'rating', 'slug'],
      attributesToHighlight: ['name', 'description'],
    },
  },
  
  // CDN configuration
  cdn: {
    enabled: true,
    imageUrl: 'https://cdn.placelisted.com/images',
    assetUrl: 'https://cdn.placelisted.com/assets',
  },
  
  // Caching strategy
  cache: {
    staticMaxAge: 86400, // 1 day in seconds
    dynamicMaxAge: 300, // 5 minutes in seconds
  },
  
  // Performance optimizations
  performance: {
    imageOptimization: true,
    minifyAssets: true,
    useCompression: true,
  },
};
