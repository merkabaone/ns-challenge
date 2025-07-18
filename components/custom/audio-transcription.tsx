'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Mic, Upload, Play, Pause, Download, AlertCircle, CheckCircle } from 'lucide-react'
import { transcribeAudio, isAudioFile, formatDuration, type TranscriptionResult } from '@/lib/whisper'

export default function AudioTranscription() {
  const [isRecording, setIsRecording] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [transcriptionResult, setTranscriptionResult] = useState<TranscriptionResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [language, setLanguage] = useState<string>('auto')
  const [model, setModel] = useState<'whisper-1' | 'whisper-large' | 'whisper-small'>('whisper-1')
  const [progress, setProgress] = useState(0)
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (isAudioFile(file)) {
        setSelectedFile(file)
        setError(null)
      } else {
        setError('Please select a valid audio file (WAV, MP3, M4A, etc.)')
      }
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        const audioFile = new File([audioBlob], 'recording.wav', { type: 'audio/wav' })
        setSelectedFile(audioFile)
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setError(null)
    } catch (err) {
      setError('Failed to access microphone. Please check permissions.')
      console.error('Error accessing microphone:', err)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const handleTranscribe = async () => {
    if (!selectedFile) {
      setError('Please select or record an audio file first')
      return
    }

    setIsTranscribing(true)
    setError(null)
    setProgress(0)

    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 10, 90))
    }, 500)

    try {
      const options = {
        model,
        language: language === 'auto' ? undefined : language,
        response_format: 'verbose_json' as const,
      }

      const result = await transcribeAudio(selectedFile, options)
      
      clearInterval(progressInterval)
      setProgress(100)

      if ('error' in result) {
        setError(result.message)
        setTranscriptionResult(null)
      } else {
        setTranscriptionResult(result)
        setError(null)
      }
    } catch (err) {
      clearInterval(progressInterval)
      setError('Transcription failed. Please try again.')
      console.error('Transcription error:', err)
    } finally {
      setIsTranscribing(false)
      setTimeout(() => setProgress(0), 2000)
    }
  }

  const downloadTranscription = () => {
    if (!transcriptionResult) return

    const blob = new Blob([transcriptionResult.text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `transcription-${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mic className="h-5 w-5" />
          Audio Transcription
        </CardTitle>
        <CardDescription>
          Record or upload audio files to transcribe with Whisper AI
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Upload Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="audio-file">Upload Audio File</Label>
              <Input
                id="audio-file"
                type="file"
                accept="audio/*"
                onChange={handleFileSelect}
                ref={fileInputRef}
                className="mt-1"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isTranscribing}
              >
                {isRecording ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4 mr-2" />
                    Record Audio
                  </>
                )}
              </Button>
            </div>
          </div>

          {selectedFile && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Selected: {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Configuration Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="language">Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto-detect</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
                <SelectItem value="it">Italian</SelectItem>
                <SelectItem value="pt">Portuguese</SelectItem>
                <SelectItem value="zh">Chinese</SelectItem>
                <SelectItem value="ja">Japanese</SelectItem>
                <SelectItem value="ko">Korean</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="model">Model</Label>
            <Select value={model} onValueChange={(value: any) => setModel(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="whisper-1">Whisper-1 (Fast)</SelectItem>
                <SelectItem value="whisper-large">Whisper Large (Accurate)</SelectItem>
                <SelectItem value="whisper-small">Whisper Small (Balanced)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Transcribe Button */}
        <Button
          onClick={handleTranscribe}
          disabled={!selectedFile || isTranscribing}
          className="w-full"
        >
          {isTranscribing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Transcribing...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Transcribe Audio
            </>
          )}
        </Button>

        {/* Progress Bar */}
        {isTranscribing && (
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-muted-foreground text-center">
              Processing audio... {progress}%
            </p>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Results Section */}
        {transcriptionResult && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Transcription Result</h3>
              <Button variant="outline" size="sm" onClick={downloadTranscription}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
            
            <Textarea
              value={transcriptionResult.text}
              readOnly
              className="min-h-[120px]"
              placeholder="Transcription will appear here..."
            />
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {transcriptionResult.language && (
                <span>Language: {transcriptionResult.language}</span>
              )}
              {transcriptionResult.segments && (
                <span>Segments: {transcriptionResult.segments.length}</span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}