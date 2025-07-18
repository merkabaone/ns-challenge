'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Database, Mic, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import { testConnection } from '@/lib/supabase/database'
import AudioTranscription from '@/components/custom/audio-transcription'

interface TestResult {
  name: string
  status: 'pending' | 'success' | 'error'
  message: string
  duration?: number
}

export default function TestPage() {
  const [tests, setTests] = useState<TestResult[]>([
    { name: 'Supabase Connection', status: 'pending', message: 'Not tested yet' },
    { name: 'Whisper API Key', status: 'pending', message: 'Not tested yet' },
    { name: 'Environment Variables', status: 'pending', message: 'Not tested yet' },
  ])

  const updateTest = (name: string, status: TestResult['status'], message: string, duration?: number) => {
    setTests(prev => prev.map(test => 
      test.name === name ? { ...test, status, message, duration } : test
    ))
  }

  const runSupabaseTest = async () => {
    updateTest('Supabase Connection', 'pending', 'Testing connection...')
    const startTime = Date.now()
    
    try {
      const result = await testConnection()
      const duration = Date.now() - startTime
      
      if (result.success) {
        updateTest('Supabase Connection', 'success', result.message, duration)
      } else {
        updateTest('Supabase Connection', 'error', result.error || 'Connection failed', duration)
      }
    } catch (error) {
      const duration = Date.now() - startTime
      updateTest('Supabase Connection', 'error', 'Connection test failed', duration)
    }
  }

  const runWhisperTest = async () => {
    updateTest('Whisper API Key', 'pending', 'Testing API key...')
    const startTime = Date.now()
    
    try {
      const response = await fetch('/api/test-env')
      const result = await response.json()
      const duration = Date.now() - startTime
      
      console.log('API Response:', result) // Debug log
      
      const whisperVar = result.variables?.find((v: any) => v.name === 'WHISPER_API')
      
      if (whisperVar?.present) {
        updateTest('Whisper API Key', 'success', 'API key found in environment', duration)
      } else if (whisperVar?.hasValue && whisperVar?.isPlaceholder) {
        updateTest('Whisper API Key', 'error', `WHISPER_API contains placeholder value (${whisperVar.valuePreview})`, duration)
      } else {
        updateTest('Whisper API Key', 'error', `WHISPER_API not found in environment variables (${whisperVar?.valuePreview || 'undefined'})`, duration)
      }
    } catch (error) {
      const duration = Date.now() - startTime
      updateTest('Whisper API Key', 'error', `Error checking API key: ${error}`, duration)
    }
  }

  const runEnvTest = async () => {
    updateTest('Environment Variables', 'pending', 'Checking environment...')
    const startTime = Date.now()
    
    try {
      const response = await fetch('/api/test-env')
      const result = await response.json()
      const duration = Date.now() - startTime
      
      if (result.success) {
        updateTest('Environment Variables', 'success', result.message, duration)
      } else {
        updateTest('Environment Variables', 'error', result.message, duration)
      }
    } catch (error) {
      const duration = Date.now() - startTime
      updateTest('Environment Variables', 'error', 'Error checking environment variables', duration)
    }
  }

  const runAllTests = async () => {
    await runEnvTest()
    await runSupabaseTest()
    await runWhisperTest()
  }

  useEffect(() => {
    // Run tests automatically on page load
    runAllTests()
  }, [])

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pending':
        return <Loader2 className="h-4 w-4 animate-spin" />
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Testing...</Badge>
      case 'success':
        return <Badge variant="default" className="bg-green-500">✓ Passed</Badge>
      case 'error':
        return <Badge variant="destructive">✗ Failed</Badge>
    }
  }

  const allTestsPassed = tests.every(test => test.status === 'success')
  const hasFailedTests = tests.some(test => test.status === 'error')

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">NS Challenge - System Test</h1>
        <p className="text-muted-foreground">
          Verify your Supabase and Whisper API integration
        </p>
      </div>

      {/* Test Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            System Tests
          </CardTitle>
          <CardDescription>
            Testing database connection and API integrations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {tests.map((test, index) => (
            <div key={test.name} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {getStatusIcon(test.status)}
                <div>
                  <div className="font-medium">{test.name}</div>
                  <div className="text-sm text-muted-foreground">{test.message}</div>
                  {test.duration && (
                    <div className="text-xs text-muted-foreground">
                      Completed in {test.duration}ms
                    </div>
                  )}
                </div>
              </div>
              {getStatusBadge(test.status)}
            </div>
          ))}
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <Button onClick={runAllTests} variant="outline">
              Run All Tests
            </Button>
            <div className="text-sm text-muted-foreground">
              {allTestsPassed ? '✅ All systems operational' : 
               hasFailedTests ? '❌ Some tests failed' : '🔄 Tests in progress'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Alert */}
      {allTestsPassed && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            🎉 All tests passed! Your system is ready for competition development.
          </AlertDescription>
        </Alert>
      )}

      {hasFailedTests && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Some tests failed. Please check your environment variables and database connection.
          </AlertDescription>
        </Alert>
      )}

      {/* Audio Transcription Demo */}
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Audio Transcription Demo</h2>
          <p className="text-muted-foreground">
            Test your Whisper API integration with live audio transcription
          </p>
        </div>
        
        <AudioTranscription />
      </div>
    </div>
  )
}