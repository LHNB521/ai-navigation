"use client"

import { navigationData } from "@/data/navigation-data"
import type { Category, SubCategory, Website } from "@/types/navigation"

// In a real application, these functions would update the data files
// For this demo, they just return the data and log the operations

// Get all categories
export function getAllCategories(): Category[] {
  return [...navigationData]
}

// Add a new category
export function addCategory(category: Category): void {
  console.log("Adding category:", category)
  // In a real application, this would update the data file
}

// Update a category
export function updateCategory(category: Category): void {
  console.log("Updating category:", category)
  // In a real application, this would update the data file
}

// Delete a category
export function deleteCategory(categoryId: string): void {
  console.log("Deleting category:", categoryId)
  // In a real application, this would update the data file
}

// Get all subcategories
export function getAllSubCategories(): { categoryId: string; subCategory: SubCategory }[] {
  const allSubCategories: { categoryId: string; subCategory: SubCategory }[] = []
  navigationData.forEach((category) => {
    category.subCategories.forEach((subCategory) => {
      allSubCategories.push({
        categoryId: category.id,
        subCategory,
      })
    })
  })
  return allSubCategories
}

// Add a new subcategory
export function addSubCategory(categoryId: string, subCategory: SubCategory): void {
  console.log("Adding subcategory:", categoryId, subCategory)
  // In a real application, this would update the data file
}

// Update a subcategory
export function updateSubCategory(categoryId: string, subCategory: SubCategory): void {
  console.log("Updating subcategory:", categoryId, subCategory)
  // In a real application, this would update the data file
}

// Delete a subcategory
export function deleteSubCategory(categoryId: string, subCategoryId: string): void {
  console.log("Deleting subcategory:", categoryId, subCategoryId)
  // In a real application, this would update the data file
}

// Get all websites
export function getAllWebsites(): { categoryId: string; subCategoryId: string; website: Website }[] {
  const allWebsites: { categoryId: string; subCategoryId: string; website: Website }[] = []
  navigationData.forEach((category) => {
    category.subCategories.forEach((subCategory) => {
      subCategory.websites.forEach((website) => {
        allWebsites.push({
          categoryId: category.id,
          subCategoryId: subCategory.id,
          website,
        })
      })
    })
  })
  return allWebsites
}

// Add a new website
export function addWebsite(categoryId: string, subCategoryId: string, website: Website): void {
  console.log("Adding website:", categoryId, subCategoryId, website)
  // In a real application, this would update the data file
}

// Update a website
export function updateWebsite(categoryId: string, subCategoryId: string, website: Website): void {
  console.log("Updating website:", categoryId, subCategoryId, website)
  // In a real application, this would update the data file
}

// Delete a website
export function deleteWebsite(categoryId: string, subCategoryId: string, websiteId: string): void {
  console.log("Deleting website:", categoryId, subCategoryId, websiteId)
  // In a real application, this would update the data file
}

