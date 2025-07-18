import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple in-memory rate limiter (in production, use Redis or similar)
const rateLimit = new Map<string, { count: number; resetTime: number }>()

const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 60 // 60 requests per minute

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : 'unknown'
  return `${ip}:${request.nextUrl.pathname}`
}

export async function middleware(req: NextRequest) {
  // Add security headers
  const res = NextResponse.next()
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('X-Frame-Options', 'DENY')
  res.headers.set('X-XSS-Protection', '1; mode=block')
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.headers.set('Permissions-Policy', 'camera=(self), microphone=(self), geolocation=()')

  // Rate limiting for API routes
  if (req.nextUrl.pathname.startsWith('/api/')) {
    const key = getRateLimitKey(req)
    const now = Date.now()
    const limit = rateLimit.get(key)

    if (limit) {
      if (now < limit.resetTime) {
        if (limit.count >= RATE_LIMIT_MAX_REQUESTS) {
          return new NextResponse('Too Many Requests', {
            status: 429,
            headers: {
              'Retry-After': String(Math.ceil((limit.resetTime - now) / 1000)),
              'X-RateLimit-Limit': String(RATE_LIMIT_MAX_REQUESTS),
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': new Date(limit.resetTime).toISOString(),
            },
          })
        }
        limit.count++
      } else {
        limit.count = 1
        limit.resetTime = now + RATE_LIMIT_WINDOW
      }
    } else {
      rateLimit.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    }

    // Clean up old entries periodically
    if (Math.random() < 0.01) {
      const entries = Array.from(rateLimit.entries())
      for (const [k, v] of entries) {
        if (now > v.resetTime) {
          rateLimit.delete(k)
        }
      }
    }
  }
  
  // Create a Supabase client configured to use cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          req.cookies.set({
            name,
            value,
            ...options,
          })
          res.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          req.cookies.set({
            name,
            value: '',
            ...options,
          })
          res.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Refresh session if expired - required for Server Components
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/profile', '/swipe']
  const isProtectedRoute = protectedRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  )

  // Auth routes that should redirect if already authenticated
  const authRoutes = ['/auth']
  const isAuthRoute = authRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  )

  // If user is not authenticated and trying to access protected route
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL('/', req.url)
    return NextResponse.redirect(redirectUrl)
  }

  // If user is authenticated and trying to access auth pages
  if (isAuthRoute && session) {
    const redirectTo = req.nextUrl.searchParams.get('redirectTo') || '/dashboard'
    return NextResponse.redirect(new URL(redirectTo, req.url))
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}