export interface Website {
  id: string
  name: string
  url: string
  description: string
  icon?: string
  order?: number // 添加排序字段
}

export interface SubCategory {
  id: string
  name: string
  websites: Website[]
  order?: number // 添加排序字段
}

export interface Category {
  id: string
  name: string
  icon: string
  subCategories: SubCategory[]
  order?: number // 添加排序字段
}

