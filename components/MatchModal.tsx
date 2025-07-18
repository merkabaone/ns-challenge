'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Heart, Copy, Check } from 'lucide-react'
import { type Profile } from '@/lib/supabase'

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
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="flex justify-center mb-4"
            >
              <Heart className="h-16 w-16 text-pink-500 animate-pulse" fill="currentColor" />
            </motion.div>
            It&apos;s a Match! 🎉
          </DialogTitle>
          <DialogDescription className="text-center">
            You and {matchedProfile.display_name} liked each other!
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Profile picture */}
          <div className="flex justify-center">
            <img 
              src={matchedProfile.profile_picture_url || matchedProfile.discord_avatar_url} 
              alt={matchedProfile.display_name}
              className="w-24 h-24 rounded-full object-cover"
            />
          </div>

          {/* Discord handle */}
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Discord Username:
            </p>
            <div className="flex items-center justify-between">
              <p className="font-mono font-semibold">
                {matchedProfile.discord_username}
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={copyDiscordHandle}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>

          <p className="text-sm text-center text-gray-600 dark:text-gray-400">
            Add them as a friend on Discord to start chatting!
          </p>

          <Button onClick={onClose} className="w-full">
            Keep Swiping
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}