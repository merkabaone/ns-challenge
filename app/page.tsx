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
    <main className="fixed inset-0 flex items-center justify-center overflow-hidden fade-in" style={{ backgroundColor: 'black' }}>
      <div className="text-center">
        <h1 className="mb-12" style={{ 
          fontSize: 'clamp(3.5rem, 9vw, 7rem)', 
          lineHeight: '0.9',
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontWeight: '400',
          color: 'white'
        }}>
          NS Friender
        </h1>
        
        <button 
          onClick={beginAction}
          className="group inline-flex items-center justify-center gap-3 bg-white rounded-full transition-all hover:gap-4 hover:scale-105"
          style={{
            fontSize: '1.125rem',
            padding: '1.25rem 2.5rem',
            minWidth: '240px',
            letterSpacing: '0.08em',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", sans-serif',
            fontWeight: '600',
            color: 'black',
            textTransform: 'uppercase',
            boxShadow: '0 4px 20px rgba(255, 255, 255, 0.1)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 6px 30px rgba(255, 255, 255, 0.2)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(255, 255, 255, 0.1)'
          }}
        >
          Begin
          <span className="transition-transform group-hover:translate-x-1" style={{ fontSize: '1.25rem', color: 'black' }}>→</span>
        </button>
      </div>
    </main>
  )
}