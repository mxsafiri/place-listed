// User model definition
export interface User {
  uid: string;
  email: string;
  displayName: string;
  businessName?: string;
  role: 'business_owner' | 'admin' | 'customer';
  createdAt: Date;
  updatedAt: Date;
  subscription: 'free' | 'premium' | 'enterprise';
  verified: boolean;
  profileImage?: string;
  phoneNumber?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  businessDetails?: {
    industry?: string;
    size?: 'solo' | 'small' | 'medium' | 'large';
    foundedYear?: number;
    description?: string;
  };
  settings?: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    marketingEmails: boolean;
  };
  lastLogin?: Date;
}

// Registration data (subset of fields required when registering)
export interface RegistrationData {
  email: string;
  password: string;
  displayName: string;
  businessName: string;
}

// Profile update data (subset of fields that can be updated)
export interface ProfileUpdateData {
  displayName?: string;
  businessName?: string;
  profileImage?: string;
  phoneNumber?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  businessDetails?: {
    industry?: string;
    size?: 'solo' | 'small' | 'medium' | 'large';
    foundedYear?: number;
    description?: string;
  };
  settings?: {
    emailNotifications?: boolean;
    smsNotifications?: boolean;
    marketingEmails?: boolean;
  };
}
