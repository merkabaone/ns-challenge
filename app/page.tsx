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
        <h1 className="mb-6" style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', lineHeight: '0.9' }}>
          NS Friender
        </h1>
        
        <p className="text-2xl mb-12" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: '400' }}>
          A Network School Community
        </p>
        
        <button 
          onClick={beginAction}
          className="group inline-flex items-center gap-3 px-12 py-5 text-xl font-semibold rounded-full transition-all hover:gap-4"
          style={{
            backgroundColor: 'white',
            color: 'black',
            minWidth: '280px'
          }}
        >
          BEGIN
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </button>
      </div>
    </main>
  )
}