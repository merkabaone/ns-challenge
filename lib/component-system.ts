// Component System Architecture
// Atomic Design + Compound Components + Composition Patterns

export interface ComponentSystemConfig {
  theme: 'light' | 'dark' | 'system'
  density: 'compact' | 'comfortable' | 'spacious'
  radius: 'none' | 'small' | 'medium' | 'large'
  animations: boolean
  reducedMotion: boolean
}

// Component Categories
export interface ComponentLibrary {
  // Atoms - Basic building blocks
  atoms: {
    Button: ComponentMeta
    Input: ComponentMeta
    Label: ComponentMeta
    Icon: ComponentMeta
    Avatar: ComponentMeta
    Badge: ComponentMeta
    Spinner: ComponentMeta
  }
  
  // Molecules - Simple combinations
  molecules: {
    FormField: ComponentMeta
    SearchBox: ComponentMeta
    Card: ComponentMeta
    Alert: ComponentMeta
    Tooltip: ComponentMeta
    Dropdown: ComponentMeta
  }
  
  // Organisms - Complex UI sections
  organisms: {
    Navbar: ComponentMeta
    Sidebar: ComponentMeta
    DataTable: ComponentMeta
    Form: ComponentMeta
    Modal: ComponentMeta
    AudioPlayer: ComponentMeta
  }
  
  // Templates - Page layouts
  templates: {
    DashboardLayout: ComponentMeta
    AuthLayout: ComponentMeta
    ContentLayout: ComponentMeta
    LandingLayout: ComponentMeta
  }
}

export interface ComponentMeta {
  name: string
  category: 'atom' | 'molecule' | 'organism' | 'template'
  variants: string[]
  props: Record<string, any>
  examples: string[]
  accessibility: {
    ariaLabel?: string
    keyboardNavigation: boolean
    screenReader: boolean
  }
  performance: {
    bundleSize: number
    renderTime: number
    memoryUsage: number
  }
}

// Composition Patterns
export interface CompositionPattern {
  name: string
  description: string
  components: string[]
  example: string
  useCase: string
}

export const compositionPatterns: CompositionPattern[] = [
  {
    name: 'Compound Components',
    description: 'Components that work together as a cohesive unit',
    components: ['Select', 'SelectTrigger', 'SelectContent', 'SelectItem'],
    example: 'Select.Root > Select.Trigger + Select.Content > Select.Item',
    useCase: 'Complex interactions with multiple related parts'
  },
  {
    name: 'Render Props',
    description: 'Components that share logic through render functions',
    components: ['DataProvider', 'AudioRecorder', 'FormValidator'],
    example: '<DataProvider>{({ data, loading }) => <UI />}</DataProvider>',
    useCase: 'Logic sharing without component coupling'
  },
  {
    name: 'Slot Pattern',
    description: 'Flexible content composition with named slots',
    components: ['Layout', 'Card', 'Modal'],
    example: '<Layout><Layout.Header /><Layout.Main /><Layout.Footer /></Layout>',
    useCase: 'Flexible layouts with predictable structure'
  }
]

// Component Quality Metrics
export interface QualityMetrics {
  accessibility: {
    score: number // 0-100
    issues: string[]
    recommendations: string[]
  }
  performance: {
    bundleSize: number
    renderTime: number
    memoryLeaks: boolean
  }
  usability: {
    apiComplexity: number
    learningCurve: 'low' | 'medium' | 'high'
    documentation: number // 0-100
  }
}