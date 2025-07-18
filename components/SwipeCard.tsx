'use client'

import { motion, useMotionValue, useTransform } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Clock, Sparkles } from 'lucide-react'
import { type Profile } from '@/lib/supabase'

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

  const handleDragEnd = (_: any, info: any) => {
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
      <Card className="relative overflow-hidden h-[600px]">
        {/* Background image or color */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70" />
        
        {/* Profile image */}
        {profile.profile_picture_url || profile.discord_avatar_url ? (
          <img 
            src={profile.profile_picture_url || profile.discord_avatar_url} 
            alt={profile.display_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400" />
        )}

        {/* Swipe indicators */}
        <motion.div
          className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold"
          style={{ opacity: useTransform(x, [-100, 0], [1, 0]) }}
        >
          PASS
        </motion.div>
        
        <motion.div
          className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full font-bold"
          style={{ opacity: useTransform(x, [0, 100], [0, 1]) }}
        >
          LIKE
        </motion.div>

        {/* Profile info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
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

          {/* Interests */}
          <div className="flex flex-wrap gap-2">
            {profile.interests.map(interest => (
              <Badge 
                key={interest}
                variant={sharedInterests.includes(interest) ? 'default' : 'secondary'}
                className={sharedInterests.includes(interest) ? 'bg-pink-500' : ''}
              >
                {sharedInterests.includes(interest) && (
                  <Sparkles className="h-3 w-3 mr-1" />
                )}
                {interest}
              </Badge>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}