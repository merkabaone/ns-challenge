'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Heart, X, MessageCircle } from 'lucide-react'
import '../globals.css'

interface Profile {
  id: string
  display_name: string
  discord_username: string
  interests: string[]
  connection_style: string
  bio: string
  avatar: string
  age: number
  location: string
}

export default function SwipePage() {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [likedProfiles, setLikedProfiles] = useState<string[]>([])
  const [matches, setMatches] = useState<string[]>([])
  const [showMatch, setShowMatch] = useState(false)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load profiles from JSON file
        const response = await fetch('/profiles.json')
        const profilesData = await response.json()
        setProfiles(profilesData)

        // Get user profile
        const profile = localStorage.getItem('demo_profile')
        if (!profile) {
          router.push('/')
          return
        }
        setUserProfile(JSON.parse(profile))

        // Load existing likes and matches
        const savedLikes = localStorage.getItem('liked_profiles')
        const savedMatches = localStorage.getItem('matches')
        if (savedLikes) setLikedProfiles(JSON.parse(savedLikes))
        if (savedMatches) setMatches(JSON.parse(savedMatches))
      } catch (error) {
        console.error('Error loading profiles:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  const currentProfile = profiles[currentIndex]

  const handleSwipe = (isLike: boolean) => {
    if (!currentProfile) return

    if (isLike) {
      const newLikes = [...likedProfiles, currentProfile.id]
      setLikedProfiles(newLikes)
      localStorage.setItem('liked_profiles', JSON.stringify(newLikes))

      // Simulate random match (30% chance)
      if (Math.random() < 0.3) {
        const newMatches = [...matches, currentProfile.id]
        setMatches(newMatches)
        localStorage.setItem('matches', JSON.stringify(newMatches))
        setShowMatch(true)
        setTimeout(() => setShowMatch(false), 3000)
      }
    }

    // Move to next profile
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const goToMatches = () => {
    router.push('/matches')
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🔄</div>
          <p className="text-xl">Loading profiles...</p>
        </div>
      </main>
    )
  }

  if (!userProfile || !currentProfile) {
    return null
  }

  if (currentIndex >= profiles.length) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center px-6">
          <h1 className="text-4xl mb-6">All caught up! 🎉</h1>
          <p className="text-xl opacity-80 mb-8">
            You&apos;ve seen all available profiles
          </p>
          <button
            onClick={goToMatches}
            className="px-8 py-3 bg-white text-black rounded-full hover:scale-105 transition-all"
          >
            View Your Matches ({matches.length})
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-6 flex justify-between items-center">
        <h2 className="text-2xl font-light">NS Friender</h2>
        <button
          onClick={goToMatches}
          className="flex items-center gap-2 px-4 py-2 border border-white/30 rounded-full hover:bg-white hover:text-black transition-all"
        >
          <MessageCircle size={20} />
          <span>{matches.length}</span>
        </button>
      </div>

      {/* Profile Card */}
      <div className="flex items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-md">
          <div className="bg-white/5 backdrop-blur border border-white/20 rounded-3xl p-8 text-center">
            {/* Avatar */}
            <div className="text-8xl mb-6">{currentProfile.avatar}</div>
            
            {/* Name */}
            <h2 className="text-3xl mb-4">{currentProfile.display_name}</h2>
            
            {/* Bio */}
            <p className="text-lg opacity-80 mb-6 leading-relaxed">
              {currentProfile.bio}
            </p>
            
            {/* Interests */}
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              {currentProfile.interests.map((interest, i) => (
                <span key={i} className="px-4 py-2 bg-white/10 rounded-full text-sm">
                  {interest}
                </span>
              ))}
            </div>
            
            {/* Connection Style */}
            <div className="mb-8">
              <span className="text-lg opacity-60">Prefers to: </span>
              <span className="text-lg">{currentProfile.connection_style}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-8 mt-8">
            <button
              onClick={() => handleSwipe(false)}
              className="w-20 h-20 rounded-full bg-white/90 hover:bg-red-500 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
              style={{ boxShadow: '0 8px 32px rgba(255, 255, 255, 0.2)' }}
            >
              <X size={36} className="text-black hover:text-white" />
            </button>
            
            <button
              onClick={() => handleSwipe(true)}
              className="w-20 h-20 rounded-full bg-white/90 hover:bg-green-500 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
              style={{ boxShadow: '0 8px 32px rgba(255, 255, 255, 0.2)' }}
            >
              <Heart size={36} className="text-black hover:text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Match Notification */}
      {showMatch && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 fade-in">
          <div className="bg-black border border-white rounded-3xl p-8 max-w-sm mx-auto text-center">
            <h1 className="text-6xl mb-6">🎉</h1>
            <h2 className="text-3xl mb-4">It&apos;s a Match!</h2>
            <p className="text-xl mb-6">
              You and {currentProfile.display_name} liked each other!
            </p>
            <div className="p-4 bg-white/10 rounded-2xl mb-6">
              <p className="text-sm opacity-60 mb-2">Discord:</p>
              <p className="font-mono text-lg">{currentProfile.discord_username}</p>
            </div>
            <p className="text-sm opacity-60">Add them on Discord to connect!</p>
          </div>
        </div>
      )}

      {/* Progress and Navigation */}
      <div className="absolute bottom-6 left-6 right-6">
        <div className="text-center mb-4">
          <p className="text-sm opacity-60">
            {currentIndex + 1} / {profiles.length}
          </p>
        </div>
        <div className="flex justify-center">
          <button
            onClick={goToMatches}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full transition-all text-sm"
          >
            View Matches ({matches.length})
          </button>
        </div>
      </div>
    </main>
  )
}