'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { VoiceIntro } from '@/components/VoiceIntro'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { logger } from '@/lib/logger'
import '../globals.css'

const INTERESTS = [
  'AI & LLMs', 'Crypto & Web3', 'Startups & VC', 'The Burn',
  'Longevity & Bio-hacking', 'Filmmaking & Storytelling', 'Music & DJs',
  'Philosophy & Big Ideas', 'Foodie Culture', 'Poker & Game Nights'
]

const CONNECTION_PREFERENCES = [
  'Hit "The Burn" Together', 'A Co-working Session', 'Grab a Meal', 
  'A Coffee Chat', 'Whiteboard an Idea', 'Play Football / Hoops',
  'A Day Trip to Singapore', 'Practice a Pitch', 'Talk Philosophy & Ideas',
  'A Spontaneous Adventure'
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
  const [connectionPreferences, setConnectionPreferences] = useState<string[]>([])
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
    } else if (selectedInterests.length < 3) {
      setSelectedInterests([...selectedInterests, interest])
    }
  }

  const toggleConnectionPreference = (preference: string) => {
    if (connectionPreferences.includes(preference)) {
      setConnectionPreferences(connectionPreferences.filter(p => p !== preference))
    } else if (connectionPreferences.length < 3) {
      setConnectionPreferences([...connectionPreferences, preference])
    }
  }

  const handleContinueToVoice = () => {
    if (!displayName) {
      alert('Please enter your display name')
      return
    }
    if (selectedInterests.length !== 3) {
      alert('Please select exactly 3 interests')
      return
    }
    if (connectionPreferences.length !== 3) {
      alert('Please select exactly 3 ways to connect')
      return
    }
    if (!availability) {
      alert('Please select your availability')
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
        connection_preferences: connectionPreferences,
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
          <h1 className="text-center mb-12">Introduce Yourself</h1>
          
          <div className="space-y-8">
            <div className="text-center mb-8">
              <p className="text-xl font-light mb-4">
                Tell us about yourself in 60 seconds or less
              </p>
              <p className="text-sm opacity-60">
                Share what brings you here and what connections you&apos;re looking for
              </p>
            </div>

            <VoiceIntro onTranscriptionComplete={handleTranscription} />

            {voiceIntro && (
              <div className="dark-card slide-up">
                <h3 className="font-semibold mb-4">Your Introduction</h3>
                <p className="font-light italic opacity-80">
                  &ldquo;{voiceIntro}&rdquo;
                </p>
                <button 
                  onClick={() => setVoiceIntro('')}
                  className="dark-link mt-4 text-sm"
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
                {loading ? <LoadingSpinner size="sm" /> : 'Start Swiping'}
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
        <h1 className="text-center mb-12">Create Your Profile</h1>
        
        <div className="space-y-8">
          {/* Profile Picture */}
          <div className="dark-card">
            <h2 className="text-2xl mb-6">Profile Picture</h2>
            <div className="flex flex-col items-center space-y-6">
              {profilePicture ? (
                <div className="relative">
                  <img 
                    src={profilePicture} 
                    alt="Profile" 
                    className="w-40 h-40 rounded-full object-cover" 
                    style={{ border: '2px solid white' }}
                  />
                  <button
                    className="absolute -top-2 -right-2 rounded-full p-2 bg-white text-black hover:scale-110 transition-transform"
                    onClick={() => setProfilePicture(null)}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div 
                  className="w-40 h-40 rounded-full flex items-center justify-center"
                  style={{ border: '2px solid white' }}
                >
                  <Camera className="h-12 w-12 opacity-60" />
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
              <div className="space-y-4 mt-6">
                <video ref={videoRef} autoPlay className="w-full rounded-lg" />
                <canvas ref={canvasRef} className="hidden" />
                <div className="flex gap-4 justify-center">
                  <button onClick={capturePhoto} className="dark-button">Capture</button>
                  <button onClick={stopCamera} className="dark-button dark-button-outline">Cancel</button>
                </div>
              </div>
            )}
          </div>

          {/* Display Name */}
          <div className="dark-card">
            <h2 className="text-2xl mb-6">Display Name</h2>
            <input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="What should we call you?"
              className="dark-input"
              maxLength={50}
              required
              aria-label="Display name"
            />
          </div>

          {/* Interests */}
          <div className="dark-card">
            <h2 className="text-2xl mb-6">Interests <span className="text-lg font-light opacity-60">(Select 3)</span></h2>
            <div className="flex flex-wrap gap-3">
              {INTERESTS.map(interest => (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  disabled={!selectedInterests.includes(interest) && selectedInterests.length >= 3}
                  className={`dark-badge ${selectedInterests.includes(interest) ? 'selected' : ''}`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          {/* Connection Preference */}
          <div className="dark-card">
            <h2 className="text-2xl mb-6">How I Connect <span className="text-lg font-light opacity-60">(Select 3)</span></h2>
            <div className="flex flex-wrap gap-3">
              {CONNECTION_PREFERENCES.map(pref => (
                <button
                  key={pref}
                  onClick={() => toggleConnectionPreference(pref)}
                  disabled={!connectionPreferences.includes(pref) && connectionPreferences.length >= 3}
                  className={`dark-badge ${connectionPreferences.includes(pref) ? 'selected' : ''}`}
                >
                  {pref}
                </button>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div className="dark-card">
            <h2 className="text-2xl mb-6">Availability</h2>
            <div className="flex flex-wrap gap-3">
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
            disabled={loading || !displayName || selectedInterests.length !== 3 || connectionPreferences.length !== 3 || !availability}
            className="dark-button w-full"
          >
            {(() => {
              const needInterests = 3 - selectedInterests.length
              const needConnections = 3 - connectionPreferences.length
              
              if (needInterests > 0 && needConnections > 0) {
                return `Select ${needInterests} more ${needInterests === 1 ? 'interest' : 'interests'} and ${needConnections} more ${needConnections === 1 ? 'way' : 'ways'} to connect`
              } else if (needInterests > 0) {
                return `Select ${needInterests} more ${needInterests === 1 ? 'interest' : 'interests'}`
              } else if (needConnections > 0) {
                return `Select ${needConnections} more ${needConnections === 1 ? 'way' : 'ways'} to connect`
              } else if (!displayName) {
                return 'Enter your display name'
              } else if (!availability) {
                return 'Select your availability'
              }
              return 'Continue'
            })()}
          </button>
        </div>
      </div>
    </main>
  )
}