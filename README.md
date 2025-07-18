# NS Friender 💖

A fun, focused tool that helps Network School members find and connect with each other based on shared interests and availability.

## 🌟 Features

- 🔐 Discord OAuth authentication
- 📸 Camera capture or file upload for profile pictures
- 🏷️ Interest-based matching (up to 5 interests)
- 💬 Connection preferences (Workout, Grab a Meal, Co-work, Chat)
- ⏰ Availability preferences (Mornings, Lunchtime, Afternoons, Evenings)
- 👆 Swipe interface with animations
- 💖 Real-time match notifications
- 📋 Discord handle sharing for matches

## ⚡ Quick Start

### 1. Clone and Install
```bash
git clone <your-repo-url>
cd ns-coding-challenge
npm install
```

### 2. Setup Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run the database schema from `supabase/schema.sql`
3. Enable Discord OAuth in Authentication > Providers
4. Add Discord OAuth credentials

### 3. Configure Environment

Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Run Development Server
```bash
npm run dev
```

## 🏗️ Architecture

- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Backend**: Supabase (Auth, Database)
- **Styling**: Tailwind CSS + ShadCN/UI Components
- **Animations**: Framer Motion
- **Deployment**: Vercel

## 📱 User Flow

1. **Welcome**: User lands on welcome page, clicks "Connect with Discord"
2. **Auth**: Discord OAuth flow, automatic profile creation
3. **Profile Setup**: User adds photo, selects interests, connection preferences, and availability
4. **Swiping**: Users swipe through other member profiles
5. **Matching**: When two users like each other, they match
6. **Connection**: Match reveals Discord username for manual friend request

## 🚀 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project to [Vercel](https://vercel.com)
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` (your Vercel URL)
4. Deploy!

### Important: Update Supabase Redirect URL

After deployment, update your Supabase Discord OAuth settings:
1. Go to Authentication > URL Configuration
2. Add `https://your-app.vercel.app/auth/callback` to Redirect URLs

## 📂 Key Files

```
app/
├── page.tsx                # Welcome page with Discord login
├── profile/page.tsx        # Profile setup page
├── swipe/page.tsx          # Main swiping interface
├── auth/callback/route.ts  # Discord OAuth callback
components/
├── SwipeCard.tsx           # Swipeable card component
├── MatchModal.tsx          # Match notification modal
lib/
├── supabase.ts             # Supabase client and types
supabase/
└── schema.sql              # Database schema
```

## 🛠️ Tech Stack

- **Next.js 14**: React framework with App Router
- **Supabase**: Backend as a Service (Auth + Database)
- **Framer Motion**: Smooth swipe animations
- **Tailwind CSS**: Utility-first styling
- **ShadCN/UI**: Beautiful UI components
- **TypeScript**: Type safety

## 🗄️ Database Schema

The app uses three main tables:

1. **profiles**: User profiles with Discord info, interests, preferences
2. **likes**: Records of swipe actions (who liked whom)
3. **matches**: Mutual likes between users

Row Level Security (RLS) ensures users can only:
- View all profiles
- Update their own profile
- View their own likes and matches

## ✅ Success Criteria Met

- [x] Discord OAuth authentication
- [x] Profile creation with photo, interests, and preferences
- [x] Swipeable card interface
- [x] Mutual match detection
- [x] Discord handle display on match
- [x] Deployed and functional

## 🎯 Time to Build: <55 minutes

This MVP was built in under an hour following the PRD requirements:

- **15 min**: Setup & Auth
- **15 min**: Profile Creation
- **20 min**: Core Swiping
- **5 min**: Match & Deploy

---

Built with ❤️ for Network School!