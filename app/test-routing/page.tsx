'use client'

import { useRouter } from 'next/navigation'

export default function TestRouting() {
  const router = useRouter()

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Test Routing</h1>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        <button onClick={() => router.push('/')}>Go to Home</button>
        <button onClick={() => router.push('/profile')}>Go to Profile</button>
        <button onClick={() => window.location.href = '/profile'}>Window Location to Profile</button>
      </div>
    </div>
  )
}