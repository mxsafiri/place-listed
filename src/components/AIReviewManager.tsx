'use client';

import { useState } from 'react';
import { Button } from '@/frontend/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/frontend/components/ui/Card';

interface AIReviewManagerProps {
  reviews: {
    id: string;
    author: string;
    rating: number;
    comment: string;
    date: string;
    businessName?: string;
    businessSlug?: string;
  }[];
}

export default function AIReviewManager({ reviews }: AIReviewManagerProps) {
  const [selectedReview, setSelectedReview] = useState<string | null>(null);
  const [aiSuggestion, setAiSuggestion] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const generateResponse = async (reviewId: string) => {
    setIsLoading(true);
    setSelectedReview(reviewId);
    
    // In a real implementation, this would call an API endpoint
    // For now, we'll simulate an AI response
    setTimeout(() => {
      const review = reviews.find(r => r.id === reviewId);
      if (!review) return;
      
      let response = '';
      
      if (review.rating >= 4) {
        response = `Thank you so much for your positive feedback! We're thrilled that you enjoyed your experience with us. We work hard to provide excellent service, and we're glad it shows. We hope to see you again soon!`;
      } else if (review.rating === 3) {
        response = `Thank you for your feedback. We appreciate you taking the time to share your thoughts. We're constantly working to improve our services, and your input helps us do that. We'd love to hear more about how we can make your next experience better.`;
      } else {
        response = `We sincerely apologize for your disappointing experience. Your feedback is important to us, and we'd like to make things right. Please reach out to us directly so we can address your concerns and improve our service.`;
      }
      
      setAiSuggestion(response);
      setIsLoading(false);
    }, 1500);
  };

  const getSentimentColor = (rating: number) => {
    if (rating >= 4) return 'bg-green-100 text-green-800';
    if (rating === 3) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getSentimentText = (rating: number) => {
    if (rating >= 4) return 'Positive';
    if (rating === 3) return 'Neutral';
    return 'Negative';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-black">AI Review Manager</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-black mb-4">Use AI to help analyze and respond to customer reviews.</p>
        
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between mb-2">
                <div>
                  <span className="font-medium text-black">{review.author}</span>
                  <span className="text-black ml-2">• {review.date}</span>
                </div>
                <div className={`px-2 py-1 rounded-full text-sm ${getSentimentColor(review.rating)}`}>
                  {getSentimentText(review.rating)} ({review.rating}/5)
                </div>
              </div>
              
              <p className="text-black mb-3">{review.comment}</p>
              
              <div className="flex flex-col space-y-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="text-red-600 border-red-600 hover:bg-red-50 w-full"
                  onClick={() => generateResponse(review.id)}
                  disabled={isLoading && selectedReview === review.id}
                >
                  {isLoading && selectedReview === review.id ? 'Generating...' : 'Generate AI Response'}
                </Button>
                
                {selectedReview === review.id && aiSuggestion && (
                  <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <h4 className="text-sm font-medium text-black mb-2">AI Suggested Response:</h4>
                    <p className="text-black text-sm">{aiSuggestion}</p>
                    <div className="flex justify-end mt-2">
                      <Button variant="primary" size="sm">Use This Response</Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {reviews.length === 0 && (
            <div className="text-center py-8">
              <p className="text-black mb-4">No reviews to manage yet.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
