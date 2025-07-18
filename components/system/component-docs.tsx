'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Code, Copy, Eye, Palette, Settings } from 'lucide-react'

interface ComponentExample {
  name: string
  description: string
  code: string
  preview: React.ReactNode
  props?: Record<string, any>
}

export default function ComponentDocumentation() {
  const [selectedVariant, setSelectedVariant] = useState('default')
  const [showCode, setShowCode] = useState(false)

  const buttonExamples: ComponentExample[] = [
    {
      name: 'Default Button',
      description: 'Standard button with default styling',
      code: `<Button>Click me</Button>`,
      preview: <Button>Click me</Button>
    },
    {
      name: 'Primary Button',
      description: 'Primary action button with emphasis',
      code: `<Button variant="default">Primary Action</Button>`,
      preview: <Button variant="default">Primary Action</Button>
    },
    {
      name: 'Secondary Button',
      description: 'Secondary action button',
      code: `<Button variant="secondary">Secondary Action</Button>`,
      preview: <Button variant="secondary">Secondary Action</Button>
    },
    {
      name: 'Destructive Button',
      description: 'Destructive action button for dangerous operations',
      code: `<Button variant="destructive">Delete</Button>`,
      preview: <Button variant="destructive">Delete</Button>
    },
    {
      name: 'Ghost Button',
      description: 'Minimal button with subtle styling',
      code: `<Button variant="ghost">Ghost</Button>`,
      preview: <Button variant="ghost">Ghost</Button>
    },
    {
      name: 'Link Button',
      description: 'Button styled as a link',
      code: `<Button variant="link">Link Button</Button>`,
      preview: <Button variant="link">Link Button</Button>
    }
  ]

  const inputExamples: ComponentExample[] = [
    {
      name: 'Basic Input',
      description: 'Standard text input field',
      code: `<Input placeholder="Enter text..." />`,
      preview: <Input placeholder="Enter text..." />
    },
    {
      name: 'Input with Label',
      description: 'Input field with associated label',
      code: `<>
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" placeholder="Enter email..." />
</>`,
      preview: (
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="Enter email..." />
        </div>
      )
    },
    {
      name: 'Disabled Input',
      description: 'Input field in disabled state',
      code: `<Input disabled placeholder="Disabled input" />`,
      preview: <Input disabled placeholder="Disabled input" />
    }
  ]

  const cardExamples: ComponentExample[] = [
    {
      name: 'Basic Card',
      description: 'Simple card with content',
      code: `<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here.</p>
  </CardContent>
</Card>`,
      preview: (
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card content goes here.</p>
          </CardContent>
        </Card>
      )
    }
  ]

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code)
  }

  const ExampleCard = ({ example }: { example: ComponentExample }) => (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{example.name}</CardTitle>
        <CardDescription>{example.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border rounded-lg p-4 bg-slate-50 dark:bg-slate-900">
          <div className="flex items-center justify-center min-h-[60px]">
            {example.preview}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Code</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => copyToClipboard(example.code)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-3">
            <pre className="text-sm overflow-x-auto">
              <code>{example.code}</code>
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Component Documentation
          </CardTitle>
          <CardDescription>
            Interactive documentation for your design system components
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant="secondary">
                <Palette className="h-3 w-3 mr-1" />
                Design System
              </Badge>
              <Badge variant="outline">
                <Settings className="h-3 w-3 mr-1" />
                Interactive
              </Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCode(!showCode)}
            >
              <Eye className="h-4 w-4 mr-2" />
              {showCode ? 'Hide' : 'Show'} Code
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="buttons" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="buttons">Buttons</TabsTrigger>
          <TabsTrigger value="inputs">Inputs</TabsTrigger>
          <TabsTrigger value="cards">Cards</TabsTrigger>
          <TabsTrigger value="forms">Forms</TabsTrigger>
        </TabsList>
        
        <TabsContent value="buttons" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {buttonExamples.map((example, index) => (
              <ExampleCard key={index} example={example} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="inputs" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inputExamples.map((example, index) => (
              <ExampleCard key={index} example={example} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="cards" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cardExamples.map((example, index) => (
              <ExampleCard key={index} example={example} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="forms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Form Examples</CardTitle>
              <CardDescription>
                Interactive form components and patterns
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border rounded-lg p-4 bg-slate-50 dark:bg-slate-900">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input id="name" placeholder="Enter your name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="Enter your email" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea id="message" placeholder="Enter your message" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="support">Support</SelectItem>
                        <SelectItem value="billing">Billing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="newsletter" />
                    <Label htmlFor="newsletter">Subscribe to newsletter</Label>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex gap-2">
                    <Button type="submit">Submit</Button>
                    <Button variant="outline" type="button">Cancel</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}