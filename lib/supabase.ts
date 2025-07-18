import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Profile = {
  id: string
  discord_id: string
  discord_username: string
  display_name: string
  discord_avatar_url?: string
  profile_picture_url?: string
  interests: string[]
  connection_preference: string
  availability: string
  voice_intro?: string
  created_at?: string
  updated_at?: string
}

export type Like = {
  id: string
  swiper_id: string
  liked_id: string
  created_at: string
}

export type Match = {
  id: string
  user1_id: string
  user2_id: string
  other_user?: Profile
  created_at: string
}