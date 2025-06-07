"use client"

import { useState, ButtonHTMLAttributes } from "react"
import { cn } from "@/lib/utils"
import { ExpandIcon } from "../icons/expand-icon"
import { Button } from "@/components/ui/button"

interface ExpandButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isExpanded: boolean
  className?: string
}

export function ExpandButton({ 
  isExpanded, 
  className, 
  ...props 
}: ExpandButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isActive, setIsActive] = useState(false)

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("p-0 h-auto w-auto hover:bg-transparent", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setIsActive(false)
      }}
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      {...props}
    >
      <ExpandIcon 
        isExpanded={isExpanded} 
        isHovered={isHovered} 
        isActive={isActive} 
      />
    </Button>
  )
}
