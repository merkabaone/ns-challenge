'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import '../globals.css'

const WAYS_TO_CONNECT = [
  '🔥 Hit "The Burn" Together',
  '💻 A Co-working Session',
  '🍽️ Grab a Meal',
  '☕ A Coffee Chat',
  '💡 Whiteboard an Idea',
  '⚽ Play Football / Hoops',
  '🌴 A Day Trip to Singapore',
  '🎤 Practice a Pitch',
  '🧠 Talk Philosophy & Ideas',
  '🎲 A Spontaneous Adventure'
]

export default function ConnectionPreference() {
  const router = useRouter()
  const [selectedConnection, setSelectedConnection] = useState('')
  const [discordHandle, setDiscordHandle] = useState('')
  const [profileData, setProfileData] = useState<any>(null)

  useEffect(() => {
    // Get profile data from previous page
    const tempProfile = localStorage.getItem('temp_profile')
    if (!tempProfile) {
      router.push('/profile')
      return
    }
    setProfileData(JSON.parse(tempProfile))
  }, [router])

  const handleSubmit = () => {
    if (!selectedConnection || !discordHandle || !profileData) {
      return
    }

    // Create complete profile
    const mockUserId = `user_${Date.now()}`
    const profile = {
      id: mockUserId,
      display_name: profileData.displayName,
      interests: [profileData.selectedInterest],
      connection_preferences: [selectedConnection],
      profile_picture_url: profileData.profileImage,
      created_at: new Date().toISOString(),
      // Use provided Discord handle
      discord_id: `demo_${mockUserId}`,
      discord_username: discordHandle,
      discord_avatar_url: profileData.profileImage,
    }
    
    // Save profile to localStorage
    localStorage.setItem('demo_profile', JSON.stringify(profile))
    localStorage.setItem('demo_user_id', mockUserId)
    
    // Get existing submissions or create new array
    const existingSubmissions = JSON.parse(localStorage.getItem('all_submissions') || '[]')
    existingSubmissions.push(profile)
    localStorage.setItem('all_submissions', JSON.stringify(existingSubmissions))
    
    // Clean up temp data
    localStorage.removeItem('temp_profile')
    
    // Navigate to view other profiles
    router.push('/view')
  }

  if (!profileData) {
    return null
  }

  return (
    <main className="min-h-screen bg-black text-white fade-in">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light mb-4">
            How do you want to connect?
          </h1>
          <p className="text-xl opacity-80">
            Choose your preferred way to meet
          </p>
        </div>
        
        <div className="space-y-8">
          {/* Discord Handle Input */}
          <div>
            <h2 className="text-2xl mb-4 text-center">What&apos;s your Discord handle?</h2>
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

          {/* Connection Options */}
          <div>
            <h2 className="text-2xl mb-4 text-center">How do you like to connect?</h2>
            <div className="grid grid-cols-1 gap-3">
            {WAYS_TO_CONNECT.map(connection => (
              <button
                key={connection}
                onClick={() => setSelectedConnection(connection)}
                className={`px-6 py-4 rounded-2xl border text-left transition-all ${
                  selectedConnection === connection
                    ? 'bg-white text-black border-white'
                    : 'bg-transparent text-white border-white/30 hover:border-white/60'
                }`}
              >
                {connection}
              </button>
            ))}
          </div>

          {/* Submit Button */}
          <div className="text-center pt-8">
            <button
              onClick={handleSubmit}
              disabled={!selectedConnection}
              className={`px-12 py-4 rounded-full text-lg font-medium transition-all ${
                selectedConnection
                  ? 'bg-white text-black hover:scale-105'
                  : 'bg-white/20 text-white/50 cursor-not-allowed'
              }`}
            >
              Submit →
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}