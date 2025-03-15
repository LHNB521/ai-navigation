import type { Category, SubCategory } from "@/types/navigation"
import WebsiteCard from "./website-card"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import Link from "next/link"

interface WebsiteGridProps {
  category: Category
  subCategory: SubCategory
  limit?: boolean
}

export default function WebsiteGrid({ category, subCategory, limit = true }: WebsiteGridProps) {
  // 限制显示的网站数量，最多6行，每行5个，共30个
  const maxWebsites = limit ? 30 : subCategory.websites.length
  const displayedWebsites = subCategory.websites.slice(0, maxWebsites)
  const hasMore = subCategory.websites.length > maxWebsites

  return (
    <div className="relative">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
        {displayedWebsites.map((website) => (
          <WebsiteCard key={website.id} website={website} />
        ))}
      </div>

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

