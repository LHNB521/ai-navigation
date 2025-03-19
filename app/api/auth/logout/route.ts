import { NextResponse } from "next/server"

export async function POST() {
  try {
    // 创建响应对象
    const response = NextResponse.json({ success: true })

    // 删除Cookie - 确保使用相同的路径和域名设置
    response.cookies.set({
      name: "admin_token",
      value: "",
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 0, // 立即过期
      sameSite: "lax",
      // 不设置domain，让浏览器自动设置为当前域名
    })

    return response
  } catch (error) {
    console.error("登出处理失败:", error)
    return NextResponse.json({ error: "登出处理失败" }, { status: 500 })
  }
}

