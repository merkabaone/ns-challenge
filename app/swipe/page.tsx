'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Heart, X, MessageCircle } from 'lucide-react'
import '../globals.css'

// Mock profiles for demo
const DEMO_PROFILES = [
  {
    id: '1',
    display_name: 'Sarah Chen',
    interests: ['🤖 AI & Tech', '🚀 Startups', '☕ Coffee Chat'],
    connection_style: '💡 Brainstorm',
    bio: 'Building AI tools for creators. Love deep conversations about tech and philosophy over coffee.',
    avatar: '👩‍💻'
  },
  {
    id: '2',
    display_name: 'Marcus Rivera',
    interests: ['🔥 The Burn', '🎵 Music & DJs', '🧠 Philosophy'],
    connection_style: '🏃 Activities',
    bio: 'DJ and music producer. Always down for adventures and philosophical discussions.',
    avatar: '🎧'
  },
  {
    id: '3',
    display_name: 'Emily Zhang',
    interests: ['💰 Crypto', '🍜 Foodie', '🚀 Startups'],
    connection_style: '🍽️ Grab a Meal',
    bio: 'Web3 founder exploring the intersection of food and blockchain. Let\'s grab the best ramen in town!',
    avatar: '🍜'
  },
  {
    id: '4',
    display_name: 'Alex Thompson',
    interests: ['🧬 Longevity', '🏃 Activities', '🤖 AI & Tech'],
    connection_style: '💻 Co-working',
    bio: 'Biohacker and fitness enthusiast. Building longevity tech and always up for a workout.',
    avatar: '💪'
  },
  {
    id: '5',
    display_name: 'Priya Patel',
    interests: ['🎬 Filmmaking', '🧠 Philosophy', '☕ Coffee Chat'],
    connection_style: '🗣️ Deep Talks',
    bio: 'Documentary filmmaker exploring human stories. Love meaningful conversations.',
    avatar: '🎬'
  }
]

export default function SwipePage() {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [likedProfiles, setLikedProfiles] = useState<string[]>([])
  const [matches, setMatches] = useState<string[]>([])
  const [showMatch, setShowMatch] = useState(false)
  const [userProfile, setUserProfile] = useState<any>(null)

  useEffect(() => {
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
  }, [router])

  const currentProfile = DEMO_PROFILES[currentIndex]

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
    if (currentIndex < DEMO_PROFILES.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const goToMatches = () => {
    router.push('/matches')
  }

  if (!userProfile || !currentProfile) {
    return null
  }

  if (currentIndex >= DEMO_PROFILES.length) {
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
              className="w-16 h-16 rounded-full bg-white/10 hover:bg-red-500/20 flex items-center justify-center transition-all hover:scale-110"
            >
              <X size={28} className="text-red-400" />
            </button>
            
            <button
              onClick={() => handleSwipe(true)}
              className="w-16 h-16 rounded-full bg-white/10 hover:bg-green-500/20 flex items-center justify-center transition-all hover:scale-110"
            >
              <Heart size={28} className="text-green-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Match Notification */}
      {showMatch && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 fade-in">
          <div className="text-center">
            <h1 className="text-6xl mb-6">It&apos;s a Match! 🎉</h1>
            <p className="text-2xl opacity-80">
              You and {currentProfile.display_name} liked each other!
            </p>
          </div>
        </div>
      )}

      {/* Progress and Navigation */}
      <div className="absolute bottom-6 left-6 right-6">
        <div className="text-center mb-4">
          <p className="text-sm opacity-60">
            {currentIndex + 1} / {DEMO_PROFILES.length}
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