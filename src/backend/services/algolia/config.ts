// Mock implementation for Algolia client
// TODO: Replace with actual Algolia implementation when needed

interface AlgoliaClient {
  initIndex: (indexName: string) => AlgoliaIndex;
}

interface AlgoliaIndex {
  search: (query: string, options?: any) => Promise<any>;
  saveObject: (object: any) => Promise<any>;
  saveObjects: (objects: any[]) => Promise<any>;
  deleteObject: (objectID: string) => Promise<any>;
}

// Mock Algolia client implementation
const algoliaClient: AlgoliaClient = {
  initIndex: (indexName: string) => ({
    search: async (query: string, options?: any) => ({ hits: [] }),
    saveObject: async (object: any) => ({ objectID: 'mock-id' }),
    saveObjects: async (objects: any[]) => ({ objectIDs: objects.map(() => 'mock-id') }),
    deleteObject: async (objectID: string) => ({ objectID })
  })
};

// Create an index for businesses
const businessIndex = algoliaClient.initIndex('businesses');

export { algoliaClient, businessIndex };
