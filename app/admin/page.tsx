"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  Plus,
  Search,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  AlertCircle,
  Github,
  Download,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { getIconComponent } from "@/data/navigation-data"
import type { Category, SubCategory, Website } from "@/types/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  fetchCategories,
  fetchSubCategories,
  fetchWebsites,
  createCategory,
  updateCategory,
  deleteCategory,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
  createWebsite,
  updateWebsite,
  deleteWebsite,
} from "@/lib/api-client"
import ImageUpload from "@/components/image-upload"
import SecondVerificationDialog from "@/components/second-verification-dialog"

export default function AdminPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("categories")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)

  // 检查登录状态
  useEffect(() => {
    const token = localStorage.getItem("admin_token")
    console.log("token", token)
    if (!token) {
      router.push("/login")
    }
  }, [router])

  // 二次验证对话框状态
  const [isPushVerificationOpen, setIsPushVerificationOpen] = useState(false)
  const [isPullVerificationOpen, setIsPullVerificationOpen] = useState(false)

  // Data states
  const [categories, setCategories] = useState<Category[]>([])
  const [subCategories, setSubCategories] = useState<{ categoryId: string; subCategory: SubCategory }[]>([])
  const [websites, setWebsites] = useState<{ categoryId: string; subCategoryId: string; website: Website }[]>([])

  // Form states
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    icon: "",
    url: "",
    description: "",
    categoryId: "",
    subCategoryId: "",
    order: 0, // 添加排序字段
  })

  // 在AdminPage组件中添加状态来跟踪Git操作
  const [isGitLoading, setIsGitLoading] = useState(false)
  // 在AdminPage组件中添加状态来跟踪Git Pull操作
  const [isGitPullLoading, setIsGitPullLoading] = useState(false)

  // 添加处理Git提交的函数
  const handleGitPush = async () => {
    // 打开二次验证对话框
    setIsPushVerificationOpen(true)
  }

  // 执行Git Push操作
  const executeGitPush = async (password: string) => {
    try {
      setIsGitLoading(true)
      setActionError(null)
      setActionSuccess(null)

      const response = await fetch("/api/git/push", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "提交到GitHub失败")
      }

      setActionSuccess("成功提交到GitHub仓库！")
    } catch (error: any) {
      console.error("Git操作失败:", error)
      throw new Error(error.message || "Git操作失败，请检查控制台日志")
    } finally {
      setIsGitLoading(false)
    }
  }

  // 添加处理Git Pull的函数
  const handleGitPull = async () => {
    // 打开二次验证对话框
    setIsPullVerificationOpen(true)
  }

  // 执行Git Pull操作
  const executeGitPull = async (password: string) => {
    try {
      setIsGitPullLoading(true)
      setActionError(null)
      setActionSuccess(null)

      const response = await fetch("/api/git/pull", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "从GitHub拉取代码失败")
      }

      setActionSuccess("成功从GitHub仓库拉取代码！")

      // 拉取成功后重新加载数据
      await loadData()
    } catch (error: any) {
      console.error("Git Pull操作失败:", error)
      throw new Error(error.message || "Git Pull操作失败，请检查控制台日志")
    } finally {
      setIsGitPullLoading(false)
    }
  }

  // Load data
  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Load all data in parallel
      const [categoriesData, subCategoriesData, websitesData] = await Promise.all([
        fetchCategories(),
        fetchSubCategories(),
        fetchWebsites(),
      ])

      setCategories(categoriesData)
      setSubCategories(subCategoriesData)
      setWebsites(websitesData)
    } catch (err) {
      console.error("Failed to load data:", err)
      setError("加载数据失败，请刷新页面重试")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // Reset page when tab changes
  useEffect(() => {
    setCurrentPage(1)
  }, [activeTab])

  // Clear action messages after 3 seconds
  useEffect(() => {
    if (actionSuccess || actionError) {
      const timer = setTimeout(() => {
        setActionSuccess(null)
        setActionError(null)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [actionSuccess, actionError])

  // Filter data based on search term
  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredSubCategories = subCategories.filter(
    (item) =>
      item.subCategory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subCategory.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredWebsites = websites.filter(
    (item) =>
      item.website.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.website.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.website.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Pagination
  const getPageItems = (items: any[]) => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return items.slice(startIndex, startIndex + itemsPerPage)
  }

  const totalPages = () => {
    let items
    switch (activeTab) {
      case "categories":
        items = filteredCategories
        break
      case "subcategories":
        items = filteredSubCategories
        break
      case "websites":
        items = filteredWebsites
        break
      default:
        items = []
    }
    return Math.ceil(items.length / itemsPerPage)
  }

  // Handle form submission for adding/editing items
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setActionError(null)
    setActionSuccess(null)

    try {
      // 更新添加新项目的处理
      if (isAddDialogOpen) {
        // Add new item
        if (activeTab === "categories") {
          const newCategory: Category = {
            id: formData.id,
            name: formData.name,
            icon: formData.icon,
            subCategories: [],
            order: formData.order, // 添加排序字段
          }
          await createCategory(newCategory)
          setActionSuccess("分类添加成功！")
        } else if (activeTab === "subcategories") {
          const newSubCategory: SubCategory = {
            id: formData.id,
            name: formData.name,
            websites: [],
            order: formData.order, // 添加排序字段
          }
          await createSubCategory(formData.categoryId, newSubCategory)
          setActionSuccess("子分类添加成功！")
        } else {
          const newWebsite: Website = {
            id: formData.id,
            name: formData.name,
            url: formData.url,
            description: formData.description,
            icon: formData.icon || "/placeholder.svg?height=32&width=32",
            order: formData.order, // 添加排序字段
          }
          await createWebsite(formData.categoryId, formData.subCategoryId, newWebsite)
          setActionSuccess("网站添加成功！")
        }
      } else {
        // Update existing item
        if (activeTab === "categories") {
          const updatedCategory: Category = {
            id: formData.id,
            name: formData.name,
            icon: formData.icon,
            subCategories: selectedItem.subCategories,
            order: formData.order, // 添加排序字段
          }
          await updateCategory(formData.id, updatedCategory)
          setActionSuccess("分类更新成功！")
        } else if (activeTab === "subcategories") {
          const updatedSubCategory: SubCategory = {
            id: formData.id,
            name: formData.name,
            websites: selectedItem.subCategory.websites,
            order: formData.order, // 添加排序字段
          }
          await updateSubCategory(formData.id, formData.categoryId, updatedSubCategory)
          setActionSuccess("子分类更新成功！")
        } else {
          const updatedWebsite: Website = {
            id: formData.id,
            name: formData.name,
            url: formData.url,
            description: formData.description,
            icon: formData.icon || "/placeholder.svg?height=32&width=32",
            order: formData.order, // 添加排序字段
          }
          await updateWebsite(formData.id, formData.categoryId, formData.subCategoryId, updatedWebsite)
          setActionSuccess("网站更新成功！")
        }
      }

      // Reload data
      await loadData()

      // Close dialogs
      setIsAddDialogOpen(false)
      setIsEditDialogOpen(false)

      // Reset form
      setFormData({
        id: "",
        name: "",
        icon: "",
        url: "",
        description: "",
        categoryId: "",
        subCategoryId: "",
        order: 0,
      })
    } catch (error: any) {
      console.error("操作失败:", error)
      setActionError(error.message || "操作失败，请重试")
    }
  }

  // Handle edit button click
  const handleEdit = (item: any) => {
    setSelectedItem(item)

    if (activeTab === "categories") {
      setFormData({
        id: item.id,
        name: item.name,
        icon: item.icon,
        url: "",
        description: "",
        categoryId: "",
        subCategoryId: "",
        order: item.order !== undefined ? item.order : 0, // 添加排序字段
      })
    } else if (activeTab === "subcategories") {
      setFormData({
        id: item.subCategory.id,
        name: item.subCategory.name,
        icon: "",
        url: "",
        description: "",
        categoryId: item.categoryId,
        subCategoryId: "",
        order: item.subCategory.order !== undefined ? item.subCategory.order : 0, // 添加排序字段
      })
    } else {
      setFormData({
        id: item.website.id,
        name: item.website.name,
        icon: item.website.icon || "",
        url: item.website.url,
        description: item.website.description,
        categoryId: item.categoryId,
        subCategoryId: item.subCategoryId,
        order: item.website.order !== undefined ? item.website.order : 0, // 添加排序字段
      })
    }

    setIsEditDialogOpen(true)
  }

  // Handle delete button click
  const handleDelete = (item: any) => {
    setSelectedItem(item)
    setIsDeleteDialogOpen(true)
  }

  // Confirm delete
  const confirmDelete = async () => {
    setActionError(null)
    setActionSuccess(null)

    try {
      if (activeTab === "categories") {
        await deleteCategory(selectedItem.id)
        setActionSuccess("分类删除成功！")
      } else if (activeTab === "subcategories") {
        await deleteSubCategory(selectedItem.subCategory.id, selectedItem.categoryId)
        setActionSuccess("子分类删除成功！")
      } else {
        await deleteWebsite(selectedItem.website.id, selectedItem.categoryId, selectedItem.subCategoryId)
        setActionSuccess("网站删除成功！")
      }

      // Reload data
      await loadData()
      setIsDeleteDialogOpen(false)
    } catch (error: any) {
      console.error("删除失败:", error)
      setActionError(error.message || "删除失败，请重试")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

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
          <h1 className="text-xl font-bold">网站导航管理</h1>
          <div className="ml-auto flex gap-2">
            <Button variant="outline" className="gap-2" onClick={handleGitPush} disabled={isGitLoading}>
              <Github className="h-4 w-4" />
              {isGitLoading ? "提交中..." : "提交到GitHub"}
            </Button>
            <Button variant="outline" className="gap-2" onClick={handleGitPull} disabled={isGitPullLoading}>
              <Download className="h-4 w-4" />
              {isGitPullLoading ? "拉取中..." : "拉取GitHub代码"}
            </Button>
          </div>
        </div>
      </header>

      <main className="container px-4 py-6">
        {/* Error and success messages */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>错误</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {actionError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>操作失败</AlertTitle>
            <AlertDescription>{actionError}</AlertDescription>
          </Alert>
        )}

        {actionSuccess && (
          <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
            <AlertTitle>成功</AlertTitle>
            <AlertDescription>{actionSuccess}</AlertDescription>
          </Alert>
        )}

        {/* Top section: Search and Add */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="搜索..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-1">
                <Plus className="h-4 w-4" />
                添加
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  添加{activeTab === "categories" ? "分类" : activeTab === "subcategories" ? "子分类" : "网站"}
                </DialogTitle>
                <DialogDescription>
                  填写以下信息以添加新
                  {activeTab === "categories" ? "分类" : activeTab === "subcategories" ? "子分类" : "网站"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  {activeTab === "subcategories" && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="categoryId" className="text-right">
                        所属分类
                      </Label>
                      <Select
                        value={formData.categoryId}
                        onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="选择分类" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {activeTab === "websites" && (
                    <>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="categoryId" className="text-right">
                          所属分类
                        </Label>
                        <Select
                          value={formData.categoryId}
                          onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="选择分类" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="subCategoryId" className="text-right">
                          所属子分类
                        </Label>
                        <Select
                          value={formData.subCategoryId}
                          onValueChange={(value) => setFormData({ ...formData, subCategoryId: value })}
                          disabled={!formData.categoryId}
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="选择子分类" />
                          </SelectTrigger>
                          <SelectContent>
                            {subCategories
                              .filter((item) => item.categoryId === formData.categoryId)
                              .map((item) => (
                                <SelectItem key={item.subCategory.id} value={item.subCategory.id}>
                                  {item.subCategory.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="id" className="text-right">
                      ID
                    </Label>
                    <Input
                      id="id"
                      value={formData.id}
                      onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                      className="col-span-3"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      名称
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="col-span-3"
                    />
                  </div>

                  {activeTab === "categories" && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="icon" className="text-right">
                        图标
                      </Label>
                      <Select
                        value={formData.icon}
                        onValueChange={(value) => setFormData({ ...formData, icon: value })}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="选择图标" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Code">Code</SelectItem>
                          <SelectItem value="BookOpen">BookOpen</SelectItem>
                          <SelectItem value="Coffee">Coffee</SelectItem>
                          <SelectItem value="ShoppingCart">ShoppingCart</SelectItem>
                          <SelectItem value="Film">Film</SelectItem>
                          <SelectItem value="Music">Music</SelectItem>
                          <SelectItem value="Gamepad2">Gamepad2</SelectItem>
                          <SelectItem value="Newspaper">Newspaper</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {activeTab === "websites" && (
                    <>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="url" className="text-right">
                          URL
                        </Label>
                        <Input
                          id="url"
                          value={formData.url}
                          onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                          className="col-span-3"
                        />
                      </div>

                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                          描述
                        </Label>
                        <Input
                          id="description"
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          className="col-span-3"
                        />
                      </div>

                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="icon" className="text-right">
                          图标
                        </Label>
                        <div className="col-span-3">
                          <ImageUpload
                            value={formData.icon}
                            onChange={(url) => setFormData({ ...formData, icon: url })}
                          />
                        </div>
                      </div>
                    </>
                  )}
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="order" className="text-right">
                      排序
                    </Label>
                    <Input
                      id="order"
                      type="number"
                      value={formData.order?.toString() || "0"}
                      onChange={(e) => setFormData({ ...formData, order: Number.parseInt(e.target.value) || 0 })}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">保存</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tabs for different data types */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList>
            <TabsTrigger value="categories">分类</TabsTrigger>
            <TabsTrigger value="subcategories">子分类</TabsTrigger>
            <TabsTrigger value="websites">网站</TabsTrigger>
          </TabsList>

          <TabsContent value="categories">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>名称</TableHead>
                    <TableHead>图标</TableHead>
                    <TableHead>排序</TableHead>
                    <TableHead>子分类数量</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getPageItems(filteredCategories).map((category) => {
                    const IconComponent = getIconComponent(category.icon)
                    return (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.id}</TableCell>
                        <TableCell>{category.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <IconComponent className="h-4 w-4" />
                            <span>{category.icon}</span>
                          </div>
                        </TableCell>
                        <TableCell>{category.order !== undefined ? category.order : "-"}</TableCell>
                        <TableCell>{category.subCategories.length}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleEdit(category)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDelete(category)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="subcategories">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>名称</TableHead>
                    <TableHead>所属分类</TableHead>
                    <TableHead>排序</TableHead>
                    <TableHead>网站数量</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getPageItems(filteredSubCategories).map((item) => {
                    const category = categories.find((c) => c.id === item.categoryId)
                    return (
                      <TableRow key={`${item.categoryId}-${item.subCategory.id}`}>
                        <TableCell className="font-medium">{item.subCategory.id}</TableCell>
                        <TableCell>{item.subCategory.name}</TableCell>
                        <TableCell>{category?.name || item.categoryId}</TableCell>
                        <TableCell>{item.subCategory.order !== undefined ? item.subCategory.order : "-"}</TableCell>
                        <TableCell>{item.subCategory.websites.length}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDelete(item)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="websites">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>名称</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>描述</TableHead>
                    <TableHead>排序</TableHead>
                    <TableHead>所属分类/子分类</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getPageItems(filteredWebsites).map((item) => {
                    const category = categories.find((c) => c.id === item.categoryId)
                    const subCategory = category?.subCategories.find((sc) => sc.id === item.subCategoryId)
                    return (
                      <TableRow key={`${item.categoryId}-${item.subCategoryId}-${item.website.id}`}>
                        <TableCell className="font-medium">{item.website.id}</TableCell>
                        <TableCell>{item.website.name}</TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          <a
                            href={item.website.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            {item.website.url}
                          </a>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">{item.website.description}</TableCell>
                        <TableCell>{item.website.order !== undefined ? item.website.order : "-"}</TableCell>
                        <TableCell>
                          {category?.name || item.categoryId}/{subCategory?.name || item.subCategoryId}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="sm" onClick={() => handleDelete(item)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            显示第 {(currentPage - 1) * itemsPerPage + 1} 到{" "}
            {Math.min(
              currentPage * itemsPerPage,
              activeTab === "categories"
                ? filteredCategories.length
                : activeTab === "subcategories"
                  ? filteredSubCategories.length
                  : filteredWebsites.length,
            )}{" "}
            条， 共{" "}
            {activeTab === "categories"
              ? filteredCategories.length
              : activeTab === "subcategories"
                ? filteredSubCategories.length
                : filteredWebsites.length}{" "}
            条
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              第 {currentPage} 页，共 {totalPages()} 页
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages()))}
              disabled={currentPage === totalPages()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages())}
              disabled={currentPage === totalPages()}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              编辑{activeTab === "categories" ? "分类" : activeTab === "subcategories" ? "子分类" : "网站"}
            </DialogTitle>
            <DialogDescription>
              修改以下信息以更新
              {activeTab === "categories" ? "分类" : activeTab === "subcategories" ? "子分类" : "网站"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              {activeTab === "subcategories" && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="categoryId" className="text-right">
                    所属分类
                  </Label>
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="选择分类" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {activeTab === "websites" && (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="categoryId" className="text-right">
                      所属分类
                    </Label>
                    <Select
                      value={formData.categoryId}
                      onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="选择分类" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="subCategoryId" className="text-right">
                      所属子分类
                    </Label>
                    <Select
                      value={formData.subCategoryId}
                      onValueChange={(value) => setFormData({ ...formData, subCategoryId: value })}
                      disabled={!formData.categoryId}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="选择子分类" />
                      </SelectTrigger>
                      <SelectContent>
                        {subCategories
                          .filter((item) => item.categoryId === formData.categoryId)
                          .map((item) => (
                            <SelectItem key={item.subCategory.id} value={item.subCategory.id}>
                              {item.subCategory.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="id" className="text-right">
                  ID
                </Label>
                <Input
                  id="id"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  className="col-span-3"
                  disabled={true} // ID shouldn't be editable
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  名称
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="col-span-3"
                />
              </div>

              {activeTab === "categories" && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="icon" className="text-right">
                    图标
                  </Label>
                  <Select value={formData.icon} onValueChange={(value) => setFormData({ ...formData, icon: value })}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="选择图标" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Code">Code</SelectItem>
                      <SelectItem value="BookOpen">BookOpen</SelectItem>
                      <SelectItem value="Coffee">Coffee</SelectItem>
                      <SelectItem value="ShoppingCart">ShoppingCart</SelectItem>
                      <SelectItem value="Film">Film</SelectItem>
                      <SelectItem value="Music">Music</SelectItem>
                      <SelectItem value="Gamepad2">Gamepad2</SelectItem>
                      <SelectItem value="Newspaper">Newspaper</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {activeTab === "websites" && (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="url" className="text-right">
                      URL
                    </Label>
                    <Input
                      id="url"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      className="col-span-3"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      描述
                    </Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="col-span-3"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="icon" className="text-right">
                      图标
                    </Label>
                    <div className="col-span-3">
                      <ImageUpload value={formData.icon} onChange={(url) => setFormData({ ...formData, icon: url })} />
                    </div>
                  </div>
                </>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="order" className="text-right">
                  排序
                </Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order?.toString() || "0"}
                  onChange={(e) => setFormData({ ...formData, order: Number.parseInt(e.target.value) || 0 })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">保存</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              取消
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Git Push Verification Dialog */}
      <SecondVerificationDialog
        isOpen={isPushVerificationOpen}
        onClose={() => setIsPushVerificationOpen(false)}
        onConfirm={executeGitPush}
        title="提交到GitHub验证"
        description="请输入验证密码以确认提交到GitHub"
      />

      {/* Git Pull Verification Dialog */}
      <SecondVerificationDialog
        isOpen={isPullVerificationOpen}
        onClose={() => setIsPullVerificationOpen(false)}
        onConfirm={executeGitPull}
        title="拉取GitHub代码验证"
        description="请输入验证密码以确认从GitHub拉取代码"
      />
    </div>
  )
}

