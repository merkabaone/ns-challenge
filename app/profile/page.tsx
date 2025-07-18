'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, X, Mic, Square } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { VoiceIntro } from '@/components/VoiceIntro'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { logger } from '@/lib/logger'
import '../globals.css'

const INTERESTS = [
  'AI & Machine Learning', 'Health & Wellness', 'Building Products', 'Music Production', 
  'Exploring Cities', 'Fitness & Sports', 'Reading & Writing', 'Gaming & Esports', 
  'Cooking & Nutrition', 'Art & Design', 'Travel & Adventure', 'Photography & Video',
  'Blockchain & Web3', 'Sustainability', 'Meditation & Mindfulness', 'Public Speaking',
  'Investing & Finance', 'Podcasting', 'Community Building', 'Personal Development',
  'Robotics', 'Biohacking', 'Language Learning', 'Dancing'
]

const CONNECTION_PREFERENCES = [
  'Workout (The Burn)', 'Grab a Meal', 'Co-work Session', 'Just Chat'
]

const AVAILABILITY = [
  'Mornings', 'Lunchtime', 'Afternoons', 'Evenings'
]

export default function ProfileSetup() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [profilePicture, setProfilePicture] = useState<string | null>(null)
  const [displayName, setDisplayName] = useState('')
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [connectionPreference, setConnectionPreference] = useState('')
  const [availability, setAvailability] = useState('')
  const [voiceIntro, setVoiceIntro] = useState('')
  const [showCamera, setShowCamera] = useState(false)
  const [showVoiceIntro, setShowVoiceIntro] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setShowCamera(true)
      }
    } catch (error) {
      logger.error('Error accessing camera:', error)
      alert('Could not access camera. Please use file upload instead.')
    }
  }

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d')
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth
        canvasRef.current.height = videoRef.current.videoHeight
        context.drawImage(videoRef.current, 0, 0)
        const dataUrl = canvasRef.current.toDataURL('image/jpeg')
        setProfilePicture(dataUrl)
        stopCamera()
      }
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
      setShowCamera(false)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfilePicture(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest))
    } else if (selectedInterests.length < 5) {
      setSelectedInterests([...selectedInterests, interest])
    }
  }

  const handleContinueToVoice = () => {
    if (!displayName || selectedInterests.length === 0 || !connectionPreference || !availability) {
      alert('Please fill in all fields before continuing')
      return
    }
    setShowVoiceIntro(true)
  }

  const handleTranscription = (transcript: string) => {
    setVoiceIntro(transcript)
  }

  const handleSubmit = async () => {
    if (!voiceIntro) {
      alert('Please record a voice introduction')
      return
    }

    setLoading(true)
    try {
      // For demo purposes, create a mock profile without authentication
      const mockUserId = `demo_${Date.now()}`
      
      // Store in localStorage for demo
      const profile = {
        id: mockUserId,
        discord_id: mockUserId,
        discord_username: `${displayName.toLowerCase().replace(/\s+/g, '_')}#0000`,
        discord_avatar_url: profilePicture,
        display_name: displayName,
        profile_picture_url: profilePicture,
        interests: selectedInterests,
        connection_preference: connectionPreference,
        availability: availability,
        voice_intro: voiceIntro,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      localStorage.setItem('demo_profile', JSON.stringify(profile))
      localStorage.setItem('demo_user_id', mockUserId)
      
      router.push('/swipe')
    } catch (error) {
      logger.error('Error creating profile:', error)
      alert('Failed to create profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (showVoiceIntro) {
    return (
      <main className="dark-container fade-in">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-center mb-8">Introduce Yourself</h1>
          
          <div className="space-y-6">
            <div className="text-center mb-8">
              <p className="text-lg mb-4">
                Tell us about yourself! Share what brings you to Network School, 
                what you&apos;re working on, and what kind of connections you&apos;re looking for.
              </p>
              <p className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
                Tip: Keep it under 60 seconds for the best experience
              </p>
            </div>

            <VoiceIntro onTranscriptionComplete={handleTranscription} />

            {voiceIntro && (
              <div className="dark-card">
                <h3 className="font-semibold mb-2">Your Introduction:</h3>
                <p className="italic" style={{ color: 'hsl(var(--muted-foreground))' }}>
                  &ldquo;{voiceIntro}&rdquo;
                </p>
                <button 
                  onClick={() => setVoiceIntro('')}
                  className="dark-link mt-2 text-sm"
                >
                  Re-record
                </button>
              </div>
            )}

            <div className="flex gap-4">
              <button 
                onClick={() => {
                  setShowVoiceIntro(false)
                  setVoiceIntro('')
                }}
                className="dark-button dark-button-outline flex-1"
              >
                Back
              </button>
              <button 
                onClick={handleSubmit} 
                disabled={loading || !voiceIntro}
                className="dark-button flex-1"
              >
                {loading ? <LoadingSpinner size="sm" /> : 'Start Swiping!'}
              </button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="dark-container fade-in">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-center mb-8">Complete Your Profile</h1>
        
        <div className="space-y-6">
          {/* Profile Picture */}
          <div className="dark-card">
            <h2 className="text-lg font-semibold mb-4">Profile Picture</h2>
            <div className="flex flex-col items-center space-y-4">
              {profilePicture ? (
                <div className="relative">
                  <img 
                    src={profilePicture} 
                    alt="Profile" 
                    className="w-32 h-32 rounded-full object-cover" 
                    style={{ border: '2px solid hsl(var(--border))' }}
                  />
                  <button
                    className="absolute -top-2 -right-2 rounded-full p-1.5 transition-opacity hover:opacity-80"
                    style={{ 
                      backgroundColor: 'hsl(var(--primary))', 
                      color: 'hsl(var(--primary-foreground))'
                    }}
                    onClick={() => setProfilePicture(null)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div 
                  className="w-32 h-32 rounded-full flex items-center justify-center"
                  style={{ 
                    backgroundColor: 'hsl(var(--secondary))', 
                    border: '2px solid hsl(var(--border))' 
                  }}
                >
                  <Camera className="h-12 w-12" style={{ color: 'hsl(var(--muted-foreground))' }} />
                </div>
              )}
              
              {!showCamera && (
                <div className="flex gap-4">
                  <button onClick={startCamera} className="dark-link">
                    Take Photo
                  </button>
                  <button onClick={() => fileInputRef.current?.click()} className="dark-link">
                    Upload Photo
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              )}
            </div>

            {showCamera && (
              <div className="space-y-4 mt-4">
                <video ref={videoRef} autoPlay className="w-full rounded-lg" />
                <canvas ref={canvasRef} className="hidden" />
                <div className="flex gap-4 justify-center">
                  <button onClick={capturePhoto} className="dark-link">Capture</button>
                  <button onClick={stopCamera} className="dark-link">Cancel</button>
                </div>
              </div>
            )}
          </div>

          {/* Display Name */}
          <div className="dark-card">
            <h2 className="text-lg font-semibold mb-4">Display Name</h2>
            <input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="How should we call you?"
              className="dark-input"
              maxLength={50}
              required
              aria-label="Display name"
            />
          </div>

          {/* Interests */}
          <div className="dark-card">
            <h2 className="text-lg font-semibold mb-4">My Interests (Select up to 5)</h2>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map(interest => (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  disabled={!selectedInterests.includes(interest) && selectedInterests.length >= 5}
                  className={`dark-badge ${selectedInterests.includes(interest) ? 'selected' : ''}`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {/* Connection Preference */}
          <div className="dark-card">
            <h2 className="text-lg font-semibold mb-4">How I Like to Connect</h2>
            <div className="flex flex-wrap gap-2">
              {CONNECTION_PREFERENCES.map(pref => (
                <button
                  key={pref}
                  onClick={() => setConnectionPreference(pref)}
                  className={`dark-badge ${connectionPreference === pref ? 'selected' : ''}`}
                >
                  {pref}
                </button>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="dark-card">
            <h2 className="text-lg font-semibold mb-4">When I&apos;m Free</h2>
            <div className="flex flex-wrap gap-2">
              {AVAILABILITY.map(time => (
                <button
                  key={time}
                  onClick={() => setAvailability(time)}
                  className={`dark-badge ${availability === time ? 'selected' : ''}`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          {/* Continue Button */}
          <button 
            onClick={handleContinueToVoice} 
            disabled={loading || !displayName || selectedInterests.length === 0 || !connectionPreference || !availability}
            className="dark-button w-full"
          >
            Continue to Voice Introduction
          </button>
        </div>
      </div>
    </main>
  )
}