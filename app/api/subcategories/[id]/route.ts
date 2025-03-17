import { type NextRequest, NextResponse } from "next/server"
import { updateSubCategory, deleteSubCategory } from "@/lib/file-utils"

// PUT /api/subcategories/[id] - Update a subcategory
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const subCategoryId = params.id
    const data = await request.json()
    const { categoryId, subCategory } = data

    // Validate required fields
    if (!categoryId || !subCategory || !subCategory.id || !subCategory.name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const updatedSubCategory = await updateSubCategory(categoryId, subCategoryId, subCategory)
    return NextResponse.json({ categoryId, subCategory: updatedSubCategory })
  } catch (error: any) {
    console.error(`Error updating subcategory ${params.id}:`, error)
    return NextResponse.json({ error: error.message || "Failed to update subcategory" }, { status: 500 })
  }
}

// DELETE /api/subcategories/[id] - Delete a subcategory
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const subCategoryId = params.id
    const { categoryId } = await request.json()

    if (!categoryId) {
      return NextResponse.json({ error: "Missing categoryId" }, { status: 400 })
    }

    await deleteSubCategory(categoryId, subCategoryId)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error(`Error deleting subcategory ${params.id}:`, error)
    return NextResponse.json({ error: error.message || "Failed to delete subcategory" }, { status: 500 })
  }
}

