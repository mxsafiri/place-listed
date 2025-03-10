// This file simulates Firebase Cloud Functions for place-related operations
import { db } from '../services/firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit 
} from 'firebase/firestore';

// Create a new place
export const createPlace = async (placeData: any, userId: string) => {
  try {
    const placeWithOwner = {
      ...placeData,
      ownerId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'pending', // Places need approval before being public
      views: 0,
      ratings: {
        average: 0,
        count: 0
      }
    };
    
    const docRef = await addDoc(collection(db, 'places'), placeWithOwner);
    return { id: docRef.id, ...placeWithOwner };
  } catch (error) {
    console.error('Error creating place:', error);
    throw error;
  }
};

// Get places owned by a specific user
export const getPlacesByOwner = async (userId: string) => {
  try {
    const placesQuery = query(
      collection(db, 'places'),
      where('ownerId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(placesQuery);
    const places: any[] = [];
    
    querySnapshot.forEach((doc) => {
      places.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return places;
  } catch (error) {
    console.error('Error getting places by owner:', error);
    throw error;
  }
};

// Update an existing place
export const updatePlace = async (placeId: string, placeData: any, userId: string) => {
  try {
    // First verify ownership
    const placeRef = doc(db, 'places', placeId);
    const placeSnap = await getDoc(placeRef);
    
    if (!placeSnap.exists()) {
      throw new Error('Place not found');
    }
    
    const placeInfo = placeSnap.data();
    if (placeInfo.ownerId !== userId) {
      throw new Error('Unauthorized: You do not own this place');
    }
    
    // Update the place
    const updatedData = {
      ...placeData,
      updatedAt: new Date(),
      // Preserve fields that shouldn't be updated by the user
      ownerId: placeInfo.ownerId,
      createdAt: placeInfo.createdAt,
      status: placeInfo.status,
      views: placeInfo.views,
      ratings: placeInfo.ratings
    };
    
    await updateDoc(placeRef, updatedData);
    return { id: placeId, ...updatedData };
  } catch (error) {
    console.error('Error updating place:', error);
    throw error;
  }
};

// Delete a place
export const deletePlace = async (placeId: string, userId: string) => {
  try {
    // First verify ownership
    const placeRef = doc(db, 'places', placeId);
    const placeSnap = await getDoc(placeRef);
    
    if (!placeSnap.exists()) {
      throw new Error('Place not found');
    }
    
    const placeInfo = placeSnap.data();
    if (placeInfo.ownerId !== userId) {
      throw new Error('Unauthorized: You do not own this place');
    }
    
    // Delete the place
    await deleteDoc(placeRef);
    return { success: true, id: placeId };
  } catch (error) {
    console.error('Error deleting place:', error);
    throw error;
  }
};

// Get place analytics
export const getPlaceAnalytics = async (placeId: string, userId: string) => {
  try {
    // First verify ownership
    const placeRef = doc(db, 'places', placeId);
    const placeSnap = await getDoc(placeRef);
    
    if (!placeSnap.exists()) {
      throw new Error('Place not found');
    }
    
    const placeInfo = placeSnap.data();
    if (placeInfo.ownerId !== userId) {
      throw new Error('Unauthorized: You do not own this place');
    }
    
    // Get analytics data
    // In a real implementation, this would query analytics collections
    // For now, we'll return mock data
    return {
      views: {
        total: placeInfo.views || 0,
        weekly: Math.floor(Math.random() * 100),
        monthly: Math.floor(Math.random() * 400)
      },
      engagement: {
        clicksToCall: Math.floor(Math.random() * 30),
        clicksToWebsite: Math.floor(Math.random() * 50),
        clicksToDirections: Math.floor(Math.random() * 40)
      },
      demographics: {
        ageGroups: {
          '18-24': Math.floor(Math.random() * 20),
          '25-34': Math.floor(Math.random() * 30),
          '35-44': Math.floor(Math.random() * 25),
          '45-54': Math.floor(Math.random() * 15),
          '55+': Math.floor(Math.random() * 10)
        },
        gender: {
          male: Math.floor(Math.random() * 60),
          female: Math.floor(Math.random() * 40),
          other: Math.floor(Math.random() * 5)
        }
      }
    };
  } catch (error) {
    console.error('Error getting place analytics:', error);
    throw error;
  }
};
