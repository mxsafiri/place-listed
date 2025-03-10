'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaStar, FaMapMarkerAlt, FaPhone, FaShoppingBag } from 'react-icons/fa';
import { MdRestaurant, MdAccessTime } from 'react-icons/md';
import { Card, CardContent } from '@/frontend/components/ui/Card';
import { colors } from '@/frontend/styles/colors';

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
  amenities?: string[];
  hasProducts?: boolean;
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
  amenities = [],
  hasProducts = false,
}: BusinessCardProps) {
  // Get category color or default to gray
  const categoryColor = 
    (category.toLowerCase() in colors) 
      ? (colors as any)[category.toLowerCase()] 
      : colors.default;
  
  return (
    <div className="group h-full flex flex-col overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-lg">
      <div className="relative">
        <Link href={`/business/${slug}`} className="block relative h-48 overflow-hidden">
          <Image
            src={imageUrl || '/images/placeholder-business.jpg'}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3 px-3 py-1 text-sm font-medium rounded-full bg-white text-red-600">
            {category}
          </div>
          <div className="absolute top-3 right-3 flex items-center bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
            <FaStar className="text-yellow-400 mr-1" />
            <span className="font-medium text-black">{rating.toFixed(1)}</span>
          </div>
        </Link>
      </div>
      
      <CardContent className="flex-1 flex flex-col p-5">
        <Link href={`/business/${slug}`} className="block">
          <h3 className="text-xl font-bold text-red-600 hover:text-red-700 transition-colors mb-1">{name}</h3>
        </Link>
        
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <FaMapMarkerAlt className="mr-2 text-gray-500 flex-shrink-0" />
          <span className="truncate">{address}</span>
        </div>
        
        <p className="text-sm text-black mb-4 line-clamp-2">{description}</p>
        
        {amenities.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {amenities.map((amenity) => (
              <span 
                key={amenity} 
                className="px-3 py-1 text-sm rounded-md bg-gray-100 text-black"
              >
                {amenity}
              </span>
            ))}
          </div>
        )}
        
        {hasProducts && (
          <div className="border-t border-gray-200 pt-4 mb-4">
            <div className="flex justify-between items-center">
              <div className="font-medium">Mini Shop</div>
              <Link 
                href={`/business/${slug}?view=products`}
                className="text-sm text-red-600 hover:text-red-700"
              >
                View Products
              </Link>
            </div>
          </div>
        )}
        
        <div className="mt-auto flex items-center justify-between">
          <div className="flex space-x-2">
            <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-black hover:bg-gray-50">
              <FaPhone className="mr-2" />
              Call
            </button>
            <button className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-black hover:bg-gray-50">
              <MdAccessTime className="mr-2" />
              Hours
            </button>
          </div>
          <Link 
            href={`/business/${slug}`}
            className="inline-flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors"
          >
            View Details
          </Link>
        </div>
      </CardContent>
    </div>
  );
}
