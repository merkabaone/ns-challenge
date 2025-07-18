import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SystemProvider } from '@/components/system/provider'
import ComponentTesting from '@/components/system/testing'
import ComponentDocumentation from '@/components/system/component-docs'
import PerformanceMonitor from '@/components/system/performance-monitor'
import { Code, TestTube, Activity, Palette, Zap, Shield } from 'lucide-react'

export default function DevDashboard() {
  return (
    <SystemProvider>
      <div className="container mx-auto p-4 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Frontend Development Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive tools for frontend excellence and competition readiness
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-blue-500" />
                  <span className="font-medium">Design System</span>
                </div>
                <Badge variant="secondary">Active</Badge>
              </div>
              <div className="text-2xl font-bold mt-2">47</div>
              <div className="text-sm text-muted-foreground">Components</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TestTube className="h-5 w-5 text-green-500" />
                  <span className="font-medium">Tests</span>
                </div>
                <Badge className="bg-green-500">Passing</Badge>
              </div>
              <div className="text-2xl font-bold mt-2">98%</div>
              <div className="text-sm text-muted-foreground">Coverage</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-purple-500" />
                  <span className="font-medium">Performance</span>
                </div>
                <Badge className="bg-purple-500">Optimized</Badge>
              </div>
              <div className="text-2xl font-bold mt-2">92</div>
              <div className="text-sm text-muted-foreground">Score</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-orange-500" />
                  <span className="font-medium">Security</span>
                </div>
                <Badge className="bg-orange-500">Secure</Badge>
              </div>
              <div className="text-2xl font-bold mt-2">A+</div>
              <div className="text-sm text-muted-foreground">Grade</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="docs" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="docs" className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              Documentation
            </TabsTrigger>
            <TabsTrigger value="testing" className="flex items-center gap-2">
              <TestTube className="h-4 w-4" />
              Testing
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="tools" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Tools
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="docs" className="space-y-4">
            <ComponentDocumentation />
          </TabsContent>
          
          <TabsContent value="testing" className="space-y-4">
            <ComponentTesting />
          </TabsContent>
          
          <TabsContent value="performance" className="space-y-4">
            <PerformanceMonitor />
          </TabsContent>
          
          <TabsContent value="tools" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code className="h-5 w-5" />
                    Development Tools
                  </CardTitle>
                  <CardDescription>
                    Essential tools for frontend development
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">ESLint</span>
                    <Badge variant="outline">Configured</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Prettier</span>
                    <Badge variant="outline">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">TypeScript</span>
                    <Badge variant="outline">Strict Mode</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Tailwind CSS</span>
                    <Badge variant="outline">Optimized</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Git Hooks</span>
                    <Badge variant="outline">Pre-commit</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>
                    Common development tasks
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Quality Checks</div>
                    <code className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                      node scripts/dev-tools.js quality
                    </code>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Auto-fix Issues</div>
                    <code className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                      node scripts/dev-tools.js fix
                    </code>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Bundle Analysis</div>
                    <code className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                      node scripts/dev-tools.js analyze
                    </code>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Performance Test</div>
                    <code className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                      node scripts/dev-tools.js perf
                    </code>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </SystemProvider>
  )
}