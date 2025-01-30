import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get("auth_token")
  const conductorAuthToken = request.cookies.get("conductor_auth_token")

  // Public paths that don't require authentication
  const publicPaths = ["/login", "/register", "/conductor-login"]
  const isPublicPath = publicPaths.some((path) => request.nextUrl.pathname.startsWith(path))

  // API paths that don't require authentication
  const isApiAuthPath = request.nextUrl.pathname.startsWith("/api/auth")

  // Static files and other paths that should be ignored
  const isStaticPath = request.nextUrl.pathname.match(/\.(js|css|ico|png|jpg|jpeg|svg|woff|woff2)$/)

  // If it's a public path, API path, or static file, allow access
  if (isPublicPath || isApiAuthPath || isStaticPath) {
    return NextResponse.next()
  }

  // Check for conductor-specific paths
  const isConductorPath =
    request.nextUrl.pathname.startsWith("/conductor") || request.nextUrl.pathname === "/conductor-dashboard"

  // Allow access to all paths without redirection
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
}

