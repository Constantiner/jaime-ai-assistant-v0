"use client"

import React from "react"
import { SendHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SendTextButtonProps {
  onClick?: () => void
  hasText: boolean
  disabled?: boolean
  className?: string
  type?: "button" | "submit" | "reset"
}

export function SendTextButton({
  onClick,
  hasText,
  disabled = false,
  className = "",
  type = "button"
}: SendTextButtonProps) {
  return (
    <Button
      size="icon"
      type={type}
      variant="ghost"
      className={cn(
        "rounded-full w-8 h-8",
        hasText ? "text-orange-500 hover:text-orange-600" : "text-slate-500",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      <SendHorizontal className="w-4 h-4" />
    </Button>
  )
}
