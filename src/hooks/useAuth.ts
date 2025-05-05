import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Get session on first load
    const getSession = async () => {
      setLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (_event, session) => {
          setUser(session?.user ?? null)
        }
      )

      return () => {
        subscription.unsubscribe()
      }
    }

    getSession()
  }, [])

  const signIn = async (email: string, password: string) => {
    return supabase.auth.signInWithPassword({ email, password })
  }

  const signInWithPhone = async (phone: string) => {
    return supabase.auth.signInWithOtp({ phone })
  }

  const signInWithGoogle = async () => {
    return supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
  }

  const signUp = async (email: string, password: string, userData: any) => {
    const response = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    
    return response
  }

  const signOut = async () => {
    return supabase.auth.signOut()
  }

  return {
    user,
    loading,
    signIn,
    signInWithPhone,
    signInWithGoogle,
    signUp,
    signOut
  }
} 