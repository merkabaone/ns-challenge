import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (!error && data.user) {
        // Check if profile exists
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('discord_id', data.user.id)
          .single()
        
        // Create profile if it doesn't exist
        if (!profile && data.user.user_metadata) {
          const userMetadata = data.user.user_metadata
          await supabase.from('profiles').insert({
            discord_id: data.user.id,
            discord_username: userMetadata.full_name || userMetadata.name || userMetadata.username || 'User',
            display_name: userMetadata.full_name || userMetadata.name || userMetadata.username || 'User',
            discord_avatar_url: userMetadata.avatar_url,
            interests: [],
            connection_preference: '',
            availability: ''
          })
          
          // Redirect to profile setup
          return NextResponse.redirect(`${origin}/profile`)
        }
        
        // Profile exists, redirect to swipe
        return NextResponse.redirect(`${origin}/swipe`)
      }
    } catch (error) {
      console.error('Auth callback error:', error)
    }
  }

  // Auth failed, redirect to home
  return NextResponse.redirect(`${origin}/`)
}