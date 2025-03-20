import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import * as jose from "jose"

// 在实际应用中，这些凭据应该存储在环境变量或数据库中
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin"
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "password"
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()

    // 验证用户名和密码
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "用户名或密码错误" }, { status: 401 })
    }

    // 创建JWT令牌
    const secret = new TextEncoder().encode(JWT_SECRET)
    const token = await new jose.SignJWT({
      username,
      role: "admin",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(secret)

    // 设置Cookie
    cookies().set({
      name: "admin_token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 24小时
      sameSite: "strict",
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("登录处理失败:", error)
    return NextResponse.json({ error: "登录处理失败" }, { status: 500 })
  }
}

