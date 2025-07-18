'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Camera, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const INTERESTS = [
  'AI', 'Health & Wellness', 'Building', 'Music', 'Exploring the City',
  'Sports', 'Reading', 'Gaming', 'Cooking', 'Art', 'Travel', 'Photography'
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
  const [showCamera, setShowCamera] = useState(false)
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
      console.error('Error accessing camera:', error)
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

  const handleSubmit = async () => {
    if (!displayName || selectedInterests.length === 0 || !connectionPreference || !availability) {
      alert('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/')
        return
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: displayName,
          profile_picture_url: profilePicture,
          interests: selectedInterests,
          connection_preference: connectionPreference,
          availability: availability,
          updated_at: new Date().toISOString()
        })
        .eq('discord_id', user.id)

      if (error) throw error

      router.push('/swipe')
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center">Complete Your Profile</h1>
        
        {/* Profile Picture */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4">
          <Label>Profile Picture</Label>
          <div className="flex flex-col items-center space-y-4">
            {profilePicture ? (
              <div className="relative">
                <img src={profilePicture} alt="Profile" className="w-32 h-32 rounded-full object-cover" />
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute -top-2 -right-2 rounded-full p-1"
                  onClick={() => setProfilePicture(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <Camera className="h-12 w-12 text-gray-400" />
              </div>
            )}
            
            {!showCamera && (
              <div className="flex gap-2">
                <Button onClick={startCamera} variant="outline">
                  <Camera className="h-4 w-4 mr-2" />
                  Take Photo
                </Button>
                <Button onClick={() => fileInputRef.current?.click()} variant="outline">
                  Upload Photo
                </Button>
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
            <div className="space-y-4">
              <video ref={videoRef} autoPlay className="w-full rounded-lg" />
              <canvas ref={canvasRef} className="hidden" />
              <div className="flex gap-2 justify-center">
                <Button onClick={capturePhoto}>Capture</Button>
                <Button onClick={stopCamera} variant="outline">Cancel</Button>
              </div>
            </div>
          )}
        </div>

        {/* Display Name */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4">
          <Label htmlFor="displayName">Display Name</Label>
          <Input
            id="displayName"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="How should we call you?"
          />
        </div>

        {/* Interests */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4">
          <Label>My Interests (Select up to 5)</Label>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map(interest => (
              <Button
                key={interest}
                variant={selectedInterests.includes(interest) ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleInterest(interest)}
                disabled={!selectedInterests.includes(interest) && selectedInterests.length >= 5}
              >
                {interest}
              </Button>
            ))}
          </div>
        </div>

        {/* Connection Preference */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4">
          <Label>How I Like to Connect</Label>
          <div className="flex flex-wrap gap-2">
            {CONNECTION_PREFERENCES.map(pref => (
              <Button
                key={pref}
                variant={connectionPreference === pref ? 'default' : 'outline'}
                size="sm"
                onClick={() => setConnectionPreference(pref)}
              >
                {pref}
              </Button>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4">
          <Label>When I&apos;m Free</Label>
          <div className="flex flex-wrap gap-2">
            {AVAILABILITY.map(time => (
              <Button
                key={time}
                variant={availability === time ? 'default' : 'outline'}
                size="sm"
                onClick={() => setAvailability(time)}
              >
                {time}
              </Button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <Button 
          onClick={handleSubmit} 
          disabled={loading}
          size="lg"
          className="w-full"
        >
          {loading ? 'Saving...' : 'Start Swiping!'}
        </Button>
      </div>
    </main>
  )
}