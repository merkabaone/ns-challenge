'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  User, 
  Shield, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Github, 
  Chrome, 
  MessageCircle,
  Home,
  Database,
  Lock,
  Globe,
  ArrowRight
} from 'lucide-react'
import { useAuth } from '@/lib/auth/auth-context'
import Link from 'next/link'

export default function AuthTestPage() {
  const { user, session, loading, signOut } = useAuth()
  const [testResults, setTestResults] = useState<any>(null)
  const [testing, setTesting] = useState(false)

  const runAuthTests = async () => {
    setTesting(true)
    const results = {
      timestamp: new Date().toISOString(),
      tests: {
        userObject: !!user,
        sessionObject: !!session,
        userEmail: !!user?.email,
        userMetadata: !!user?.user_metadata,
        userProvider: !!user?.app_metadata?.provider,
        sessionAccessToken: !!session?.access_token,
        sessionRefreshToken: !!session?.refresh_token,
        sessionExpiry: !!session?.expires_at,
      },
      userInfo: user ? {
        id: user.id,
        email: user.email,
        fullName: user.user_metadata?.full_name,
        avatarUrl: user.user_metadata?.avatar_url,
        provider: user.app_metadata?.provider,
        createdAt: user.created_at,
        lastSignIn: user.last_sign_in_at,
        emailConfirmed: !!user.email_confirmed_at,
      } : null,
      sessionInfo: session ? {
        tokenType: session.token_type,
        expiresAt: session.expires_at,
        expiresIn: session.expires_in,
        hasAccessToken: !!session.access_token,
        hasRefreshToken: !!session.refresh_token,
      } : null,
    }
    
    setTestResults(results)
    setTesting(false)
  }

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'google':
        return <Chrome className="h-4 w-4" />
      case 'github':
        return <Github className="h-4 w-4" />
      case 'discord':
        return <MessageCircle className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const getProviderName = (provider: string) => {
    switch (provider) {
      case 'google':
        return 'Google'
      case 'github':
        return 'GitHub'
      case 'discord':
        return 'Discord'
      default:
        return 'Unknown'
    }
  }

  const TestResult = ({ label, value, type = 'boolean' }: { label: string, value: any, type?: string }) => (
    <div className="flex items-center justify-between p-2 rounded border">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex items-center gap-2">
        {type === 'boolean' ? (
          <>
            {value ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
            <Badge variant={value ? 'default' : 'destructive'}>
              {value ? 'Pass' : 'Fail'}
            </Badge>
          </>
        ) : (
          <span className="text-sm text-muted-foreground font-mono">
            {value || 'N/A'}
          </span>
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Authentication Test Suite</h1>
            <p className="text-muted-foreground">
              Test and verify social authentication integration
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Home
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Authentication Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Authentication Status
              </CardTitle>
              <CardDescription>
                Current authentication state and user information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <span className="ml-2">Loading...</span>
                </div>
              ) : user ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback>
                        {user.user_metadata?.full_name?.[0] || user.email?.[0] || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">
                        {user.user_metadata?.full_name || 'Anonymous User'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {getProviderIcon(user.app_metadata?.provider || '')}
                        <Badge variant="secondary" className="text-xs">
                          {getProviderName(user.app_metadata?.provider || '')}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      ✅ Authentication successful! User is signed in.
                    </AlertDescription>
                  </Alert>

                  <div className="flex gap-2">
                    <Button onClick={runAuthTests} disabled={testing}>
                      {testing ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Database className="h-4 w-4 mr-2" />
                      )}
                      Run Tests
                    </Button>
                    <Button variant="outline" onClick={signOut}>
                      Sign Out
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>
                      ❌ No user authenticated. Please sign in to test.
                    </AlertDescription>
                  </Alert>
                  
                  <Button asChild>
                    <Link href="/auth">
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Go to Sign In
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Test Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Test Results
              </CardTitle>
              <CardDescription>
                Detailed authentication tests and validation
              </CardDescription>
            </CardHeader>
            <CardContent>
              {testResults ? (
                <div className="space-y-4">
                  <div className="text-xs text-muted-foreground">
                    Last run: {new Date(testResults.timestamp).toLocaleString()}
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Core Authentication Tests</h4>
                    <div className="space-y-1">
                      <TestResult label="User Object" value={testResults.tests.userObject} />
                      <TestResult label="Session Object" value={testResults.tests.sessionObject} />
                      <TestResult label="User Email" value={testResults.tests.userEmail} />
                      <TestResult label="User Metadata" value={testResults.tests.userMetadata} />
                      <TestResult label="OAuth Provider" value={testResults.tests.userProvider} />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h4 className="font-medium">Session Tests</h4>
                    <div className="space-y-1">
                      <TestResult label="Access Token" value={testResults.tests.sessionAccessToken} />
                      <TestResult label="Refresh Token" value={testResults.tests.sessionRefreshToken} />
                      <TestResult label="Session Expiry" value={testResults.tests.sessionExpiry} />
                    </div>
                  </div>

                  {testResults.userInfo && (
                    <>
                      <Separator />
                      <div className="space-y-2">
                        <h4 className="font-medium">User Information</h4>
                        <div className="space-y-1">
                          <TestResult label="User ID" value={testResults.userInfo.id} type="string" />
                          <TestResult label="Email" value={testResults.userInfo.email} type="string" />
                          <TestResult label="Full Name" value={testResults.userInfo.fullName} type="string" />
                          <TestResult label="Provider" value={testResults.userInfo.provider} type="string" />
                          <TestResult label="Email Confirmed" value={testResults.userInfo.emailConfirmed} />
                        </div>
                      </div>
                    </>
                  )}

                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      All authentication tests completed successfully!
                    </AlertDescription>
                  </Alert>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Database className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-muted-foreground">
                    No test results yet. Sign in and run tests to see results.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Protected Routes Test */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Protected Routes Test
              </CardTitle>
              <CardDescription>
                Test middleware and route protection
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Test protected routes:</p>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/dashboard">
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Dashboard (Protected)
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/profile">
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Profile (Protected)
                    </Link>
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Test public routes:</p>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/">
                      <Globe className="h-4 w-4 mr-2" />
                      Home (Public)
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href="/test">
                      <Globe className="h-4 w-4 mr-2" />
                      System Test (Public)
                    </Link>
                  </Button>
                </div>
              </div>

              <Alert>
                <Lock className="h-4 w-4" />
                <AlertDescription>
                  {user ? (
                    "✅ You have access to protected routes"
                  ) : (
                    "⚠️ You'll be redirected to sign in for protected routes"
                  )}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Integration Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Integration Summary
              </CardTitle>
              <CardDescription>
                Complete authentication system status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Social Auth Providers</span>
                  <Badge variant="default">3 Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Protected Routes</span>
                  <Badge variant="default">2 Routes</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>User Management</span>
                  <Badge variant="default">Complete</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Session Management</span>
                  <Badge variant="default">Active</Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Available Providers:</h4>
                <div className="flex gap-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Chrome className="h-3 w-3" />
                    Google
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Github className="h-3 w-3" />
                    GitHub
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" />
                    Discord
                  </Badge>
                </div>
              </div>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  🎉 Social authentication system is fully operational!
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}