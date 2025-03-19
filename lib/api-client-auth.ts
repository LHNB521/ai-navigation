// 基础请求函数，自动添加认证头
async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("admin_token")

  const headers = {
    ...options.headers,
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  // 如果返回401，可能是token过期，重定向到登录页面
  if (response.status === 401) {
    localStorage.removeItem("admin_token")
    window.location.href = "/admin/login"
    throw new Error("登录已过期，请重新登录")
  }

  return response
}

// 分类API
export async function fetchCategories() {
  const response = await fetchWithAuth("/api/categories")
  if (!response.ok) {
    throw new Error("Failed to fetch categories")
  }
  return response.json()
}

export async function fetchCategoryById(id: string) {
  const response = await fetchWithAuth(`/api/categories/${id}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch category with id ${id}`)
  }
  return response.json()
}

export async function createCategory(category: any) {
  const response = await fetchWithAuth("/api/categories", {
    method: "POST",
    body: JSON.stringify(category),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to create category")
  }

  return response.json()
}

export async function updateCategory(id: string, category: any) {
  const response = await fetchWithAuth(`/api/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(category),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to update category")
  }

  return response.json()
}

export async function deleteCategory(id: string) {
  const response = await fetchWithAuth(`/api/categories/${id}`, {
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
  const response = await fetchWithAuth("/api/subcategories")
  if (!response.ok) {
    throw new Error("Failed to fetch subcategories")
  }
  return response.json()
}

export async function createSubCategory(categoryId: string, subCategory: any) {
  const response = await fetchWithAuth("/api/subcategories", {
    method: "POST",
    body: JSON.stringify({ categoryId, subCategory }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to create subcategory")
  }

  return response.json()
}

export async function updateSubCategory(id: string, categoryId: string, subCategory: any) {
  const response = await fetchWithAuth(`/api/subcategories/${id}`, {
    method: "PUT",
    body: JSON.stringify({ categoryId, subCategory }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to update subcategory")
  }

  return response.json()
}

export async function deleteSubCategory(id: string, categoryId: string) {
  const response = await fetchWithAuth(`/api/subcategories/${id}`, {
    method: "DELETE",
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
  const response = await fetchWithAuth("/api/websites")
  if (!response.ok) {
    throw new Error("Failed to fetch websites")
  }
  return response.json()
}

export async function createWebsite(categoryId: string, subCategoryId: string, website: any) {
  const response = await fetchWithAuth("/api/websites", {
    method: "POST",
    body: JSON.stringify({ categoryId, subCategoryId, website }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to create website")
  }

  return response.json()
}

export async function updateWebsite(id: string, categoryId: string, subCategoryId: string, website: any) {
  const response = await fetchWithAuth(`/api/websites/${id}`, {
    method: "PUT",
    body: JSON.stringify({ categoryId, subCategoryId, website }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to update website")
  }

  return response.json()
}

export async function deleteWebsite(id: string, categoryId: string, subCategoryId: string) {
  const response = await fetchWithAuth(`/api/websites/${id}`, {
    method: "DELETE",
    body: JSON.stringify({ categoryId, subCategoryId }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to delete website")
  }

  return response.json()
}

// Git操作API
export async function gitPush(password: string) {
  const response = await fetchWithAuth("/api/git/push", {
    method: "POST",
    body: JSON.stringify({ password }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to push to git")
  }

  return response.json()
}

export async function gitPull(password: string) {
  const response = await fetchWithAuth("/api/git/pull", {
    method: "POST",
    body: JSON.stringify({ password }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Failed to pull from git")
  }

  return response.json()
}

