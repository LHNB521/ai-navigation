import fs from "fs"
import path from "path"
import type { Category, SubCategory, Website } from "@/types/navigation"

const CATEGORIES_DIR = path.join(process.cwd(), "data", "categories")

// Ensure the categories directory exists
export function ensureCategoriesDir() {
  if (!fs.existsSync(CATEGORIES_DIR)) {
    fs.mkdirSync(CATEGORIES_DIR, { recursive: true })
  }
}

// Get all categories
export async function getAllCategories(): Promise<Category[]> {
  ensureCategoriesDir()

  const files = fs.readdirSync(CATEGORIES_DIR)
  const categories: Category[] = []

  for (const file of files) {
    if (file.endsWith(".json")) {
      const filePath = path.join(CATEGORIES_DIR, file)
      const fileContent = fs.readFileSync(filePath, "utf-8")
      try {
        const category = JSON.parse(fileContent) as Category
        categories.push(category)
      } catch (error) {
        console.error(`Error parsing ${file}:`, error)
      }
    }
  }

  return categories
}

// Get a single category by ID
export async function getCategoryById(id: string): Promise<Category | null> {
  const filePath = path.join(CATEGORIES_DIR, `${id}.json`)

  if (!fs.existsSync(filePath)) {
    return null
  }

  try {
    const fileContent = fs.readFileSync(filePath, "utf-8")
    return JSON.parse(fileContent) as Category
  } catch (error) {
    console.error(`Error reading category ${id}:`, error)
    return null
  }
}

// Create a new category
export async function createCategory(category: Category): Promise<Category> {
  ensureCategoriesDir()

  const filePath = path.join(CATEGORIES_DIR, `${category.id}.json`)

  // Check if category already exists
  if (fs.existsSync(filePath)) {
    throw new Error(`Category with ID ${category.id} already exists`)
  }

  fs.writeFileSync(filePath, JSON.stringify(category, null, 2), "utf-8")
  return category
}

// Update an existing category
export async function updateCategory(id: string, category: Category): Promise<Category> {
  const filePath = path.join(CATEGORIES_DIR, `${id}.json`)

  // Check if category exists
  if (!fs.existsSync(filePath)) {
    throw new Error(`Category with ID ${id} not found`)
  }

  // If ID is changing, delete the old file
  if (id !== category.id) {
    fs.unlinkSync(filePath)
    const newFilePath = path.join(CATEGORIES_DIR, `${category.id}.json`)
    fs.writeFileSync(newFilePath, JSON.stringify(category, null, 2), "utf-8")
  } else {
    fs.writeFileSync(filePath, JSON.stringify(category, null, 2), "utf-8")
  }

  return category
}

// Delete a category
export async function deleteCategory(id: string): Promise<boolean> {
  const filePath = path.join(CATEGORIES_DIR, `${id}.json`)

  // Check if category exists
  if (!fs.existsSync(filePath)) {
    throw new Error(`Category with ID ${id} not found`)
  }

  fs.unlinkSync(filePath)
  return true
}

// Get all subcategories
export async function getAllSubCategories(): Promise<{ categoryId: string; subCategory: SubCategory }[]> {
  const categories = await getAllCategories()
  const subCategories: { categoryId: string; subCategory: SubCategory }[] = []

  categories.forEach((category) => {
    category.subCategories.forEach((subCategory) => {
      subCategories.push({
        categoryId: category.id,
        subCategory,
      })
    })
  })

  return subCategories
}

// Add a subcategory to a category
export async function addSubCategory(categoryId: string, subCategory: SubCategory): Promise<SubCategory> {
  const category = await getCategoryById(categoryId)

  if (!category) {
    throw new Error(`Category with ID ${categoryId} not found`)
  }

  // Check if subcategory already exists
  const existingSubCategory = category.subCategories.find((sc) => sc.id === subCategory.id)
  if (existingSubCategory) {
    throw new Error(`Subcategory with ID ${subCategory.id} already exists in category ${categoryId}`)
  }

  category.subCategories.push(subCategory)
  await updateCategory(categoryId, category)

  return subCategory
}

// Update a subcategory
export async function updateSubCategory(
  categoryId: string,
  subCategoryId: string,
  subCategory: SubCategory,
): Promise<SubCategory> {
  const category = await getCategoryById(categoryId)

  if (!category) {
    throw new Error(`Category with ID ${categoryId} not found`)
  }

  const index = category.subCategories.findIndex((sc) => sc.id === subCategoryId)
  if (index === -1) {
    throw new Error(`Subcategory with ID ${subCategoryId} not found in category ${categoryId}`)
  }

  // If ID is changing, ensure new ID doesn't already exist
  if (subCategoryId !== subCategory.id) {
    const existingWithNewId = category.subCategories.find((sc) => sc.id === subCategory.id)
    if (existingWithNewId) {
      throw new Error(`Subcategory with ID ${subCategory.id} already exists in category ${categoryId}`)
    }
  }

  category.subCategories[index] = subCategory
  await updateCategory(categoryId, category)

  return subCategory
}

// Delete a subcategory
export async function deleteSubCategory(categoryId: string, subCategoryId: string): Promise<boolean> {
  const category = await getCategoryById(categoryId)

  if (!category) {
    throw new Error(`Category with ID ${categoryId} not found`)
  }

  const index = category.subCategories.findIndex((sc) => sc.id === subCategoryId)
  if (index === -1) {
    throw new Error(`Subcategory with ID ${subCategoryId} not found in category ${categoryId}`)
  }

  category.subCategories.splice(index, 1)
  await updateCategory(categoryId, category)

  return true
}

// Get all websites
export async function getAllWebsites(): Promise<{ categoryId: string; subCategoryId: string; website: Website }[]> {
  const categories = await getAllCategories()
  const websites: { categoryId: string; subCategoryId: string; website: Website }[] = []

  categories.forEach((category) => {
    category.subCategories.forEach((subCategory) => {
      subCategory.websites.forEach((website) => {
        websites.push({
          categoryId: category.id,
          subCategoryId: subCategory.id,
          website,
        })
      })
    })
  })

  return websites
}

// Add a website to a subcategory
export async function addWebsite(categoryId: string, subCategoryId: string, website: Website): Promise<Website> {
  const category = await getCategoryById(categoryId)

  if (!category) {
    throw new Error(`Category with ID ${categoryId} not found`)
  }

  const subCategory = category.subCategories.find((sc) => sc.id === subCategoryId)
  if (!subCategory) {
    throw new Error(`Subcategory with ID ${subCategoryId} not found in category ${categoryId}`)
  }

  // Check if website already exists
  const existingWebsite = subCategory.websites.find((w) => w.id === website.id)
  if (existingWebsite) {
    throw new Error(`Website with ID ${website.id} already exists in subcategory ${subCategoryId}`)
  }

  subCategory.websites.push(website)
  await updateCategory(categoryId, category)

  return website
}

// Update a website
export async function updateWebsite(
  categoryId: string,
  subCategoryId: string,
  websiteId: string,
  website: Website,
): Promise<Website> {
  const category = await getCategoryById(categoryId)

  if (!category) {
    throw new Error(`Category with ID ${categoryId} not found`)
  }

  const subCategory = category.subCategories.find((sc) => sc.id === subCategoryId)
  if (!subCategory) {
    throw new Error(`Subcategory with ID ${subCategoryId} not found in category ${categoryId}`)
  }

  const index = subCategory.websites.findIndex((w) => w.id === websiteId)
  if (index === -1) {
    throw new Error(`Website with ID ${websiteId} not found in subcategory ${subCategoryId}`)
  }

  // If ID is changing, ensure new ID doesn't already exist
  if (websiteId !== website.id) {
    const existingWithNewId = subCategory.websites.find((w) => w.id === website.id)
    if (existingWithNewId) {
      throw new Error(`Website with ID ${website.id} already exists in subcategory ${subCategoryId}`)
    }
  }

  subCategory.websites[index] = website
  await updateCategory(categoryId, category)

  return website
}

// Delete a website
export async function deleteWebsite(categoryId: string, subCategoryId: string, websiteId: string): Promise<boolean> {
  const category = await getCategoryById(categoryId)

  if (!category) {
    throw new Error(`Category with ID ${categoryId} not found`)
  }

  const subCategory = category.subCategories.find((sc) => sc.id === subCategoryId)
  if (!subCategory) {
    throw new Error(`Subcategory with ID ${subCategoryId} not found in category ${categoryId}`)
  }

  const index = subCategory.websites.findIndex((w) => w.id === websiteId)
  if (index === -1) {
    throw new Error(`Website with ID ${websiteId} not found in subcategory ${subCategoryId}`)
  }

  subCategory.websites.splice(index, 1)
  await updateCategory(categoryId, category)

  return true
}

// 对分类进行排序
export function sortCategories(categories: Category[]): Category[] {
  return [...categories].sort((a, b) => {
    // 如果有order字段，按order排序
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order
    }
    // 如果只有一个有order字段，有order的排在前面
    if (a.order !== undefined) return -1
    if (b.order !== undefined) return 1
    // 都没有order字段，按名称排序
    return a.name.localeCompare(b.name)
  })
}

// 对子分类进行排序
export function sortSubCategories(subCategories: SubCategory[]): SubCategory[] {
  return [...subCategories].sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order
    }
    if (a.order !== undefined) return -1
    if (b.order !== undefined) return 1
    return a.name.localeCompare(b.name)
  })
}

// 对网站进行排序
export function sortWebsites(websites: Website[]): Website[] {
  return [...websites].sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order
    }
    if (a.order !== undefined) return -1
    if (b.order !== undefined) return 1
    return a.name.localeCompare(b.name)
  })
}

