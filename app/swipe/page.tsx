'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, X, Sparkles } from 'lucide-react'
import { type Profile } from '@/lib/supabase'
import { SwipeCard } from '@/components/SwipeCard'
import { MatchModal } from '@/components/MatchModal'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { logger } from '@/lib/logger'
import '../globals.css'

// Mock profiles for demo
const MOCK_PROFILES: Profile[] = [
  {
    id: '1',
    discord_id: 'demo_1',
    discord_username: 'alex_builder#1234',
    discord_avatar_url: undefined,
    display_name: 'Alex Builder',
    profile_picture_url: undefined,
    interests: ['AI & LLMs', 'Startups & VC', 'Philosophy & Big Ideas'],
    connection_preferences: ['A Co-working Session', 'Whiteboard an Idea', 'Practice a Pitch'],
    availability: 'Mornings',
    voice_intro: "Hey! I'm Alex, a product builder focused on AI tools. Currently working on a startup that helps creators automate their workflows. Would love to connect with other builders and exchange ideas over morning co-working sessions!",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '2',
    discord_id: 'demo_2',
    discord_username: 'maya_wellness#5678',
    discord_avatar_url: undefined,
    display_name: 'Maya',
    profile_picture_url: undefined,
    interests: ['The Burn', 'Longevity & Bio-hacking', 'Foodie Culture'],
    connection_preferences: ['Hit "The Burn" Together', 'Grab a Meal', 'Talk Philosophy & Ideas'],
    availability: 'Mornings',
    voice_intro: "Hi there! I'm Maya, passionate about holistic wellness and building mindful communities. I run a small wellness coaching business and love starting my day with a good workout. Looking to connect with like-minded people who value health and personal growth!",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '3',
    discord_id: 'demo_3',
    discord_username: 'sam_nomad#9012',
    discord_avatar_url: undefined,
    display_name: 'Sam Nomad',
    profile_picture_url: undefined,
    interests: ['Filmmaking & Storytelling', 'Music & DJs', 'Foodie Culture'],
    connection_preferences: ['A Spontaneous Adventure', 'A Day Trip to Singapore', 'Grab a Meal'],
    availability: 'Afternoons',
    voice_intro: "What's up! I'm Sam, a digital nomad and content creator. I've been traveling for 3 years now, documenting my journey and learning languages along the way. Always down to explore new restaurants and share travel stories!",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: '4',
    discord_id: 'demo_4',
    discord_username: 'jordan_crypto#3456',
    discord_avatar_url: undefined,
    display_name: 'Jordan',
    profile_picture_url: undefined,
    interests: ['Crypto & Web3', 'Poker & Game Nights', 'Philosophy & Big Ideas'],
    connection_preferences: ['A Coffee Chat', 'Play Football / Hoops', 'Talk Philosophy & Ideas'],
    availability: 'Evenings',
    voice_intro: "Hey everyone! I'm Jordan, deep into the Web3 space and building DeFi protocols. Also a huge gaming enthusiast and digital art collector. Love having deep conversations about the future of finance and technology. Hit me up for evening chats!",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

export default function SwipePage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<Profile | null>(null)
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showMatch, setShowMatch] = useState(false)
  const [matchedProfile, setMatchedProfile] = useState<Profile | null>(null)
  const [swipedProfiles, setSwipedProfiles] = useState<string[]>([])

  useEffect(() => {
    loadUserAndProfiles()
  }, [])

  const handleKeyPress = (event: KeyboardEvent) => {
    if (currentIndex >= profiles.length) return
    
    if (event.key === 'ArrowLeft') {
      handleSwipe('left')
    } else if (event.key === 'ArrowRight') {
      handleSwipe('right')
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentIndex, profiles.length])

  const loadUserAndProfiles = async () => {
    try {
      // Load demo profile from localStorage
      const savedProfile = localStorage.getItem('demo_profile')
      if (!savedProfile) {
        router.push('/profile')
        return
      }

      const userProfile = JSON.parse(savedProfile)
      setCurrentUser(userProfile)

      // Get swiped profiles from localStorage
      const swiped = JSON.parse(localStorage.getItem('swiped_profiles') || '[]')
      setSwipedProfiles(swiped)

      // Filter out already swiped profiles
      const availableProfiles = MOCK_PROFILES.filter(p => !swiped.includes(p.id))
      setProfiles(availableProfiles)
    } catch (error) {
      logger.error('Error loading profiles:', error)
      router.push('/profile')
    } finally {
      setLoading(false)
    }
  }

  const handleSwipe = async (direction: 'left' | 'right') => {
    if (!currentUser || currentIndex >= profiles.length) return

    const targetProfile = profiles[currentIndex]
    const isLike = direction === 'right'

    try {
      // Update swiped profiles in localStorage
      const newSwipedProfiles = [...swipedProfiles, targetProfile.id]
      setSwipedProfiles(newSwipedProfiles)
      localStorage.setItem('swiped_profiles', JSON.stringify(newSwipedProfiles))

      if (isLike) {
        // For demo, randomly decide if it's a match (30% chance)
        const isMatch = Math.random() < 0.3
        
        if (isMatch) {
          setMatchedProfile(targetProfile)
          setShowMatch(true)
        }
      }

      setCurrentIndex(currentIndex + 1)
    } catch (error) {
      logger.error('Error recording swipe:', error)
    }
  }

  if (loading) {
    return (
      <div className="dark-container flex items-center justify-center">
        <LoadingSpinner message="Loading profiles..." size="lg" />
      </div>
    )
  }

  const currentProfile = profiles[currentIndex]

  return (
    <main className="dark-container fade-in">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="mb-6">Discover Connections</h1>
          <p className="text-xl font-light opacity-60">
            Swipe right to connect, left to pass
          </p>
        </div>

        <div className="w-full max-w-md mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm opacity-60">← Pass</span>
              <span className="text-sm opacity-60">|</span>
              <span className="text-sm opacity-60">Connect →</span>
            </div>
            <button
              onClick={() => router.push('/matches')}
              className="dark-link text-sm uppercase tracking-wide"
            >
              View Matches
            </button>
          </div>
        
        {currentProfile ? (
          <>
            <div className="relative h-[600px]">
              <AnimatePresence>
                <SwipeCard
                  key={currentProfile.id}
                  profile={currentProfile}
                  onSwipeLeft={() => handleSwipe('left')}
                  onSwipeRight={() => handleSwipe('right')}
                  sharedInterests={
                    currentUser?.interests.filter(i => 
                      currentProfile.interests.includes(i)
                    ) || []
                  }
                />
              </AnimatePresence>
            </div>

            <div className="flex justify-center gap-8">
              <button
                className="dark-button dark-button-outline rounded-full h-16 w-16 p-0 flex items-center justify-center focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                onClick={() => handleSwipe('left')}
                aria-label="Pass on this profile"
                tabIndex={0}
              >
                <X className="h-8 w-8" style={{ color: '#ef4444' }} />
              </button>
              
              <button
                className="dark-button dark-button-outline rounded-full h-16 w-16 p-0 flex items-center justify-center focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                onClick={() => handleSwipe('right')}
                aria-label="Like this profile"
                tabIndex={0}
              >
                <Heart className="h-8 w-8" fill="#10b981" style={{ color: '#10b981' }} />
              </button>
            </div>
          </>
        ) : (
          <div className="text-center space-y-4 py-12">
            <h2 className="text-xl font-semibold">No more profiles!</h2>
            <p style={{ color: 'hsl(var(--muted-foreground))' }}>
              Check back later for more Network School members
            </p>
            <button 
              onClick={() => {
                // Reset swiped profiles for demo
                localStorage.removeItem('swiped_profiles')
                window.location.reload()
              }} 
              className="dark-button"
            >
              Start Over
            </button>
          </div>
        )}
      </div>

      {showMatch && matchedProfile && (
        <MatchModal
          matchedProfile={matchedProfile}
          onClose={() => {
            setShowMatch(false)
            setMatchedProfile(null)
          }}
        />
      )}
    </main>
  )
}