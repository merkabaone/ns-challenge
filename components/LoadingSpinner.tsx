import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
}

export function LoadingSpinner({ message = 'Loading...', size = 'md' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <Loader2 
        className={`${sizeClasses[size]} animate-spin`} 
        style={{ color: 'hsl(var(--primary))' }}
        aria-label="Loading"
      />
      {message && (
        <p className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>
          {message}
        </p>
      )}
    </div>
  )
}