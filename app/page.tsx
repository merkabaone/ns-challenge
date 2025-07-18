import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Database, Mic, TestTube, Zap, Code, LogIn, User } from 'lucide-react'
import { AuthButton } from '@/components/auth/auth-button'

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <div className="flex flex-col items-center justify-center min-h-screen space-y-8">
        {/* Header with Auth Button */}
        <div className="absolute top-4 right-4">
          <AuthButton />
        </div>
        
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            NS Challenge
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Competition-ready app with Next.js, Supabase, Whisper AI, and ShadCN/UI
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Quick Start
              </CardTitle>
              <CardDescription>
                Your app is ready to deploy! Start building your competition entry.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">✅ Next.js 14 (App Router)</p>
                <p className="text-sm font-medium">✅ Supabase Integration</p>
                <p className="text-sm font-medium">✅ Whisper AI Integration</p>
                <p className="text-sm font-medium">✅ Tailwind CSS + ShadCN/UI</p>
                <p className="text-sm font-medium">✅ TypeScript Ready</p>
                <p className="text-sm font-medium">✅ Vercel Deploy Ready</p>
              </div>
              <Link href="/test">
                <Button className="w-full">
                  <TestTube className="h-4 w-4 mr-2" />
                  Test System
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Database Ready
              </CardTitle>
              <CardDescription>
                Supabase database with example schema and RLS policies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">🏗️ Users table with auth</p>
                <p className="text-sm font-medium">🎵 Audio transcriptions table</p>
                <p className="text-sm font-medium">📁 Projects table for data</p>
                <p className="text-sm font-medium">🔒 Row Level Security enabled</p>
                <p className="text-sm font-medium">⚡ Optimized indexes</p>
              </div>
              <Button variant="outline" className="w-full" asChild>
                <Link href="https://supabase.com/dashboard" target="_blank">
                  <Database className="h-4 w-4 mr-2" />
                  Open Supabase
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Frontend Excellence
              </CardTitle>
              <CardDescription>
                Complete development system for maximum efficiency
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">🎨 Design System Tokens</p>
                <p className="text-sm font-medium">🧪 Component Testing</p>
                <p className="text-sm font-medium">📊 Performance Monitoring</p>
                <p className="text-sm font-medium">📚 Interactive Documentation</p>
                <p className="text-sm font-medium">🔧 Development Tools</p>
              </div>
              <Link href="/dev">
                <Button variant="outline" className="w-full">
                  <Code className="h-4 w-4 mr-2" />
                  Dev Dashboard
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mic className="h-5 w-5" />
              Audio Transcription Demo
            </CardTitle>
            <CardDescription>
              Test your Whisper API integration with live audio transcription
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Record or upload audio files to transcribe with OpenAI&apos;s Whisper API
              </p>
              <Link href="/test">
                <Button size="lg">
                  <Mic className="h-4 w-4 mr-2" />
                  Try Audio Transcription
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}