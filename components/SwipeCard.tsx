'use client'

import { motion, useMotionValue, useTransform } from 'framer-motion'
import { MapPin, Clock, Sparkles } from 'lucide-react'
import { type Profile } from '@/lib/supabase'
import '../app/globals.css'

interface SwipeCardProps {
  profile: Profile
  onSwipeLeft: () => void
  onSwipeRight: () => void
  sharedInterests: string[]
}

export function SwipeCard({ profile, onSwipeLeft, onSwipeRight, sharedInterests }: SwipeCardProps) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-20, 20])
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0])

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: { offset: { x: number; y: number } }) => {
    if (info.offset.x > 100) {
      onSwipeRight()
    } else if (info.offset.x < -100) {
      onSwipeLeft()
    }
  }

  return (
    <motion.div
      className="absolute w-full"
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="bg-black border border-white rounded-3xl overflow-hidden h-[500px] p-6">
        <div className="h-full flex flex-col">
          {/* Name and emoji */}
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">👤</div>
            <h3 className="text-2xl font-bold">{profile.display_name}</h3>
          </div>
          
          {/* Simple bio */}
          <div className="flex-1 space-y-4">
            {profile.voice_intro && (
              <p className="text-center text-lg opacity-80 line-clamp-4">
                &ldquo;{profile.voice_intro.split('.')[0]}.&rdquo;
              </p>
            )}
            
            {/* Interests as simple tags */}
            <div className="flex flex-wrap gap-2 justify-center mt-6">
              {profile.interests.slice(0, 3).map(interest => (
                <span 
                  key={interest}
                  className="px-4 py-2 rounded-full border border-white/30 text-sm"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
          
          {/* Swipe hints */}
          <div className="flex justify-between text-xs opacity-40 mt-6">
            <span>← Pass</span>
            <span>Connect →</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}