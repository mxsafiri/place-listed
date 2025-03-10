'use client';

import React from 'react';
import { BusinessCard, BusinessCardProps } from '@/frontend/components/business/BusinessCard';

interface BusinessGridProps {
  businesses: BusinessCardProps[];
  columns?: 1 | 2 | 3 | 4;
}

export function BusinessGrid({ businesses, columns = 3 }: BusinessGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-8`}>
      {businesses.map((business) => (
        <BusinessCard key={business.id} {...business} />
      ))}
    </div>
  );
}
