"use client"

import { ButtonHTMLAttributes } from "react"
import { cn } from "@/lib/utils"
import { AudioIcon } from "../icons/audio-icon"
import { Button } from "@/components/ui/button"

interface AudioButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
  className?: string
}

export function AudioButton({ 
  active = false, 
  className, 
  ...props 
}: AudioButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("p-0 h-auto w-auto hover:bg-transparent", className)}
      {...props}
    >
      <AudioIcon active={active} />
    </Button>
  )
}
