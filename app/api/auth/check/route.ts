import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import * as jose from "jose"

// JWT密钥，应该与API路由中使用的相同
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function GET() {
  try {
    // 获取Cookie中的令牌
    const c = await cookies()
    const token = c.get("admin_token")?.value

    // 如果没有令牌，返回未授权
    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    try {
      // 验证令牌
      const secret = new TextEncoder().encode(JWT_SECRET)
      await jose.jwtVerify(token, secret)

      // 令牌有效，返回已授权
      return NextResponse.json({ authenticated: true })
    } catch (error) {
      // 令牌无效或已过期，返回未授权
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }
  } catch (error) {
    console.error("检查登录状态失败:", error)
    return NextResponse.json({ error: "检查登录状态失败" }, { status: 500 })
  }
}

