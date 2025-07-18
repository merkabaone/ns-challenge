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
        isPlaceholder: value ? (value.includes('your-') || value.includes('YOUR_')) : false
      }
    })
    
    const allPresent = envStatus.every(env => env.present)
    const missingVars = envStatus.filter(env => !env.present).map(env => env.name)
    
    return NextResponse.json({
      success: allPresent,
      message: allPresent 
        ? 'All required environment variables found'
        : `Missing or placeholder values: ${missingVars.join(', ')}`,
      variables: envStatus
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