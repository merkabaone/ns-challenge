'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { ComponentSystemConfig } from '@/lib/component-system'

interface SystemContextType {
  config: ComponentSystemConfig
  updateConfig: (updates: Partial<ComponentSystemConfig>) => void
  metrics: {
    renderCount: number
    errorCount: number
    performanceScore: number
  }
}

const SystemContext = createContext<SystemContextType | undefined>(undefined)

export function useSystem() {
  const context = useContext(SystemContext)
  if (!context) {
    throw new Error('useSystem must be used within a SystemProvider')
  }
  return context
}

interface SystemProviderProps {
  children: React.ReactNode
  initialConfig?: Partial<ComponentSystemConfig>
}

export function SystemProvider({ children, initialConfig }: SystemProviderProps) {
  const [config, setConfig] = useState<ComponentSystemConfig>({
    theme: 'system',
    density: 'comfortable',
    radius: 'medium',
    animations: true,
    reducedMotion: false,
    ...initialConfig
  })

  const [metrics, setMetrics] = useState({
    renderCount: 0,
    errorCount: 0,
    performanceScore: 100
  })

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement
    root.setAttribute('data-theme', config.theme)
    root.setAttribute('data-density', config.density)
    root.setAttribute('data-radius', config.radius)
    
    if (config.reducedMotion) {
      root.setAttribute('data-reduced-motion', 'true')
    } else {
      root.removeAttribute('data-reduced-motion')
    }
  }, [config])

  useEffect(() => {
    // Performance monitoring
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const renderTime = entries.reduce((sum, entry) => sum + entry.duration, 0)
      
      setMetrics(prev => ({
        ...prev,
        renderCount: prev.renderCount + entries.length,
        performanceScore: Math.max(0, 100 - (renderTime / 16 * 10)) // 16ms = 60fps
      }))
    })

    observer.observe({ entryTypes: ['measure'] })

    return () => observer.disconnect()
  }, [])

  const updateConfig = (updates: Partial<ComponentSystemConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }))
  }

  return (
    <SystemContext.Provider value={{ config, updateConfig, metrics }}>
      {children}
    </SystemContext.Provider>
  )
}