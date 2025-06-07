"use client"

import { SVGProps } from "react"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface ExpandIconProps extends SVGProps<SVGSVGElement> {
  isExpanded?: boolean
  isHovered?: boolean
  isActive?: boolean
  className?: string
}

export function ExpandIcon({ 
  isExpanded = false, 
  isHovered = false, 
  isActive = false,
  className, 
  ...props 
}: ExpandIconProps) {
  const getIconSrc = () => {
    if (isActive) return "/icons/expand-active.svg"
    if (isHovered) return "/icons/expand-hover-large.svg"
    return "/icons/expand-default-large.svg"
  }

  return (
    <div
      className={cn(
        "transition-all duration-200 flex items-center justify-center", 
        className
      )}
      style={{
        transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
        transformOrigin: "center",
      }}
      {...props}
    >
      <Image
        src={getIconSrc()}
        alt={isExpanded ? "Collapse" : "Expand"}
        width={48}
        height={48}
        className="transition-all duration-200"
      />
    </div>
  )
}
