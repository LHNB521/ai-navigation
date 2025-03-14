"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Moon, Sun, ArrowUp } from "lucide-react"
import { useTheme } from "next-themes"

export default function FloatingActions() {
  const [showScrollTop, setShowScrollTop] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // 挂载完成后，我们可以安全地展示依赖客户端特性的用户界面
  useEffect(() => {
    setMounted(true)
  }, [])

  // 处理滚动事件以显示/隐藏返回顶部按钮
  useEffect(() => {
    const handleScroll = () => {
      // 当页面向下滚动100像素时显示按钮
      setShowScrollTop(window.scrollY > 100)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  // Toggle theme function
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) return null

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-2">
      {/* Scroll to top button */}
      {showScrollTop && (
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-full shadow-lg bg-background transition-transform hover:scale-110"
          onClick={scrollToTop}
          aria-label="回到顶部"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      )}

      {/* Theme toggle button */}
      <Button
        variant="outline"
        size="icon"
        className="h-10 w-10 rounded-full shadow-lg bg-background transition-transform hover:scale-110"
        onClick={toggleTheme}
        aria-label={theme === "dark" ? "切换到亮色模式" : "切换到暗色模式"}
      >
        {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </Button>
    </div>
  )
}

