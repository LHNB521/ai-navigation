import { type NextRequest, NextResponse } from "next/server"
import { getAllWebsites, addWebsite } from "@/lib/file-utils"

// GET /api/websites - Get all websites
export async function GET() {
  try {
    const websites = await getAllWebsites()
    return NextResponse.json(websites)
  } catch (error) {
    console.error("Error fetching websites:", error)
    return NextResponse.json({ error: "Failed to fetch websites" }, { status: 500 })
  }
}

// POST /api/websites - Create a new website
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { categoryId, subCategoryId, website } = data

    // Validate required fields
    if (!categoryId || !subCategoryId || !website || !website.id || !website.name || !website.url) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newWebsite = await addWebsite(categoryId, subCategoryId, website)
    return NextResponse.json({ categoryId, subCategoryId, website: newWebsite }, { status: 201 })
  } catch (error: any) {
    console.error("Error creating website:", error)
    return NextResponse.json({ error: error.message || "Failed to create website" }, { status: 500 })
  }
}

