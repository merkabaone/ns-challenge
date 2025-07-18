'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import '../globals.css'

const INTERESTS = [
  '🤖 AI & Tech', '💰 Crypto', '🚀 Startups', '🔥 The Burn',
  '🧬 Longevity', '🎬 Filmmaking', '🎵 Music & DJs',
  '🧠 Philosophy', '🍜 Foodie', '🃏 Game Nights'
]

const WAYS_TO_CONNECT = [
  '☕ Coffee Chat', '💻 Co-working', '🍽️ Grab a Meal', 
  '🏃 Activities', '💡 Brainstorm', '🗣️ Deep Talks'
]

export default function ProfileSetup() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [discordHandle, setDiscordHandle] = useState('')
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [connectionStyle, setConnectionStyle] = useState('')

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest))
    } else if (selectedInterests.length < 3) {
      setSelectedInterests([...selectedInterests, interest])
    }
  }

  const handleFinish = async () => {
    if (!displayName || !discordHandle || selectedInterests.length === 0 || !connectionStyle) {
      return
    }

    setLoading(true)
    
    // Create profile
    const mockUserId = `user_${Date.now()}`
    const profile = {
      id: mockUserId,
      display_name: displayName,
      interests: selectedInterests,
      connection_style: connectionStyle,
      created_at: new Date().toISOString(),
      // Use provided Discord handle
      discord_id: `demo_${mockUserId}`,
      discord_username: discordHandle,
      discord_avatar_url: undefined,
      profile_picture_url: undefined,
      connection_preferences: [connectionStyle],
      availability: 'Afternoons',
      voice_intro: `Hi! I'm ${displayName}. I'm interested in ${selectedInterests.join(', ')}. I love connecting through ${connectionStyle}. Looking forward to meeting fellow Network School members!`,
      updated_at: new Date().toISOString()
    }
    
    localStorage.setItem('demo_profile', JSON.stringify(profile))
    localStorage.setItem('demo_user_id', mockUserId)
    
    // Create some demo matches for a better demo experience
    const demoMatches = [
      {
        id: 'match_1',
        profile: {
          id: 'demo_sarah',
          display_name: 'Sarah Chen',
          discord_username: 'sarah_chen_789',
          interests: ['🤖 AI & Tech', '🚀 Startups', '☕ Coffee Chat'],
          connection_style: '💡 Brainstorm',
          voice_intro: 'Hey! I\'m Sarah, building AI tools for creators. Love deep conversations about tech and philosophy over coffee.',
          connection_preferences: ['💡 Brainstorm', '☕ Coffee Chat'],
          availability: 'Mornings'
        },
        matchedAt: new Date().toISOString()
      },
      {
        id: 'match_2',
        profile: {
          id: 'demo_marcus',
          display_name: 'Marcus Rivera',
          discord_username: 'marcus_dj_456',
          interests: ['🔥 The Burn', '🎵 Music & DJs', '🧠 Philosophy'],
          connection_style: '🏃 Activities',
          voice_intro: 'What\'s up! I\'m Marcus, a DJ and music producer. Always down for adventures and philosophical discussions.',
          connection_preferences: ['🏃 Activities', '🗣️ Deep Talks'],
          availability: 'Evenings'
        },
        matchedAt: new Date().toISOString()
      }
    ]
    
    localStorage.setItem('demo_matches', JSON.stringify(demoMatches))
    
    // Go to swipe
    setTimeout(() => {
      router.push('/swipe')
    }, 500)
  }

  return (
    <main className="min-h-screen bg-black text-white fade-in">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light mb-4">
            Let&apos;s set up your profile
          </h1>
          <p className="text-xl opacity-80">
            Quick setup to start connecting
          </p>
        </div>
        
        <div className="space-y-12">
          {/* Name and Discord Input */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm opacity-80 mb-2">Your name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-6 py-4 bg-transparent border border-white/30 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-white transition-all"
                style={{
                  fontSize: '1rem',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", sans-serif',
                }}
              />
            </div>
            
            <div>
              <label className="block text-sm opacity-80 mb-2">Discord handle</label>
              <input
                type="text"
                value={discordHandle}
                onChange={(e) => setDiscordHandle(e.target.value)}
                placeholder="username#1234"
                className="w-full px-6 py-4 bg-transparent border border-white/30 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-white transition-all"
                style={{
                  fontSize: '1rem',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", sans-serif',
                }}
              />
            </div>
          </div>
          {/* Interests */}
          <div className="text-center">
            <h2 className="text-2xl mb-6">What excites you?</h2>
            <p className="text-sm opacity-60 mb-6">Pick up to 3</p>
            <div className="flex flex-wrap gap-3 justify-center">
              {INTERESTS.map(interest => (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`px-6 py-3 rounded-full border transition-all ${
                    selectedInterests.includes(interest)
                      ? 'bg-white text-black border-white'
                      : 'bg-transparent text-white border-white/30 hover:border-white/60'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {/* Connection Style */}
          <div className="text-center">
            <h2 className="text-2xl mb-6">How do you like to connect?</h2>
            <div className="flex flex-wrap gap-3 justify-center">
              {WAYS_TO_CONNECT.map(style => (
                <button
                  key={style}
                  onClick={() => setConnectionStyle(style)}
                  className={`px-6 py-3 rounded-full border transition-all ${
                    connectionStyle === style
                      ? 'bg-white text-black border-white'
                      : 'bg-transparent text-white border-white/30 hover:border-white/60'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="text-center pt-8">
            <button
              onClick={handleFinish}
              disabled={loading || !displayName || !discordHandle || selectedInterests.length === 0 || !connectionStyle}
              className={`px-12 py-4 rounded-full text-lg font-medium transition-all ${
                displayName && discordHandle && selectedInterests.length > 0 && connectionStyle
                  ? 'bg-white text-black hover:scale-105'
                  : 'bg-white/20 text-white/50 cursor-not-allowed'
              }`}
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Start Connecting →'}
            </button>
            
            {(!displayName || !discordHandle || selectedInterests.length === 0 || !connectionStyle) && (
              <p className="mt-4 text-sm opacity-60">
                {!displayName ? 'Enter your name' :
                 !discordHandle ? 'Enter your Discord handle' :
                 selectedInterests.length === 0 ? 'Select at least one interest' :
                 !connectionStyle ? 'Select how you like to connect' : ''}
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}