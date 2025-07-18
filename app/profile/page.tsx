'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Camera } from 'lucide-react'
import '../globals.css'

const INTERESTS = [
  '🤖 AI & Tech', '💰 Crypto', '🚀 Startups', '🔥 The Burn',
  '🧬 Longevity', '🎬 Filmmaking', '🎵 Music & DJs',
  '🧠 Philosophy', '🍜 Foodie', '🃏 Game Nights'
]

export default function ProfileSetup() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [displayName, setDisplayName] = useState('')
  const [selectedInterest, setSelectedInterest] = useState('')
  const [profileImage, setProfileImage] = useState<string | null>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleNext = () => {
    // Create simple profile and go straight to swipe
    const profile = {
      id: `user_${Date.now()}`,
      display_name: displayName || 'Demo User',
      discord_username: 'demo_user_123',
      interests: [selectedInterest || '🤖 AI & Tech'],
      connection_style: '☕ Coffee Chat',
      created_at: new Date().toISOString()
    }
    
    localStorage.setItem('demo_profile', JSON.stringify(profile))
    
    // Create demo matches
    const demoMatches = [
      {
        id: 'match_1',
        profile: {
          display_name: 'Sarah Chen',
          discord_username: 'sarahchen#4521'
        }
      },
      {
        id: 'match_2', 
        profile: {
          display_name: 'Marcus Rivera',
          discord_username: 'marcusbeats#7823'
        }
      }
    ]
    
    localStorage.setItem('demo_matches', JSON.stringify(demoMatches))
    
    // Go straight to swipe
    router.push('/swipe')
  }

  return (
    <main className="min-h-screen bg-black text-white fade-in">
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light mb-4">
            Welcome to NS Friender
          </h1>
          <p className="text-xl opacity-80">
            Let&apos;s set up your profile
          </p>
        </div>
        
        <div className="space-y-12">
          {/* Profile Photo */}
          <div className="text-center">
            <h2 className="text-2xl mb-6">Add your photo</h2>
            <div className="flex justify-center mb-6">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-32 h-32 rounded-full bg-white/10 border-2 border-dashed border-white/30 flex items-center justify-center cursor-pointer hover:border-white/60 transition-all overflow-hidden"
              >
                {profileImage ? (
                  <img 
                    src={profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera size={32} className="text-white/50" />
                )}
              </div>
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Name Input */}
          <div className="text-center">
            <h2 className="text-2xl mb-6">What&apos;s your name?</h2>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your name"
              className="w-full max-w-sm mx-auto block px-6 py-3 bg-white/10 border border-white/30 rounded-full text-center text-white placeholder-white/50 focus:outline-none focus:border-white/60 transition-all"
            />
          </div>

          {/* Interest Selection */}
          <div className="text-center">
            <h2 className="text-2xl mb-6">Pick one interest</h2>
            <div className="flex flex-wrap gap-3 justify-center">
              {INTERESTS.map(interest => (
                <button
                  key={interest}
                  onClick={() => setSelectedInterest(interest)}
                  className={`px-6 py-3 rounded-full border transition-all ${
                    selectedInterest === interest
                      ? 'bg-white text-black border-white'
                      : 'bg-transparent text-white border-white/30 hover:border-white/60'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {/* Next Button */}
          <div className="text-center pt-8">
            <button
              onClick={handleNext}
              className="px-16 py-6 rounded-full text-2xl font-bold transition-all bg-white text-black hover:scale-105 hover:shadow-2xl active:scale-95"
              style={{
                boxShadow: '0 12px 48px rgba(255, 255, 255, 0.3)',
                minWidth: '240px',
                letterSpacing: '0.05em'
              }}
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}