"use client"

import { useState } from "react"
import Image from "next/image"

interface CloseButtonProps {
  onClick: () => void
  className?: string
}

export function CloseButton({ onClick, className = "" }: CloseButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isActive, setIsActive] = useState(false)

  const getIconSrc = () => {
    if (isActive) return "/icons/close-active.svg"
    if (isHovered) return "/icons/close-hover.svg"
    return "/icons/close-default.svg"
  }

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
      className={`transition-all duration-200 ${className}`}
    >
      <Image
        src={getIconSrc() || "/placeholder.svg"}
        alt="Close"
        width={48}
        height={48}
        className="transition-all duration-200"
      />
    </button>
  )
}
