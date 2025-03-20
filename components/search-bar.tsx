"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { searchWebsites } from "@/utils/search"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function SearchBar() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Handle search input change
  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)

    if (value.trim()) {
      setIsLoading(true)
      try {
        const searchResults = await searchWebsites(value)
        setResults(searchResults)
        setIsOpen(true)
      } catch (error) {
        console.error("搜索失败:", error)
      } finally {
        setIsLoading(false)
      }
    } else {
      setResults([])
      setIsOpen(false)
    }
  }

  // Clear search
  const clearSearch = () => {
    setQuery("")
    setResults([])
    setIsOpen(false)
  }

  // Handle clicking outside to close results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Navigate to search page with query
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
      setIsOpen(false)
    }
  }

  // Navigate to website
  const handleResultClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer")
    setIsOpen(false)
  }

  // Navigate to category section
  const handleCategoryClick = (categoryId: string, subCategoryId: string) => {
    router.push(`/#${categoryId}`)

    // Add a small delay to ensure the page has loaded before trying to set the active tab
    setTimeout(() => {
      // Create and dispatch a custom event to notify the ContentSection component
      const event = new CustomEvent("setActiveTab", {
        detail: { categoryId, subCategoryId },
      })
      window.dispatchEvent(event)
    }, 100)

    setIsOpen(false)
  }

  return (
    <div className="relative w-full max-w-md" ref={searchRef}>
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="搜索网站..." className="pl-9 pr-10" value={query} onChange={handleSearch} />
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 h-full px-3"
              onClick={clearSearch}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">清除搜索</span>
            </Button>
          )}
        </div>
      </form>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
          <div className="max-h-[60vh] overflow-auto p-2">
            {isLoading ? (
              <div className="flex justify-center p-4">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-1">
                {results.slice(0, 8).map((result, index) => (
                  <div
                    key={`${result.website.id}-${index}`}
                    className="flex cursor-pointer items-center rounded-md p-2 hover:bg-accent"
                  >
                    <div className="flex-1 mr-2" onClick={() => handleResultClick(result.website.url)}>
                      <div className="flex items-center">
                        {/* 修改图片处理逻辑，使用默认图标 */}
                        <Image
                          src={result.website.icon || "/placeholder.svg?height=20&width=20"}
                          alt={result.website.name}
                          width={20}
                          height={20}
                          className="mr-2 rounded-sm"
                        />
                        <span className="font-medium">{result.website.name}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">{result.website.description}</div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-auto py-1 px-2 text-xs"
                      onClick={() => handleCategoryClick(result.categoryId, result.subCategoryId)}
                    >
                      {result.categoryName} / {result.subCategoryName}
                    </Button>
                  </div>
                ))}

                {results.length > 8 && (
                  <Button variant="ghost" className="w-full justify-center text-sm" onClick={handleSearchSubmit}>
                    查看全部 {results.length} 个结果
                  </Button>
                )}
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-muted-foreground">未找到相关结果</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

