import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

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
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <Heart className="h-24 w-24 text-pink-500 animate-pulse" fill="currentColor" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-bold text-2xl">NS</span>
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            NS Friender
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Find your next Network School friend!
          </p>
          
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            Connect with fellow NS members based on shared interests and availability. 
            Swipe, match, and make meaningful connections.
          </p>
        </div>

        <form action={signInWithDiscord}>
          <Button 
            type="submit"
            size="lg" 
            className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold py-6 text-lg"
          >
            <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.369a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.369a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            Connect with Discord
          </Button>
        </form>

        <p className="text-xs text-gray-400 dark:text-gray-500">
          By signing in, you agree to share your Discord profile information
        </p>
      </div>
    </main>
  )
}