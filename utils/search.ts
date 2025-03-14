import type { Website } from "@/types/navigation"
import { navigationData } from "@/data/bak"

// Simple fuzzy search function
export function fuzzySearch(query: string, text: string): boolean {
  if (!query) return false

  query = query.toLowerCase()
  text = text.toLowerCase()

  let i = 0
  let j = 0

  while (i < text.length && j < query.length) {
    if (text[i] === query[j]) {
      j++
    }
    i++
  }

  return j === query.length
}

// Search through all websites
export function searchWebsites(query: string): Array<{
  website: Website
  categoryId: string
  categoryName: string
  subCategoryId: string
  subCategoryName: string
}> {
  if (!query || query.trim() === "") return []

  const results: Array<{
    website: Website
    categoryId: string
    categoryName: string
    subCategoryId: string
    subCategoryName: string
  }> = []

  navigationData.forEach((category) => {
    category.subCategories.forEach((subCategory) => {
      subCategory.websites.forEach((website) => {
        if (
          fuzzySearch(query, website.name) ||
          fuzzySearch(query, website.description) ||
          fuzzySearch(query, category.name) ||
          fuzzySearch(query, subCategory.name)
        ) {
          results.push({
            website,
            categoryId: category.id,
            categoryName: category.name,
            subCategoryId: subCategory.id,
            subCategoryName: subCategory.name,
          })
        }
      })
    })
  })

  return results
}

