export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  user_type: string;
  language_preference: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserRole {
  role_type: string;
  is_primary: boolean;
}

export interface FarmerProfile {
  id: string;
  user_id: string;
  farm_location?: string;
  land_area?: number;
  crops_grown?: string[];
  farming_practices?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface StoreOwnerProfile {
  id: string;
  user_id: string;
  store_name: string;
  store_location?: string;
  gst_number?: string;
  specializations?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface BrokerProfile {
  id: string;
  user_id: string;
  market_name?: string;
  license_number?: string;
  specializations?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface ExpertProfile {
  id: string;
  user_id: string;
  expertise?: string;
  qualification?: string;
  years_experience?: number;
  created_at?: string;
  updated_at?: string;
}

export interface StudentProfile {
  id: string;
  user_id: string;
  institution?: string;
  field_of_study?: string;
  graduation_year?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ConsumerProfile {
  id: string;
  user_id: string;
  preferences?: string;
  interests?: string[];
  created_at?: string;
  updated_at?: string;
} 