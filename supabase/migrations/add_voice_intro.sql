-- Add voice_intro column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS voice_intro TEXT;