import { type NextRequest, NextResponse } from "next/server"
import { getAllCategories, createCategory, sortCategories } from "@/lib/file-utils"
import type { Category } from "@/types/navigation"

// GET /api/categories - Get all categories
export async function GET() {
  try {
    const categories = await getAllCategories()
    // 对分类进行排序
    const sortedCategories = sortCategories(categories)
    return NextResponse.json(sortedCategories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

// POST /api/categories - Create a new category
export async function POST(request: NextRequest) {
  try {
    const category: Category = await request.json()

    // Validate required fields
    if (!category.id || !category.name || !category.icon) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Initialize subcategories if not provided
    if (!category.subCategories) {
      category.subCategories = []
    }

    const newCategory = await createCategory(category)
    return NextResponse.json(newCategory, { status: 201 })
  } catch (error: any) {
    console.error("Error creating category:", error)
    return NextResponse.json({ error: error.message || "Failed to create category" }, { status: 500 })
  }
}

