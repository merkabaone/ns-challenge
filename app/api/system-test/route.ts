import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const results = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    tests: {} as any
  }

  // Test 1: Environment Variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const speechApiKey = process.env.ASSEMBLY_AI_KEY || process.env.WHISPER_API

  results.tests.environment = {
    supabaseUrl: {
      present: !!supabaseUrl,
      value: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'missing'
    },
    supabaseKey: {
      present: !!supabaseKey,
      value: supabaseKey ? `${supabaseKey.substring(0, 20)}...` : 'missing'
    },
    speechApiKey: {
      present: !!speechApiKey,
      value: speechApiKey ? `${speechApiKey.substring(0, 10)}...` : 'missing'
    }
  }

  // Test 2: Supabase Connection
  try {
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey)
      
      // Simple auth check - this will work even with empty database
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        results.tests.supabase = {
          status: 'error',
          message: `Database connection failed: ${error.message}`
        }
      } else {
        results.tests.supabase = {
          status: 'success',
          message: 'Database connection successful'
        }
      }
    } else {
      results.tests.supabase = {
        status: 'error',
        message: 'Missing Supabase environment variables'
      }
    }
  } catch (error) {
    results.tests.supabase = {
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }
  }

  // Test 3: Speech API (just check if key exists)
  results.tests.speechApi = {
    status: speechApiKey ? 'success' : 'error',
    message: speechApiKey ? 'Speech API key found' : 'Speech API key missing'
  }

  return NextResponse.json(results)
}