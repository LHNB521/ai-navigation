"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Category } from "@/types/navigation"
import { getIconComponent } from "@/data/navigation-data"

interface SidebarNavigationProps {
  categories: Category[]
  onCategoryClick: (categoryId: string) => void
  onSubCategoryClick: (categoryId: string, subCategoryId: string) => void
  collapsed?: boolean
  loading?: boolean
}

export default function SidebarNavigation({
  categories,
  onCategoryClick,
  onSubCategoryClick,
  collapsed = false,
  loading = false,
}: SidebarNavigationProps) {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(
    categories.reduce(
      (acc, category) => {
        acc[category.id] = true
        return acc
      },
      {} as Record<string, boolean>,
    ),
  )

  const toggleCategory = (categoryId: string) => {
    if (collapsed) {
      // If sidebar is collapsed, clicking a category should expand the sidebar
      return
    }

    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }))
  }

  const handleCategoryClick = (categoryId: string) => {
    onCategoryClick(categoryId)
  }

  const handleSubCategoryClick = (categoryId: string, subCategoryId: string) => {
    onSubCategoryClick(categoryId, subCategoryId)
  }

  if (loading) {
    return (
      <div className="w-full h-full overflow-hidden p-4">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 bg-muted rounded-md"></div>
          ))}
        </div>
      </div>
    )
  }

  // 对分类进行排序
  const sortedCategories = [...categories].sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order
    }
    if (a.order !== undefined) return -1
    if (b.order !== undefined) return 1
    return a.name.localeCompare(b.name)
  })

  return (
    <div className="w-full h-full overflow-hidden">
      <div className={cn("p-4 transition-all duration-300", collapsed && "p-2")}>
        {!collapsed && <h2 className="text-xl font-bold mb-4 whitespace-nowrap">网站导航</h2>}
        <nav>
          <ul className="space-y-1">
            {sortedCategories.map((category) => {
              const IconComponent = getIconComponent(category.icon)

              // 对子分类进行排序
              const sortedSubCategories = [...category.subCategories].sort((a, b) => {
                if (a.order !== undefined && b.order !== undefined) {
                  return a.order - b.order
                }
                if (a.order !== undefined) return -1
                if (b.order !== undefined) return 1
                return a.name.localeCompare(b.name)
              })

              return (
                <li key={category.id} className="rounded-md overflow-hidden">
                  <div
                    className={cn(
                      "flex items-center justify-between p-2 cursor-pointer hover:bg-accent rounded-md transition-all duration-300",
                      collapsed && "justify-center p-3",
                    )}
                    onClick={() => {
                      toggleCategory(category.id)
                      handleCategoryClick(category.id)
                    }}
                    title={collapsed ? category.name : undefined}
                  >
                    <div className={cn("flex items-center gap-2 min-w-0", collapsed && "gap-0")}>
                      <IconComponent className="h-4 w-4 flex-shrink-0" />
                      {!collapsed && <span className="truncate">{category.name}</span>}
                    </div>
                    {!collapsed && (
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform flex-shrink-0",
                          expandedCategories[category.id] ? "transform rotate-180" : "",
                        )}
                      />
                    )}
                  </div>
                  {!collapsed && expandedCategories[category.id] && (
                    <ul className="ml-6 mt-1 space-y-1">
                      {sortedSubCategories.map((subCategory) => (
                        <li key={subCategory.id}>
                          <button
                            className="w-full text-left p-2 text-sm hover:bg-accent rounded-md truncate"
                            onClick={() => handleSubCategoryClick(category.id, subCategory.id)}
                          >
                            {subCategory.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </div>
  )
}

