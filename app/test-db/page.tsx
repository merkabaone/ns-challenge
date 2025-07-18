'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import '../globals.css'

export default function TestDatabasePage() {
  const [testResults, setTestResults] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testDatabaseConnection = async () => {
    setLoading(true)
    setTestResults([])
    
    try {
      addResult('Starting database tests...')
      
      // Test 1: Check if we can connect to Supabase
      addResult('Test 1: Checking Supabase connection...')
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError) {
        addResult(`❌ Auth check failed: ${authError.message}`)
      } else if (!user) {
        addResult('⚠️ No authenticated user found (this is normal for demo mode)')
      } else {
        addResult(`✅ Authenticated as user: ${user.id}`)
      }
      
      // Test 2: Try to read from profiles table
      addResult('Test 2: Reading from profiles table...')
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .limit(5)
      
      if (profilesError) {
        addResult(`❌ Failed to read profiles: ${profilesError.message}`)
      } else {
        addResult(`✅ Successfully read ${profiles?.length || 0} profiles`)
      }
      
      // Test 3: Test write operation (create a test profile)
      addResult('Test 3: Testing write operation...')
      const testProfile = {
        discord_id: `test_${Date.now()}`,
        discord_username: 'test_user#0000',
        display_name: 'Test User',
        interests: ['AI & LLMs', 'Startups & VC', 'Philosophy & Big Ideas'],
        connection_preferences: ['A Coffee Chat', 'Talk Philosophy & Ideas', 'Practice a Pitch'],
        availability: 'Mornings',
        voice_intro: 'This is a test profile'
      }
      
      const { data: insertData, error: insertError } = await supabase
        .from('profiles')
        .insert(testProfile)
        .select()
        .single()
      
      if (insertError) {
        addResult(`❌ Failed to insert test profile: ${insertError.message}`)
      } else {
        addResult(`✅ Successfully created test profile with ID: ${insertData?.id}`)
        
        // Clean up - delete the test profile
        if (insertData?.id) {
          const { error: deleteError } = await supabase
            .from('profiles')
            .delete()
            .eq('id', insertData.id)
          
          if (deleteError) {
            addResult(`⚠️ Failed to clean up test profile: ${deleteError.message}`)
          } else {
            addResult('✅ Test profile cleaned up successfully')
          }
        }
      }
      
      // Test 4: Check if likes table exists
      addResult('Test 4: Checking likes table...')
      const { error: likesError } = await supabase
        .from('likes')
        .select('*')
        .limit(1)
      
      if (likesError) {
        addResult(`❌ Failed to access likes table: ${likesError.message}`)
      } else {
        addResult('✅ Likes table is accessible')
      }
      
      // Test 5: Check if matches table exists
      addResult('Test 5: Checking matches table...')
      const { error: matchesError } = await supabase
        .from('matches')
        .select('*')
        .limit(1)
      
      if (matchesError) {
        addResult(`❌ Failed to access matches table: ${matchesError.message}`)
      } else {
        addResult('✅ Matches table is accessible')
      }
      
      addResult('Database tests completed!')
      
    } catch (error) {
      addResult(`❌ Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="dark-container fade-in min-h-screen">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Database Test Page</h1>
        
        <div className="dark-card mb-6">
          <p className="mb-4">
            This page tests the connection to Supabase and verifies that all database operations are working correctly.
          </p>
          
          <button
            onClick={testDatabaseConnection}
            disabled={loading}
            className="dark-button"
          >
            {loading ? 'Running Tests...' : 'Run Database Tests'}
          </button>
        </div>
        
        {testResults.length > 0 && (
          <div className="dark-card">
            <h2 className="text-xl font-semibold mb-4">Test Results:</h2>
            <div className="space-y-2 font-mono text-sm">
              {testResults.map((result, index) => (
                <div 
                  key={index} 
                  className={
                    result.includes('✅') ? 'text-green-400' :
                    result.includes('❌') ? 'text-red-400' :
                    result.includes('⚠️') ? 'text-yellow-400' :
                    ''
                  }
                >
                  {result}
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-6">
          <button
            onClick={() => window.history.back()}
            className="dark-button dark-button-outline"
          >
            Go Back
          </button>
        </div>
      </div>
    </main>
  )
}