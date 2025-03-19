import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import * as jose from "jose"

// JWT密钥，应该与API路由中使用的相同
const JWT_SECRET = process.env.JWT_SECRET || "lihao-niubi-yyds"

export async function middleware(request: NextRequest) {
  // 只拦截管理员页面的请求，但排除登录页面
  if (request.nextUrl.pathname.startsWith("/admin") && !request.nextUrl.pathname.startsWith("/admin/login")) {
    // 获取Cookie中的令牌
    const token = request.cookies.get("admin_token")?.value

    // 如果没有令牌，重定向到登录页面
    if (!token) {
      const url = new URL("/admin/login", request.url)
      // 保存原始URL作为查询参数，以便登录后重定向回来
      url.searchParams.set("callbackUrl", encodeURIComponent(request.nextUrl.pathname))
      return NextResponse.redirect(url)
    }

    try {
      // 验证令牌
      const secret = new TextEncoder().encode(JWT_SECRET)
      await jose.jwtVerify(token, secret)

      // 令牌有效，继续请求
      return NextResponse.next()
    } catch (error) {
      // 令牌无效或已过期，重定向到登录页面
      const url = new URL("/admin/login", request.url)
      url.searchParams.set("callbackUrl", encodeURIComponent(request.nextUrl.pathname))
      return NextResponse.redirect(url)
    }
  }

  // 如果是登录页面，检查用户是否已登录
  if (request.nextUrl.pathname.startsWith("/admin/login")) {
    const token = request.cookies.get("admin_token")?.value

    if (token) {
      try {
        // 验证令牌
        const secret = new TextEncoder().encode(JWT_SECRET)
        await jose.jwtVerify(token, secret)

        // 令牌有效，用户已登录，重定向到管理员页面
        // 检查是否有回调URL
        const callbackUrl = request.nextUrl.searchParams.get("callbackUrl")
        const redirectUrl = callbackUrl ? decodeURIComponent(callbackUrl) : "/admin"
        return NextResponse.redirect(new URL(redirectUrl, request.url))
      } catch (error) {
        // 令牌无效或已过期，继续访问登录页面
      }
    }
  }

  // 对于其他路径，不做处理
  return NextResponse.next()
}

// 配置中间件应用的路径
export const config = {
  matcher: ["/admin/:path*"],
}

