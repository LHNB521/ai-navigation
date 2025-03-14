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
  const [results, setResults] = useState<ReturnType<typeof searchWebsites>>([])
  const [isOpen, setIsOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Handle search input change
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)

    if (value.trim()) {
      const searchResults = searchWebsites(value)
      setResults(searchResults)
      setIsOpen(true)
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
    router.push(`/#${categoryId}-${subCategoryId}`)
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

      {isOpen && results.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
          <div className="max-h-[60vh] overflow-auto p-2">
            <div className="space-y-1">
              {results.slice(0, 8).map((result, index) => (
                <div
                  key={`${result.website.id}-${index}`}
                  className="flex cursor-pointer items-center rounded-md p-2 hover:bg-accent"
                >
                  <div className="flex-1 mr-2" onClick={() => handleResultClick(result.website.url)}>
                    <div className="flex items-center">
                      {result.website.icon && (
                        <Image
                          src={result.website.icon || "/placeholder.svg"}
                          alt={result.website.name}
                          width={20}
                          height={20}
                          className="mr-2 rounded-sm"
                        />
                      )}
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
          </div>
        </div>
      )}
    </div>
  )
}

