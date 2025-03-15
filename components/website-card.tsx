import type { Website } from "@/types/navigation"
import { ExternalLink } from "lucide-react"
import Image from "next/image"

interface WebsiteCardProps {
  website: Website
}

export default function WebsiteCard({ website }: WebsiteCardProps) {
  return (
    <a
      href={website.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-2 sm:p-3 md:p-4 rounded-lg border border-border hover:border-primary transition-colors bg-card hover:shadow-md"
    >
      <div className="flex items-center gap-2 md:gap-3">
        {website.icon && (
          <div className="flex-shrink-0">
            <Image
              src={website.icon || "/placeholder.svg"}
              alt={website.name}
              width={24}
              height={24}
              className="rounded-md w-6 h-6 sm:w-7 sm:h-7 md:w-7 md:h-7"
            />
          </div>
        )}
        <div className="flex-grow min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-foreground truncate text-xs sm:text-sm md:text-base">{website.name}</h3>
            <ExternalLink className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground flex-shrink-0 ml-1 md:ml-2" />
          </div>
          <p className="text-xs md:text-sm text-muted-foreground truncate">{website.description}</p>
        </div>
      </div>
    </a>
  )
}

