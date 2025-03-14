import type { Category, SubCategory } from "@/types/navigation"
import WebsiteCard from "./website-card"

interface WebsiteGridProps {
  category: Category
  subCategory: SubCategory
}

export default function WebsiteGrid({ category, subCategory }: WebsiteGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
      {subCategory.websites.map((website) => (
        <WebsiteCard key={website.id} website={website} />
      ))}
    </div>
  )
}

