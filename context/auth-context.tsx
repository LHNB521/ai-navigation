"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"

type AuthContextType = {
  isAuthenticated: boolean
  login: (token: string) => void
  logout: () => void
  token: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  // Initialize authentication state from localStorage on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem("admin_token")
    if (storedToken) {
      setToken(storedToken)
      setIsAuthenticated(true)
    }
  }, [])

  // Setup fetch interceptor to add Authorization header
  useEffect(() => {
    const originalFetch = window.fetch

    window.fetch = async (input, init) => {
      init = init || {}

      // If authenticated, add the token to all requests
      if (token) {
        init.headers = {
          ...init.headers,
          Authorization: `Bearer ${token}`,
        }
      }

      // Call the original fetch with our modified init
      return originalFetch(input, init)
    }

    // Clean up the override when component unmounts
    return () => {
      window.fetch = originalFetch
    }
  }, [token])

  const login = (newToken: string) => {
    localStorage.setItem("admin_token", newToken)
    setToken(newToken)
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem("admin_token")
    setToken(null)
    setIsAuthenticated(false)
    router.push("/admin/login")
  }

  return <AuthContext.Provider value={{ isAuthenticated, login, logout, token }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

