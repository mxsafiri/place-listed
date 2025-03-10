'use client';

import { useState } from 'react';
import { Button } from '@/frontend/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/frontend/components/ui/Card';

interface ReviewFormProps {
  businessId: string;
  onReviewSubmit: (review: {
    rating: number;
    comment: string;
    user: string;
  }) => void;
  onCancel: () => void;
}

export default function ReviewForm({ businessId, onReviewSubmit, onCancel }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comment.trim() || !name.trim()) {
      alert('Please provide both a name and comment');
      return;
    }
    
    onReviewSubmit({
      rating,
      comment,
      user: name
    });
    
    // Reset form
    setRating(5);
    setComment('');
    setName('');
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-black">Write a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-black mb-1">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-red-600"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Rating
            </label>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(null)}
                  className="text-2xl focus:outline-none"
                >
                  <span className={`${
                    (hoveredStar !== null ? star <= hoveredStar : star <= rating)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}>
                    ★
                  </span>
                </button>
              ))}
              <span className="ml-2 text-black">{rating} out of 5</span>
            </div>
          </div>
          
          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-black mb-1">
              Your Review
            </label>
            <textarea
              id="comment"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-red-600"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="primary"
            >
              Submit Review
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
