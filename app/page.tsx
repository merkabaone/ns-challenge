import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <div className="flex flex-col items-center justify-center min-h-screen space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            NS Challenge
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Competition-ready app built with Next.js, Supabase, Tailwind CSS, and ShadCN/UI
          </p>
        </div>
        
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Quick Start</CardTitle>
            <CardDescription>
              Your app is ready to deploy! Start building your competition entry.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">✅ Next.js 14 (App Router)</p>
              <p className="text-sm font-medium">✅ Supabase Integration</p>
              <p className="text-sm font-medium">✅ Tailwind CSS + ShadCN/UI</p>
              <p className="text-sm font-medium">✅ TypeScript Ready</p>
              <p className="text-sm font-medium">✅ Vercel Deploy Ready</p>
            </div>
            <Button className="w-full">
              Start Building
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}