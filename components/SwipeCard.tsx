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
  const rotate = useTransform(x, [-200, 200], [-30, 30])
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
      className="absolute w-full cursor-grab active:cursor-grabbing"
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="dark-card relative overflow-hidden h-[600px] p-0">
        {/* Background image or color */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 z-10" />
        
        {/* Profile image */}
        {profile.profile_picture_url || profile.discord_avatar_url ? (
          <img 
            src={profile.profile_picture_url || profile.discord_avatar_url} 
            alt={profile.display_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, hsl(var(--secondary)) 0%, hsl(var(--muted)) 100%)' }} />
        )}

        {/* Swipe indicators */}
        <motion.div
          className="absolute top-4 left-4 px-4 py-2 rounded-full font-bold z-20"
          style={{ 
            opacity: useTransform(x, [-100, 0], [1, 0]),
            backgroundColor: '#ef4444',
            color: 'white'
          }}
        >
          PASS
        </motion.div>
        
        <motion.div
          className="absolute top-4 right-4 px-4 py-2 rounded-full font-bold z-20"
          style={{ 
            opacity: useTransform(x, [0, 100], [0, 1]),
            backgroundColor: '#10b981',
            color: 'white'
          }}
        >
          LIKE
        </motion.div>

        {/* Profile info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-20">
          <h3 className="text-3xl font-bold mb-2">{profile.display_name}</h3>
          
          <div className="flex items-center gap-4 mb-4 text-sm">
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {profile.connection_preference}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {profile.availability}
            </div>
          </div>

          {/* Voice Introduction */}
          {profile.voice_intro && (
            <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
              <p className="text-sm italic line-clamp-3">&ldquo;{profile.voice_intro}&rdquo;</p>
            </div>
          )}

          {/* Interests */}
          <div className="flex flex-wrap gap-2">
            {profile.interests.map(interest => (
              <span 
                key={interest}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                  sharedInterests.includes(interest) 
                    ? 'bg-white text-black' 
                    : 'bg-white/20 text-white backdrop-blur-sm'
                }`}
              >
                {sharedInterests.includes(interest) && (
                  <Sparkles className="inline h-3 w-3 mr-1" />
                )}
                {interest}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}