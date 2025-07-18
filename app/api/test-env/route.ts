import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const requiredVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'WHISPER_API'
    ]
    
    const envStatus = requiredVars.map(varName => {
      const value = process.env[varName]
      const isPresent = !!(value && !value.includes('your-') && !value.includes('YOUR_'))
      
      return {
        name: varName,
        present: isPresent,
        hasValue: !!value,
        isPlaceholder: value ? (value.includes('your-') || value.includes('YOUR_')) : false,
        // Debug info (don't expose actual values in production)
        valuePreview: value ? `${value.substring(0, 4)}...` : 'undefined'
      }
    })
    
    const allPresent = envStatus.every(env => env.present)
    const missingVars = envStatus.filter(env => !env.present).map(env => env.name)
    
    // Debug: Log environment check
    console.log('Environment check:', {
      allPresent,
      missingVars,
      envStatus
    })
    
    return NextResponse.json({
      success: allPresent,
      message: allPresent 
        ? 'All required environment variables found'
        : `Missing or placeholder values: ${missingVars.join(', ')}`,
      variables: envStatus,
      // Debug info
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown'
    })
    
  } catch (error) {
    console.error('Error checking environment variables:', error)
    return NextResponse.json({
      success: false,
      message: 'Error checking environment variables',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}