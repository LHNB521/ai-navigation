import { navigationData, getIconComponent } from "@/data/navigation-data"
import WebsiteGrid from "./website-grid"

export default function ContentSection() {
  return (
    <div className="w-full p-4 md:p-6 space-y-8 md:space-y-12">
      {navigationData.map((category) => {
        const IconComponent = getIconComponent(category.icon)
        return (
          <section key={category.id} id={category.id} className="scroll-mt-16">
            <div className="flex items-center gap-2 mb-4 md:mb-6">
              <IconComponent className="h-5 w-5 md:h-6 md:w-6" />
              <h2 className="text-xl md:text-2xl font-bold">{category.name}</h2>
            </div>
            <div className="space-y-6 md:space-y-8">
              {category.subCategories.map((subCategory) => (
                <div key={subCategory.id} id={`${category.id}-${subCategory.id}`} className="scroll-mt-16">
                  <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">{subCategory.name}</h3>
                  <WebsiteGrid category={category} subCategory={subCategory} />
                </div>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}

