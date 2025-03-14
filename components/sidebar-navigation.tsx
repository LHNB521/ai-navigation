"use client"

import { useState } from "react"
import { navigationData, getIconComponent } from "@/data/navigation-data"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarNavigationProps {
  onCategoryClick: (categoryId: string) => void
  onSubCategoryClick: (categoryId: string, subCategoryId: string) => void
  collapsed?: boolean
}

export default function SidebarNavigation({
  onCategoryClick,
  onSubCategoryClick,
  collapsed = false,
}: SidebarNavigationProps) {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(
    navigationData.reduce(
      (acc, category) => {
        acc[category.id] = false
        return acc
      },
      {} as Record<string, boolean>,
    ),
  )

  const toggleCategory = (categoryId: string) => {
    if (collapsed) {
      // 如果侧边栏折叠，点击分类应该展开侧边栏
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

  return (
    <div className="w-full h-full overflow-auto">
      <div className={cn("p-4", collapsed && "p-2")}>
        {!collapsed && <h2 className="text-xl font-bold mb-4">AI工具导航</h2>}
        <nav>
          <ul className="space-y-1">
            {navigationData.map((category) => {
              const IconComponent = getIconComponent(category.icon)
              return (
                <li key={category.id} className="rounded-md overflow-hidden">
                  <div
                    className={cn(
                      "flex items-center justify-between p-2 cursor-pointer hover:bg-accent rounded-md",
                      collapsed && "justify-center p-3",
                    )}
                    onClick={() => {
                      toggleCategory(category.id)
                      handleCategoryClick(category.id)
                    }}
                    title={collapsed ? category.name : undefined}
                  >
                    <div className={cn("flex items-center gap-2", collapsed && "gap-0")}>
                      <IconComponent className="h-4 w-4" />
                      {!collapsed && <span>{category.name}</span>}
                    </div>
                    {!collapsed && (
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform",
                          expandedCategories[category.id] ? "transform rotate-180" : "",
                        )}
                      />
                    )}
                  </div>
                  {!collapsed && expandedCategories[category.id] && (
                    <ul className="ml-6 mt-1 space-y-1">
                      {category.subCategories.map((subCategory) => (
                        <li key={subCategory.id}>
                          <button
                            className="w-full text-left p-2 text-sm hover:bg-accent rounded-md"
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

