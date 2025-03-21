import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import * as jose from "jose"

// JWT密钥，应该与API路由中使用的相同
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function middleware(request: NextRequest) {
  // Only apply to admin routes excluding the login page
  if (request.nextUrl.pathname.startsWith("/admin") && !request.nextUrl.pathname.startsWith("/admin/login")) {
    // Get the authorization header
    const authHeader = request.headers.get("authorization")

    // If no authorization header is present, redirect to login
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    const token = authHeader.substring(7)

    try {
      // Verify the token
      const secret = new TextEncoder().encode(JWT_SECRET)
      await jose.jwtVerify(token, secret)

      // Continue the request if token is valid
      return NextResponse.next()
    } catch (error) {
      // Redirect to login if token is invalid
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  // For other routes, just continue
  return NextResponse.next()
}

// Configure which paths should be handled by middleware
export const config = {
  matcher: ["/admin/:path*"],
}

