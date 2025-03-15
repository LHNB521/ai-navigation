"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { navigationData, getIconComponent } from "@/data/navigation-data"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import FloatingActions from "@/components/floating-actions"
import Link from "next/link"
import VirtualizedWebsiteGrid from "@/components/virtualized-website-grid"

export default function CategoryPage() {
  const params = useParams()
  const router = useRouter()
  const [category, setCategory] = useState<any>(null)
  const [subCategory, setSubCategory] = useState<any>(null)

  useEffect(() => {
    if (params.categoryId && params.subCategoryId) {
      const foundCategory = navigationData.find((cat) => cat.id === params.categoryId)
      if (foundCategory) {
        const foundSubCategory = foundCategory.subCategories.find((subCat) => subCat.id === params.subCategoryId)
        if (foundSubCategory) {
          setCategory(foundCategory)
          setSubCategory(foundSubCategory)
        } else {
          router.push("/")
        }
      } else {
        router.push("/")
      }
    }
  }, [params, router])

  if (!category || !subCategory) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>加载中...</p>
      </div>
    )
  }

  const IconComponent = getIconComponent(category.icon)

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-16 items-center px-4">
          <Link href="/" passHref>
            <Button variant="ghost" size="icon" className="mr-4">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">返回首页</span>
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <IconComponent className="h-5 w-5" />
            <h1 className="text-xl font-bold">
              {category.name} / {subCategory.name}
            </h1>
          </div>
        </div>
      </header>

      <main className="container px-4 py-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">{subCategory.name}</h2>
          <p className="text-muted-foreground">共 {subCategory.websites.length} 个网站</p>
        </div>

        <VirtualizedWebsiteGrid category={category} subCategory={subCategory} limit={false} />
      </main>
      <FloatingActions />
    </div>
  )
}

