'use client'

import { useState, useRef } from 'react'
import { Mic, Square, Loader2 } from 'lucide-react'
import { transcribeAudio } from '@/lib/whisper'

interface VoiceIntroProps {
  onTranscriptionComplete: (transcript: string) => void
}

export function VoiceIntro({ onTranscriptionComplete }: VoiceIntroProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        const audioFile = new File([audioBlob], 'voice-intro.webm', { type: 'audio/webm' })
        
        setIsTranscribing(true)
        try {
          const result = await transcribeAudio(audioFile)
          if ('text' in result && result.text) {
            onTranscriptionComplete(result.text)
          } else if ('error' in result) {
            setError(result.error)
          }
        } catch (err) {
          setError('Failed to transcribe audio. Please try again.')
          console.error('Transcription error:', err)
        } finally {
          setIsTranscribing(false)
        }
      }

      mediaRecorder.start()
      setIsRecording(true)
      setError(null)
    } catch (err) {
      setError('Could not access microphone. Please check permissions.')
      console.error('Recording error:', err)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
      setIsRecording(false)
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        disabled={isTranscribing}
        className={`relative flex items-center justify-center w-32 h-32 rounded-full transition-all ${
          isRecording 
            ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
            : 'bg-white hover:opacity-90'
        } ${isTranscribing ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isTranscribing ? (
          <Loader2 className="h-12 w-12 text-black animate-spin" />
        ) : isRecording ? (
          <Square className="h-12 w-12 text-white" />
        ) : (
          <Mic className="h-12 w-12 text-black" />
        )}
      </button>

      <div className="text-center">
        {isRecording && (
          <p className="text-white font-semibold">Recording... Tap to stop</p>
        )}
        {isTranscribing && (
          <p className="text-gray-400">Transcribing your introduction...</p>
        )}
        {!isRecording && !isTranscribing && (
          <p className="text-gray-400">Tap the microphone to start recording</p>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-500/20 border border-red-500 rounded-lg">
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}
    </div>
  )
}