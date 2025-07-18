import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { logger } from '@/lib/logger'
import './globals.css'

export default async function Home() {
  let user = null
  let error = null

  try {
    const supabase = createClient()
    const { data: authData, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      logger.error('Auth error:', authError)
      error = authError
    } else {
      user = authData.user
    }
  } catch (err) {
    logger.error('Unexpected error:', err)
    error = err
  }

  async function signInWithDiscord() {
    'use server'
    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'discord',
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
        },
      })
      
      if (error) {
        throw error
      }
      
      if (data.url) {
        redirect(data.url)
      }
    } catch (err) {
      logger.error('Discord sign in error:', err)
      throw new Error('Failed to sign in with Discord')
    }
  }

  // If user is already logged in, redirect to appropriate page
  if (user && !error) {
    try {
      const supabase = createClient()
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('discord_id', user.id)
        .single()
      
      if (!profileError && profile) {
        redirect('/swipe')
      } else {
        redirect('/profile')
      }
    } catch (err) {
      logger.error('Profile check error:', err)
    }
  }

  return (
    <main className="dark-container fade-in">
      <div className="max-w-2xl mx-auto">
        <h1 className="mb-8 text-center">What is NS Friender?</h1>
        
        <div className="space-y-6">
          <p>
            NS Friender is a connection platform for Network School members. Our 
            platform helps remote workers, digital nomads, online creators, 
            personal trainers, self-improvers, event organizers, and engineers of all 
            stripes find meaningful connections within the Network School community.
          </p>
          
          <p>
            We <em className="italic">know</em> that the best connections happen when 
            people share interests, schedules, and aspirations. That&apos;s why NS Friender 
            matches you based on what matters: your interests, your availability, and 
            your goals within the Network School ecosystem.
          </p>
          
          <p>
            If you&apos;re part of the Network School community, NS Friender helps you 
            build lasting friendships with fellow members. Swipe through profiles, 
            match with like-minded individuals, and start conversations that lead to 
            real connections.
          </p>
          
          <p>
            Ready to find your next Network School friend? Please{' '}
            <form action={signInWithDiscord} className="inline">
              <button type="submit" className="dark-link">
                sign in with Discord
              </button>
            </form>
            !
          </p>
        </div>
      </div>
    </main>
  )
}