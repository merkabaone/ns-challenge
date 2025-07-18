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
          className="px-12 py-4 bg-white text-black rounded-full transition-all hover:scale-105"
          style={{
            fontSize: '1.25rem',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", sans-serif',
            fontWeight: '600',
            letterSpacing: '0.08em',
            boxShadow: '0 4px 20px rgba(255, 255, 255, 0.1)'
          }}
        >
          Begin
        </button>
      </div>
    </main>
  )
}