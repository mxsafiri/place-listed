'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaStar, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import { MdRestaurant } from 'react-icons/md';
import { Card, CardContent } from '@/frontend/components/ui/Card';
import { colors } from '@/styles/colors';

export interface BusinessCardProps {
  id: string;
  name: string;
  slug: string;
  description: string;
  address: string;
  category: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  phone?: string;
  tags?: string[];
}

export function BusinessCard({
  id,
  name,
  slug,
  description,
  address,
  category,
  rating,
  reviewCount,
  imageUrl,
  phone,
  tags = [],
}: BusinessCardProps) {
  // Get category color or default to gray
  const categoryColor = 
    (category.toLowerCase() in colors) 
      ? (colors as any)[category.toLowerCase()] 
      : colors.default;
  
  return (
    <div className="group h-full flex flex-col overflow-hidden rounded-lg bg-white shadow-card transition-all duration-300 hover:shadow-card-hover">
      <Link href={`/business/${slug}`} className="block relative h-48 overflow-hidden">
        <Image
          src={imageUrl || '/images/placeholder-business.jpg'}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-0 left-0 m-2 px-2 py-1 text-xs font-semibold rounded" 
          style={{ backgroundColor: categoryColor, color: 'white' }}>
          {category}
        </div>
      </Link>
      
      <CardContent className="flex-1 flex flex-col p-4">
        <div className="flex justify-between items-start mb-2">
          <Link href={`/business/${slug}`} className="block">
            <h3 className="text-lg font-bold text-gray-900 hover:text-red-600 transition-colors">{name}</h3>
          </Link>
          <div className="flex items-center">
            <FaStar className="text-yellow-400 mr-1" />
            <span className="text-sm font-medium">{rating.toFixed(1)}</span>
            <span className="text-xs text-gray-500 ml-1">({reviewCount})</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>
        
        <div className="mt-auto">
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <FaMapMarkerAlt className="mr-2 text-gray-400" />
            <span className="truncate">{address}</span>
          </div>
          
          {phone && (
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <FaPhone className="mr-2 text-gray-400" />
              <span>{phone}</span>
            </div>
          )}
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {tags.slice(0, 3).map((tag) => (
                <span 
                  key={tag} 
                  className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700"
                >
                  {tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                  +{tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </div>
  );
}
