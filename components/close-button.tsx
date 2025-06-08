"use client"

// Removed Image import as we're using inline SVG
import { cn } from "@/lib/utils"

interface CloseButtonProps {
  onClick: () => void
  className?: string
}

export function CloseButton({ onClick, className = "" }: CloseButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-9 h-9 rounded border border-slate-800 hover:border-slate-600 active:border-transparent",
        "transition-all duration-200 flex items-center justify-center",
        className
      )}
    >
      <div 
        className={cn(
          "w-full h-full p-2 text-slate-400 hover:text-slate-300 active:text-orange-500",
          "transition-all duration-200"
        )}
      >
        <svg 
          width="22" 
          height="22" 
          viewBox="0 0 22 22" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <path d="M20 2L2 20" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
          <path d="M20 20L2 2" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
        </svg>
      </div>
    </button>
  )
}
