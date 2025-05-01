'use client';

import React, { useEffect, useState } from 'react';

export default function DebugPage() {
  const [info, setInfo] = useState<any>({
    env: {},
    loaded: false,
    error: null
  });

  useEffect(() => {
    try {
      // Collect environment information
      const envInfo = {
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'not set',
        NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'not set',
        NEXT_PUBLIC_ALGOLIA_APP_ID: process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || 'not set',
        nodeEnv: process.env.NODE_ENV || 'not set',
      };
      
      setInfo({
        env: envInfo,
        loaded: true,
        error: null
      });
    } catch (error) {
      setInfo({
        env: {},
        loaded: true,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Debug Page</h1>
      
      <div className="bg-white shadow-md rounded p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
        {info.loaded ? (
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(info.env, null, 2)}
          </pre>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      
      {info.error && (
        <div className="bg-red-50 text-red-600 p-4 rounded mb-6">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p>{info.error}</p>
        </div>
      )}
      
      <div className="bg-white shadow-md rounded p-6">
        <h2 className="text-xl font-semibold mb-4">Basic Component Test</h2>
        <p>If you can see this text, basic React rendering is working.</p>
        <button 
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => alert('Button click works!')}
        >
          Test Button Interaction
        </button>
      </div>
    </div>
  );
}
