'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  User, 
  LogOut, 
  Settings, 
  Trophy, 
  Mic, 
  FileText,
  Calendar,
  Star,
  Github,
  Chrome,
  MessageCircle,
  Loader2
} from 'lucide-react'
import { useAuth } from '@/lib/auth/auth-context'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const { user, signOut, loading } = useAuth()
  const router = useRouter()
  const [signingOut, setSigningOut] = useState(false)

  // Redirect if not authenticated
  if (!user && !loading) {
    router.push('/auth')
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const handleSignOut = async () => {
    try {
      setSigningOut(true)
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Sign out error:', error)
    } finally {
      setSigningOut(false)
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {user?.user_metadata?.full_name || user?.email}
            </p>
          </div>
          <Button
            variant="outline"
            onClick={handleSignOut}
            disabled={signingOut}
          >
            {signingOut ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <LogOut className="h-4 w-4 mr-2" />
            )}
            Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback>
                    {user?.user_metadata?.full_name?.[0] || user?.email?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">
                    {user?.user_metadata?.full_name || 'Anonymous User'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {user?.email}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {getProviderIcon(user?.app_metadata?.provider || '')}
                    <Badge variant="secondary" className="text-xs">
                      {getProviderName(user?.app_metadata?.provider || '')}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Member since</span>
                  <span className="text-muted-foreground">
                    {new Date(user?.created_at || '').toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Last login</span>
                  <span className="text-muted-foreground">
                    {new Date(user?.last_sign_in_at || '').toLocaleDateString()}
                  </span>
                </div>
              </div>

              <Button className="w-full" variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Welcome Alert */}
            <Alert>
              <Trophy className="h-4 w-4" />
              <AlertDescription>
                🎉 Welcome to NS Challenge! You&apos;re all set to start competing and building amazing projects.
              </AlertDescription>
            </Alert>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Get started with these common tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button className="h-16 flex-col space-y-2">
                    <Mic className="h-6 w-6" />
                    <span>Test Audio Transcription</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex-col space-y-2">
                    <FileText className="h-6 w-6" />
                    <span>Create Project</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex-col space-y-2">
                    <Trophy className="h-6 w-6" />
                    <span>View Challenges</span>
                  </Button>
                  <Button variant="outline" className="h-16 flex-col space-y-2">
                    <Star className="h-6 w-6" />
                    <span>Leaderboard</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your latest actions and achievements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
                      <User className="h-4 w-4 text-green-500" />
                    </div>
                    <div>
                      <p className="font-medium">Account created</p>
                      <p className="text-sm text-muted-foreground">
                        Welcome to NS Challenge!
                      </p>
                    </div>
                    <div className="ml-auto text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      {new Date(user?.created_at || '').toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="text-center py-8 text-muted-foreground">
                    <Trophy className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No recent activity yet</p>
                    <p className="text-sm">Start by testing the audio transcription feature!</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}