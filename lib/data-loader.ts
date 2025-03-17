import type { Category } from "@/types/navigation"

// Load all categories from the API
export async function loadCategories(): Promise<Category[]> {
  try {
    const response = await fetch("/api/categories", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error loading categories:", error)
    return []
  }
}

// Load all subcategories from the API
export async function loadSubCategories(): Promise<{ categoryId: string; subCategory: any }[]> {
  try {
    const response = await fetch("/api/subcategories", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch subcategories: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error loading subcategories:", error)
    return []
  }
}

// Load all websites from the API
export async function loadWebsites(): Promise<{ categoryId: string; subCategoryId: string; website: any }[]> {
  try {
    const response = await fetch("/api/websites", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch websites: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error("Error loading websites:", error)
    return []
  }
}

