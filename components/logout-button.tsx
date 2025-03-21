"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useAuth } from "@/context/auth-context"

export default function LogoutButton() {
  const { logout } = useAuth()

  return (
    <Button variant="outline" size="sm" onClick={logout} className="gap-2">
      <LogOut className="h-4 w-4" />
      退出登录
    </Button>
  )
}

