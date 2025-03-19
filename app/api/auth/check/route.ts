import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import * as jose from "jose"

// JWT密钥，应该与API路由中使用的相同
const JWT_SECRET = process.env.JWT_SECRET || "lihao-niubi-yyds"

export async function GET() {
  try {
    // 获取Cookie中的令牌
    const c = await cookies()
    const token = c.get("admin_token")?.value
    // 添加调试日志
    console.log("Auth check API - Cookie token:", token)
    console.log("Auth check API - All cookies:", cookies().getAll())

    // 如果没有令牌，返回未授权
    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    try {
      // 验证令牌
      const secret = new TextEncoder().encode(JWT_SECRET)
      const { payload } = await jose.jwtVerify(token, secret)

      // 令牌有效，返回已授权和用户信息
      return NextResponse.json({
        authenticated: true,
        user: {
          username: payload.username,
          role: payload.role,
        },
      })
    } catch (error) {
      console.error("Token verification failed in auth check API:", error)
      // 令牌无效或已过期，返回未授权
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }
  } catch (error) {
    console.error("检查登录状态失败:", error)
    return NextResponse.json({ error: "检查登录状态失败" }, { status: 500 })
  }
}

