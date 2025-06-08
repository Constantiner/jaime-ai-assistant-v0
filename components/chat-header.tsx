import { Button } from "@/components/ui/button"
import { Star, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { JaimeLogo } from "./jaime-logo"
// Use the existing ExpandButton and CloseButton components
import { ExpandButton } from "./expand-button"
import { CloseButton } from "./close-button"

interface ChatHeaderProps {
  isExpanded: boolean
  onToggleExpand: () => void
  onClose?: () => void
}

export function ChatHeader({ isExpanded, onToggleExpand, onClose = () => {} }: ChatHeaderProps) {
  return (
    <div className="p-4">
      {/* Only show the logo and title in collapsed view since expanded has it in sidebar */}
      <div className="flex items-center justify-between mb-4">
        {!isExpanded && (
          <div className="flex items-center space-x-2">
            <JaimeLogo className="w-6 h-6" />
            <span className="text-lg font-semibold">Jaime AI Assistant</span>
          </div>
        )}
        <div className={cn("flex items-center space-x-2", isExpanded && "absolute top-4 right-4 z-10")}>
          <ExpandButton 
            isExpanded={isExpanded} 
            onClick={onToggleExpand}
          />
          {/* <CloseButton onClick={onClose} /> */}
        </div>
      </div>

      {/* Action buttons - adapt layout based on expanded state */}
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size={isExpanded ? "sm" : "icon"}
          className="bg-transparent border-[#1E293B] text-[#687389] hover:bg-[#1E293B] hover:text-white"
        >
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className={isExpanded ? "mr-2" : ""}
          >
            <path
              d="M14 2V6C14 6.53043 14.2107 7.03914 14.5858 7.41421C14.9609 7.78929 15.4696 8 16 8H20M9 15H15M12 18V12M15 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V7L15 2Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {isExpanded && "New Chat"}
        </Button>
        <Button
          variant="outline"
          size={isExpanded ? "sm" : "icon"}
          className="bg-transparent border-[#1E293B] text-[#687389] hover:bg-[#1E293B] hover:text-white"
        >
          <Star className={cn("w-4 h-4", isExpanded && "mr-2")} />
          {isExpanded && "Show Starred"}
        </Button>
        <Button
          variant="outline"
          size={isExpanded ? "sm" : "icon"}
          className="bg-transparent border-[#1E293B] text-[#687389] hover:bg-[#1E293B] hover:text-white"
        >
          <Trash2 className={cn("w-4 h-4", isExpanded && "mr-2")} />
          {isExpanded && "Clear Conversation"}
        </Button>
      </div>
    </div>
  )
}