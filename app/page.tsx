'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import './globals.css'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Check if user has a profile
    const savedProfile = localStorage.getItem('demo_profile')
    if (savedProfile) {
      // User is logged in, redirect to matches
      router.push('/matches')
    }
  }, [router])

  const handleBegin = () => {
    // Clear any existing demo profile to start fresh
    localStorage.removeItem('demo_profile')
    localStorage.removeItem('demo_user_id')
    localStorage.removeItem('temp_profile')
    router.push('/profile')
  }

  return (
    <main className="fixed inset-0 flex items-center justify-center overflow-hidden fade-in" style={{ 
      backgroundColor: 'black',
      height: '100dvh', // Dynamic viewport height for mobile
      width: '100vw',
      touchAction: 'none' // Prevent scrolling on touch devices
    }}>
      <div className="w-full max-w-md px-6 text-center" style={{ 
        maxHeight: '90vh',
        overflow: 'hidden'
      }}>
        <h1 className="mb-12" style={{ 
          fontSize: 'clamp(3.5rem, 9vw, 6rem)', 
          lineHeight: '0.9',
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontWeight: '400',
          color: 'white'
        }}>
          NS Friender
        </h1>
        
        <button 
          onClick={handleBegin}
          className="px-16 py-6 bg-white text-black rounded-full transition-all hover:scale-105 hover:shadow-2xl"
          style={{
            fontSize: '1.75rem',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", sans-serif',
            fontWeight: '600',
            letterSpacing: '0.1em',
            boxShadow: '0 8px 32px rgba(255, 255, 255, 0.2)',
            minWidth: '280px'
          }}
        >
          Begin
        </button>
      </div>
    </main>
  )
}