'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/frontend/components/ui/Input';
import { Button } from '@/frontend/components/ui/Button';
import Link from 'next/link';
import { useAuth } from '@/frontend/contexts/AuthContext';
import { createPlace, uploadPlaceImage, PlaceData } from '@/backend/api/places';

// Define the business categories
const businessCategories = [
  { id: 'restaurant', name: 'Restaurant' },
  { id: 'retail', name: 'Retail' },
  { id: 'service', name: 'Service' },
  { id: 'health', name: 'Health & Wellness' },
  { id: 'education', name: 'Education' },
  { id: 'entertainment', name: 'Entertainment' },
  { id: 'hospitality', name: 'Hospitality' },
  { id: 'professional', name: 'Professional Services' },
  { id: 'other', name: 'Other' },
];

// Form steps
const STEPS = {
  BUSINESS_INFO: 0,
  LOCATION: 1,
  CONTACT: 2,
  HOURS: 3,
  PHOTOS: 4,
  REVIEW: 5,
};

export default function AddPlacePage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [step, setStep] = useState(STEPS.BUSINESS_INFO);
  const [loading, setLoading] = useState(false);
  const [generatingDescription, setGeneratingDescription] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    // Business Info
    name: '',
    category: '',
    description: '',
    tags: '',
    
    // Location
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    
    // Contact
    phone: '',
    email: '',
    website: '',
    
    // Hours
    mondayOpen: '09:00',
    mondayClose: '17:00',
    tuesdayOpen: '09:00',
    tuesdayClose: '17:00',
    wednesdayOpen: '09:00',
    wednesdayClose: '17:00',
    thursdayOpen: '09:00',
    thursdayClose: '17:00',
    fridayOpen: '09:00',
    fridayClose: '17:00',
    saturdayOpen: '10:00',
    saturdayClose: '15:00',
    sundayOpen: '',
    sundayClose: '',
    
    // Photos
    photos: [],
    
    // Account Info
    password: '',
    confirmPassword: '',
  });

  // Redirect if not logged in and not in demo mode
  useEffect(() => {
    if (!currentUser) {
      // For demo purposes, we're not redirecting
      // router.push('/auth/login?redirect=/add-place');
    }
  }, [currentUser, router]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Generate AI description
  const generateAIDescription = async () => {
    if (!formData.name) {
      alert('Please enter a business name first');
      return;
    }
    
    setGeneratingDescription(true);
    
    try {
      const response = await fetch('/api/ai-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessName: formData.name,
          category: formData.category,
          keywords: formData.tags,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.description) {
        setFormData(prev => ({
          ...prev,
          description: data.description,
        }));
      } else {
        console.error('Error generating description:', data.error);
        alert('Failed to generate description. Please try again.');
      }
    } catch (error) {
      console.error('Error calling AI description API:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setGeneratingDescription(false);
    }
  };

  // Handle next step
  const handleNext = () => {
    setStep(prev => prev + 1);
  };

  // Handle previous step
  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Validate form data
      if (!formData.name || !formData.category || !formData.address) {
        alert('Please fill in all required fields');
        return;
      }
      
      if (!currentUser) {
        alert('You must be logged in to add a business');
        router.push('/auth/login?redirect=/add-place');
        return;
      }
      
      // Create a new place
      const placeData: PlaceData = {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        tags: formData.tags.split(',').map(tag => tag.trim()),
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
        phone: formData.phone,
        email: formData.email,
        website: formData.website,
        hours: {
          monday: `${formData.mondayOpen} - ${formData.mondayClose}`,
          tuesday: `${formData.tuesdayOpen} - ${formData.tuesdayClose}`,
          wednesday: `${formData.wednesdayOpen} - ${formData.wednesdayClose}`,
          thursday: `${formData.thursdayOpen} - ${formData.thursdayClose}`,
          friday: `${formData.fridayOpen} - ${formData.fridayClose}`,
          saturday: `${formData.saturdayOpen} - ${formData.saturdayClose}`,
          sunday: `${formData.sundayOpen} - ${formData.sundayClose}`
        },
        amenities: [],
        images: []
      };
      
      // Upload photos to Firebase Storage if there are any
      let uploadedPhotoUrls: string[] = [];
      if (formData.photos && formData.photos.length > 0) {
        uploadedPhotoUrls = await Promise.all(
          formData.photos.map(photo => uploadPlaceImage(photo, currentUser.uid))
        );
        placeData.images = uploadedPhotoUrls;
      }
      
      // Create a new place in Firestore
      const placeId = await createPlace(placeData, currentUser.uid);
      
      // Redirect to success page or dashboard
      router.push(`/dashboard?business=${placeId}`);
    } catch (error) {
      console.error('Error submitting business:', error);
      alert('There was an error adding your business. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Render the current step
  const renderStep = () => {
    switch (step) {
      case STEPS.BUSINESS_INFO:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-black">Business Information</h2>
            <p className="text-black">Tell us about your business so customers can find you easily.</p>
            
            <Input
              label="Business Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Joe's Coffee Shop"
              fullWidth
              required
            />
            
            <div className="space-y-1.5">
              <label htmlFor="category" className="text-sm font-medium text-black">Business Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                required
              >
                <option value="">Select a category</option>
                {businessCategories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label htmlFor="description" className="text-sm font-medium text-black">Business Description</label>
                <button
                  type="button"
                  onClick={generateAIDescription}
                  disabled={generatingDescription}
                  className="text-sm text-red-600 hover:text-red-800 flex items-center"
                >
                  {generatingDescription ? 'Generating...' : '✨ Generate with AI'}
                </button>
              </div>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                placeholder="Describe your business, services, and what makes you unique..."
                required
              />
              <p className="text-xs text-black">
                Need help? Click &quot;Generate with AI&quot; to create a professional description based on your business details.
              </p>
            </div>
            
            <Input
              label="Tags (comma separated)"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="e.g., coffee, breakfast, wifi"
              helperText="Add keywords that help customers find your business"
              fullWidth
            />
            
            <div className="flex justify-end">
              <Button onClick={handleNext} variant="primary">
                Next: Location
              </Button>
            </div>
          </div>
        );
        
      case STEPS.LOCATION:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-black">Business Location</h2>
            <p className="text-black">Help customers find your physical location.</p>
            
            <Input
              label="Street Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="123 Main St"
              fullWidth
              required
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                fullWidth
                required
              />
              
              <Input
                label="State/Province"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
                fullWidth
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="ZIP/Postal Code"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                placeholder="ZIP Code"
                fullWidth
                required
              />
              
              <Input
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Country"
                fullWidth
                required
              />
            </div>
            
            <div className="flex justify-between">
              <Button onClick={handleBack} variant="outline">
                Back
              </Button>
              <Button onClick={handleNext} variant="primary">
                Next: Contact Information
              </Button>
            </div>
          </div>
        );
        
      case STEPS.CONTACT:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-black">Contact Information</h2>
            <p className="text-black">How can customers reach your business?</p>
            
            <Input
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 123-4567"
              fullWidth
              required
            />
            
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="business@example.com"
              fullWidth
              required
            />
            
            <Input
              label="Website (optional)"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://www.example.com"
              helperText="If you have an existing website, enter it here"
              fullWidth
            />
            
            <div className="flex justify-between">
              <Button onClick={handleBack} variant="outline">
                Back
              </Button>
              <Button onClick={handleNext} variant="primary">
                Next: Business Hours
              </Button>
            </div>
          </div>
        );
        
      case STEPS.HOURS:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-black">Business Hours</h2>
            <p className="text-black">Let customers know when you're open.</p>
            
            {/* Monday */}
            <div className="grid grid-cols-3 gap-4 items-center">
              <div className="font-medium text-black">Monday</div>
              <Input
                name="mondayOpen"
                type="time"
                value={formData.mondayOpen}
                onChange={handleChange}
                fullWidth
              />
              <Input
                name="mondayClose"
                type="time"
                value={formData.mondayClose}
                onChange={handleChange}
                fullWidth
              />
            </div>
            
            {/* Tuesday */}
            <div className="grid grid-cols-3 gap-4 items-center">
              <div className="font-medium text-black">Tuesday</div>
              <Input
                name="tuesdayOpen"
                type="time"
                value={formData.tuesdayOpen}
                onChange={handleChange}
                fullWidth
              />
              <Input
                name="tuesdayClose"
                type="time"
                value={formData.tuesdayClose}
                onChange={handleChange}
                fullWidth
              />
            </div>
            
            {/* Wednesday */}
            <div className="grid grid-cols-3 gap-4 items-center">
              <div className="font-medium text-black">Wednesday</div>
              <Input
                name="wednesdayOpen"
                type="time"
                value={formData.wednesdayOpen}
                onChange={handleChange}
                fullWidth
              />
              <Input
                name="wednesdayClose"
                type="time"
                value={formData.wednesdayClose}
                onChange={handleChange}
                fullWidth
              />
            </div>
            
            {/* Thursday */}
            <div className="grid grid-cols-3 gap-4 items-center">
              <div className="font-medium text-black">Thursday</div>
              <Input
                name="thursdayOpen"
                type="time"
                value={formData.thursdayOpen}
                onChange={handleChange}
                fullWidth
              />
              <Input
                name="thursdayClose"
                type="time"
                value={formData.thursdayClose}
                onChange={handleChange}
                fullWidth
              />
            </div>
            
            {/* Friday */}
            <div className="grid grid-cols-3 gap-4 items-center">
              <div className="font-medium text-black">Friday</div>
              <Input
                name="fridayOpen"
                type="time"
                value={formData.fridayOpen}
                onChange={handleChange}
                fullWidth
              />
              <Input
                name="fridayClose"
                type="time"
                value={formData.fridayClose}
                onChange={handleChange}
                fullWidth
              />
            </div>
            
            {/* Saturday */}
            <div className="grid grid-cols-3 gap-4 items-center">
              <div className="font-medium text-black">Saturday</div>
              <Input
                name="saturdayOpen"
                type="time"
                value={formData.saturdayOpen}
                onChange={handleChange}
                fullWidth
              />
              <Input
                name="saturdayClose"
                type="time"
                value={formData.saturdayClose}
                onChange={handleChange}
                fullWidth
              />
            </div>
            
            {/* Sunday */}
            <div className="grid grid-cols-3 gap-4 items-center">
              <div className="font-medium text-black">Sunday</div>
              <Input
                name="sundayOpen"
                type="time"
                value={formData.sundayOpen}
                onChange={handleChange}
                fullWidth
              />
              <Input
                name="sundayClose"
                type="time"
                value={formData.sundayClose}
                onChange={handleChange}
                fullWidth
              />
            </div>
            
            <div className="flex justify-between">
              <Button onClick={handleBack} variant="outline">
                Back
              </Button>
              <Button onClick={handleNext} variant="primary">
                Next: Photos
              </Button>
            </div>
          </div>
        );
        
      case STEPS.PHOTOS:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-black">Business Photos</h2>
            <p className="text-black">Upload photos of your business to attract customers.</p>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="space-y-4">
                <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <div className="text-sm text-black">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-red-600 hover:text-red-700 focus-within:outline-none">
                    <span>Upload photos</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple accept="image/*" />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-black">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button onClick={handleBack} variant="outline">
                Back
              </Button>
              <Button onClick={handleNext} variant="primary">
                Review & Submit
              </Button>
            </div>
          </div>
        );
        
      case STEPS.REVIEW:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-black">Review Your Business</h2>
            <p className="text-black">Please review your information before submitting.</p>
            
            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
              <div>
                <h3 className="text-lg font-medium text-black">Business Information</h3>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-black">Name:</span>
                    <p className="text-black">{formData.name || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-black">Category:</span>
                    <p className="text-black">{businessCategories.find(c => c.id === formData.category)?.name || 'Not provided'}</p>
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-sm text-black">Description:</span>
                  <p className="text-black">{formData.description || 'Not provided'}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-black">Location</h3>
                <p className="text-black">{formData.address}, {formData.city}, {formData.state} {formData.zipCode}, {formData.country}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-black">Contact Information</h3>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-black">Phone:</span>
                    <p className="text-black">{formData.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="text-sm text-black">Email:</span>
                    <p className="text-black">{formData.email || 'Not provided'}</p>
                  </div>
                  {formData.website && (
                    <div>
                      <span className="text-sm text-black">Website:</span>
                      <p className="text-black">{formData.website}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg space-y-4">
              <h3 className="text-lg font-medium text-black">Create Your Account</h3>
              <p className="text-black">Set up your account to manage your business listing.</p>
              
              <div className="space-y-4">
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  fullWidth
                  required
                  disabled={!!formData.email} // Disable if already provided in contact info
                />
                
                <Input
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a secure password"
                  fullWidth
                  required
                />
                
                <Input
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  fullWidth
                  required
                />
              </div>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm text-red-700">
                <strong>Next steps:</strong> After submitting, you'll be redirected to your business dashboard.
              </p>
            </div>
            
            <div className="flex justify-between">
              <Button onClick={handleBack} variant="outline">
                Back
              </Button>
              <Button onClick={handleSubmit} variant="primary" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Business'}
              </Button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  // Progress indicator
  const renderProgress = () => {
    const totalSteps = Object.keys(STEPS).length;
    const progress = ((step + 1) / totalSteps) * 100;
    
    return (
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-black">Step {step + 1} of {totalSteps}</span>
          <span className="text-sm font-medium text-black">{Math.round(progress)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-red-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black">Add Your Place to PlaceListed</h1>
          <p className="mt-2 text-lg text-black">
            Get discovered by new customers without needing a website
          </p>
        </div>
        
        {renderProgress()}
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 md:p-8">
          {renderStep()}
        </div>
        
        <div className="mt-6 text-center text-sm text-black">
          Already have a business on PlaceListed?{' '}
          <Link href="/auth/login" className="font-medium text-red-600 hover:text-red-500">
            Sign in to manage it
          </Link>
        </div>
      </div>
    </div>
  );
}
