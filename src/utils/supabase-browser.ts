import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/supabase'

// Create client for client components
export function createBrowserSupabaseClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
} 