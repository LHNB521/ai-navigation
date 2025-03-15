"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Moon, Sun, ArrowUp } from "lucide-react"
import { useTheme } from "next-themes"

export default function FloatingActions() {
  const [showScrollTop, setShowScrollTop] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // After mounting, we can safely show the UI that depends on client-side features
  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle scroll event to show/hide scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      // Show button when page is scrolled down 300px
      setShowScrollTop(window.scrollY > 300)
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

