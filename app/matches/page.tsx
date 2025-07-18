'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Mail } from 'lucide-react'
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

export default function MatchesPage() {
  const router = useRouter()
  const [matches, setMatches] = useState<Profile[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const loadMatches = useCallback(async () => {
    try {
      // Load all profiles
      const response = await fetch('/profiles.json')
      const allProfiles = await response.json()
      
      // Get matched profile IDs from localStorage
      const matchedIds = JSON.parse(localStorage.getItem('matches') || '[]')
      
      // Filter profiles to only show matches
      const matchedProfiles = allProfiles.filter((profile: Profile) => 
        matchedIds.includes(profile.id)
      )
      
      setMatches(matchedProfiles)
    } catch (error) {
      console.error('Error loading matches:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadMatches()
  }, [loadMatches])

  const handleCopyDiscord = (username: string, matchId: string) => {
    navigator.clipboard.writeText(username)
    setCopiedId(matchId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const goBack = () => {
    router.push('/swipe')
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🔄</div>
          <p className="text-xl">Loading matches...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={goBack}
            className="p-2 hover:bg-white/10 rounded-full transition-all"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-3xl">Your Matches</h1>
        </div>

        {matches.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl opacity-60 mb-6">No matches yet</p>
            <p className="opacity-40">Keep swiping to find your connections!</p>
            <button
              onClick={goBack}
              className="mt-8 px-6 py-3 bg-white text-black rounded-full hover:scale-105 transition-all"
            >
              Back to Swiping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {matches.map((match) => (
              <div
                key={match.id}
                className="bg-white/5 border border-white/20 rounded-2xl p-6 hover:bg-white/10 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-5xl">{match.avatar}</div>
                    <div>
                      <h3 className="text-xl font-medium">{match.display_name}</h3>
                      <p className="opacity-60">@{match.discord_username}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleCopyDiscord(match.discord_username, match.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white hover:text-black rounded-full transition-all"
                  >
                    <Mail size={18} />
                    <span>
                      {copiedId === match.id ? 'Copied!' : 'Copy Discord'}
                    </span>
                  </button>
                </div>
              </div>
            ))}
            
            <div className="mt-8 p-6 bg-white/5 rounded-2xl text-center">
              <p className="opacity-60">
                Send a friend request on Discord to connect! 
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}