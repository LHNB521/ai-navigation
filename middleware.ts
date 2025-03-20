import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import * as jose from "jose"

// JWT密钥，应该与API路由中使用的相同
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function middleware(request: NextRequest) {
  // 只拦截管理员页面的请求，但排除登录页面
  if (!request.nextUrl.pathname.startsWith("/admin") && !request.nextUrl.pathname.startsWith("/admin/login")) {
    // 获取Cookie中的令牌
    const token = request.cookies.get("admin_token")?.value

    // 如果没有令牌，重定向到登录页面
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    try {
      // 验证令牌
      const secret = new TextEncoder().encode(JWT_SECRET)
      await jose.jwtVerify(token, secret)

      // 令牌有效，继续请求
      return NextResponse.next()
    } catch (error) {
      // 令牌无效或已过期，重定向到登录页面
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  // 对于其他路径，不做处理
  return NextResponse.next()
}

// 配置中间件应用的路径
export const config = {
  matcher: ["/admin/:path*"],
}

