// Review API using Supabase
import { reviewService, Review } from '@/lib/review-service';

// Create a new review
export const createReview = async (
  review: Omit<Review, 'id' | 'created_at' | 'updated_at'>
): Promise<Review> => {
  try {
    return await reviewService.createReview(review);
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
};

// Get reviews for a business
export const getBusinessReviews = async (businessId: string): Promise<Review[]> => {
  try {
    return await reviewService.getBusinessReviews(businessId);
  } catch (error) {
    console.error('Error getting business reviews:', error);
    throw error;
  }
};

// Get a specific review
export const getReview = async (reviewId: string): Promise<Review | null> => {
  try {
    return await reviewService.getReview(reviewId);
  } catch (error) {
    console.error('Error getting review:', error);
    throw error;
  }
};

// Update a review
export const updateReview = async (
  reviewId: string, 
  updates: Partial<Review>
): Promise<Review> => {
  try {
    return await reviewService.updateReview(reviewId, updates);
  } catch (error) {
    console.error('Error updating review:', error);
    throw error;
  }
};

// Delete a review
export const deleteReview = async (reviewId: string): Promise<void> => {
  try {
    await reviewService.deleteReview(reviewId);
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
};

// Get user reviews
export const getUserReviews = async (userId: string): Promise<Review[]> => {
  try {
    return await reviewService.getUserReviews(userId);
  } catch (error) {
    console.error('Error getting user reviews:', error);
    throw error;
  }
};
