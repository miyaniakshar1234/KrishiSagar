export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          created_at: string
          email: string
          phone: string | null
          full_name: string | null
          user_type: 'farmer' | 'agro_store' | 'broker' | 'expert' | 'student' | 'consumer'
          profile_image: string | null
          language_preference: 'en' | 'hi' | 'gu'
        }
        Insert: {
          id?: string
          created_at?: string
          email: string
          phone?: string | null
          full_name?: string | null
          user_type: 'farmer' | 'agro_store' | 'broker' | 'expert' | 'student' | 'consumer'
          profile_image?: string | null
          language_preference?: 'en' | 'hi' | 'gu'
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          phone?: string | null
          full_name?: string | null
          user_type?: 'farmer' | 'agro_store' | 'broker' | 'expert' | 'student' | 'consumer'
          profile_image?: string | null
          language_preference?: 'en' | 'hi' | 'gu'
        }
      }
      farmer_profiles: {
        Row: {
          id: string
          user_id: string
          farm_location: string | null
          crops_grown: string[] | null
          farming_practices: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          farm_location?: string | null
          crops_grown?: string[] | null
          farming_practices?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          farm_location?: string | null
          crops_grown?: string[] | null
          farming_practices?: string[] | null
          created_at?: string
        }
      }
      agro_store_profiles: {
        Row: {
          id: string
          user_id: string
          store_name: string
          store_location: string
          specializations: string[] | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          store_name: string
          store_location: string
          specializations?: string[] | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          store_name?: string
          store_location?: string
          specializations?: string[] | null
          created_at?: string
        }
      }
      // Other table definitions will be added as needed
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 