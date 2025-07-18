'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import './globals.css'

export default function Home() {
  const router = useRouter()
  
  useEffect(() => {
    // Check if user already has a profile
    const existingProfile = localStorage.getItem('demo_profile')
    
    if (existingProfile) {
      // User has a profile, go straight to swipe
      router.push('/swipe')
    } else {
      // No profile, clear any old data and go to profile setup
      localStorage.removeItem('demo_profile')
      localStorage.removeItem('demo_user_id')
      localStorage.removeItem('temp_profile')
      localStorage.removeItem('demo_matches')
      localStorage.removeItem('matches')
      localStorage.removeItem('liked_profiles')
      
      // Redirect to profile setup
      router.push('/profile')
    }
  }, [router])

  return (
    <main className="fixed inset-0 flex items-center justify-center overflow-hidden fade-in" style={{ 
      backgroundColor: 'black',
      height: '100dvh',
      width: '100vw'
    }}>
      <div className="w-full max-w-md px-6 text-center">
        <h1 style={{ 
          fontSize: 'clamp(3.5rem, 9vw, 6rem)', 
          lineHeight: '0.9',
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontWeight: '400',
          color: 'white'
        }}>
          NS Friender
        </h1>
        <p className="mt-8 text-white/60">Loading...</p>
      </div>
    </main>
  )
}