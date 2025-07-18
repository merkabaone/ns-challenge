// AssemblyAI Speech-to-Text integration
const ASSEMBLY_AI_KEY = process.env.ASSEMBLY_AI_KEY!

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

export interface TranscriptionError {
  error: string
  message: string
}

export async function transcribeAudio(
  audioFile: File,
  options: {
    language?: string
    speaker_labels?: boolean
    auto_chapters?: boolean
    summarization?: boolean
    sentiment_analysis?: boolean
    entity_detection?: boolean
  } = {}
): Promise<TranscriptionResult | TranscriptionError> {
  try {
    // Step 1: Upload audio file
    const uploadFormData = new FormData()
    uploadFormData.append('file', audioFile)
    
    const uploadResponse = await fetch('https://api.assemblyai.com/v2/upload', {
      method: 'POST',
      headers: {
        'Authorization': ASSEMBLY_AI_KEY,
      },
      body: uploadFormData,
    })

    if (!uploadResponse.ok) {
      throw new Error('Failed to upload audio file')
    }

    const { upload_url } = await uploadResponse.json()

    // Step 2: Request transcription
    const transcriptionRequest = {
      audio_url: upload_url,
      speaker_labels: options.speaker_labels || false,
      auto_chapters: options.auto_chapters || false,
      summarization: options.summarization || false,
      sentiment_analysis: options.sentiment_analysis || false,
      entity_detection: options.entity_detection || false,
      language_code: options.language || 'en_us',
    }

    const transcriptionResponse = await fetch('https://api.assemblyai.com/v2/transcript', {
      method: 'POST',
      headers: {
        'Authorization': ASSEMBLY_AI_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transcriptionRequest),
    })

    if (!transcriptionResponse.ok) {
      throw new Error('Failed to request transcription')
    }

    const { id } = await transcriptionResponse.json()

    // Step 3: Poll for results
    let transcript = null
    const maxAttempts = 60 // 5 minutes max
    let attempts = 0

    while (attempts < maxAttempts) {
      const pollingResponse = await fetch(`https://api.assemblyai.com/v2/transcript/${id}`, {
        headers: {
          'Authorization': ASSEMBLY_AI_KEY,
        },
      })

      if (!pollingResponse.ok) {
        throw new Error('Failed to get transcription status')
      }

      transcript = await pollingResponse.json()

      if (transcript.status === 'completed') {
        break
      } else if (transcript.status === 'error') {
        throw new Error(transcript.error || 'Transcription failed')
      }

      // Wait 5 seconds before polling again
      await new Promise(resolve => setTimeout(resolve, 5000))
      attempts++
    }

    if (transcript.status !== 'completed') {
      throw new Error('Transcription timed out')
    }

    // Format response
    const result: TranscriptionResult = {
      text: transcript.text,
      language: transcript.language_code,
      confidence: transcript.confidence,
    }

    if (transcript.utterances && options.speaker_labels) {
      result.segments = transcript.utterances.map((utterance: any) => ({
        text: utterance.text,
        start: utterance.start / 1000, // Convert to seconds
        end: utterance.end / 1000,
        speaker: utterance.speaker,
      }))
    }

    return result
    
  } catch (error) {
    console.error('AssemblyAI error:', error)
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
    speaker_labels?: boolean
    auto_chapters?: boolean
    summarization?: boolean
    sentiment_analysis?: boolean
    entity_detection?: boolean
  }
): Promise<TranscriptionResult | TranscriptionError> {
  try {
    // AssemblyAI can directly process URLs
    const transcriptionRequest = {
      audio_url: audioUrl,
      speaker_labels: options?.speaker_labels || false,
      auto_chapters: options?.auto_chapters || false,
      summarization: options?.summarization || false,
      sentiment_analysis: options?.sentiment_analysis || false,
      entity_detection: options?.entity_detection || false,
      language_code: options?.language || 'en_us',
    }

    const transcriptionResponse = await fetch('https://api.assemblyai.com/v2/transcript', {
      method: 'POST',
      headers: {
        'Authorization': ASSEMBLY_AI_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transcriptionRequest),
    })

    if (!transcriptionResponse.ok) {
      throw new Error('Failed to request transcription')
    }

    const { id } = await transcriptionResponse.json()

    // Poll for results (same as above)
    let transcript = null
    const maxAttempts = 60
    let attempts = 0

    while (attempts < maxAttempts) {
      const pollingResponse = await fetch(`https://api.assemblyai.com/v2/transcript/${id}`, {
        headers: {
          'Authorization': ASSEMBLY_AI_KEY,
        },
      })

      if (!pollingResponse.ok) {
        throw new Error('Failed to get transcription status')
      }

      transcript = await pollingResponse.json()

      if (transcript.status === 'completed') {
        break
      } else if (transcript.status === 'error') {
        throw new Error(transcript.error || 'Transcription failed')
      }

      await new Promise(resolve => setTimeout(resolve, 5000))
      attempts++
    }

    if (transcript.status !== 'completed') {
      throw new Error('Transcription timed out')
    }

    return {
      text: transcript.text,
      language: transcript.language_code,
      confidence: transcript.confidence,
    }
    
  } catch (error) {
    console.error('Error transcribing audio from URL:', error)
    return {
      error: 'fetch_failed',
      message: error instanceof Error ? error.message : 'Failed to process audio URL'
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