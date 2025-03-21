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
    // Only check admin pages and not the login page
    if (pathname?.startsWith("/admin") && !pathname?.startsWith("/admin/login")) {
      if (!isAuthenticated) {
        router.push("/admin/login")
      }
    }
  }, [isAuthenticated, pathname, router])

  // If this is an admin page that requires authentication
  if (pathname?.startsWith("/admin") && !pathname?.startsWith("/admin/login")) {
    // Show loading or nothing while checking authentication
    if (!isAuthenticated) {
      return null
    }
  }

  // If authentication check passes or this is not an admin page, render children
  return <>{children}</>
}

