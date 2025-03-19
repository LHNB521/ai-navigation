import { NextResponse } from "next/server"
import * as jose from "jose"

// 在实际应用中，这些凭据应该存储在环境变量或数据库中
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "lh"
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "lh521"
const JWT_SECRET = process.env.JWT_SECRET || "lihao-niubi-yyds"

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

    // 创建响应对象
    const response = NextResponse.json({ success: true })

    // 设置Cookie - 修改Cookie设置以解决域名问题
    response.cookies.set({
      name: "admin_token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 24小时
      sameSite: "none", // 使用lax而不是strict，允许跨站点导航时发送Cookie
      // 不设置domain，让浏览器自动设置为当前域名
    })

    return response
  } catch (error) {
    console.error("登录处理失败:", error)
    return NextResponse.json({ error: "登录处理失败" }, { status: 500 })
  }
}

