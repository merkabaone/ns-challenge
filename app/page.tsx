'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import './globals.css'

export default function Home() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    // Check if user has a profile
    const savedProfile = localStorage.getItem('demo_profile')
    if (savedProfile) {
      // User is logged in, redirect to matches
      router.push('/matches')
    }
  }, [router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      alert('Please fill in all fields')
      return
    }
    
    // For demo, just save email and redirect
    localStorage.setItem('demo_email', email)
    router.push('/profile')
  }

  return (
    <main className="fixed inset-0 flex items-center justify-center overflow-hidden fade-in" style={{ backgroundColor: 'black' }}>
      <div className="w-full max-w-sm px-6">
        <h1 className="text-center mb-12" style={{ 
          fontSize: 'clamp(3rem, 8vw, 5rem)', 
          lineHeight: '0.9',
          fontFamily: 'Georgia, "Times New Roman", serif',
          fontWeight: '400',
          color: 'white'
        }}>
          NS Friender
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-6 py-4 bg-transparent border border-white rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-white"
              style={{
                fontSize: '1rem',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", sans-serif',
                fontWeight: '400',
                letterSpacing: '0.02em'
              }}
            />
          </div>
          
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-6 py-4 bg-transparent border border-white rounded-full text-white placeholder-gray-400 focus:outline-none focus:border-white"
              style={{
                fontSize: '1rem',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", sans-serif',
                fontWeight: '400',
                letterSpacing: '0.02em'
              }}
            />
          </div>
          
          <button 
            type="submit"
            className="w-full py-4 bg-white text-black rounded-full transition-all hover:scale-105"
            style={{
              fontSize: '1rem',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", sans-serif',
              fontWeight: '600',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              boxShadow: '0 4px 20px rgba(255, 255, 255, 0.1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 6px 30px rgba(255, 255, 255, 0.2)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(255, 255, 255, 0.1)'
            }}
          >
            Sign Up
          </button>
        </form>
      </div>
    </main>
  )
}