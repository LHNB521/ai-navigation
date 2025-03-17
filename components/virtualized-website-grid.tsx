"use client"

import type React from "react"

import { useState, useEffect } from "react"
import type { Category, SubCategory, Website } from "@/types/navigation"
import WebsiteCard from "./website-card"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { useIntersectionObserver } from "@/hooks/use-intersection-observer"

interface WebsiteChunkProps {
  websites: Website[]
  index: number
}

// This component represents a chunk of websites that will be observed
const WebsiteChunk = ({ websites, index }: WebsiteChunkProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const { ref, isIntersecting } = useIntersectionObserver({
    rootMargin: "200px", // Load a bit before they come into view
    threshold: 0,
  })

  useEffect(() => {
    if (isIntersecting && !isVisible) {
      setIsVisible(true)
    }
  }, [isIntersecting, isVisible])

  // If this is the first chunk (index 0), render it immediately
  // Otherwise, only render when it becomes visible
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4"
    >
      {isVisible || index === 0
        ? websites.map((website) => <WebsiteCard key={website.id} website={website} />)
        : // Render placeholder skeletons with the same dimensions
          websites.map((website, i) => (
            <div
              key={`placeholder-${i}`}
              className="p-2 sm:p-3 md:p-4 rounded-lg border border-border bg-card/50 animate-pulse h-[72px]"
            />
          ))}
    </div>
  )
}

interface VirtualizedWebsiteGridProps {
  category: Category
  subCategory: SubCategory
  limit?: boolean
}

export default function VirtualizedWebsiteGrid({ category, subCategory, limit = true }: VirtualizedWebsiteGridProps) {
  // Limit displayed websites if needed
  const maxWebsites = limit ? 30 : subCategory.websites.length
  const displayedWebsites = subCategory.websites.slice(0, maxWebsites)
  const hasMore = subCategory.websites.length > maxWebsites

  // 在显示网站之前对它们进行排序
  const sortedWebsites = [...displayedWebsites].sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order
    }
    if (a.order !== undefined) return -1
    if (b.order !== undefined) return 1
    return a.name.localeCompare(b.name)
  })

  // Split websites into chunks of 10 for virtualization
  const CHUNK_SIZE = 10

  // 使用排序后的网站
  const websiteChunks = Array.from({ length: Math.ceil(sortedWebsites.length / CHUNK_SIZE) }, (_, i) =>
    sortedWebsites.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE),
  )

  return (
    <div className="relative space-y-8">
      {websiteChunks.map((chunk, index) => (
        <WebsiteChunk key={`chunk-${index}`} websites={chunk} index={index} />
      ))}

      {hasMore && limit && (
        <div className="mt-4 flex justify-end">
          <Link href={`/category/${category.id}/${subCategory.id}`} passHref>
            <Button variant="outline" size="sm" className="gap-1">
              查看更多
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}

