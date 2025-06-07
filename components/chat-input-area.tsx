import { useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { SendTextButton } from "./send-text-button"
import { AudioButton } from "./audio-button"

interface ChatInputAreaProps {
  inputValue: string
  setInputValue: (value: string) => void
  handleSendMessage: (content: string) => void
  handleVoiceToggle: () => void
  isExpanded: boolean
  errorMessage: string | null
}

export function ChatInputArea({
  inputValue,
  setInputValue,
  handleSendMessage,
  handleVoiceToggle,
  isExpanded,
  errorMessage
}: ChatInputAreaProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim()) {
      // Pass the message content to the parent component
      handleSendMessage(inputValue)
      // Clear input after sending
      setInputValue("")
    }
  }
  
  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <div className={isExpanded ? "p-6" : "p-4"}>
      <div className={isExpanded ? "max-w-4xl mx-auto" : ""}>
        <form onSubmit={handleSubmit} className="flex items-center space-x-2 bg-slate-800 rounded-lg p-3">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isExpanded 
              ? "Tell me about your company relationships with InterSystems" 
              : "Type here in any language or use audio mode..."
            }
            className={cn(
              "flex-1 bg-transparent border-none text-white focus:ring-0",
              isExpanded ? "placeholder-slate-400" : "placeholder-slate-500 text-sm"
            )}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                if (inputValue.trim()) {
                  handleSubmit(e)
                }
              }
            }}
          />
          <div className="flex items-center space-x-2">
            <AudioButton onClick={handleVoiceToggle} type="button" />
            <SendTextButton
              hasText={inputValue.trim().length > 0}
              disabled={!inputValue.trim()}
              type="submit"
            />
          </div>
        </form>
        {errorMessage && (
          <div className="text-xs text-red-500 text-center font-medium mb-2 p-2 bg-red-100 rounded-md">
            {errorMessage}
          </div>
        )}
        <div className={cn(
          "text-xs text-slate-500 text-center",
          isExpanded ? "mt-2" : "leading-tight"
        )}>
          <>Jaime is powered by Generative AI technology, which may produce inaccurate information. Please{" "}
            <span className="underline cursor-pointer">contact our team</span> for any questions.</>
        
        </div>
      </div>
    </div>
  )
}