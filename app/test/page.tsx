'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { 
  Database, 
  Mic, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Globe, 
  Key,
  RefreshCw 
} from 'lucide-react'

interface TestResult {
  name: string
  status: 'pending' | 'success' | 'error' | 'warning'
  message: string
  details?: string
  duration?: number
}

export default function SystemTestPage() {
  const [loading, setLoading] = useState(false)
  const [tests, setTests] = useState<TestResult[]>([
    { name: 'Client Environment', status: 'pending', message: 'Checking browser environment...' },
    { name: 'Server Environment', status: 'pending', message: 'Checking server environment...' },
    { name: 'Database Connection', status: 'pending', message: 'Testing database connection...' },
    { name: 'API Configuration', status: 'pending', message: 'Verifying API keys...' },
  ])

  const updateTest = (name: string, status: TestResult['status'], message: string, details?: string, duration?: number) => {
    setTests(prev => prev.map(test => 
      test.name === name ? { ...test, status, message, details, duration } : test
    ))
  }

  const runClientTests = () => {
    const startTime = Date.now()
    
    // Check client-side environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (supabaseUrl && supabaseKey) {
      updateTest(
        'Client Environment', 
        'success', 
        'All client environment variables found',
        `Supabase URL: ${supabaseUrl.substring(0, 30)}...
Supabase Key: ${supabaseKey.substring(0, 30)}...`,
        Date.now() - startTime
      )
    } else {
      const missing = []
      if (!supabaseUrl) missing.push('NEXT_PUBLIC_SUPABASE_URL')
      if (!supabaseKey) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY')
      
      updateTest(
        'Client Environment', 
        'error', 
        `Missing client environment variables: ${missing.join(', ')}`,
        'These variables should be available in the browser. Check your deployment configuration.',
        Date.now() - startTime
      )
    }
  }

  const runServerTests = async () => {
    const startTime = Date.now()
    
    try {
      const response = await fetch('/api/system-test')
      const data = await response.json()
      const duration = Date.now() - startTime
      
      // Server Environment Test
      const env = data.tests.environment
      const hasAllVars = env.supabaseUrl.present && env.supabaseKey.present && env.whisperKey.present
      
      if (hasAllVars) {
        updateTest(
          'Server Environment', 
          'success', 
          'All server environment variables found',
          `Supabase URL: ${env.supabaseUrl.value}
Supabase Key: ${env.supabaseKey.value}
Whisper Key: ${env.whisperKey.value}`,
          duration
        )
      } else {
        const missing = []
        if (!env.supabaseUrl.present) missing.push('NEXT_PUBLIC_SUPABASE_URL')
        if (!env.supabaseKey.present) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY')
        if (!env.whisperKey.present) missing.push('WHISPER_API')
        
        updateTest(
          'Server Environment', 
          'error', 
          `Missing server environment variables: ${missing.join(', ')}`,
          'These variables are not available on the server. Check your deployment configuration.',
          duration
        )
      }
      
      // Database Connection Test
      const db = data.tests.supabase
      updateTest(
        'Database Connection',
        db.status === 'success' ? 'success' : 'error',
        db.message,
        db.status === 'error' ? 'Check your Supabase project settings and ensure the database is accessible.' : undefined,
        duration
      )
      
      // API Configuration Test
      const api = data.tests.whisper
      updateTest(
        'API Configuration',
        api.status === 'success' ? 'success' : 'error',
        api.message,
        api.status === 'error' ? 'Add your Whisper API key to the WHISPER_API environment variable.' : undefined,
        duration
      )
      
    } catch (error) {
      const duration = Date.now() - startTime
      updateTest(
        'Server Environment', 
        'error', 
        'Failed to contact server',
        error instanceof Error ? error.message : 'Unknown error',
        duration
      )
      updateTest(
        'Database Connection', 
        'error', 
        'Cannot test - server unavailable',
        undefined,
        duration
      )
      updateTest(
        'API Configuration', 
        'error', 
        'Cannot test - server unavailable',
        undefined,
        duration
      )
    }
  }

  const runAllTests = async () => {
    setLoading(true)
    
    // Reset all tests
    setTests([
      { name: 'Client Environment', status: 'pending', message: 'Checking browser environment...' },
      { name: 'Server Environment', status: 'pending', message: 'Checking server environment...' },
      { name: 'Database Connection', status: 'pending', message: 'Testing database connection...' },
      { name: 'API Configuration', status: 'pending', message: 'Verifying API keys...' },
    ])
    
    // Run client tests immediately
    runClientTests()
    
    // Run server tests
    await runServerTests()
    
    setLoading(false)
  }

  // Run tests on component mount
  useEffect(() => {
    runAllTests()
  }, [])

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pending':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default:
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
    }
  }

  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Testing...</Badge>
      case 'success':
        return <Badge className="bg-green-500 hover:bg-green-600">✓ Passed</Badge>
      case 'error':
        return <Badge variant="destructive">✗ Failed</Badge>
      case 'warning':
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">⚠ Warning</Badge>
      default:
        return <Badge variant="secondary">Testing...</Badge>
    }
  }

  const getTestIcon = (name: string) => {
    switch (name) {
      case 'Client Environment':
        return <Globe className="h-4 w-4" />
      case 'Server Environment':
        return <Database className="h-4 w-4" />
      case 'Database Connection':
        return <Database className="h-4 w-4" />
      case 'API Configuration':
        return <Key className="h-4 w-4" />
      default:
        return <CheckCircle className="h-4 w-4" />
    }
  }

  const allTestsPassed = tests.every(test => test.status === 'success')
  const hasFailedTests = tests.some(test => test.status === 'error')
  const hasWarnings = tests.some(test => test.status === 'warning')

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">System Test Dashboard</h1>
        <p className="text-muted-foreground">
          Verify your Supabase and Whisper API integration
        </p>
      </div>

      {/* Test Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            System Health Check
          </CardTitle>
          <CardDescription>
            Testing all system components and integrations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {tests.map((test) => (
            <div key={test.name} className="space-y-2">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getTestIcon(test.name)}
                  {getStatusIcon(test.status)}
                  <div className="flex-1">
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
              
              {test.details && (
                <div className="ml-8 p-3 bg-muted rounded-lg">
                  <pre className="text-xs font-mono whitespace-pre-wrap">{test.details}</pre>
                </div>
              )}
            </div>
          ))}
          
          <Separator />
          
          <div className="flex items-center justify-between">
            <Button 
              onClick={runAllTests} 
              disabled={loading}
              variant="outline"
              className="flex items-center gap-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Run All Tests
            </Button>
            <div className="text-sm text-muted-foreground">
              {allTestsPassed ? '✅ All systems operational' : 
               hasFailedTests ? '❌ Some tests failed' : 
               hasWarnings ? '⚠️ Some warnings detected' : '🔄 Tests in progress'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Alerts */}
      {allTestsPassed && (
        <Alert className="border-green-500">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertDescription>
            🎉 All tests passed! Your system is ready for development.
          </AlertDescription>
        </Alert>
      )}

      {hasFailedTests && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Some tests failed. Please check the details above and ensure your environment variables are configured correctly in your deployment platform.
          </AlertDescription>
        </Alert>
      )}

      {hasWarnings && !hasFailedTests && (
        <Alert className="border-yellow-500">
          <AlertCircle className="h-4 w-4 text-yellow-500" />
          <AlertDescription>
            Some tests have warnings. Your system should work, but check the details above for potential issues.
          </AlertDescription>
        </Alert>
      )}

      {/* Environment Help */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Environment Variables Help
          </CardTitle>
          <CardDescription>
            Required environment variables for your deployment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">Required Variables:</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• <code>NEXT_PUBLIC_SUPABASE_URL</code> - Your Supabase project URL</li>
              <li>• <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> - Your Supabase anonymous key</li>
              <li>• <code>WHISPER_API</code> - Your OpenAI Whisper API key</li>
            </ul>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">How to set variables in Vercel:</h4>
            <ol className="text-sm space-y-1 text-muted-foreground">
              <li>1. Go to your Vercel project dashboard</li>
              <li>2. Click Settings → Environment Variables</li>
              <li>3. Add each variable for Production, Preview, and Development</li>
              <li>4. Redeploy your project</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}