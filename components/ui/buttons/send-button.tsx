"use client"

import { ButtonHTMLAttributes } from "react"
import { cn } from "@/lib/utils"
import { SendIcon } from "../icons/send-icon"
import { Button } from "@/components/ui/button"

interface SendButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean
  className?: string
}

export function SendButton({ 
  active = false, 
  className, 
  disabled,
  ...props 
}: SendButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      disabled={disabled}
      className={cn("p-0 h-auto w-auto hover:bg-transparent", className)}
      {...props}
    >
      <SendIcon active={active && !disabled} />
    </Button>
  )
}
