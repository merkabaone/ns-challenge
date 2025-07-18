'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, X, ArrowLeft, Save, LogOut } from 'lucide-react'
import { VoiceIntro } from '@/components/VoiceIntro'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { logger } from '@/lib/logger'
import { type Profile } from '@/lib/supabase'
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

export default function SettingsPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [profilePicture, setProfilePicture] = useState<string | null>(null)
  const [displayName, setDisplayName] = useState('')
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [connectionPreferences, setConnectionPreferences] = useState<string[]>([])
  const [availability, setAvailability] = useState('')
  const [voiceIntro, setVoiceIntro] = useState('')
  const [showCamera, setShowCamera] = useState(false)
  const [showVoiceUpdate, setShowVoiceUpdate] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const loadProfile = useCallback(async () => {
    try {
      const savedProfile = localStorage.getItem('demo_profile')
      if (!savedProfile) {
        router.push('/profile')
        return
      }

      const userProfile = JSON.parse(savedProfile) as Profile
      setProfile(userProfile)
      setProfilePicture(userProfile.profile_picture_url || null)
      setDisplayName(userProfile.display_name)
      setSelectedInterests(userProfile.interests || [])
      setConnectionPreferences((userProfile as any).connection_preferences || [])
      setAvailability(userProfile.availability)
      setVoiceIntro(userProfile.voice_intro || '')
    } catch (error) {
      logger.error('Error loading profile:', error)
      router.push('/profile')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

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

  const handleTranscription = (transcript: string) => {
    setVoiceIntro(transcript)
    setShowVoiceUpdate(false)
  }

  const handleSave = async () => {
    if (!profile) return

    setSaving(true)
    try {
      const updatedProfile = {
        ...profile,
        display_name: displayName,
        profile_picture_url: profilePicture,
        interests: selectedInterests,
        connection_preferences: connectionPreferences,
        availability: availability,
        voice_intro: voiceIntro,
        updated_at: new Date().toISOString()
      }

      localStorage.setItem('demo_profile', JSON.stringify(updatedProfile))
      alert('Profile updated successfully!')
      router.push('/matches')
    } catch (error) {
      logger.error('Error updating profile:', error)
      alert('Failed to update profile. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out? This will delete your profile data.')) {
      localStorage.removeItem('demo_profile')
      localStorage.removeItem('demo_user_id')
      localStorage.removeItem('demo_matches')
      localStorage.removeItem('swiped_profiles')
      router.push('/')
    }
  }

  if (loading) {
    return (
      <div className="dark-container flex items-center justify-center min-h-screen">
        <LoadingSpinner message="Loading profile..." size="lg" />
      </div>
    )
  }

  if (showVoiceUpdate) {
    return (
      <main className="dark-container fade-in min-h-screen">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => setShowVoiceUpdate(false)}
            className="dark-button dark-button-outline mb-6 inline-flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Settings
          </button>

          <h1 className="text-center mb-8">Update Your Introduction</h1>
          
          <div className="space-y-6">
            <div className="text-center mb-8">
              <p className="text-lg mb-4">
                Record a new voice introduction to tell others about yourself.
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
              </div>
            )}
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="dark-container fade-in min-h-screen pb-20">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <button
            onClick={() => router.push('/matches')}
            className="dark-button dark-button-outline inline-flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>
        
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
            <h2 className="text-lg font-semibold mb-4">My Interests (Select 3)</h2>
            <div className="flex flex-wrap gap-2">
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

          {/* Connection Preferences */}
          <div className="dark-card">
            <h2 className="text-lg font-semibold mb-4">How I Like to Connect (Select 3)</h2>
            <div className="flex flex-wrap gap-2">
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

          {/* Voice Introduction */}
          <div className="dark-card">
            <h2 className="text-lg font-semibold mb-4">Voice Introduction</h2>
            {voiceIntro ? (
              <div>
                <p className="italic mb-4" style={{ color: 'hsl(var(--muted-foreground))' }}>
                  &ldquo;{voiceIntro}&rdquo;
                </p>
                <button 
                  onClick={() => setShowVoiceUpdate(true)}
                  className="dark-link"
                >
                  Update Voice Introduction
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowVoiceUpdate(true)}
                className="dark-button"
              >
                Record Voice Introduction
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button 
              onClick={handleSave}
              disabled={saving || !displayName || selectedInterests.length === 0 || connectionPreferences.length === 0 || !availability}
              className="dark-button w-full flex items-center justify-center gap-2"
            >
              {saving ? <LoadingSpinner size="sm" /> : <Save className="h-5 w-5" />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>

            <button 
              onClick={handleLogout}
              className="dark-button dark-button-outline w-full flex items-center justify-center gap-2 text-red-500 border-red-500 hover:bg-red-500/10"
            >
              <LogOut className="h-5 w-5" />
              Log Out
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}