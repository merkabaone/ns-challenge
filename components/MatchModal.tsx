'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Copy, Check } from 'lucide-react'
import { type Profile } from '@/lib/supabase'
import '../app/globals.css'

interface MatchModalProps {
  matchedProfile: Profile
  onClose: () => void
}

export function MatchModal({ matchedProfile, onClose }: MatchModalProps) {
  const [copied, setCopied] = useState(false)

  const copyDiscordHandle = () => {
    navigator.clipboard.writeText(`${matchedProfile.discord_username}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="dark-card relative w-full max-w-md z-10"
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="flex justify-center mb-4"
          >
            <Heart className="h-16 w-16 animate-pulse" fill="#ec4899" style={{ color: '#ec4899' }} />
          </motion.div>
          
          <h2 className="text-2xl font-bold mb-2">It&apos;s a Match! 🎉</h2>
          <p className="mb-6" style={{ color: 'hsl(var(--muted-foreground))' }}>
            You and {matchedProfile.display_name} liked each other!
          </p>
        </div>
        
        <div className="space-y-4">
          {/* Profile picture */}
          <div className="flex justify-center">
            <img 
              src={matchedProfile.profile_picture_url || matchedProfile.discord_avatar_url} 
              alt={matchedProfile.display_name}
              className="w-24 h-24 rounded-full object-cover"
              style={{ border: '3px solid hsl(var(--border))' }}
            />
          </div>

          {/* Discord handle */}
          <div className="dark-card" style={{ backgroundColor: 'hsl(var(--secondary))' }}>
            <p className="text-sm mb-2" style={{ color: 'hsl(var(--muted-foreground))' }}>
              Discord Username:
            </p>
            <div className="flex items-center justify-between">
              <p className="font-mono font-semibold">
                {matchedProfile.discord_username}
              </p>
              <button
                className="dark-badge flex items-center gap-2"
                onClick={copyDiscordHandle}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>

          <p className="text-sm text-center" style={{ color: 'hsl(var(--muted-foreground))' }}>
            Add them as a friend on Discord to start chatting!
          </p>

          <button onClick={onClose} className="dark-button w-full">
            Keep Swiping
          </button>
        </div>
      </motion.div>
    </div>
  )
}