import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(request: NextRequest, token: any) {
    const response = NextResponse.next()
    
    // Skip authentication for webhook endpoints
    if (request.nextUrl.pathname.startsWith('/api/webhook/')) {
      return response
    }
    
    // Check admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
      if (!token || token.role !== 'ADMIN' || !token.isActive) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }

  // Security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  // CORS headers for API routes (excluding NextAuth)
  if (request.nextUrl.pathname.startsWith('/api/') && !request.nextUrl.pathname.startsWith('/api/auth/')) {
    const origin = request.headers.get('origin')
    const allowedOrigins = [
      process.env.NEXTAUTH_URL,
      'http://localhost:3000',
      'https://yourdomain.com' // Add your production domain
    ].filter(Boolean)

    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin)
    }

    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    response.headers.set('Access-Control-Allow-Credentials', 'true')
  }

  // Rate limiting headers (basic)
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
  response.headers.set('X-RateLimit-IP', ip)

  // CSP header for production
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://accounts.google.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: https://lh3.googleusercontent.com https://lh4.googleusercontent.com https://lh5.googleusercontent.com https://lh6.googleusercontent.com; font-src 'self' data:; connect-src 'self' https://accounts.google.com https://oauth2.googleapis.com https://gmail.googleapis.com https://www.googleapis.com https://unifyintent.com; frame-src https://accounts.google.com;"
    )
  }

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 200, headers: response.headers })
  }

    return response
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to public routes, webhooks, and health endpoints
        if (req.nextUrl.pathname === '/' || 
            req.nextUrl.pathname.startsWith('/auth/') ||
            req.nextUrl.pathname.startsWith('/api/auth/') ||
            req.nextUrl.pathname.startsWith('/api/webhook/') ||
            req.nextUrl.pathname === '/api/health' ||
            req.nextUrl.pathname === '/api/test-env' ||
            req.nextUrl.pathname === '/api/test-google-sheets' ||
            req.nextUrl.pathname === '/api/test-n8n-integration' ||
            req.nextUrl.pathname.startsWith('/api/stats') ||
            req.nextUrl.pathname === '/api/log-action') {
          return true
        }
        // Require authentication for protected routes
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
