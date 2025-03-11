'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams, useParams } from 'next/navigation';
import { Button } from "@/frontend/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/ui/Card";
import ReviewForm from '@/components/ReviewForm';

// This would normally come from a database
const getBusinessData = (slug: string) => {
  // Mock data for demonstration
  const businesses = {
    'savory-bites': {
      name: 'Savory Bites Restaurant',
      description: 'Fine dining with a modern twist, serving a fusion of local and international cuisines in an elegant setting. Our chefs use only the freshest ingredients to create memorable culinary experiences.',
      category: 'Restaurant',
      rating: 4.8,
      reviewCount: 124,
      location: 'Nairobi, Kenya',
      address: '123 Kenyatta Avenue, Nairobi, Kenya',
      phone: '+254 123 456 789',
      email: 'info@savorybites.com',
      website: 'savorybites.com',
      hours: {
        monday: '11:00 AM - 10:00 PM',
        tuesday: '11:00 AM - 10:00 PM',
        wednesday: '11:00 AM - 10:00 PM',
        thursday: '11:00 AM - 10:00 PM',
        friday: '11:00 AM - 11:00 PM',
        saturday: '10:00 AM - 11:00 PM',
        sunday: '10:00 AM - 9:00 PM',
      },
      images: ['/images/placeholders/food.jpg', '/images/placeholders/food.jpg', '/images/placeholders/food.jpg'],
      reviews: [
        { id: 1, user: 'John D.', rating: 5, comment: 'Excellent food &amp; service!', date: '2023-12-15' },
        { id: 2, user: 'Sarah M.', rating: 4, comment: 'Great atmosphere, slightly pricey.', date: '2023-11-30' },
        { id: 3, user: 'Michael K.', rating: 5, comment: 'Best restaurant in Nairobi!', date: '2023-11-20' },
      ],
      amenities: ["Outdoor Seating", "Wheelchair Accessible", "Free Wi-Fi", "Parking", "Reservations"],
      products: [
        {
          id: '1',
          name: 'Special Dinner for Two',
          description: 'Three-course meal with wine pairing',
          price: 79.99,
          image: '/images/placeholders/food.jpg'
        },
        {
          id: '2',
          name: 'Cooking Class',
          description: 'Learn to cook our signature dishes',
          price: 49.99,
          image: '/images/placeholders/food.jpg'
        },
        {
          id: '3',
          name: 'Private Dining Experience',
          description: 'Exclusive dining room for special occasions',
          price: 199.99,
          image: '/images/placeholders/food.jpg'
        }
      ]
    },
    'tech-solutions': {
      name: 'Tech Solutions Hub',
      description: 'Professional IT services and computer repairs for individuals and businesses. We offer hardware repairs, software installations, network setup, and IT consultancy services.',
      category: 'Services',
      rating: 4.5,
      reviewCount: 89,
      location: 'Lagos, Nigeria',
      address: '45 Victoria Island, Lagos, Nigeria',
      phone: '+234 987 654 321',
      email: 'support@techsolutions.com',
      website: 'techsolutionshub.com',
      hours: {
        monday: '9:00 AM - 6:00 PM',
        tuesday: '9:00 AM - 6:00 PM',
        wednesday: '9:00 AM - 6:00 PM',
        thursday: '9:00 AM - 6:00 PM',
        friday: '9:00 AM - 6:00 PM',
        saturday: '10:00 AM - 4:00 PM',
        sunday: 'Closed',
      },
      images: ['/images/placeholders/category.jpg', '/images/placeholders/category.jpg', '/images/placeholders/category.jpg'],
      reviews: [
        { id: 1, user: 'Emmanuel O.', rating: 5, comment: 'Fixed my laptop in record time!', date: '2023-12-10' },
        { id: 2, user: 'Chioma A.', rating: 4, comment: 'Good service, reasonable prices.', date: '2023-12-01' },
        { id: 3, user: 'Tunde B.', rating: 4, comment: 'Professional staff and reliable service.', date: '2023-11-25' },
      ],
      amenities: ["Free Wi-Fi", "Parking", "Reservations"],
      products: []
    },
    'green-earth': {
      name: 'Green Earth Market',
      description: 'Organic produce and eco-friendly products for environmentally conscious consumers. We source directly from local farmers and sustainable producers to bring you the best quality products.',
      category: 'Retail',
      rating: 4.7,
      reviewCount: 103,
      location: 'Cape Town, South Africa',
      address: '78 Long Street, Cape Town, South Africa',
      phone: '+27 765 432 109',
      email: 'hello@greenearthmarket.com',
      website: 'greenearthmarket.com',
      hours: {
        monday: '8:00 AM - 7:00 PM',
        tuesday: '8:00 AM - 7:00 PM',
        wednesday: '8:00 AM - 7:00 PM',
        thursday: '8:00 AM - 7:00 PM',
        friday: '8:00 AM - 7:00 PM',
        saturday: '8:00 AM - 5:00 PM',
        sunday: '9:00 AM - 2:00 PM',
      },
      images: ['/images/placeholders/category.jpg', '/images/placeholders/category.jpg', '/images/placeholders/category.jpg'],
      reviews: [
        { id: 1, user: 'Lerato M.', rating: 5, comment: 'Fresh produce &amp; friendly staff!', date: '2023-12-18' },
        { id: 2, user: 'David S.', rating: 5, comment: 'Love their organic selection.', date: '2023-12-05' },
        { id: 3, user: 'Thandi N.', rating: 4, comment: 'Great products but a bit expensive.', date: '2023-11-28' },
      ],
      amenities: ["Outdoor Seating", "Wheelchair Accessible", "Free Wi-Fi", "Parking", "Reservations"],
      products: []
    }
  };
  
  return businesses[slug as keyof typeof businesses] || null;
};

export default function BusinessPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = params.slug as string;
  const business = getBusinessData(slug);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviews, setReviews] = useState(business?.reviews || []);
  const [activeTab, setActiveTab] = useState('details');
  
  useEffect(() => {
    // Check if we should view products
    const viewParam = searchParams.get('view');
    if (viewParam === 'products') {
      setActiveTab('products');
    }
  }, [searchParams]);
  
  if (!business) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Business Not Found</h1>
        <p className="mb-8">The business you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        <Link href="/" className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition duration-300">
          Back to Home
        </Link>
      </div>
    );
  }
  
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section with Business Image */}
      <section className="relative h-80 md:h-96 w-full">
        <Image
          src={business.images[0]}
          alt={business.name}
          fill
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold text-white mb-2">{business.name}</h1>
            <div className="flex items-center text-white mb-4">
              <span className="mr-2">{business.category}</span>
              <span className="mx-2">•</span>
              <span>{business.location}</span>
              <span className="mx-2">•</span>
              <span className="flex items-center">
                <span className="text-yellow-400 mr-1">★</span>
                {business.rating}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Business Details */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Business Info */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent>
                <div className="mb-6">
                  <div className="flex border-b border-gray-200 mb-6">
                    <button 
                      onClick={() => setActiveTab('details')} 
                      className={`px-4 py-2 font-medium ${activeTab === 'details' ? 'text-red-600 border-b-2 border-red-600' : 'text-black hover:text-red-600'}`}
                    >
                      Details
                    </button>
                    {business.products && business.products.length > 0 && (
                      <button 
                        onClick={() => setActiveTab('products')} 
                        className={`px-4 py-2 font-medium ${activeTab === 'products' ? 'text-red-600 border-b-2 border-red-600' : 'text-black hover:text-red-600'}`}
                      >
                        Mini Shop
                      </button>
                    )}
                    <button 
                      onClick={() => setActiveTab('reviews')} 
                      className={`px-4 py-2 font-medium ${activeTab === 'reviews' ? 'text-red-600 border-b-2 border-red-600' : 'text-black hover:text-red-600'}`}
                    >
                      Reviews
                    </button>
                  </div>
                  
                  {activeTab === 'details' && (
                    <>
                      <p className="text-black mb-6">{business.description}</p>
                      
                      <h2 className="text-2xl font-bold text-black mb-4">Amenities</h2>
                      <div className="flex flex-wrap gap-2 mb-6">
                        {business.amenities.map((amenity, index) => (
                          <span key={index} className="bg-gray-100 text-black px-3 py-1 rounded-full text-sm">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                  
                  {activeTab === 'products' && business.products && (
                    <>
                      <h2 className="text-2xl font-bold text-black mb-4">Mini Shop</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {business.products.map((product) => (
                          <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                            <div className="relative h-40 bg-gray-100">
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            </div>
                            <div className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="font-medium text-black">{product.name}</h3>
                                <span className="text-red-600 font-bold">${product.price.toFixed(2)}</span>
                              </div>
                              <p className="text-black text-sm mb-3">{product.description}</p>
                              <Button variant="primary" size="sm">Add to Cart</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  
                  {activeTab === 'reviews' && (
                    <>
                      <h2 className="text-2xl font-bold text-black mb-4">Reviews</h2>
                      <div className="space-y-4 mb-6">
                        {reviews.map((review) => (
                          <Card key={review.id}>
                            <CardContent>
                              <div className="flex justify-between mb-2">
                                <div className="font-medium text-black">{review.user}</div>
                                <div className="text-gray-600 text-sm">{review.date}</div>
                              </div>
                              <div className="flex items-center mb-2">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <svg
                                    key={i}
                                    className={`w-5 h-5 ${
                                      i < review.rating ? "text-yellow-400" : "text-gray-300"
                                    }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                              <p className="text-black">{review.comment}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      
                      {showReviewForm ? (
                        <ReviewForm 
                          businessId={slug}
                          onReviewSubmit={(newReview) => {
                            const date = new Date().toISOString().split('T')[0];
                            const reviewWithId = {
                              ...newReview,
                              id: Date.now(),
                              date
                            };
                            setReviews([reviewWithId, ...reviews]);
                            setShowReviewForm(false);
                          }}
                          onCancel={() => setShowReviewForm(false)}
                        />
                      ) : (
                        <Button 
                          variant="primary" 
                          onClick={() => setShowReviewForm(true)}
                        >
                          Write a Review
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
            
          {/* Right Column - Contact Info */}
          <div>
            <Card className="sticky top-4">
              <CardContent>
                <h2 className="text-xl font-bold text-black mb-4">Contact Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-black">Address</h3>
                    <p className="text-black">{business.address}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-black">Phone</h3>
                    <p className="text-black">
                      <a href={`tel:${business.phone}`} className="text-red-600 hover:text-red-700">
                        {business.phone}
                      </a>
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-black">Email</h3>
                    <p className="text-black">
                      <a href={`mailto:${business.email}`} className="text-red-600 hover:text-red-700">
                        {business.email}
                      </a>
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-black">Website</h3>
                    <p className="text-black">
                      <a href={`https://${business.website}`} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-700">
                        {business.website}
                      </a>
                    </p>
                  </div>
                </div>
                
                <hr className="my-4" />
                
                <h2 className="text-xl font-bold text-black mb-4">Business Hours</h2>
                <div className="space-y-2">
                  {Object.entries(business.hours).map(([day, hours]) => (
                    <div key={day} className="flex justify-between">
                      <span className="capitalize text-black">{day}</span>
                      <span className="text-black">{hours}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 space-y-3">
                  <Button variant="primary" fullWidth={true}>
                    Contact Business
                  </Button>
                  <Button variant="outline" fullWidth={true}>
                    Save to Favorites
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      </main>
    );
  }
