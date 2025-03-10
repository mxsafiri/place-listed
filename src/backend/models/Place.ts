// Place model definition
export interface Place {
  id?: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    }
  };
  contact: {
    phone?: string;
    email?: string;
    website?: string;
    socialMedia?: {
      facebook?: string;
      instagram?: string;
      twitter?: string;
      linkedin?: string;
    }
  };
  businessHours: {
    monday?: { open: string; close: string; closed: boolean };
    tuesday?: { open: string; close: string; closed: boolean };
    wednesday?: { open: string; close: string; closed: boolean };
    thursday?: { open: string; close: string; closed: boolean };
    friday?: { open: string; close: string; closed: boolean };
    saturday?: { open: string; close: string; closed: boolean };
    sunday?: { open: string; close: string; closed: boolean };
  };
  photos: {
    main?: string;
    gallery?: string[];
    logo?: string;
  };
  amenities: string[];
  tags: string[];
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'pending' | 'active' | 'rejected' | 'inactive';
  views: number;
  ratings: {
    average: number;
    count: number;
  };
  featured?: boolean;
  subscription?: 'free' | 'premium' | 'enterprise';
  slug?: string;
}

// Place creation data (subset of fields required when creating a new place)
export interface PlaceCreationData {
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  contact: {
    phone?: string;
    email?: string;
    website?: string;
  };
  businessHours?: {
    monday?: { open: string; close: string; closed: boolean };
    tuesday?: { open: string; close: string; closed: boolean };
    wednesday?: { open: string; close: string; closed: boolean };
    thursday?: { open: string; close: string; closed: boolean };
    friday?: { open: string; close: string; closed: boolean };
    saturday?: { open: string; close: string; closed: boolean };
    sunday?: { open: string; close: string; closed: boolean };
  };
  photos?: {
    main?: string;
    gallery?: string[];
    logo?: string;
  };
  amenities?: string[];
  tags?: string[];
}
