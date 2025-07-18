'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signInWithProvider: (provider: 'google' | 'github' | 'discord', redirectTo?: string) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (data: {
    username?: string
    full_name?: string
    bio?: string
    github_username?: string
    discord_username?: string
    twitter_username?: string
  }) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signInWithProvider = async (provider: 'google' | 'github' | 'discord', redirectTo?: string) => {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    // Use production URL if available, otherwise use current origin
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin
    const callbackUrl = new URL(`${baseUrl}/auth/callback`)
    if (redirectTo) {
      callbackUrl.searchParams.set('next', redirectTo)
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: callbackUrl.toString(),
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })

    if (error) {
      throw error
    }
  }

  const signOut = async () => {
    if (!supabase) {
      throw new Error('Supabase client not initialized')
    }

    const { error } = await supabase.auth.signOut()
    if (error) {
      throw error
    }
  }

  const updateProfile = async (data: {
    username?: string
    full_name?: string
    bio?: string
    github_username?: string
    discord_username?: string
    twitter_username?: string
  }) => {
    if (!supabase || !user) {
      throw new Error('User not authenticated')
    }

    const { error } = await supabase.rpc('update_user_profile', {
      user_id: user.id,
      new_username: data.username,
      new_full_name: data.full_name,
      new_bio: data.bio,
      new_github_username: data.github_username,
      new_discord_username: data.discord_username,
      new_twitter_username: data.twitter_username,
    })

    if (error) {
      throw error
    }
  }

  const value = {
    user,
    session,
    loading,
    signInWithProvider,
    signOut,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function useRequireAuth() {
  const { user, loading } = useAuth()
  
  if (loading) {
    return { user: null, loading: true }
  }
  
  if (!user) {
    throw new Error('Authentication required')
  }
  
  return { user, loading: false }
}