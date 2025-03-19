import { cookies } from "next/headers"
import * as jose from "jose"

// JWT密钥，应该与API路由中使用的相同
const JWT_SECRET = process.env.JWT_SECRET || "lihao-niubi-yyds"

// 二次验证密码，应该存储在环境变量中
export const SECOND_PASSWORD = process.env.SECOND_PASSWORD || "lhnb"

// 验证用户是否已登录
export async function isAuthenticated() {
  const c = await cookies()
  const token = c.get("admin_token")?.value

  if (!token) {
    return false
  }

  try {
    const secret = new TextEncoder().encode(JWT_SECRET)
    await jose.jwtVerify(token, secret)
    return true
  } catch (error) {
    return false
  }
}

// 验证二次密码是否正确
export function verifySecondPassword(password: string) {
  return password === SECOND_PASSWORD
}

