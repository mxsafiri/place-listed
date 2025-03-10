'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { categoryColors } from '@/styles/colors';

interface CategoryCardProps {
  name: string;
  icon: string;
  count: number;
  imageUrl: string;
  slug: string;
}

export const CategoryCard = ({ name, icon, count, imageUrl, slug }: CategoryCardProps) => {
  // Get category color or default to gray
  const bgColor = categoryColors[slug.toLowerCase() as keyof typeof categoryColors] || '#6b7280';
  
  return (
    <Link 
      href={`/search?category=${slug}`}
      className="block group relative overflow-hidden rounded-xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      <div className="relative aspect-square overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 bg-black"></div>
        <Image 
          src={imageUrl} 
          alt={name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110 opacity-80"
          unoptimized
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 transition-opacity duration-300 group-hover:opacity-80" />
        
        {/* Icon Circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative flex items-center justify-center w-28 h-28 rounded-full bg-white/90 backdrop-blur-sm shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:bg-white">
            {/* Count Badge */}
            <div 
              className="absolute -top-1 -right-1 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-md transform transition-transform group-hover:scale-110"
              style={{ backgroundColor: bgColor }}
            >
              {count}
            </div>
            
            {/* Icon */}
            <div className="w-14 h-14 flex items-center justify-center">
              <svg className="w-10 h-10" style={{ color: bgColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {slug === 'food' && (
                  <>
                    <path d="M7 10.5V14c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2v-3.5" />
                    <path d="M5.5 10.5H7" />
                    <path d="M17 10.5h1.5" />
                    <path d="M8 10.5c0-2.8 2.2-5 5-5s5 2.2 5 5" />
                    <path d="M8 14.5h8" />
                    <path d="M13 2v3" />
                  </>
                )}
                {slug === 'hotel' && (
                  <>
                    <path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16" />
                    <path d="M1 21h22" />
                    <path d="M7 10.5h10" />
                    <path d="M7 14.5h10" />
                    <path d="M7 6.5h10" />
                  </>
                )}
                {slug === 'salon' && (
                  <>
                    <path d="M15.5 6.5l-5 5" />
                    <path d="M19 10c0 1.5-1.5 3-3 3s-3-1.5-3-3 1.5-3 3-3 3 1.5 3 3z" />
                    <path d="M13 7l-1.5-1.5c-.8-.8-2.2-.8-3 0L5 9c-.8.8-.8 2.2 0 3l1.5 1.5" />
                    <path d="M6 15l-3 3" />
                    <path d="M9 18l-3 3" />
                    <path d="M10 12l-1.5 1.5c-.8.8-.8 2.2 0 3L12 20c.8.8 2.2.8 3 0l3.5-3.5c.8-.8.8-2.2 0-3L17 12" />
                  </>
                )}
                {slug === 'shops' && (
                  <>
                    <path d="M3 3h18v18H3z" />
                    <path d="M3 9h18" />
                    <path d="M9 21V9" />
                    <path d="M15 21V9" />
                    <path d="M21 9L3 9" />
                    <path d="M21 15L3 15" />
                  </>
                )}
                {slug === 'tented' && (
                  <>
                    <path d="M2 20h20" />
                    <path d="M12 4l10 16H2L12 4z" />
                    <path d="M12 4v16" />
                  </>
                )}
                {slug === 'wifi' && (
                  <>
                    <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                    <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                    <circle cx="12" cy="20" r="1" />
                  </>
                )}
                {!['food', 'hotel', 'salon', 'shops', 'tented', 'wifi'].includes(slug) && (
                  <>
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v8" />
                    <path d="M8 12h8" />
                  </>
                )}
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Category Name */}
      <div className="absolute bottom-0 left-0 right-0 text-center py-4 bg-black/40 backdrop-blur-sm transition-all duration-300 group-hover:bg-black/60">
        <h3 className="text-lg font-medium text-white">{name}</h3>
      </div>
    </Link>
  );
};
