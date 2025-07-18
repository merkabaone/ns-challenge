'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, X, Sparkles } from 'lucide-react'
import { supabase, type Profile } from '@/lib/supabase'
import { SwipeCard } from '@/components/SwipeCard'
import { MatchModal } from '@/components/MatchModal'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { logger } from '@/lib/logger'
import '../globals.css'

export default function SwipePage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<Profile | null>(null)
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showMatch, setShowMatch] = useState(false)
  const [matchedProfile, setMatchedProfile] = useState<Profile | null>(null)

  useEffect(() => {
    loadUserAndProfiles()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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
  }, [currentIndex, profiles.length]) // eslint-disable-line react-hooks/exhaustive-deps

  const loadUserAndProfiles = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/')
        return
      }

      // Get current user profile
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('discord_id', user.id)
        .single()

      if (!userProfile) {
        router.push('/profile')
        return
      }

      setCurrentUser(userProfile)

      // Get all profiles except current user
      const { data: allProfiles } = await supabase
        .from('profiles')
        .select('*')
        .neq('discord_id', user.id)
        .not('display_name', 'is', null)

      if (allProfiles) {
        // Filter out profiles already swiped
        const { data: swipedProfiles } = await supabase
          .from('likes')
          .select('liked_id')
          .eq('swiper_id', userProfile.id)

        const swipedIds = swipedProfiles?.map(s => s.liked_id) || []
        const availableProfiles = allProfiles.filter(
          p => !swipedIds.includes(p.id)
        )

        setProfiles(availableProfiles)
      }
    } catch (error) {
      logger.error('Error loading profiles:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSwipe = async (direction: 'left' | 'right') => {
    if (!currentUser || currentIndex >= profiles.length) return

    const targetProfile = profiles[currentIndex]
    const isLike = direction === 'right'

    try {
      // Record the swipe
      await supabase.from('likes').insert({
        swiper_id: currentUser.id,
        liked_id: targetProfile.id
      })

      if (isLike) {
        // Check if they liked us back
        const { data: mutualLike } = await supabase
          .from('likes')
          .select('*')
          .eq('swiper_id', targetProfile.id)
          .eq('liked_id', currentUser.id)
          .single()

        if (mutualLike) {
          // Create a match!
          await supabase.from('matches').insert({
            user1_id: currentUser.id,
            user2_id: targetProfile.id
          })

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
    <main className="dark-container fade-in flex flex-col items-center justify-center">
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-center mb-2">Find Your Match!</h1>
        <p className="text-sm text-center mb-4" style={{ color: 'hsl(var(--muted-foreground))' }}>
          Swipe or use arrow keys (← →) to navigate
        </p>
        
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
            <p className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
              Tip: Use arrow keys (← →) to swipe
            </p>
            <button onClick={() => router.push('/')} className="dark-button">
              Back to Home
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