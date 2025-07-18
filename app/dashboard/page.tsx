'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  User, 
  Settings, 
  Trophy, 
  Calendar,
  Star,
  Chrome,
  MessageCircle
} from 'lucide-react'

export default function DashboardPage() {
  const router = useRouter()

  // This is now a demo dashboard without auth
  const demoUser = {
    display_name: 'Demo User',
    discord_username: 'demo_user#1234'
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-4xl font-bold mb-8">NS Friender Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              onClick={() => router.push('/swipe')} 
              className="w-full justify-start"
            >
              <User className="mr-2 h-4 w-4" />
              Start Swiping
            </Button>
            <Button 
              onClick={() => router.push('/matches')} 
              className="w-full justify-start"
              variant="outline"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              View Matches
            </Button>
            <Button 
              onClick={() => router.push('/settings')} 
              className="w-full justify-start"
              variant="outline"
            >
              <Settings className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        {/* Demo Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Your Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Profile Views</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Matches</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="text-2xl font-bold">Today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Chrome className="h-5 w-5" />
              Demo Mode
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              This is a demo version of NS Friender. Data is stored locally in your browser.
            </p>
            <Button 
              onClick={() => {
                localStorage.clear()
                router.push('/')
              }} 
              variant="destructive"
              className="w-full"
            >
              Reset Demo
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}