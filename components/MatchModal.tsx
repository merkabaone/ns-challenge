'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Heart, Copy, Check } from 'lucide-react'
import { type Profile } from '@/lib/supabase'
import '../app/globals.css'

interface MatchModalProps {
  matchedProfile: Profile
  onClose: () => void
}

export function MatchModal({ matchedProfile, onClose }: MatchModalProps) {
  const router = useRouter()
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Save match to localStorage
    const existingMatches = JSON.parse(localStorage.getItem('demo_matches') || '[]')
    const newMatch = {
      id: `match_${Date.now()}`,
      profile: matchedProfile,
      matchedAt: new Date().toISOString()
    }
    const updatedMatches = [...existingMatches, newMatch]
    localStorage.setItem('demo_matches', JSON.stringify(updatedMatches))
  }, [matchedProfile])

  const copyDiscordHandle = () => {
    navigator.clipboard.writeText(`${matchedProfile.discord_username}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90"
        onClick={onClose}
      />
      
      {/* Modal */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-black border border-white rounded-3xl p-8 relative w-full max-w-sm z-10 text-center"
      >
        <div className="text-6xl mb-4">🎉</div>
        
        <h2 className="text-3xl mb-4">Match!</h2>
        <p className="text-lg mb-6 opacity-80">
          You matched with<br/><strong>{matchedProfile.display_name}</strong>
        </p>
        
        <div className="space-y-4">
          {/* Simple contact info */}
          <div className="p-4 bg-white/10 rounded-2xl">
            <p className="text-sm opacity-60 mb-2">Discord:</p>
            <p className="font-mono text-sm">{matchedProfile.discord_username}</p>
          </div>

          <button onClick={onClose} className="w-full py-4 bg-white text-black rounded-full font-semibold hover:scale-105 transition-transform">
            Continue
          </button>
        </div>
      </motion.div>
    </div>
  )
}