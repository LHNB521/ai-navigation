import { type NextRequest, NextResponse } from "next/server"
import { getCategoryById, updateCategory, deleteCategory } from "@/lib/file-utils"
import type { Category } from "@/types/navigation"

// GET /api/categories/[id] - Get a category by ID
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const category = await getCategoryById(id)

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error(`Error fetching category ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 })
  }
}

// PUT /api/categories/[id] - Update a category
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const category: Category = await request.json()

    // Validate required fields
    if (!category.id || !category.name || !category.icon) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const updatedCategory = await updateCategory(id, category)
    return NextResponse.json(updatedCategory)
  } catch (error: any) {
    console.error(`Error updating category ${params.id}:`, error)
    return NextResponse.json({ error: error.message || "Failed to update category" }, { status: 500 })
  }
}

// DELETE /api/categories/[id] - Delete a category
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    await deleteCategory(id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error(`Error deleting category ${params.id}:`, error)
    return NextResponse.json({ error: error.message || "Failed to delete category" }, { status: 500 })
  }
}

