"use client"
import { useState, useEffect, useRef } from "react"
import SidebarNavigation from "@/components/sidebar-navigation"
import ContentSection from "@/components/content-section"
import { Menu, X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMediaQuery } from "@/hooks/use-media-query"
import SearchBar from "@/components/search-bar"
import { useRouter } from "next/navigation"
import FloatingActions from "@/components/floating-actions"

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const sidebarRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // 在移动设备上自动折叠侧边栏
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false)
    } else {
      setSidebarOpen(true)
    }
  }, [isMobile])

  // 在移动设备上，点击侧边栏外部时关闭侧边栏
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setSidebarOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMobile, sidebarOpen])

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev)
  }

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }

    // 在移动设备上选择后自动关闭侧边栏
    if (isMobile) {
      setSidebarOpen(false)
    }
  }

  const handleCategoryClick = (categoryId: string) => {
    scrollToSection(categoryId)
  }

  const handleSubCategoryClick = (categoryId: string, subCategoryId: string) => {
    scrollToSection(`${categoryId}-${subCategoryId}`)
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="h-16 border-b flex items-center px-4 md:px-6 bg-background z-20">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="mr-4"
          aria-label={sidebarOpen ? "关闭侧边栏" : "打开侧边栏"}
        >
          {sidebarOpen && isMobile ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        <h1 className="text-xl md:text-2xl font-bold truncate mr-4">长江小浩 - 网站导航</h1>
        <div className="flex-1 max-w-md hidden md:block">
          <SearchBar />
        </div>
      </header>
      <main className="flex flex-1 overflow-hidden relative">
        {/* 移动设备背景 */}
        {isMobile && sidebarOpen && <div className="fixed inset-0 bg-black/50 z-10" aria-hidden="true" />}

        {/* 侧边栏 */}
        <aside
          ref={sidebarRef}
          className={`
            ${isMobile ? "fixed left-0 top-16 bottom-0 z-20" : "relative"}
            ${sidebarOpen ? (isMobile ? "w-64" : "w-64") : isMobile ? "-translate-x-full" : "w-16"}
          `}
        >
          <SidebarNavigation
            onCategoryClick={handleCategoryClick}
            onSubCategoryClick={handleSubCategoryClick}
            collapsed={!sidebarOpen}
          />
        </aside>

        {/* 主内容 */}
        <div className={`flex-1 overflow-y-auto ${isMobile && sidebarOpen ? "ml-0" : ""}`}>
          <ContentSection />
        </div>
      </main>
      {/* 移动设备搜索按钮 */}
      {isMobile && (
        <div className="fixed bottom-4 left-4 z-30 md:hidden">
          <Button size="icon" className="h-12 w-12 rounded-full shadow-lg" onClick={() => router.push("/search")}>
            <Search className="h-5 w-5" />
            <span className="sr-only">搜索</span>
          </Button>
        </div>
      )}

      {/* 添加 FloatingActions 组件 */}
      <FloatingActions />
    </div>
  )
}

