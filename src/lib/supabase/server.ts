import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies as nextCookies } from 'next/headers'
import { Database } from '@/types/supabase'

// Create a Supabase client for server components
export const createClient = () => {
  // Get the cookies from the request
  const cookieStore = nextCookies()
  
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          // This is safe because we're in a server component context
          const cookie = cookieStore.get(name)
          return cookie?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            // This is safe because we're in a server component context
            cookieStore.set(name, value, options)
          } catch {
            // This can happen in middleware or when cookies are read-only
            // We can safely ignore this error
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            // This is safe because we're in a server component context
            cookieStore.set(name, '', { ...options, maxAge: 0 })
          } catch {
            // This can happen in middleware or when cookies are read-only
            // We can safely ignore this error
          }
        },
      },
    }
  )
} 