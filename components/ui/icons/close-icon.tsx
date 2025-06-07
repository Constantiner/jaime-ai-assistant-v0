"use client"

import { SVGProps } from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

interface CloseIconProps extends SVGProps<SVGSVGElement> {
  className?: string
}

export function CloseIcon({ className, ...props }: CloseIconProps) {
  return (
    <X 
      className={cn("h-6 w-6 text-slate-400 hover:text-white transition-colors", className)}
      {...props}
    />
  )
}
