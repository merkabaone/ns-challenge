# NS Friender - System Design Document

## 1. Architecture Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Next.js App   │────▶│  Supabase Auth  │────▶│    Discord      │
│   (Frontend)    │     │   (OAuth Flow)   │     │    OAuth2       │
└────────┬────────┘     └─────────────────┘     └─────────────────┘
         │
         ▼
┌─────────────────┐
│  Supabase DB    │
│  - profiles     │
│  - likes        │
│  - matches      │
└─────────────────┘
```

## 2. Database Schema

```sql
-- Users profile table
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Likes table (swipe actions)
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  swiper_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  liked_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(swiper_id, liked_id)
);

-- Matches table
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user1_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user2_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user1_id, user2_id)
);

-- Indexes for performance
CREATE INDEX idx_likes_swiper ON likes(swiper_id);
CREATE INDEX idx_likes_liked ON likes(liked_id);
CREATE INDEX idx_matches_users ON matches(user1_id, user2_id);
```

## 3. Component Architecture

```
app/
├── page.tsx                    // Welcome screen with Discord login
├── profile/
│   └── page.tsx               // Profile setup page
├── swipe/
│   └── page.tsx               // Main swiping interface
├── match/
│   └── page.tsx               // Match notification screen
├── api/
│   ├── auth/
│   │   └── discord/
│   │       └── route.ts       // Discord OAuth callback
│   ├── profile/
│   │   └── route.ts           // Profile CRUD operations
│   ├── users/
│   │   └── route.ts           // Get users for swiping
│   ├── swipe/
│   │   └── route.ts           // Record swipe actions
│   └── matches/
│       └── route.ts           // Check and create matches
└── components/
    ├── SwipeCard.tsx          // Individual swipeable card
    ├── SwipeDeck.tsx          // Card stack manager
    ├── ProfileForm.tsx        // Profile creation form
    ├── CameraCapture.tsx      // Camera photo capture
    └── MatchModal.tsx         // Match notification modal
```

## 4. API Design

### Authentication Flow
```typescript
// 1. Initiate Discord OAuth
GET /api/auth/discord
→ Redirects to Discord OAuth

// 2. Discord Callback
GET /api/auth/discord/callback
→ Creates/updates user profile
→ Sets session cookie
→ Redirects to /profile or /swipe
```

### Profile Operations
```typescript
// Get current user profile
GET /api/profile
Response: Profile

// Create/Update profile
POST /api/profile
Body: {
  display_name: string,
  profile_picture_url?: string,
  interests: string[],
  connection_preference: string,
  availability: string
}
Response: Profile
```

### Swiping Operations
```typescript
// Get users to swipe
GET /api/users
Response: Profile[] (excluding already swiped)

// Record swipe
POST /api/swipe
Body: {
  liked_id: string,
  is_like: boolean
}
Response: {
  matched: boolean,
  match?: Match
}
```

## 5. Component Interfaces

### SwipeCard Component
```typescript
interface SwipeCardProps {
  profile: Profile;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  sharedInterests: string[];
}
```

### ProfileForm Component
```typescript
interface ProfileFormProps {
  initialData?: Partial<Profile>;
  onSubmit: (data: ProfileData) => Promise<void>;
}
```

### CameraCapture Component
```typescript
interface CameraCaptureProps {
  onCapture: (imageUrl: string) => void;
  onCancel: () => void;
}
```

## 6. Data Types

```typescript
interface Profile {
  id: string;
  discord_id: string;
  discord_username: string;
  display_name: string;
  discord_avatar_url?: string;
  profile_picture_url?: string;
  interests: string[];
  connection_preference: string;
  availability: string;
}

interface Like {
  id: string;
  swiper_id: string;
  liked_id: string;
  created_at: string;
}

interface Match {
  id: string;
  user1_id: string;
  user2_id: string;
  other_user?: Profile;
  created_at: string;
}
```

## 7. State Management

Using React Context for global state:
```typescript
interface AppState {
  user: Profile | null;
  isAuthenticated: boolean;
  currentDeck: Profile[];
  matches: Match[];
}
```

## 8. Security Considerations

1. **Row Level Security (RLS)** on all tables
2. Users can only update their own profile
3. Users can only see matches they're part of
4. Discord OAuth tokens stored securely in Supabase Auth

## 9. Performance Optimizations

1. **Pagination** for swipe deck (load 10 profiles at a time)
2. **Optimistic UI** for swipe actions
3. **Image optimization** using Next.js Image component
4. **Caching** profile data in session storage

## 10. Implementation Priority (55-min build)

### Phase 1 (15 min) - Setup & Auth
1. Initialize Supabase project
2. Set up Discord OAuth
3. Create database schema
4. Basic auth flow

### Phase 2 (15 min) - Profile Creation
1. Profile form component
2. Camera capture (basic)
3. Profile API endpoint
4. Interest selection UI

### Phase 3 (20 min) - Core Swiping
1. SwipeCard component with animations
2. SwipeDeck manager
3. Swipe API endpoints
4. Match detection logic

### Phase 4 (5 min) - Match & Deploy
1. Match notification UI
2. Discord handle display
3. Deploy to Vercel