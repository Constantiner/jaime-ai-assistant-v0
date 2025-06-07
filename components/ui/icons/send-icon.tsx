"use client"

import { SVGProps } from "react"
import { cn } from "@/lib/utils"

interface SendIconProps extends SVGProps<SVGSVGElement> {
  active?: boolean
  className?: string
}

export function SendIcon({ active = false, className, ...props }: SendIconProps) {
  const strokeColor = active ? "#F68D2E" : "#687389"
  
  return (
    <svg 
      width="36" 
      height="37" 
      viewBox="0 0 36 37" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={cn("transition-all duration-200", className)}
      {...props}
    >
      <g filter="url(#filter0_d_4004_658)">
        <path
          d="M28.0003 17C28.0003 17.0947 27.9734 17.1875 27.9227 17.2675C27.872 17.3475 27.7996 17.4115 27.714 17.452L9.71402 25.952C9.62412 25.9956 9.52318 26.0111 9.42434 25.9966C9.32549 25.982 9.2333 25.9381 9.15974 25.8705C9.08619 25.8028 9.03468 25.7147 9.0119 25.6174C8.98913 25.5201 8.99614 25.4182 9.03202 25.325L11.874 17.698C12.0417 17.2477 12.0417 16.7522 11.874 16.302L9.03102 8.67498C8.99495 8.58162 8.98785 8.47956 9.01064 8.3821C9.03343 8.28465 9.08505 8.19632 9.15878 8.12864C9.23251 8.06096 9.32492 8.01706 9.42396 8.00267C9.523 7.98828 9.62409 8.00407 9.71402 8.04798L27.714 16.548C27.7996 16.5885 27.872 16.6525 27.9227 16.7325C27.9734 16.8125 28.0003 16.9053 28.0003 17ZM28.0003 17H12"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_4004_658"
          x="-6"
          y="-4"
          width="48"
          height="46"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="2" />
          <feGaussianBlur stdDeviation="3" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.01 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_4004_658" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_4004_658" result="shape" />
        </filter>
      </defs>
    </svg>
  )
}
