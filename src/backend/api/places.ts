// This file simulates Firebase Cloud Functions for place-related operations
import { db, storage } from '../services/firebase/config';
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
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Define proper types for our place data
export interface PlaceData {
  name: string;
  description: string;
  category: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  website: string;
  hours: Record<string, string>;
  amenities: string[];
  tags: string[];
  images?: string[];
  products?: ProductData[];
  [key: string]: any; // For any additional properties
}

export interface ProductData {
  name: string;
  description: string;
  price: number;
  image?: string;
  category?: string;
}

export interface PlaceWithOwner extends PlaceData {
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
  views: number;
  ratings: {
    average: number;
    count: number;
  };
  slug: string;
}

// Upload an image to Firebase Storage and get the URL
export const uploadPlaceImage = async (file: File, userId: string): Promise<string> => {
  try {
    const storageRef = ref(storage, `places/${userId}/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Create a new place
export const createPlace = async (placeData: PlaceData, userId: string): Promise<string> => {
  try {
    const slug = generateSlug(placeData.name);
    
    const placeWithOwner: PlaceWithOwner = {
      ...placeData,
      ownerId: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'pending', // Places need approval before being public
      views: 0,
      ratings: {
        average: 0,
        count: 0
      },
      slug
    };

    const docRef = await addDoc(collection(db, 'places'), placeWithOwner);
    return docRef.id;
  } catch (error) {
    console.error('Error creating place:', error);
    throw error;
  }
};

// Helper function to generate a URL-friendly slug from a name
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with a single one
    .trim();
};

// Get places owned by a specific user
export const getPlacesByOwner = async (userId: string): Promise<PlaceWithOwner[]> => {
  try {
    const placesQuery = query(
      collection(db, 'places'),
      where('ownerId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(placesQuery);
    const places: PlaceWithOwner[] = [];
    
    querySnapshot.forEach((doc) => {
      places.push({
        id: doc.id,
        ...doc.data()
      } as unknown as PlaceWithOwner);
    });
    
    return places;
  } catch (error) {
    console.error('Error getting places by owner:', error);
    throw error;
  }
};

// Update an existing place
export const updatePlace = async (placeId: string, placeData: PlaceData, userId: string): Promise<PlaceWithOwner> => {
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
    const updatedData: PlaceWithOwner = {
      ...placeData,
      updatedAt: new Date(),
      // Preserve fields that shouldn't be updated by the user
      ownerId: placeInfo.ownerId,
      createdAt: placeInfo.createdAt,
      status: placeInfo.status,
      views: placeInfo.views,
      ratings: placeInfo.ratings,
      slug: placeInfo.slug
    };
    
    await updateDoc(placeRef, updatedData);
    return { id: placeId, ...updatedData };
  } catch (error) {
    console.error('Error updating place:', error);
    throw error;
  }
};

// Delete a place
export const deletePlace = async (placeId: string, userId: string): Promise<{ success: boolean, id: string }> => {
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
export const getPlaceAnalytics = async (placeId: string, userId: string): Promise<{
  views: {
    total: number,
    weekly: number,
    monthly: number
  },
  engagement: {
    clicksToCall: number,
    clicksToWebsite: number,
    clicksToDirections: number
  },
  demographics: {
    ageGroups: {
      '18-24': number,
      '25-34': number,
      '35-44': number,
      '45-54': number,
      '55+': number
    },
    gender: {
      male: number,
      female: number,
      other: number
    }
  }
}> => {
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
