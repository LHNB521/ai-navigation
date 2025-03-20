"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { searchWebsites } from "@/utils/search"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import SearchBar from "@/components/search-bar"
import FloatingActions from "@/components/floating-actions"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchResults = async () => {
      if (query) {
        setLoading(true)
        setError(null)
        try {
          const searchResults = await searchWebsites(query)
          setResults(searchResults)
        } catch (err) {
          console.error("搜索失败:", err)
          setError("搜索失败，请重试")
        } finally {
          setLoading(false)
        }
      }
    }

    fetchResults()
  }, [query])

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-16 items-center px-4">
          <Link href="/" passHref>
            <Button variant="ghost" size="icon" className="mr-4">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">返回首页</span>
            </Button>
          </Link>
          <h1 className="text-xl font-bold mr-4 hidden sm:block">搜索结果</h1>
          <div className="flex-1 max-w-md">
            <SearchBar />
          </div>
        </div>
      </header>

      <main className="container px-4 py-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">
            {loading
              ? "搜索中..."
              : error
                ? error
                : results.length > 0
                  ? `找到 ${results.length} 个与 "${query}" 相关的结果`
                  : `未找到与 "${query}" 相关的结果`}
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {results.map((result, index) => (
              <a
                key={`${result.website.id}-${index}`}
                href={result.website.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col rounded-lg border p-4 hover:border-primary transition-colors"
              >
                <div className="flex items-center gap-3 mb-2">
                  {/* 修改图片处理逻辑，使用默认图标 */}
                  <Image
                    src={result.website.icon || "/placeholder.svg?height=32&width=32"}
                    alt={result.website.name}
                    width={32}
                    height={32}
                    className="rounded-md"
                  />
                  <h3 className="font-medium">{result.website.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{result.website.description}</p>
                <div className="mt-auto pt-2 text-xs text-muted-foreground border-t">
                  {result.categoryName} / {result.subCategoryName}
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">尝试使用不同的关键词搜索</p>
            <Link href="/" passHref>
              <Button variant="outline" className="mt-4">
                返回首页
              </Button>
            </Link>
          </div>
        )}
      </main>
      <FloatingActions />
    </div>
  )
}

