'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { 
  Github, 
  Chrome, 
  MessageCircle, 
  Loader2, 
  Shield, 
  Zap, 
  Trophy,
  AlertCircle 
} from 'lucide-react'
import { useAuth } from '@/lib/auth/auth-context'

function AuthContent() {
  const { signInWithProvider, user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const redirectTo = searchParams.get('redirectTo') || '/dashboard'

  // Redirect if already authenticated
  if (user) {
    router.push(redirectTo as any)
    return null
  }

  const handleSignIn = async (provider: 'google' | 'github' | 'discord') => {
    try {
      setLoading(provider)
      setError(null)
      await signInWithProvider(provider, redirectTo)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Welcome to NS Challenge</h1>
          <p className="text-muted-foreground">
            Sign in to start competing and building amazing projects
          </p>
        </div>

        {/* Main Auth Card */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Choose your preferred authentication method
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-3">
              {/* Google Sign In */}
              <Button
                variant="outline"
                className="w-full h-12 text-left justify-start"
                onClick={() => handleSignIn('google')}
                disabled={loading !== null}
              >
                {loading === 'google' ? (
                  <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                ) : (
                  <Chrome className="h-5 w-5 mr-3" />
                )}
                Continue with Google
                <Badge variant="secondary" className="ml-auto">
                  Popular
                </Badge>
              </Button>

              {/* GitHub Sign In */}
              <Button
                variant="outline"
                className="w-full h-12 text-left justify-start"
                onClick={() => handleSignIn('github')}
                disabled={loading !== null}
              >
                {loading === 'github' ? (
                  <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                ) : (
                  <Github className="h-5 w-5 mr-3" />
                )}
                Continue with GitHub
                <Badge variant="secondary" className="ml-auto">
                  Developers
                </Badge>
              </Button>

              {/* Discord Sign In */}
              <Button
                variant="outline"
                className="w-full h-12 text-left justify-start"
                onClick={() => handleSignIn('discord')}
                disabled={loading !== null}
              >
                {loading === 'discord' ? (
                  <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                ) : (
                  <MessageCircle className="h-5 w-5 mr-3" />
                )}
                Continue with Discord
                <Badge variant="secondary" className="ml-auto">
                  Gaming
                </Badge>
              </Button>
            </div>

            <Separator />

            {/* Features */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-center">What you get:</h3>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-center gap-2 text-sm">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <span>Compete in challenges</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Zap className="h-4 w-4 text-blue-500" />
                  <span>AI-powered speech-to-text</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="h-4 w-4 text-green-500" />
                  <span>Secure profile management</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center space-y-2">
          <p className="text-xs text-muted-foreground">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
          <p className="text-xs text-muted-foreground">
            Your data is secure and we never spam
          </p>
        </div>
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Loading...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    }>
      <AuthContent />
    </Suspense>
  )
}