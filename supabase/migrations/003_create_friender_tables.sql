-- Create NS Friender tables
-- This migration creates the profiles, likes, and matches tables

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (be careful in production!)
DROP TABLE IF EXISTS matches CASCADE;
DROP TABLE IF EXISTS likes CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  discord_id TEXT UNIQUE NOT NULL,
  discord_username TEXT NOT NULL,
  display_name TEXT NOT NULL,
  discord_avatar_url TEXT,
  profile_picture_url TEXT,
  interests TEXT[] NOT NULL DEFAULT '{}',
  connection_preference TEXT NOT NULL,
  availability TEXT NOT NULL,
  voice_intro TEXT,
  voice_intro_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create likes table (for swipe actions)
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  swiper_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  liked_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(swiper_id, liked_id)
);

-- Create matches table
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user1_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user2_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user1_id, user2_id),
  CONSTRAINT check_different_users CHECK (user1_id != user2_id),
  CONSTRAINT ordered_users CHECK (user1_id < user2_id)
);

-- Create indexes for performance
CREATE INDEX idx_profiles_discord_id ON profiles(discord_id);
CREATE INDEX idx_likes_swiper ON likes(swiper_id);
CREATE INDEX idx_likes_liked ON likes(liked_id);
CREATE INDEX idx_matches_users ON matches(user1_id, user2_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Anyone can view profiles" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid()::text = discord_id);

CREATE POLICY "Service role can insert profiles" ON profiles
  FOR INSERT WITH CHECK (true);

-- Likes policies
CREATE POLICY "Service role can manage likes" ON likes
  FOR ALL USING (true);

-- Matches policies  
CREATE POLICY "Users can view matches they're part of" ON matches
  FOR SELECT USING (
    user1_id IN (SELECT id FROM profiles WHERE discord_id = auth.uid()::text) OR
    user2_id IN (SELECT id FROM profiles WHERE discord_id = auth.uid()::text)
  );

CREATE POLICY "Service role can manage matches" ON matches
  FOR ALL USING (true);

-- Function to automatically create matches when mutual likes occur
CREATE OR REPLACE FUNCTION create_match_on_mutual_like()
RETURNS TRIGGER AS $$
DECLARE
  mutual_like_exists BOOLEAN;
  smaller_id UUID;
  larger_id UUID;
BEGIN
  -- Check if the liked user has already liked the swiper
  SELECT EXISTS (
    SELECT 1 FROM likes 
    WHERE swiper_id = NEW.liked_id 
    AND liked_id = NEW.swiper_id
  ) INTO mutual_like_exists;

  IF mutual_like_exists THEN
    -- Order the IDs to ensure consistency
    IF NEW.swiper_id < NEW.liked_id THEN
      smaller_id := NEW.swiper_id;
      larger_id := NEW.liked_id;
    ELSE
      smaller_id := NEW.liked_id;
      larger_id := NEW.swiper_id;
    END IF;

    -- Insert match if it doesn't already exist
    INSERT INTO matches (user1_id, user2_id)
    VALUES (smaller_id, larger_id)
    ON CONFLICT (user1_id, user2_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for automatic match creation
CREATE TRIGGER trigger_create_match_on_mutual_like
  AFTER INSERT ON likes
  FOR EACH ROW
  EXECUTE FUNCTION create_match_on_mutual_like();

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();