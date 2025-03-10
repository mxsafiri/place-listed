import React from 'react';
import { CategoryCard } from './CategoryCard';

interface Category {
  name: string;
  slug: string;
  count: number;
  icon: string;
  imageUrl: string;
}

interface CategorySectionProps {
  title: string;
  subtitle?: string;
  categories: Category[];
}

export const CategorySection = ({ title, subtitle, categories }: CategorySectionProps) => {
  return (
    <section className="w-full py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-display font-bold text-black mb-4">{title}</h2>
          {subtitle && <p className="text-xl text-black max-w-2xl mx-auto">{subtitle}</p>}
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {categories.map((category) => (
              <CategoryCard
                key={category.slug}
                name={category.name}
                icon={category.icon}
                count={category.count}
                imageUrl={category.imageUrl}
                slug={category.slug}
              />
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <a 
              href="/categories" 
              className="inline-flex items-center px-6 py-3 rounded-md bg-red-600 hover:bg-red-700 text-white font-medium transition-all duration-300 transform hover:scale-105 shadow-md"
            >
              View all categories
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
