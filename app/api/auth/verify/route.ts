import { NextResponse } from "next/server"
import * as jose from "jose"

// JWT密钥，应该与API路由中使用的相同
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function GET(request: Request) {
  try {
    // 从Authorization头获取token
    const authHeader = request.headers.get("Authorization")
    const token = authHeader ? authHeader.replace("Bearer ", "") : null

    if (!token) {
      return NextResponse.json({ error: "未提供令牌" }, { status: 401 })
    }

    try {
      // 验证令牌
      const secret = new TextEncoder().encode(JWT_SECRET)
      const { payload } = await jose.jwtVerify(token, secret)

      return NextResponse.json({
        valid: true,
        user: {
          username: payload.username,
          role: payload.role,
        },
      })
    } catch (error) {
      return NextResponse.json({ valid: false, error: "令牌无效或已过期" }, { status: 401 })
    }
  } catch (error) {
    console.error("验证令牌失败:", error)
    return NextResponse.json({ error: "验证令牌失败" }, { status: 500 })
  }
}

