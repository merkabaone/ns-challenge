'use client'

import { useRouter } from 'next/navigation'
import './globals.css'

export default function Home() {
  const router = useRouter()
  
  const handleBegin = () => {
    console.log('Begin button clicked')
    // Clear any existing demo profile to start fresh
    localStorage.removeItem('demo_profile')
    localStorage.removeItem('demo_user_id')
    localStorage.removeItem('temp_profile')
    localStorage.removeItem('demo_matches')
    
    // Navigate to profile setup
    console.log('Navigating to profile page')
    router.push('/profile')
  }

  return (
    <main className="fixed inset-0 flex items-center justify-center overflow-hidden fade-in" style={{ 
      backgroundColor: 'black',
      height: '100dvh', // Dynamic viewport height for mobile
      width: '100vw'
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
          className="px-20 py-8 bg-white text-black rounded-full transition-all hover:scale-105 hover:shadow-2xl active:scale-95"
          style={{
            fontSize: '2.25rem',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", sans-serif',
            fontWeight: '700',
            letterSpacing: '0.05em',
            boxShadow: '0 12px 48px rgba(255, 255, 255, 0.3)',
            minWidth: '320px'
          }}
        >
          Begin
        </button>
      </div>
    </main>
  )
}