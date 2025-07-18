import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import './globals.css'

export default async function Home() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  async function signInWithDiscord() {
    'use server'
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
      },
    })
    
    if (data.url) {
      redirect(data.url)
    }
  }

  // If user is already logged in, redirect to appropriate page
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('discord_id', user.id)
      .single()
    
    if (profile) {
      redirect('/swipe')
    } else {
      redirect('/profile')
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