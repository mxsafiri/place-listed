'use client';

import React from 'react';

export default function MinimalPage() {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        PlaceListed Minimal Page
      </h1>
      <p style={{ marginBottom: '1rem' }}>
        This is a minimal page to test if basic rendering works.
      </p>
      <button 
        style={{ 
          backgroundColor: '#ef4444', 
          color: 'white', 
          padding: '0.5rem 1rem', 
          borderRadius: '0.25rem',
          border: 'none',
          cursor: 'pointer'
        }}
        onClick={() => alert('Button works!')}
      >
        Test Button
      </button>
    </div>
  );
}
