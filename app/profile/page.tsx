'use client'

import { useState, useEffect } from 'react'
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
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [connectionStyle, setConnectionStyle] = useState('')

  useEffect(() => {
    // Get name from home page
    const tempName = localStorage.getItem('temp_name')
    if (tempName) {
      setDisplayName(tempName)
      localStorage.removeItem('temp_name')
    }
  }, [])

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest))
    } else if (selectedInterests.length < 3) {
      setSelectedInterests([...selectedInterests, interest])
    }
  }

  const handleFinish = async () => {
    if (!displayName || selectedInterests.length === 0 || !connectionStyle) {
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
      created_at: new Date().toISOString()
    }
    
    localStorage.setItem('demo_profile', JSON.stringify(profile))
    localStorage.setItem('demo_user_id', mockUserId)
    
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
            Hi {displayName}! 👋
          </h1>
          <p className="text-xl opacity-80">
            Let&apos;s get you connected quickly
          </p>
        </div>
        
        <div className="space-y-12">
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
              disabled={loading || selectedInterests.length === 0 || !connectionStyle}
              className={`px-12 py-4 rounded-full text-lg font-medium transition-all ${
                selectedInterests.length > 0 && connectionStyle
                  ? 'bg-white text-black hover:scale-105'
                  : 'bg-white/20 text-white/50 cursor-not-allowed'
              }`}
            >
              {loading ? <LoadingSpinner size="sm" /> : 'Start Connecting →'}
            </button>
            
            {selectedInterests.length === 0 && (
              <p className="mt-4 text-sm opacity-60">
                Select at least one interest
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}