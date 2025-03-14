export interface Website {
  id: string
  name: string
  url: string
  description: string
  icon?: string
}

export interface SubCategory {
  id: string
  name: string
  websites: Website[]
}

export interface Category {
  id: string
  name: string
  icon: string
  subCategories: SubCategory[]
}

