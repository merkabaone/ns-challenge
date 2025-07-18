-- Setup social authentication for NS Challenge
-- This migration configures social auth providers and user profiles

-- Add social auth fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS provider TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS provider_id TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS username TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS github_username TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS discord_username TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS twitter_username TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;

-- Create unique constraint for provider + provider_id
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_provider_id ON users(provider, provider_id);

-- Create index for username lookup
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username ON users(username) WHERE username IS NOT NULL;

-- Add RLS policy for public profile viewing (needed for competition leaderboards)
CREATE POLICY "Public profiles are viewable by everyone" ON users
    FOR SELECT USING (true);

-- Update the existing profile policies to be more specific
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid() = id);

-- Function to handle user registration from social auth
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
    -- Insert into users table when a new user is created in auth.users
    INSERT INTO public.users (id, email, full_name, avatar_url, provider, provider_id, username, last_login)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url',
        NEW.raw_app_meta_data->>'provider',
        NEW.raw_user_meta_data->>'provider_id',
        NEW.raw_user_meta_data->>'preferred_username',
        NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = EXCLUDED.full_name,
        avatar_url = EXCLUDED.avatar_url,
        last_login = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update user profile
CREATE OR REPLACE FUNCTION update_user_profile(
    user_id UUID,
    new_username TEXT DEFAULT NULL,
    new_full_name TEXT DEFAULT NULL,
    new_bio TEXT DEFAULT NULL,
    new_github_username TEXT DEFAULT NULL,
    new_discord_username TEXT DEFAULT NULL,
    new_twitter_username TEXT DEFAULT NULL
) RETURNS VOID AS $$
BEGIN
    -- Check if user owns this profile
    IF auth.uid() != user_id THEN
        RAISE EXCEPTION 'Unauthorized: You can only update your own profile';
    END IF;
    
    -- Update the user profile
    UPDATE users SET
        username = COALESCE(new_username, username),
        full_name = COALESCE(new_full_name, full_name),
        bio = COALESCE(new_bio, bio),
        github_username = COALESCE(new_github_username, github_username),
        discord_username = COALESCE(new_discord_username, discord_username),
        twitter_username = COALESCE(new_twitter_username, twitter_username),
        updated_at = NOW()
    WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a view for public user profiles (for leaderboards, etc.)
CREATE OR REPLACE VIEW public_profiles AS
SELECT 
    id,
    username,
    full_name,
    avatar_url,
    bio,
    github_username,
    discord_username,
    twitter_username,
    created_at
FROM users
WHERE username IS NOT NULL;

-- Enable RLS on the view
ALTER VIEW public_profiles OWNER TO postgres;

-- Create function to get user by username
CREATE OR REPLACE FUNCTION get_user_by_username(lookup_username TEXT)
RETURNS TABLE (
    id UUID,
    username TEXT,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    github_username TEXT,
    discord_username TEXT,
    twitter_username TEXT,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.username,
        u.full_name,
        u.avatar_url,
        u.bio,
        u.github_username,
        u.discord_username,
        u.twitter_username,
        u.created_at
    FROM users u
    WHERE u.username = lookup_username;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check username availability
CREATE OR REPLACE FUNCTION is_username_available(check_username TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN NOT EXISTS (
        SELECT 1 FROM users WHERE username = check_username
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;