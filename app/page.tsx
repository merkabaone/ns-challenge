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

  const beginAction = () => {
    router.push('/profile')
  }

  return (
    <main className="dark-container fade-in flex flex-col items-center justify-center min-h-screen">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="mb-12" style={{ fontSize: 'clamp(4rem, 10vw, 8rem)', lineHeight: '0.9' }}>
          NS Friender
        </h1>
        
        <button 
          onClick={beginAction}
          className="group inline-flex items-center justify-center gap-4 text-black bg-white font-bold rounded-full transition-all hover:gap-6"
          style={{
            fontSize: '1.5rem',
            padding: '1.5rem 3rem',
            minWidth: '320px',
            letterSpacing: '0.05em'
          }}
        >
          BEGIN
          <span className="transition-transform group-hover:translate-x-1" style={{ fontSize: '1.75rem' }}>→</span>
        </button>
      </div>
    </main>
  )
}