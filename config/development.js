/**
 * Development environment configuration for PlaceListed
 */

module.exports = {
  // API endpoints
  api: {
    baseUrl: 'http://localhost:3000/api',
    timeout: 10000, // 10 seconds
  },
  
  // Feature flags
  features: {
    enableMockData: true,
    enableDebugLogging: true,
    enablePerformanceMonitoring: false,
  },
  
  // Firebase emulator settings
  firebase: {
    useEmulator: true,
    emulatorHost: 'localhost',
    firestorePort: 8080,
    authPort: 9099,
    functionsPort: 5001,
  },
  
  // Algolia development settings
  algolia: {
    searchParameters: {
      hitsPerPage: 20,
      attributesToRetrieve: ['*'],
      attributesToHighlight: ['name', 'description'],
    },
  },
  
  // Development tools
  devTools: {
    showReactQueryDevtools: true,
    showReduxDevTools: true,
    enableHotReload: true,
  },
};
