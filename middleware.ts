// middleware.ts
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname
    
    // Allow access to conductor-login without redirection
    if (path === "/conductor-login") {
      return NextResponse.next()
    }

    // Redirect authenticated users away from auth pages
    if (token && (path === "/login" || path === "/register")) {
      return NextResponse.redirect(new URL("/", req.url))
    }

    // Redirect conductores to their dashboard
    if (token?.type === "conductor" && path === "/") {
      return NextResponse.redirect(new URL("/conductor-dashboard", req.url))
    }

    // Protect conductor routes
    if (path.startsWith("/conductor-") || path.startsWith("/conductor/") && token?.type !== "conductor") {
      return NextResponse.redirect(new URL("/conductor-login", req.url))
    }

    // Protect admin routes
    if (path.startsWith("/admin") && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname
        
        // Allow public paths
        if (path === "/login" || path === "/conductor-login" || path === "/register") {
          return true
        }
        
        // Require authentication for all other routes
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    // Auth pages
    '/login',
    '/conductor-login',
    '/register',
    
    // Admin paths
    '/',
    '/dashboard',
    '/partes/:path*',  // Covers /partes, /partes/nuevo, /partes/editar/:id
    '/lineas',
    '/conductores',
    '/transportistas',
    '/clientes',
    '/materiales',
    
    // Conductor paths
    '/conductor-dashboard',
    '/conductor/partes/:path*',  // Covers /conductor/partes/[id]
    '/conductor/nuevo-parte',
    
    // Exclude Next.js internals
    '/((?!api|_next/static|_next/image|favicon.ico).*)'
  ]
}