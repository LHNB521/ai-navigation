import { type NextRequest, NextResponse } from "next/server"
import { getAllSubCategories, addSubCategory } from "@/lib/file-utils"

// GET /api/subcategories - Get all subcategories
export async function GET() {
  try {
    const subcategories = await getAllSubCategories()
    return NextResponse.json(subcategories)
  } catch (error) {
    console.error("Error fetching subcategories:", error)
    return NextResponse.json({ error: "Failed to fetch subcategories" }, { status: 500 })
  }
}

// POST /api/subcategories - Create a new subcategory
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { categoryId, subCategory } = data

    // Validate required fields
    if (!categoryId || !subCategory || !subCategory.id || !subCategory.name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Initialize websites if not provided
    if (!subCategory.websites) {
      subCategory.websites = []
    }

    const newSubCategory = await addSubCategory(categoryId, subCategory)
    return NextResponse.json({ categoryId, subCategory: newSubCategory }, { status: 201 })
  } catch (error: any) {
    console.error("Error creating subcategory:", error)
    return NextResponse.json({ error: error.message || "Failed to create subcategory" }, { status: 500 })
  }
}

