// Common types for the application
export interface User {
  id: string
  email: string
  name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface ApiResponse<T> {
  data?: T
  error?: string
  success: boolean
}

export interface LoadingState {
  isLoading: boolean
  error?: string
}

// Generic database entity
export interface BaseEntity {
  id: string
  created_at: string
  updated_at: string
}

// Common form types
export interface FormState {
  isSubmitting: boolean
  error?: string
  success?: boolean
}

// Theme types
export type Theme = 'light' | 'dark' | 'system'

// Navigation types
export interface NavItem {
  title: string
  href?: string
  disabled?: boolean
  external?: boolean
  icon?: React.ComponentType<{ className?: string }>
}