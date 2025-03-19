import { NextResponse } from "next/server"

export async function POST() {
  try {
    // 创建响应对象
    const response = NextResponse.json({ success: true })

    // 删除Cookie
    response.cookies.set({
      name: "admin_token",
      value: "",
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 0, // 立即过期
      sameSite: "lax",
    })

    return response
  } catch (error) {
    console.error("登出处理失败:", error)
    return NextResponse.json({ error: "登出处理失败" }, { status: 500 })
  }
}

