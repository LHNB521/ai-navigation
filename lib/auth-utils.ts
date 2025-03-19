import * as jose from "jose"

// JWT密钥，应该与API路由中使用的相同
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// 二次验证密码，应该存储在环境变量中
export const SECOND_PASSWORD = process.env.SECOND_PASSWORD || "second-password"

// 验证token是否有效
export async function verifyToken(token: string) {
  if (!token) {
    return false
  }

  try {
    const secret = new TextEncoder().encode(JWT_SECRET)
    const { payload } = await jose.jwtVerify(token, secret)
    return { valid: true, payload }
  } catch (error) {
    return { valid: false, error }
  }
}

// 验证二次密码是否正确
export function verifySecondPassword(password: string) {
  return password === SECOND_PASSWORD
}

