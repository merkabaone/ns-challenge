'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import './globals.css'

export default function Home() {
  const router = useRouter()
  const [name, setName] = useState('')

  useEffect(() => {
    // Check if user has a profile
    const savedProfile = localStorage.getItem('demo_profile')
    if (savedProfile) {
      // User is logged in, redirect to swipe
      router.push('/swipe')
    }
  }, [router])

  const handleGetStarted = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) {
      return
    }
    
    // Save name and go to quick profile setup
    localStorage.setItem('temp_name', name)
    router.push('/profile')
  }

  return (
    <main className="fixed inset-0 flex items-center justify-center overflow-hidden fade-in" style={{ 
      backgroundColor: 'black',
      height: '100vh',
      height: '100dvh', // Dynamic viewport height for mobile
      width: '100vw',
      touchAction: 'none' // Prevent scrolling on touch devices
    }}>
      <div className="w-full max-w-md px-6 text-center" style={{ 
        maxHeight: '90vh',
        overflow: 'hidden'
      }}>
        <h1 className="mb-4" style={{ 
          fontSize: 'clamp(3.5rem, 9vw, 6rem)', 
          lineHeight: '0.9',
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontWeight: '400',
          color: 'white'
        }}>
          NS Friender
        </h1>
        
        <p className="text-xl mb-12 opacity-80" style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", sans-serif',
          fontWeight: '300',
          letterSpacing: '0.02em'
        }}>
          Connect with Network School members instantly
        </p>
        
        <form onSubmit={handleGetStarted} className="space-y-6">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="What's your name?"
            className="w-full px-6 py-4 bg-transparent border border-white/30 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-white transition-all text-center"
            style={{
              fontSize: '1.125rem',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", sans-serif',
              fontWeight: '400',
              letterSpacing: '0.02em'
            }}
            autoFocus
          />
          
          <button 
            type="submit"
            disabled={!name.trim()}
            className={`w-full py-4 rounded-full transition-all ${
              name.trim() 
                ? 'bg-white text-black hover:scale-105 cursor-pointer' 
                : 'bg-white/20 text-white/50 cursor-not-allowed'
            }`}
            style={{
              fontSize: '1.125rem',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", sans-serif',
              fontWeight: '600',
              letterSpacing: '0.08em',
              boxShadow: name.trim() ? '0 4px 20px rgba(255, 255, 255, 0.1)' : 'none'
            }}
          >
            Get Started →
          </button>
        </form>
        
        <p className="mt-8 text-sm opacity-60">
          Join 100+ Network School members already connecting
        </p>
      </div>
    </main>
  )
}