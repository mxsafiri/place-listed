'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { categoryColors } from '../../styles/colors';
import { Card } from '../ui/Card';

export interface BusinessCardProps {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  location: string;
  rating: number;
  imageUrl?: string;
  isVerified?: boolean;
  tags?: string[];
}

export function BusinessCard({
  id,
  slug,
  name,
  description,
  category,
  location,
  rating,
  imageUrl = '/images/placeholders/category.jpg',
  isVerified = false,
  tags = [],
}: BusinessCardProps) {
  // Get category color or default to gray
  const categoryColor = categoryColors[category.toLowerCase() as keyof typeof categoryColors] || '#6b7280';
  
  return (
    <div className="group h-full flex flex-col overflow-hidden rounded-lg bg-white shadow-card transition-all duration-300 hover:shadow-card-hover">
      {/* Image Container */}
      <div className="relative aspect-video overflow-hidden">
        <Link href={`/business/${slug}`}>
          <div className="absolute inset-0 bg-gray-100"></div>
          <Image 
            src={imageUrl} 
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized
          />
        </Link>
        
        {/* Rating badge */}
        {rating > 0 && (
          <div className="absolute top-3 right-3 bg-white text-gray-800 px-2 py-1 rounded-md font-medium text-sm shadow-sm">
            <span className="flex items-center">
              <span className="text-yellow-400 mr-1">★</span>
              {rating.toFixed(1)}
            </span>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="flex-grow p-4">
        {/* Title and Verification */}
        <div className="flex items-start justify-between mb-1">
          <Link href={`/business/${slug}`} className="group-hover:text-red-600 transition-colors">
            <h3 className="text-lg font-semibold line-clamp-1">{name}</h3>
          </Link>
          
          {isVerified && (
            <div className="flex-shrink-0 ml-2 text-red-600">
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
        
        {/* Category and Location */}
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <span>{category}</span>
          <span className="mx-2">•</span>
          <span>{location}</span>
        </div>
        
        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{description}</p>
        
        {/* Tags/Features */}
        <div className="flex flex-wrap gap-2 mt-auto">
          {tags.map((tag, index) => (
            <div 
              key={index}
              className="inline-flex items-center rounded-full p-1 pr-2 text-xs"
              style={{ backgroundColor: `${categoryColor}20` }}
            >
              <div 
                className="mr-1 h-5 w-5 rounded-full flex items-center justify-center"
                style={{ backgroundColor: categoryColor }}
              >
                <svg className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-medium" style={{ color: categoryColor }}>{tag}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
