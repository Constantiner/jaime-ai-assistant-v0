"use client"

import { useState } from "react"
import Image from "next/image"

interface ExpandButtonProps {
  isExpanded: boolean
  onClick: () => void
  className?: string
}

export function ExpandButton({ isExpanded, onClick, className = "" }: ExpandButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isActive, setIsActive] = useState(false)

  const getIconSrc = () => {
    if (!isExpanded) {
      // Compact view - use the same state logic as expanded view but not rotated
      if (isActive) return "/icons/expand-active.svg"
      if (isHovered) return "/icons/expand-hover-large.svg"
      return "/icons/expand-default-large.svg"
    } else {
      // Expanded view - use the larger icons (48x48) for collapse button
      if (isActive) return "/icons/expand-active.svg"
      if (isHovered) return "/icons/expand-hover-large.svg"
      return "/icons/expand-default-large.svg"
    }
  }

  const getSize = () => {
    return { width: 48, height: 48 }
  }

  const size = getSize()

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setIsActive(false)
      }}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      className={`transition-all duration-200 flex items-center justify-center ${className}`}
      style={{
        transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
        transformOrigin: "center",
      }}
    >
      <Image
        src={getIconSrc() || "/placeholder.svg"}
        alt={isExpanded ? "Collapse" : "Expand"}
        width={size.width}
        height={size.height}
        className="transition-all duration-200"
      />
    </button>
  )
}
