// Development-only logger that's stripped in production
const isDevelopment = process.env.NODE_ENV === 'development'

export const logger = {
  debug: (...args: any[]) => {
    if (isDevelopment) {
      console.log('[DEBUG]', ...args)
    }
  },
  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info('[INFO]', ...args)
    }
  },
  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn('[WARN]', ...args)
    }
  },
  error: (...args: any[]) => {
    if (isDevelopment) {
      console.error('[ERROR]', ...args)
    }
    // In production, you might want to send to error tracking service
    // e.g., Sentry.captureException(args[0])
  }
}