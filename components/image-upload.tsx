"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, ImageIcon } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
}

export default function ImageUpload({ value, onChange, label = "图标" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 验证文件类型
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"]
    if (!validTypes.includes(file.type)) {
      setError("不支持的文件类型，请上传JPG、PNG、GIF、WEBP或SVG格式的图片")
      return
    }

    // 验证文件大小（最大2MB）
    if (file.size > 2 * 1024 * 1024) {
      setError("文件大小不能超过2MB")
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "上传失败")
      }

      const data = await response.json()
      onChange(data.url)
    } catch (err: any) {
      console.error("上传失败:", err)
      setError(err.message || "上传失败，请重试")
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = () => {
    onChange("")
  }

  return (
    <div className="space-y-2">
      <Label>
        {label} <span className="text-xs text-muted-foreground">(可选)</span>
      </Label>

      {value ? (
        <div className="relative w-full h-32 border rounded-md overflow-hidden">
          <Image src={value || "/placeholder.svg"} alt="Uploaded image" fill className="object-contain" />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-8 w-8 rounded-full"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
          {isUploading ? (
            <div className="flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              <p className="mt-2 text-sm text-muted-foreground">上传中...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">点击或拖拽图片到此处上传</p>
              <p className="text-xs text-muted-foreground">支持JPG、PNG、GIF、WEBP和SVG格式，最大2MB</p>
            </div>
          )}
          <Input
            type="file"
            accept="image/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleUpload}
            disabled={isUploading}
          />
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex items-center gap-2">
        <Input
          type="text"
          placeholder="或输入图片URL（可选）"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1"
        />
      </div>
    </div>
  )
}

