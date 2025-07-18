-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users profile table
CREATE TABLE IF NOT EXISTS profiles (
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Likes table (swipe actions)
CREATE TABLE IF NOT EXISTS likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  swiper_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  liked_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(swiper_id, liked_id)
);

-- Matches table
CREATE TABLE IF NOT EXISTS matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user1_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user2_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user1_id, user2_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_likes_swiper ON likes(swiper_id);
CREATE INDEX IF NOT EXISTS idx_likes_liked ON likes(liked_id);
CREATE INDEX IF NOT EXISTS idx_matches_users ON matches(user1_id, user2_id);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid()::text = discord_id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid()::text = discord_id);

-- Likes policies
CREATE POLICY "Users can view own likes" ON likes
  FOR SELECT USING (
    swiper_id IN (SELECT id FROM profiles WHERE discord_id = auth.uid()::text)
  );

CREATE POLICY "Users can create likes" ON likes
  FOR INSERT WITH CHECK (
    swiper_id IN (SELECT id FROM profiles WHERE discord_id = auth.uid()::text)
  );

-- Matches policies
CREATE POLICY "Users can view own matches" ON matches
  FOR SELECT USING (
    user1_id IN (SELECT id FROM profiles WHERE discord_id = auth.uid()::text) OR
    user2_id IN (SELECT id FROM profiles WHERE discord_id = auth.uid()::text)
  );