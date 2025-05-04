'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { SearchBar } from "@/frontend/components/common/SearchBar";
import { BusinessGrid } from "@/frontend/components/business/BusinessGrid";
import { CategorySection } from "@/frontend/components/common/CategorySection";
import { BusinessCard } from "@/frontend/components/business/BusinessCard";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import { useRouter } from "next/navigation";

// Mock data for categories
const popularCategories = [
  {
    name: "Food",
    slug: "food",
    count: 299,
    icon: "/icons/food.svg",
    imageUrl: "/images/placeholders/food.jpg",
  },
  {
    name: "Hotel",
    slug: "hotel",
    count: 254,
    icon: "/icons/hotel.svg",
    imageUrl: "/images/placeholders/hotel.jpg",
  },
  {
    name: "Salon",
    slug: "salon",
    count: 187,
    icon: "/icons/salon.svg",
    imageUrl: "/images/placeholders/category.jpg",
  },
  {
    name: "Shops",
    slug: "shops",
    count: 215,
    icon: "/icons/shops.svg",
    imageUrl: "/images/placeholders/category.jpg",
  },
];

// Mock data for featured businesses
const featuredBusinesses = [
  {
    id: "1",
    slug: "mediterraneo",
    name: "Mediterraneo",
    description: "Hotel and Restaurant with beautiful ocean views",
    address: "123 Ocean Drive, Kinondoni",
    category: "Hotel",
    rating: 4.8,
    reviewCount: 128,
    imageUrl: "/images/placeholders/food.jpg",
    phone: "+255 123 456 789",
    tags: ["Hotel", "Restaurant", "Bar"],
    amenities: ["Free WiFi", "Parking", "Delivery"],
    hasProducts: true
  },
  {
    id: "2",
    slug: "zanzibar-hotel",
    name: "The Zanzibar Hotel",
    description: "Luxury accommodations with stunning views",
    address: "45 Beach Road, Zanzibar",
    category: "Hotel",
    rating: 4.7,
    reviewCount: 95,
    imageUrl: "/images/placeholders/hotel.jpg",
    phone: "+255 987 654 321",
    tags: ["Hotel", "Restaurant"],
    amenities: ["Free WiFi", "Parking", "Pool"],
    hasProducts: false
  },
  {
    id: "3",
    slug: "mojito-restaurant",
    name: "Mojio Restaurant & Gastropub",
    description: "MUYENGA's Freshest Culinary Experience",
    address: "78 Muyenga Hill, Kampala",
    category: "Restaurant",
    rating: 4.6,
    reviewCount: 112,
    imageUrl: "/images/placeholders/category.jpg",
    phone: "+256 712 345 678",
    tags: ["Restaurant", "Bar"],
    amenities: ["Free WiFi", "Delivery", "Outdoor Seating"],
    hasProducts: true
  }
];

// Mock data for unique places
const uniquePlaces = [
  {
    id: "4",
    slug: "savory-bites",
    name: "Savory Bites Restaurant",
    description: "Fine dining with a modern twist, serving a fusion of local and international cuisines in an elegant setting.",
    address: "Nairobi, Kenya",
    category: "Restaurant",
    rating: 4.8,
    reviewCount: 156,
    imageUrl: "/images/placeholders/food.jpg",
    phone: "+254 712 345 678",
    tags: ["Restaurant", "Fine Dining"],
    amenities: ["Free WiFi", "Parking", "Delivery"],
    hasProducts: true
  },
  {
    id: "5",
    slug: "tech-solutions",
    name: "Tech Solutions Hub",
    description: "Professional IT services and computer repairs for individuals and businesses.",
    address: "Lagos, Nigeria",
    category: "Services",
    rating: 4.5,
    reviewCount: 87,
    imageUrl: "/images/placeholders/category.jpg",
    phone: "+234 812 345 678",
    tags: ["IT", "Repairs", "Services"],
    amenities: ["Free WiFi", "Parking", "Delivery"],
    hasProducts: true
  },
  {
    id: "6",
    slug: "green-oasis-spa",
    name: "Green Oasis Spa & Wellness",
    description: "Rejuvenating spa treatments and wellness services in a tranquil environment.",
    address: "Accra, Ghana",
    category: "Wellness",
    rating: 4.9,
    reviewCount: 203,
    imageUrl: "/images/placeholders/hotel.jpg",
    phone: "+233 512 345 678",
    tags: ["Spa", "Wellness", "Beauty"],
    amenities: ["Free WiFi", "Parking", "Appointment Booking"],
    hasProducts: true
  }
];

// Function to get a gradient based on the category slug
function getGradientForCategory(slug: string) {
  switch (slug) {
    case 'food':
      return 'linear-gradient(135deg, #e51e1e 0%, #841818 100%)'; // Red gradient (primary brand color)
    case 'hotel':
      return 'linear-gradient(135deg, #1a7af8 0%, #112d5e 100%)'; // Blue gradient
    case 'salon':
      return 'linear-gradient(135deg, #c11414 0%, #470808 100%)'; // Darker red gradient
    case 'shops':
      return 'linear-gradient(135deg, #059669 0%, #022c22 100%)'; // Green gradient
    default:
      return 'linear-gradient(135deg, #e51e1e 0%, #841818 100%)'; // Default to red gradient
  }
}

export default function Home() {
  const router = useRouter();
  const address = useAddress();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Redirect to dashboard if wallet is connected
  const handleWalletConnected = () => {
    if (address) {
      router.push('/dashboard');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-r from-primary-700 to-primary-800 text-white">
        <div className="relative">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <Image 
              src="/images/Placelisted.com-Photo-copyrighted-to-Daniel-Msirikale.jpg" 
              alt="Discover local businesses - Photo by Daniel Msirikale"
              fill
              className="object-cover opacity-30"
              priority
              unoptimized
            />
          </div>
          
          {/* Content */}
          <div className="container mx-auto px-4 py-24 relative z-10">
            <div className="max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-10 shadow-2xl border border-white/20">
                <h1 className="text-4xl md:text-5xl font-display font-bold mb-3 animate-fade-in">
                  Hi there, <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">explorer</span>
                </h1>
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-6 animate-fade-in">
                  What would you like to discover today?
                </h2>
                <p className="text-lg text-white/90 mb-10 animate-slide-up">
                  Use our search to find the perfect place or ask a specific question
                </p>
                
                {/* AI Search Input */}
                <div className="relative mb-10 animate-slide-up">
                  <form action="/search" method="get" className="flex items-center bg-white rounded-full shadow-xl overflow-hidden">
                    <div className="pl-6">
                      <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input 
                      type="text" 
                      name="q"
                      placeholder="Ask whatever you want..." 
                      className="w-full py-5 px-4 text-black focus:outline-none focus:ring-0 text-lg"
                    />
                    <button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-8 py-5 transition-colors">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </button>
                  </form>
                </div>
                
                {/* Auth/Create Listing Button */}
                <div className="flex justify-center mb-10 animate-slide-up">
                  {address ? (
                    <button
                      onClick={() => router.push('/dashboard')}
                      className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 flex items-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      Go to My Dashboard
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowAuthModal(true)}
                      className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 flex items-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      List Your Business
                    </button>
                  )}
                </div>
                
                {/* Authentication Modal */}
                {showAuthModal && (
                  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-2xl">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-bold text-gray-900">Sign In</h3>
                        <button 
                          onClick={() => setShowAuthModal(false)}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      
                      <p className="mb-6 text-gray-600">
                        Sign in with your email or connect your wallet to start listing your business
                      </p>
                      
                      <div className="flex flex-col space-y-4">
                        <ConnectWallet 
                          theme="light"
                          btnTitle="Sign In"
                          modalSize="wide"
                          className="w-full"
                          modalTitleIconUrl=""
                          welcomeScreen={{
                            title: "Sign in to PlaceListed",
                            subtitle: "Connect with your email or wallet",
                          }}
                          onConnect={handleWalletConnected}
                        />
                        
                        <div className="flex items-center my-4">
                          <div className="flex-grow border-t border-gray-300"></div>
                          <span className="px-3 text-gray-500 text-sm">OR</span>
                          <div className="flex-grow border-t border-gray-300"></div>
                        </div>
                        
                        <Link
                          href="/auth/register"
                          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-6 rounded-lg text-center"
                        >
                          Create New Account
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Prompt Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-slide-up">
                  <div className="bg-white/10 hover:bg-white/20 p-5 rounded-2xl cursor-pointer transition-all duration-300 border border-white/20 hover:shadow-lg hover:translate-y-[-2px]">
                    <div className="flex items-start">
                      <div className="bg-red-600/20 p-3 rounded-full mr-4 flex-shrink-0">
                        <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-white mb-1">Find me a romantic restaurant for dinner tonight</h3>
                        <p className="text-sm text-white/70">Discover the perfect spot for a special evening</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 hover:bg-white/20 p-5 rounded-2xl cursor-pointer transition-all duration-300 border border-white/20 hover:shadow-lg hover:translate-y-[-2px]">
                    <div className="flex items-start">
                      <div className="bg-red-600/20 p-3 rounded-full mr-4 flex-shrink-0">
                        <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-white mb-1">Where's the best coffee shop with free WiFi?</h3>
                        <p className="text-sm text-white/70">Perfect for remote work or casual meetings</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 hover:bg-white/20 p-5 rounded-2xl cursor-pointer transition-all duration-300 border border-white/20 hover:shadow-lg hover:translate-y-[-2px]">
                    <div className="flex items-start">
                      <div className="bg-red-600/20 p-3 rounded-full mr-4 flex-shrink-0">
                        <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-white mb-1">Show me businesses that are open right now near me</h3>
                        <p className="text-sm text-white/70">Find places you can visit immediately</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/10 hover:bg-white/20 p-5 rounded-2xl cursor-pointer transition-all duration-300 border border-white/20 hover:shadow-lg hover:translate-y-[-2px]">
                    <div className="flex items-start">
                      <div className="bg-red-600/20 p-3 rounded-full mr-4 flex-shrink-0">
                        <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-white mb-1">What's the highest-rated hotel with a pool?</h3>
                        <p className="text-sm text-white/70">Find the perfect accommodation for your stay</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Unique Places to Eat and Dine out */}
      <section className="w-full py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-black mb-3">Discover Places That Match Your Needs</h2>
            <p className="text-lg text-black max-w-2xl mx-auto">Find businesses and expert services tailored to your specific requirements</p>
          </div>
          
          {/* Featured Categories */}
          <div className="mb-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {popularCategories.map((category, index) => (
                <Link 
                  key={index}
                  href={`/search?category=${category.slug}`}
                  className="group relative overflow-hidden rounded-2xl aspect-square shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <Image 
                      src={category.imageUrl} 
                      alt={category.name}
                      fill
                      className="object-cover blur-[2px] brightness-75 transition-transform duration-500 group-hover:scale-110"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-black/50" />
                  </div>
                  
                  {/* Count Badge */}
                  <div className="absolute top-5 right-5 bg-red-600 text-white text-lg font-bold rounded-full w-14 h-14 flex items-center justify-center shadow-lg">
                    {category.count}
                  </div>
                  
                  {/* Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <div className="w-12 h-12 flex items-center justify-center">
                        <Image 
                          src={category.icon} 
                          alt={category.name}
                          width={48}
                          height={48}
                          className="w-full h-full"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Category Name */}
                  <div className="absolute bottom-0 inset-x-0 p-5 text-center">
                    <h3 className="text-2xl font-bold text-white">{category.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          
          {/* Featured Businesses */}
          <div className="mb-16">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-black">Featured Places</h2>
              <Link href="/search" className="text-red-600 hover:text-red-700 flex items-center">
                View all <span className="ml-1">→</span>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredBusinesses.map((business) => (
                <BusinessCard key={business.id} {...business} />
              ))}
            </div>
          </div>
          
          {/* Unique Places */}
          <div className="mb-16">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-black">Unique Experiences</h2>
              <Link href="/search" className="text-red-600 hover:text-red-700 flex items-center">
                View all <span className="ml-1">→</span>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {uniquePlaces.map((business) => (
                <BusinessCard key={business.id} {...business} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="w-full py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-display font-bold text-center mb-4 text-red-600">How PlaceListed Works</h2>
          <p className="text-center text-black mb-12 max-w-2xl mx-auto">Three simple steps to make your business digitally discoverable</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6 bg-white rounded-lg border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 animate-slide-up" style={{animationDelay: '0.1s'}}>
              <div className="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 transform transition-transform duration-500 hover:scale-110">1</div>
              <h3 className="text-xl font-bold mb-3 text-black">Create a <span className="text-red-600">Profile</span></h3>
              <p className="text-black">Register your business and create a detailed profile with all your information</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 animate-slide-up" style={{animationDelay: '0.3s'}}>
              <div className="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 transform transition-transform duration-500 hover:scale-110">2</div>
              <h3 className="text-xl font-bold mb-3 text-black">Get <span className="text-red-600">Discovered</span></h3>
              <p className="text-black">Your business becomes visible to potential customers searching online</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1 animate-slide-up" style={{animationDelay: '0.5s'}}>
              <div className="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 transform transition-transform duration-500 hover:scale-110">3</div>
              <h3 className="text-xl font-bold mb-3 text-black">Grow Your <span className="text-red-600">Business</span></h3>
              <p className="text-black">Receive reviews, connect with customers, and watch your business grow</p>
            </div>
          </div>
          
          <div className="text-center mt-12 animate-slide-up" style={{animationDelay: '0.7s'}}>
            <button 
              onClick={() => setShowAuthModal(true)}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-all duration-300 transform hover:scale-105 shadow-md"
            >
              Get Started Today
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
