'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Heart, X, Sparkles, MapPin, Clock } from 'lucide-react'
import { supabase, type Profile } from '@/lib/supabase'
import { SwipeCard } from '@/components/SwipeCard'
import { MatchModal } from '@/components/MatchModal'

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
      console.error('Error loading profiles:', error)
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
      console.error('Error recording swipe:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Sparkles className="h-8 w-8 animate-spin text-pink-500" />
      </div>
    )
  }

  const currentProfile = profiles[currentIndex]

  return (
    <main className="min-h-screen p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 flex flex-col items-center justify-center">
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-center">Find Your Match!</h1>
        
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
              <Button
                size="lg"
                variant="outline"
                className="rounded-full h-16 w-16 p-0"
                onClick={() => handleSwipe('left')}
              >
                <X className="h-8 w-8 text-red-500" />
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                className="rounded-full h-16 w-16 p-0"
                onClick={() => handleSwipe('right')}
              >
                <Heart className="h-8 w-8 text-green-500" fill="currentColor" />
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center space-y-4 py-12">
            <h2 className="text-xl font-semibold">No more profiles!</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Check back later for more Network School members
            </p>
            <Button onClick={() => router.push('/')}>
              Back to Home
            </Button>
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