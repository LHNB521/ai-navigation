"use client"
import { useState, useEffect, useRef } from "react"
import SidebarNavigation from "@/components/sidebar-navigation"
import ContentSection from "@/components/content-section"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMediaQuery } from "@/hooks/use-media-query"
import SearchBar from "@/components/search-bar"
import { useRouter } from "next/navigation"
import FloatingActions from "@/components/floating-actions"
import Link from "next/link"
import { fetchCategories } from "@/lib/api-client"
import type { Category } from "@/types/navigation"
import { useAuth } from "@/context/auth-context"
import MobileSearchFloat from "@/components/mobile-search-float"

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeCategoryId, setActiveCategoryId] = useState<string | undefined>()
  const [activeSubCategoryId, setActiveSubCategoryId] = useState<string | undefined>()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const isMobile = useMediaQuery("(max-width: 768px)")
  const sidebarRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  // 加载分类数据
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const data = await fetchCategories()
        setCategories(data)
        setError(null)
      } catch (err) {
        console.error("Failed to load categories:", err)
        setError("加载数据失败，请刷新页面重试")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Auto-collapse sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false)
    } else {
      setSidebarOpen(true)
    }
  }, [isMobile])

  // Close sidebar when clicking outside on mobile
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

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategoryId(categoryId)
    // Don't reset subcategory when clicking on a category
    scrollToSection(categoryId)
  }

  const handleSubCategoryClick = (categoryId: string, subCategoryId: string) => {
    setActiveCategoryId(categoryId)
    setActiveSubCategoryId(subCategoryId)
    scrollToSection(categoryId)
  }

  const handleTabChange = (categoryId: string, subCategoryId: string) => {
    // Update URL hash without scrolling
    window.history.replaceState(null, "", `#${categoryId}-${subCategoryId}`)
  }

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }

    // Auto close sidebar after selection on mobile
    if (isMobile) {
      setSidebarOpen(false)
    }
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
        <h1 className="text-xl md:text-2xl font-bold truncate mr-4">一行代码 - 导航</h1>
        <div className="flex-1 max-w-md hidden md:block">
          <SearchBar />
        </div>
        <Link className="flex flex-1" href={isAuthenticated ? "/admin" : "/admin/login"} passHref>
          <Button variant="outline" size="sm" className="ml-auto">
            管理员
          </Button>
        </Link>
      </header>
      <main className="flex flex-1 overflow-hidden relative">
        {/* Backdrop for mobile */}
        {isMobile && sidebarOpen && <div className="fixed inset-0 bg-black/50 z-10" aria-hidden="true" />}

        {/* Sidebar */}
        <aside
          ref={sidebarRef}
          className={`
            ${isMobile ? "fixed left-0 top-16 bottom-0 z-20" : "relative"}
            ${sidebarOpen ? (isMobile ? "w-64" : "w-64") : isMobile ? "-translate-x-full" : "w-16"}
            border-r bg-background overflow-hidden transition-all duration-300 ease-in-out
          `}
        >
          <SidebarNavigation
            categories={categories}
            onCategoryClick={handleCategoryClick}
            onSubCategoryClick={handleSubCategoryClick}
            collapsed={!sidebarOpen}
            loading={loading}
          />
        </aside>

        {/* Main content */}
        <div className={`flex-1 overflow-y-auto ${isMobile && sidebarOpen ? "ml-0" : ""}`}>
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>刷新页面</Button>
            </div>
          ) : (
            <ContentSection
              categories={categories}
              activeCategoryId={activeCategoryId}
              activeSubCategoryId={activeSubCategoryId}
              onTabChange={handleTabChange}
            />
          )}
        </div>
      </main>
      {/* Floating search for mobile */}
      {isMobile && <MobileSearchFloat />}

      {/* Add the FloatingActions component here */}
      <FloatingActions />
    </div>
  )
}

