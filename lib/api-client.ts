import type { Category, SubCategory, Website } from "@/types/navigation"

// 分类API
export async function fetchCategories() {
  const response = await fetch("/api/categories")
  if (!response.ok) {
    throw new Error("Failed to fetch categories")
  }
  return response.json()
}

export async function fetchCategoryById(id: string) {
  const response = await fetch(`/api/categories/${id}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch category with id ${id}`)
  }
  return response.json()
}

// 确保所有创建和更新函数都包含order字段
// 例如，在createCategory函数中：
export async function createCategory(category: Category) {
  // category现在包含order字段
  const response = await fetch("/api/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(category),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to create category")
  }

  return response.json()
}

export async function updateCategory(id: string, category: Category) {
  const response = await fetch(`/api/categories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(category),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to update category")
  }

  return response.json()
}

export async function deleteCategory(id: string) {
  const response = await fetch(`/api/categories/${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to delete category")
  }

  return response.json()
}

// 子分类API
export async function fetchSubCategories() {
  const response = await fetch("/api/subcategories")
  if (!response.ok) {
    throw new Error("Failed to fetch subcategories")
  }
  return response.json()
}

// 同样，确保updateCategory, createSubCategory, updateSubCategory, createWebsite, updateWebsite
// 都能正确处理order字段
export async function createSubCategory(categoryId: string, subCategory: SubCategory) {
  const response = await fetch("/api/subcategories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ categoryId, subCategory }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to create subcategory")
  }

  return response.json()
}

export async function updateSubCategory(id: string, categoryId: string, subCategory: SubCategory) {
  const response = await fetch(`/api/subcategories/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ categoryId, subCategory }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to update subcategory")
  }

  return response.json()
}

export async function deleteSubCategory(id: string, categoryId: string) {
  const response = await fetch(`/api/subcategories/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ categoryId }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to delete subcategory")
  }

  return response.json()
}

// 网站API
export async function fetchWebsites() {
  const response = await fetch("/api/websites")
  if (!response.ok) {
    throw new Error("Failed to fetch websites")
  }
  return response.json()
}

export async function createWebsite(categoryId: string, subCategoryId: string, website: Website) {
  const response = await fetch("/api/websites", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ categoryId, subCategoryId, website }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to create website")
  }

  return response.json()
}

export async function updateWebsite(id: string, categoryId: string, subCategoryId: string, website: Website) {
  const response = await fetch(`/api/websites/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ categoryId, subCategoryId, website }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to update website")
  }

  return response.json()
}

export async function deleteWebsite(id: string, categoryId: string, subCategoryId: string) {
  const response = await fetch(`/api/websites/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ categoryId, subCategoryId }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to delete website")
  }

  return response.json()
}

