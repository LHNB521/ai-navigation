import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { v4 as uuidv4 } from "uuid"

// 确保上传目录存在
async function ensureUploadDir() {
  const uploadDir = path.join(process.cwd(), "public", "uploads")
  try {
    await mkdir(uploadDir, { recursive: true })
  } catch (error) {
    console.error("Failed to create upload directory:", error)
  }
  return uploadDir
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    // 验证文件类型
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"]
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 })
    }

    // 获取文件扩展名
    const fileExt = file.name.split(".").pop()?.toLowerCase() || "png"

    // 生成唯一文件名
    const fileName = `${uuidv4()}.${fileExt}`

    // 确保上传目录存在
    const uploadDir = await ensureUploadDir()

    // 文件保存路径
    const filePath = path.join(uploadDir, fileName)

    // 保存文件
    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(filePath, buffer)

    // 返回文件URL - 使用绝对路径
    const fileUrl = `/uploads/${fileName}`

    return NextResponse.json({ url: fileUrl })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}

