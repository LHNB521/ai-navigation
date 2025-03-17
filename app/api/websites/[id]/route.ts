import { type NextRequest, NextResponse } from "next/server"
import { updateWebsite, deleteWebsite } from "@/lib/file-utils"

// PUT /api/websites/[id] - Update a website
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const websiteId = params.id
    const data = await request.json()
    const { categoryId, subCategoryId, website } = data

    // Validate required fields
    if (!categoryId || !subCategoryId || !website || !website.id || !website.name || !website.url) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const updatedWebsite = await updateWebsite(categoryId, subCategoryId, websiteId, website)
    return NextResponse.json({ categoryId, subCategoryId, website: updatedWebsite })
  } catch (error: any) {
    console.error(`Error updating website ${params.id}:`, error)
    return NextResponse.json({ error: error.message || "Failed to update website" }, { status: 500 })
  }
}

// DELETE /api/websites/[id] - Delete a website
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const websiteId = params.id
    const data = await request.json()
    const { categoryId, subCategoryId } = data

    if (!categoryId || !subCategoryId) {
      return NextResponse.json({ error: "Missing categoryId or subCategoryId" }, { status: 400 })
    }

    await deleteWebsite(categoryId, subCategoryId, websiteId)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error(`Error deleting website ${params.id}:`, error)
    return NextResponse.json({ error: error.message || "Failed to delete website" }, { status: 500 })
  }
}

