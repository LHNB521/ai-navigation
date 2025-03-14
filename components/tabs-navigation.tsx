"use client"
import { cn } from "@/lib/utils"
import type { SubCategory } from "@/types/navigation"

interface TabsNavigationProps {
  subCategories: SubCategory[]
  activeTab: string
  onTabChange: (tabId: string) => void
}

export default function TabsNavigation({ subCategories, activeTab, onTabChange }: TabsNavigationProps) {
  return (
    <div className="border-b mb-4">
      <div className="flex overflow-x-auto hide-scrollbar">
        {subCategories.map((subCategory) => (
          <button
            key={subCategory.id}
            onClick={() => onTabChange(subCategory.id)}
            className={cn(
              "px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors",
              activeTab === subCategory.id
                ? "border-b-2 border-primary text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {subCategory.name}
          </button>
        ))}
      </div>
    </div>
  )
}

