"use client"

import { useState, useEffect, useRef } from "react"
import VirtualizedWebsiteGrid from "./virtualized-website-grid"
import TabsNavigation from "./tabs-navigation"
import type { Category } from "@/types/navigation"
import { getIconComponent } from "@/data/navigation-data"

interface ContentSectionProps {
  categories: Category[]
  activeCategoryId?: string
  activeSubCategoryId?: string
  onTabChange?: (categoryId: string, subCategoryId: string) => void
}

export default function ContentSection({
  categories,
  activeCategoryId,
  activeSubCategoryId,
  onTabChange,
}: ContentSectionProps) {
  // Store active tab for each category
  const [activeTabsMap, setActiveTabsMap] = useState<Record<string, string>>({})
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})

  // Initialize active tabs with first subcategory of each category
  useEffect(() => {
    const initialTabs: Record<string, string> = {}
    categories.forEach((category) => {
      if (category.subCategories.length > 0) {
        initialTabs[category.id] = category.subCategories[0].id
      }
    })
    setActiveTabsMap(initialTabs)
  }, [categories])

  // Update active tab when props change
  useEffect(() => {
    if (activeCategoryId && activeSubCategoryId) {
      setActiveTabsMap((prev) => ({
        ...prev,
        [activeCategoryId]: activeSubCategoryId,
      }))

      // Scroll to the section
      setTimeout(() => {
        const sectionId = activeCategoryId
        const section = sectionRefs.current[sectionId]
        if (section) {
          section.scrollIntoView({ behavior: "smooth" })
        }
      }, 100)
    }
  }, [activeCategoryId, activeSubCategoryId])

  const handleTabChange = (categoryId: string, subCategoryId: string) => {
    setActiveTabsMap((prev) => ({
      ...prev,
      [categoryId]: subCategoryId,
    }))

    if (onTabChange) {
      onTabChange(categoryId, subCategoryId)
    }
  }

  return (
    <div className="w-full p-4 md:p-6 space-y-8 md:space-y-12">
      {categories.map((category) => {
        const IconComponent = getIconComponent(category.icon)
        const activeTabId =
          activeTabsMap[category.id] || (category.subCategories.length > 0 ? category.subCategories[0].id : "")

        // 对子分类进行排序
        const sortedSubCategories = [...category.subCategories].sort((a, b) => {
          if (a.order !== undefined && b.order !== undefined) {
            return a.order - b.order
          }
          if (a.order !== undefined) return -1
          if (b.order !== undefined) return 1
          return a.name.localeCompare(b.name)
        })

        const activeSubCategory =
          sortedSubCategories.find((sub) => sub.id === activeTabId) ||
          (sortedSubCategories.length > 0 ? sortedSubCategories[0] : null)

        return (
          <section
            key={category.id}
            id={category.id}
            className="scroll-mt-16"
            ref={(el) => (sectionRefs.current[category.id] = el)}
          >
            <div className="flex items-center gap-2 mb-4 md:mb-6">
              <IconComponent className="h-5 w-5 md:h-6 md:w-6" />
              <h2 className="text-xl md:text-2xl font-bold">{category.name}</h2>
            </div>

            {category.subCategories.length > 0 && (
              <>
                <TabsNavigation
                  subCategories={sortedSubCategories}
                  activeTab={activeTabId}
                  onTabChange={(tabId) => handleTabChange(category.id, tabId)}
                />

                {activeSubCategory && (
                  <div
                    key={activeSubCategory.id}
                    id={`${category.id}-${activeSubCategory.id}`}
                    className="scroll-mt-16"
                  >
                    <VirtualizedWebsiteGrid category={category} subCategory={activeSubCategory} limit={true} />
                  </div>
                )}
              </>
            )}
          </section>
        )
      })}
    </div>
  )
}

