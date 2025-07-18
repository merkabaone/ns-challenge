'use client'

import { useAuth } from '@/lib/auth/auth-context'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, User, Settings, Github, Chrome, MessageCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

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
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Profile Settings</h1>
            <p className="text-muted-foreground">
              Manage your account information and preferences
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Information */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>
                Your account details and authentication information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user?.user_metadata?.avatar_url} />
                  <AvatarFallback className="text-xl">
                    {user?.user_metadata?.full_name?.[0] || user?.email?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">
                    {user?.user_metadata?.full_name || 'Anonymous User'}
                  </h3>
                  <p className="text-muted-foreground">
                    {user?.email}
                  </p>
                  <div className="flex items-center gap-2">
                    {getProviderIcon(user?.app_metadata?.provider || '')}
                    <Badge variant="secondary">
                      {getProviderName(user?.app_metadata?.provider || '')}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <div className="p-3 bg-muted rounded-md">
                    {user?.user_metadata?.full_name || 'Not provided'}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <div className="p-3 bg-muted rounded-md">
                    {user?.email || 'Not provided'}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Username</label>
                  <div className="p-3 bg-muted rounded-md">
                    {user?.user_metadata?.user_name || user?.user_metadata?.preferred_username || 'Not provided'}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Provider</label>
                  <div className="p-3 bg-muted rounded-md flex items-center gap-2">
                    {getProviderIcon(user?.app_metadata?.provider || '')}
                    {getProviderName(user?.app_metadata?.provider || '')}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Account Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span>Account Created</span>
                    <span className="text-muted-foreground">
                      {new Date(user?.created_at || '').toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Login</span>
                    <span className="text-muted-foreground">
                      {new Date(user?.last_sign_in_at || '').toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>User ID</span>
                    <span className="text-muted-foreground font-mono text-xs">
                      {user?.id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Email Verified</span>
                    <span className="text-muted-foreground">
                      {user?.email_confirmed_at ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Settings Sidebar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Profile Management</p>
                <p className="text-xs text-muted-foreground">
                  Your profile information is managed by your authentication provider ({getProviderName(user?.app_metadata?.provider || '')}).
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <p className="text-sm font-medium">Privacy</p>
                <p className="text-xs text-muted-foreground">
                  Your data is protected and only used for your NS Challenge experience.
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <p className="text-sm font-medium">Account Actions</p>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start text-sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Update Profile
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-sm">
                    <User className="h-4 w-4 mr-2" />
                    Change Avatar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}