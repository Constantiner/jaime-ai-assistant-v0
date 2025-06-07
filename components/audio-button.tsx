"use client"

interface AudioButtonProps {
  onClick: () => void
  className?: string
  type?: "button" | "submit" | "reset"
}

export function AudioButton({ onClick, className = "", type = "button" }: AudioButtonProps) {
  return (
    <button type={type} onClick={onClick} className={`transition-all duration-200 ${className}`}>
      <svg width="36" height="37" viewBox="0 0 36 37" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_d_4004_1025)">
          <path
            d="M8 15V18M12 11V22M16 8V26M20 13V20M24 10V23M28 15V18"
            stroke="#F68D2E"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <defs>
          <filter
            id="filter0_d_4004_1025"
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
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_4004_1025" />
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_4004_1025" result="shape" />
          </filter>
        </defs>
      </svg>
    </button>
  )
}
