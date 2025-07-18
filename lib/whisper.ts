// Whisper API integration
const WHISPER_API_KEY = process.env.WHISPER_API!

export interface TranscriptionResult {
  text: string
  language?: string
  confidence?: number
  segments?: Array<{
    text: string
    start: number
    end: number
    speaker?: string
  }>
  speakers?: Array<{
    speaker: string
    start: number
    end: number
  }>
}

export interface WhisperError {
  error: string
  message: string
}

export async function transcribeAudio(
  audioFile: File,
  options: {
    language?: string
    model?: 'whisper-1' | 'whisper-large' | 'whisper-small'
    response_format?: 'json' | 'text' | 'srt' | 'verbose_json' | 'vtt'
    temperature?: number
    speaker_labels?: boolean
    prompt?: string
    translate?: boolean
  } = {}
): Promise<TranscriptionResult | WhisperError> {
  try {
    const formData = new FormData()
    formData.append('file', audioFile)
    formData.append('model', options.model || 'whisper-1')
    
    if (options.language) {
      formData.append('language', options.language)
    }
    
    if (options.response_format) {
      formData.append('response_format', options.response_format)
    }
    
    if (options.temperature !== undefined) {
      formData.append('temperature', options.temperature.toString())
    }
    
    if (options.speaker_labels) {
      formData.append('speaker_labels', 'true')
    }
    
    if (options.prompt) {
      formData.append('prompt', options.prompt)
    }
    
    if (options.translate) {
      formData.append('translate', 'true')
    }

    const response = await fetch('https://api.lemonfox.ai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHISPER_API_KEY}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error?.message || 'Transcription failed')
    }

    const result = await response.json()
    
    // Handle different response formats
    if (options.response_format === 'text') {
      return { text: result }
    }
    
    if (options.response_format === 'verbose_json') {
      return {
        text: result.text,
        language: result.language,
        segments: result.segments,
        speakers: result.speakers,
      }
    }
    
    return {
      text: result.text,
      language: result.language,
      speakers: result.speakers,
    }
    
  } catch (error) {
    console.error('Whisper API error:', error)
    return {
      error: 'transcription_failed',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

export async function transcribeAudioFromURL(
  audioUrl: string,
  options?: {
    language?: string
    model?: 'whisper-1' | 'whisper-large' | 'whisper-small'
    response_format?: 'json' | 'text' | 'srt' | 'verbose_json' | 'vtt'
    temperature?: number
    speaker_labels?: boolean
    prompt?: string
    translate?: boolean
  }
): Promise<TranscriptionResult | WhisperError> {
  try {
    // Fetch the audio file
    const audioResponse = await fetch(audioUrl)
    if (!audioResponse.ok) {
      throw new Error('Failed to fetch audio file')
    }
    
    const audioBlob = await audioResponse.blob()
    const audioFile = new File([audioBlob], 'audio.wav', { type: 'audio/wav' })
    
    return await transcribeAudio(audioFile, options)
  } catch (error) {
    console.error('Error transcribing audio from URL:', error)
    return {
      error: 'fetch_failed',
      message: error instanceof Error ? error.message : 'Failed to fetch audio'
    }
  }
}

// Utility function to check if file is supported audio format
export function isAudioFile(file: File): boolean {
  const supportedTypes = [
    'audio/wav',
    'audio/mpeg',
    'audio/mp3',
    'audio/mp4',
    'audio/m4a',
    'audio/webm',
    'audio/flac',
    'audio/ogg'
  ]
  
  return supportedTypes.includes(file.type)
}

// Utility function to format duration
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}