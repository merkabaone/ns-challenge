'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import '../globals.css'

export default function ViewProfiles() {
  const router = useRouter()
  const [submissions, setSubmissions] = useState<any[]>([])
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    // Get current user profile
    const profile = localStorage.getItem('demo_profile')
    if (profile) {
      setCurrentUser(JSON.parse(profile))
    }

    // Get all submissions
    const allSubmissions = JSON.parse(localStorage.getItem('all_submissions') || '[]')
    
    // Add some demo profiles if there aren't many submissions
    const demoProfiles = [
      {
        id: 'demo_1',
        display_name: 'Sarah Chen',
        interests: ['🤖 AI & Tech'],
        connection_preferences: ['💡 Whiteboard an Idea'],
        discord_username: 'sarah_chen_789',
        created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 min ago
      },
      {
        id: 'demo_2',
        display_name: 'Marcus Rivera',
        interests: ['🔥 The Burn'],
        connection_preferences: ['🔥 Hit "The Burn" Together'],
        discord_username: 'marcus_dj_456',
        created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString() // 45 min ago
      },
      {
        id: 'demo_3',
        display_name: 'Emily Zhang',
        interests: ['💰 Crypto'],
        connection_preferences: ['🍽️ Grab a Meal'],
        discord_username: 'emily_z_123',
        created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString() // 1 hour ago
      }
    ]
    
    // Combine submissions with demo profiles
    const combinedProfiles = [...demoProfiles, ...allSubmissions]
    
    // Sort by creation date (newest first) and remove current user
    const filteredProfiles = combinedProfiles
      .filter(p => p.id !== currentUser?.id)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    
    setSubmissions(filteredProfiles)
  }, [currentUser?.id])

  const handleStartOver = () => {
    // Clear current profile and start over
    localStorage.removeItem('demo_profile')
    localStorage.removeItem('demo_user_id')
    router.push('/')
  }

  const getTimeAgo = (timestamp: string) => {
    const minutes = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000 / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  return (
    <main className="min-h-screen bg-black text-white fade-in">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={handleStartOver}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Start Over</span>
          </button>
          <h1 className="text-2xl font-light">NS Friender</h1>
          <div className="w-20" /> {/* Spacer for centering */}
        </div>

        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-light mb-4">
            People Looking to Connect
          </h2>
          <p className="text-xl opacity-80">
            {submissions.length} {submissions.length === 1 ? 'person' : 'people'} ready to meet
          </p>
        </div>

        {/* Profiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {submissions.map((profile) => (
            <div
              key={profile.id}
              className="bg-white/5 backdrop-blur border border-white/20 rounded-2xl p-6 hover:border-white/40 transition-all"
            >
              {/* Profile Image or Avatar */}
              <div className="text-center mb-4">
                {profile.profile_picture_url ? (
                  <img 
                    src={profile.profile_picture_url} 
                    alt={profile.display_name}
                    className="w-20 h-20 rounded-full mx-auto object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-white/10 mx-auto flex items-center justify-center text-2xl">
                    {profile.display_name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Name */}
              <h3 className="text-xl font-medium text-center mb-2">
                {profile.display_name}
              </h3>

              {/* Time */}
              <p className="text-sm text-white/50 text-center mb-4">
                {getTimeAgo(profile.created_at)}
              </p>

              {/* Interest */}
              <div className="text-center mb-3">
                <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-sm">
                  {profile.interests[0]}
                </span>
              </div>

              {/* Connection Preference */}
              <p className="text-sm text-center text-white/70">
                Wants to: {profile.connection_preferences[0]}
              </p>

              {/* Discord Handle */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-xs text-white/50 text-center">
                  Discord: @{profile.discord_username}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Current User Info */}
        {currentUser && (
          <div className="mt-16 text-center">
            <div className="inline-block px-6 py-3 bg-white/5 rounded-full">
              <p className="text-sm">
                You&apos;re logged in as <strong>{currentUser.display_name}</strong>
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}