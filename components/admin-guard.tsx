"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/context/auth-context"

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // 只检查管理员页面而不是登录页面
    if (pathname?.startsWith("/admin") && !pathname?.startsWith("/admin/login")) {
      // 添加一个小延迟，确保 AuthContext 已完成初始化
      const timer = setTimeout(() => {
        if (!isAuthenticated) {
          router.push("/admin/login")
        }
      }, 50)

      return () => clearTimeout(timer)
    }
  }, [isAuthenticated, pathname, router])

  // 如果这是需要身份验证的管理员页面
  if (pathname?.startsWith("/admin") && !pathname?.startsWith("/admin/login")) {
    // 在检查身份验证时显示加载状态
    if (!isAuthenticated) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )
    }
  }

  // 如果身份验证检查通过或这不是管理员页面，渲染子组件
  return <>{children}</>
}

