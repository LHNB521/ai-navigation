"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { searchWebsites } from "@/utils/search"
import Image from "next/image"

export default function MobileSearchFloat() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // 打开搜索框并聚焦
  const openSearch = () => {
    if (isOpen) {
      setIsOpen(false)
      return
    }
    setIsOpen(true)
    // 使用setTimeout确保DOM已更新
    setTimeout(() => {
      inputRef.current?.focus()
    }, 10)
  }

  // 关闭搜索框
  const closeSearch = () => {
    setIsOpen(false)
    setQuery("")
    setResults([])
  }

  // 处理搜索输入变化
  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)

    if (value.trim()) {
      setIsLoading(true)
      try {
        const searchResults = await searchWebsites(value)
        setResults(searchResults)
      } catch (error) {
        console.error("搜索失败:", error)
      } finally {
        setIsLoading(false)
      }
    } else {
      setResults([])
    }
  }

  // 处理搜索提交
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
      closeSearch()
    }
  }

  // 处理点击搜索结果
  const handleResultClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer")
    closeSearch()
  }

  // 处理点击分类
  const handleCategoryClick = (categoryId: string, subCategoryId: string) => {
    router.push(`/#${categoryId}`)

    // 添加延迟确保页面加载后再设置活动标签
    setTimeout(() => {
      const event = new CustomEvent("setActiveTab", {
        detail: { categoryId, subCategoryId },
      })
      window.dispatchEvent(event)
    }, 100)

    closeSearch()
  }

  // 处理点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        closeSearch()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="fixed bottom-4 left-4 z-30 md:hidden" ref={searchRef}>
      <Button size="icon" className="h-12 w-12 rounded-full shadow-lg" onClick={openSearch} aria-label="搜索">
        <Search className="h-5 w-5" />
        <span className="sr-only">搜索</span>
      </Button>

      {isOpen && (
        <div className="absolute bottom-0 left-16 bg-background border rounded-lg shadow-lg p-2 w-[calc(100vw-5rem)] max-w-md">
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="relative flex items-center">
              <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
              <Input
                ref={inputRef}
                type="search"
                placeholder="搜索网站..."
                className="pl-9 pr-10 w-3/4"
                value={query}
                onChange={handleSearch}
                autoComplete="off"
              />
              {query && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 h-full px-3"
                  onClick={() => {
                    setQuery("")
                    setResults([])
                    inputRef.current?.focus()
                  }}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">清除搜索</span>
                </Button>
              )}
            </div>
          </form>

          {query.trim() !== "" && (
            <div className="mt-2 max-h-[50vh] overflow-auto">
              {isLoading ? (
                <div className="flex justify-center p-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-1">
                  {results.slice(0, 5).map((result, index) => (
                    <div
                      key={`${result.website.id}-${index}`}
                      className="flex cursor-pointer items-center rounded-md p-2 hover:bg-accent"
                    >
                      <div className="flex-1 mr-2" onClick={() => handleResultClick(result.website.url)}>
                        <div className="flex items-center">
                          <Image
                            src={
                              result.website.icon && result.website.icon.trim() !== ""
                                ? result.website.icon.startsWith("/")
                                  ? result.website.icon
                                  : `/${result.website.icon}`
                                : "/placeholder.svg?height=20&width=20"
                            }
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

                  {results.length > 5 && (
                    <Button variant="ghost" className="w-full justify-center text-sm" onClick={handleSearchSubmit}>
                      查看全部 {results.length} 个结果
                    </Button>
                  )}
                </div>
              ) : (
                <div className="p-4 text-center text-sm text-muted-foreground">未找到相关结果</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

