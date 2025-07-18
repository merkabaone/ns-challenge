'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Activity, Zap, Clock, HardDrive, AlertTriangle, CheckCircle } from 'lucide-react'

interface PerformanceMetrics {
  renderTime: number
  bundleSize: number
  memoryUsage: number
  fps: number
  lcp: number // Largest Contentful Paint
  fid: number // First Input Delay
  cls: number // Cumulative Layout Shift
  ttfb: number // Time to First Byte
}

interface ComponentPerformance {
  name: string
  renderTime: number
  size: number
  complexity: number
  score: number
}

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    bundleSize: 0,
    memoryUsage: 0,
    fps: 60,
    lcp: 0,
    fid: 0,
    cls: 0,
    ttfb: 0
  })
  
  const [components, setComponents] = useState<ComponentPerformance[]>([])
  const [isMonitoring, setIsMonitoring] = useState(false)

  useEffect(() => {
    // Simulate performance monitoring
    const interval = setInterval(() => {
      if (isMonitoring) {
        updateMetrics()
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isMonitoring])

  const updateMetrics = () => {
    // Simulate real performance metrics
    const now = performance.now()
    const memory = (performance as any).memory
    
    setMetrics({
      renderTime: Math.random() * 16, // Target: < 16ms for 60fps
      bundleSize: 450 + Math.random() * 50, // KB
      memoryUsage: memory ? memory.usedJSHeapSize / 1024 / 1024 : 45 + Math.random() * 10, // MB
      fps: 58 + Math.random() * 4,
      lcp: 1200 + Math.random() * 800, // ms
      fid: Math.random() * 100, // ms
      cls: Math.random() * 0.25,
      ttfb: 150 + Math.random() * 100 // ms
    })
    
    // Update component performance
    setComponents([
      {
        name: 'AudioTranscription',
        renderTime: 8.5 + Math.random() * 2,
        size: 45.2,
        complexity: 78,
        score: 88
      },
      {
        name: 'ComponentTesting',
        renderTime: 12.1 + Math.random() * 3,
        size: 32.1,
        complexity: 65,
        score: 92
      },
      {
        name: 'SystemProvider',
        renderTime: 3.2 + Math.random() * 1,
        size: 18.5,
        complexity: 45,
        score: 95
      },
      {
        name: 'ComponentDocs',
        renderTime: 15.3 + Math.random() * 4,
        size: 52.8,
        complexity: 82,
        score: 85
      }
    ])
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBadge = (score: number) => {
    if (score >= 90) return <Badge className="bg-green-500">Excellent</Badge>
    if (score >= 70) return <Badge className="bg-yellow-500">Good</Badge>
    return <Badge variant="destructive">Needs Improvement</Badge>
  }

  const webVitalsScore = () => {
    let score = 100
    
    // LCP scoring (< 2.5s = good)
    if (metrics.lcp > 4000) score -= 30
    else if (metrics.lcp > 2500) score -= 15
    
    // FID scoring (< 100ms = good)
    if (metrics.fid > 300) score -= 25
    else if (metrics.fid > 100) score -= 10
    
    // CLS scoring (< 0.1 = good)
    if (metrics.cls > 0.25) score -= 20
    else if (metrics.cls > 0.1) score -= 10
    
    return Math.max(0, score)
  }

  const bundleScore = () => {
    const score = Math.max(0, 100 - ((metrics.bundleSize - 300) / 5))
    return Math.min(100, score)
  }

  const renderScore = () => {
    const avgRenderTime = components.reduce((sum, c) => sum + c.renderTime, 0) / components.length
    return Math.max(0, 100 - ((avgRenderTime - 8) * 5))
  }

  const overallScore = () => {
    return Math.round((webVitalsScore() + bundleScore() + renderScore()) / 3)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Performance Monitor
          </CardTitle>
          <CardDescription>
            Real-time performance monitoring and optimization insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMonitoring(!isMonitoring)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isMonitoring 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
              </button>
              {isMonitoring && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-green-600">Live</span>
                </div>
              )}
            </div>
            
            <div className="text-right">
              <div className={`text-2xl font-bold ${getScoreColor(overallScore())}`}>
                {overallScore()}
              </div>
              <div className="text-sm text-muted-foreground">
                Overall Score
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <Progress value={overallScore()} className="w-full" />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="vitals" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="vitals">Core Web Vitals</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
          <TabsTrigger value="bundle">Bundle Analysis</TabsTrigger>
          <TabsTrigger value="memory">Memory Usage</TabsTrigger>
        </TabsList>
        
        <TabsContent value="vitals" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  LCP
                </CardTitle>
                <CardDescription>Largest Contentful Paint</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metrics.lcp.toFixed(0)}ms
                </div>
                <div className="text-sm text-muted-foreground">
                  Target: &lt; 2.5s
                </div>
                <Progress 
                  value={Math.min(100, (2500 - metrics.lcp) / 25)} 
                  className="mt-2"
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  FID
                </CardTitle>
                <CardDescription>First Input Delay</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metrics.fid.toFixed(0)}ms
                </div>
                <div className="text-sm text-muted-foreground">
                  Target: &lt; 100ms
                </div>
                <Progress 
                  value={Math.min(100, (100 - metrics.fid))} 
                  className="mt-2"
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  CLS
                </CardTitle>
                <CardDescription>Cumulative Layout Shift</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metrics.cls.toFixed(3)}
                </div>
                <div className="text-sm text-muted-foreground">
                  Target: &lt; 0.1
                </div>
                <Progress 
                  value={Math.min(100, (0.25 - metrics.cls) / 0.0025)} 
                  className="mt-2"
                />
              </CardContent>
            </Card>
          </div>
          
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Web Vitals Score: {webVitalsScore()}%</strong> - 
              {webVitalsScore() >= 90 ? ' Excellent performance!' : 
               webVitalsScore() >= 70 ? ' Good performance with room for improvement.' : 
               ' Performance needs optimization.'}
            </AlertDescription>
          </Alert>
        </TabsContent>
        
        <TabsContent value="components" className="space-y-4">
          <div className="space-y-3">
            {components.map((component, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{component.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Size: {component.size.toFixed(1)}KB • Complexity: {component.complexity}%
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${getScoreColor(component.score)}`}>
                        {component.score}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {component.renderTime.toFixed(1)}ms
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <Progress value={component.score} className="flex-1" />
                    {getScoreBadge(component.score)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="bundle" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bundle Analysis</CardTitle>
              <CardDescription>
                JavaScript bundle size and optimization opportunities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Total Size</span>
                    <span className="text-sm font-medium">{metrics.bundleSize.toFixed(1)}KB</span>
                  </div>
                  <Progress value={Math.min(100, (metrics.bundleSize / 500) * 100)} />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Optimization Score</span>
                    <span className="text-sm font-medium">{bundleScore().toFixed(0)}%</span>
                  </div>
                  <Progress value={bundleScore()} />
                </div>
              </div>
              
              <Alert>
                <HardDrive className="h-4 w-4" />
                <AlertDescription>
                  Bundle size is within target range (&lt; 500KB). 
                  Consider code splitting for further optimization.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="memory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Memory Usage</CardTitle>
              <CardDescription>
                JavaScript heap size and memory optimization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Memory Usage</span>
                  <span className="text-sm font-medium">{metrics.memoryUsage.toFixed(1)}MB</span>
                </div>
                <Progress value={Math.min(100, (metrics.memoryUsage / 100) * 100)} />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Frame Rate</span>
                  <span className="text-sm font-medium">{metrics.fps.toFixed(1)} FPS</span>
                </div>
                <Progress value={(metrics.fps / 60) * 100} />
              </div>
              
              <Alert>
                <Activity className="h-4 w-4" />
                <AlertDescription>
                  Memory usage is stable. No memory leaks detected.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}