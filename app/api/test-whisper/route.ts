import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const WHISPER_API_KEY = process.env.WHISPER_API!
    
    if (!WHISPER_API_KEY) {
      return NextResponse.json({
        success: false,
        message: 'WHISPER_API key not configured',
      }, { status: 500 })
    }
    
    // Test the API endpoint with a basic health check
    const response = await fetch('https://api.lemonfox.ai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHISPER_API_KEY}`,
      },
      body: new FormData(), // Empty FormData to test authentication
    })
    
    const responseText = await response.text()
    
    return NextResponse.json({
      success: true,
      status: response.status,
      statusText: response.statusText,
      hasApiKey: !!WHISPER_API_KEY,
      apiKeyPreview: WHISPER_API_KEY ? `${WHISPER_API_KEY.substring(0, 8)}...` : 'none',
      responsePreview: responseText.substring(0, 200),
      endpoint: 'https://api.lemonfox.ai/v1/audio/transcriptions',
    })
    
  } catch (error) {
    console.error('Whisper API test error:', error)
    return NextResponse.json({
      success: false,
      message: 'Error testing Whisper API',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}