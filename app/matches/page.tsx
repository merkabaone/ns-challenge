'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Heart, MessageCircle, Clock, MapPin, Sparkles, ArrowLeft, Users, Settings } from 'lucide-react'
import { type Profile } from '@/lib/supabase'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { logger } from '@/lib/logger'
import '../globals.css'

interface Match {
  id: string
  profile: Profile
  matchedAt: string
}

export default function MatchesPage() {
  const router = useRouter()
  const [matches, setMatches] = useState<Match[]>([])
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  const [currentUser, setCurrentUser] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMatches()
  }, [])

  const loadMatches = async () => {
    try {
      // Load demo profile from localStorage
      const savedProfile = localStorage.getItem('demo_profile')
      if (!savedProfile) {
        router.push('/profile')
        return
      }

      const userProfile = JSON.parse(savedProfile)
      setCurrentUser(userProfile)

      // Load matches from localStorage
      const savedMatches = JSON.parse(localStorage.getItem('demo_matches') || '[]')
      setMatches(savedMatches)
    } catch (error) {
      logger.error('Error loading matches:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="dark-container flex items-center justify-center min-h-screen">
        <LoadingSpinner message="Loading matches..." size="lg" />
      </div>
    )
  }

  if (selectedMatch) {
    const profile = selectedMatch.profile
    const sharedInterests = currentUser?.interests.filter(i => 
      profile.interests.includes(i)
    ) || []

    return (
      <main className="dark-container fade-in min-h-screen">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => setSelectedMatch(null)}
            className="dark-button dark-button-outline mb-6 inline-flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Matches
          </button>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Profile Image */}
            <div className="dark-card p-0 overflow-hidden h-[500px]">
              {profile.profile_picture_url || profile.discord_avatar_url ? (
                <img 
                  src={profile.profile_picture_url || profile.discord_avatar_url} 
                  alt={profile.display_name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div 
                  className="w-full h-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, hsl(var(--secondary)) 0%, hsl(var(--muted)) 100%)' }}
                >
                  <Heart className="h-24 w-24" style={{ color: 'hsl(var(--muted-foreground))' }} />
                </div>
              )}
            </div>

            {/* Profile Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{profile.display_name}</h1>
                <p className="text-lg" style={{ color: 'hsl(var(--muted-foreground))' }}>
                  @{profile.discord_username}
                </p>
              </div>

              {/* Connection Info */}
              <div className="dark-card space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Connection Details
                </h3>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" style={{ color: 'hsl(var(--muted-foreground))' }} />
                    <span>Prefers: {profile.connection_preference}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" style={{ color: 'hsl(var(--muted-foreground))' }} />
                    <span>Available: {profile.availability}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    alert(`Discord username: @${profile.discord_username}\n\nYou can now connect with ${profile.display_name} on Discord!`)
                  }}
                  className="dark-button w-full"
                >
                  Connect on Discord
                </button>
              </div>

              {/* Voice Introduction */}
              {profile.voice_intro && (
                <div className="dark-card">
                  <h3 className="font-semibold text-lg mb-3">Their Introduction</h3>
                  <p className="italic" style={{ color: 'hsl(var(--muted-foreground))' }}>
                    &ldquo;{profile.voice_intro}&rdquo;
                  </p>
                </div>
              )}

              {/* Interests */}
              <div className="dark-card">
                <h3 className="font-semibold text-lg mb-3">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map(interest => (
                    <span 
                      key={interest}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        sharedInterests.includes(interest) 
                          ? 'bg-white text-black' 
                          : 'dark-badge'
                      }`}
                    >
                      {sharedInterests.includes(interest) && (
                        <Sparkles className="inline h-3 w-3 mr-1" />
                      )}
                      {interest}
                    </span>
                  ))}
                </div>
                {sharedInterests.length > 0 && (
                  <p className="text-sm mt-3" style={{ color: 'hsl(var(--muted-foreground))' }}>
                    {sharedInterests.length} shared {sharedInterests.length === 1 ? 'interest' : 'interests'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="dark-container fade-in min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Your Matches</h1>
        </div>

        {matches.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 mx-auto mb-4" style={{ color: 'hsl(var(--muted-foreground))' }} />
            <h2 className="text-xl font-semibold mb-2">No matches yet</h2>
            <p style={{ color: 'hsl(var(--muted-foreground))' }}>
              Keep swiping to find your first match!
            </p>
            <button
              onClick={() => router.push('/swipe')}
              className="dark-button mt-6"
            >
              Start Swiping
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matches.map((match) => (
              <button
                key={match.id}
                onClick={() => setSelectedMatch(match)}
                className="dark-card hover:opacity-90 transition-opacity text-left"
              >
                <div className="flex items-start gap-4">
                  {/* Profile Picture */}
                  <div className="flex-shrink-0">
                    {match.profile.profile_picture_url || match.profile.discord_avatar_url ? (
                      <img 
                        src={match.profile.profile_picture_url || match.profile.discord_avatar_url} 
                        alt={match.profile.display_name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div 
                        className="w-16 h-16 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: 'hsl(var(--secondary))' }}
                      >
                        <Heart className="h-8 w-8" style={{ color: 'hsl(var(--muted-foreground))' }} />
                      </div>
                    )}
                  </div>

                  {/* Match Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg truncate">{match.profile.display_name}</h3>
                    <p className="text-sm truncate" style={{ color: 'hsl(var(--muted-foreground))' }}>
                      @{match.profile.discord_username}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Sparkles className="h-3 w-3" style={{ color: 'hsl(var(--primary))' }} />
                      <span className="text-xs" style={{ color: 'hsl(var(--primary))' }}>
                        Matched {new Date(match.matchedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 p-4" style={{ backgroundColor: 'hsl(var(--background))' }}>
          <div className="max-w-4xl mx-auto grid grid-cols-2 gap-4">
            <button
              onClick={() => router.push('/swipe')}
              className="dark-button flex items-center justify-center gap-2 py-4"
            >
              <Users className="h-5 w-5" />
              Find More Matches
            </button>
            <button
              onClick={() => router.push('/settings')}
              className="dark-button dark-button-outline flex items-center justify-center gap-2 py-4"
            >
              <Settings className="h-5 w-5" />
              Update Profile
            </button>
          </div>
        )}
      </div>
    </main>
  )
}