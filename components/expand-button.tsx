"use client"

// Removed Image import as we're using inline SVG
import { cn } from "@/lib/utils"

interface ExpandButtonProps {
  isExpanded: boolean
  onClick: () => void
  className?: string
}

export function ExpandButton({ isExpanded, onClick, className = "" }: ExpandButtonProps) {
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
          "w-full h-full p-2 text-slate-400 hover:text-slate-300 active:text-white",
          "transition-all duration-200 origin-center",
          isExpanded ? "rotate-180" : "rotate-0"
        )}
      >
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 20 20" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <path d="M19.5813 0.418414C20.1392 0.9763 20.1392 1.88083 19.5813 2.43872L3.39087 18.6291C2.83298 19.187 1.92845 19.187 1.37056 18.6291C0.812677 18.0712 0.812677 17.1669 1.37056 16.6089L17.5611 0.418414C18.119 -0.139471 19.0234 -0.139471 19.5813 0.418414Z" fill="currentColor"/>
          <path d="M0 1.42857C0 0.6396 0.6396 0 1.42857 0H18.5714C19.3604 0 20 0.6396 20 1.42857V18.5714C20 19.3604 19.3604 20 18.5714 20C17.7825 20 17.1429 19.3604 17.1429 18.5714V2.85714H1.42857C0.6396 2.85714 0 2.21754 0 1.42857Z" fill="currentColor"/>
        </svg>
      </div>
    </button>
  )
}
