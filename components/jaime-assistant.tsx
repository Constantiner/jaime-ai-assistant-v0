"use client"

import { useState, useRef, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Star, Trash2, ThumbsUp, ThumbsDown, Copy, MoreHorizontal, ArrowUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { JaimeLogo } from "./jaime-logo"
import { AudioButton } from "./audio-button"
import { CloseButton } from "./close-button"
import { ChatHeader } from "./chat-header"
import { ChatInputArea } from "./chat-input-area"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ChatHistory {
  id: string
  title: string
  messages: Message[]
  timestamp: Date
}

const SUGGESTED_PROMPTS = [
  "Show me case studies in ...",
  "What do you do best?",
  "Summarize this page",
  "Talk to an expert",
]

const CHAT_HISTORY: ChatHistory[] = [
  {
    id: "1",
    title: "Case studies related to GenAI.",
    messages: [],
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
  },
  {
    id: "2",
    title: "Bug Report",
    messages: [],
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
  },
  {
    id: "3",
    title: "Expertise in Generative AI Systems Evaluation",
    messages: [],
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: "4",
    title: "Generation of proposal for a real estate age",
    messages: [],
    timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
  },
  {
    id: "5",
    title: "List of projects in the financial industry",
    messages: [],
    timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  },
  {
    id: "6",
    title: "Summarize a whitepaper on AI in marketing",
    messages: [],
    timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
  },
]

export function JaimeAssistant() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isVoiceMode, setIsVoiceMode] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize chat with AI SDK
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    append,
    stop,
    error,
    status,
    setInput,
  } = useChat({
    api: "/api/chat",
    id: "jaime-chat",
    experimental_throttle: 100, // From the Vercel AI Chatbot example
    onError: (err) => {
      console.error("AI SDK error:", err)
    }
  })

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Helper function to format AI SDK messages to UI messages
  const formattedMessages = messages.map(msg => ({
    id: msg.id,
    role: msg.role as "user" | "assistant", 
    content: msg.content,
    timestamp: new Date(msg.createdAt || Date.now())
  }))

  // Handle clicking on a suggested prompt
  const handlePromptClick = (prompt: string) => {
    if (prompt === "Talk to an expert") {
      append({
        role: "user",
        content: "Tell me about your company relationships with InterSystems"
      })
    } else {
      append({
        role: "user", 
        content: prompt
      })
    }
  }

  // Handle voice mode toggle
  const handleVoiceToggle = () => {
    setIsVoiceMode(!isVoiceMode)
    if (!isVoiceMode) {
      setIsListening(true)
      // Simulate voice listening
      setTimeout(() => {
        setIsListening(false)
        setIsVoiceMode(false)
      }, 3000)
    }
  }

  // Group chats by time period for sidebar organization
  const groupChatsByTime = (chats: ChatHistory[]) => {
    const now = new Date()
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    const groups = {
      yesterday: chats.filter((chat) => chat.timestamp > yesterday),
      week: chats.filter((chat) => chat.timestamp <= yesterday && chat.timestamp > weekAgo),
      month: chats.filter((chat) => chat.timestamp <= weekAgo && chat.timestamp > monthAgo),
    }

    return groups
  }

  // Voice waveform component
  const VoiceWaveform = () => (
    <div className="flex items-center justify-center space-x-1">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={cn(
            "bg-blue-500 rounded-full transition-all duration-300",
            isListening ? "animate-pulse" : "",
            i === 0 || i === 4 ? "w-2 h-8" : i === 1 || i === 3 ? "w-2 h-16" : "w-2 h-24",
          )}
          style={{
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}
    </div>
  )

  return (
    <div
      className={cn(
        "text-white flex flex-col rounded-2xl overflow-hidden shadow-[0_0_25px_3px_rgba(246,141,46,0.7)]",
        isExpanded ? "fixed inset-5" : "w-[400px] h-[718px] relative"
      )}
      style={{ backgroundColor: "#0F1827" }}
    >
      {/* Main container with optional sidebar */}
      <div className="flex flex-1 h-full overflow-hidden">
        {/* Sidebar - Only visible when expanded */}
        {isExpanded && (
          <div className="w-96 bg-slate-800 flex flex-col shrink-0">
            {/* Sidebar Header */}
            <div className="p-4" style={{ backgroundColor: "#030B16" }}>
              <div className="flex items-center mb-4">
                <div className="flex items-center space-x-2">
                  <JaimeLogo className="w-6 h-6" />
                  <span className="text-lg font-semibold">Jaime AI Assistant</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-transparent border-[#1E293B] text-[#687389] hover:bg-[#1E293B] hover:text-white"
                  onClick={() => {
                    // Clear current chat
                    window.location.reload()
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2"
                  >
                    <path
                      d="M14 2V6C14 6.53043 14.2107 7.03914 14.5858 7.41421C14.9609 7.78929 15.4696 8 16 8H20M9 15H15M12 18V12M15 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V7L15 2Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  New Chat
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-transparent border-[#1E293B] text-[#687389] hover:bg-[#1E293B] hover:text-white"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              </div>
            </div>

            {/* Chat History */}
            <ScrollArea className="flex-1 p-4" style={{ backgroundColor: "#030B16" }}>
              {(() => {
                const groups = groupChatsByTime(CHAT_HISTORY)
                return (
                  <div className="space-y-6">
                    {groups.yesterday.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-slate-400 mb-3">Yesterday</h3>
                        <div className="space-y-2">
                          {groups.yesterday.map((chat) => (
                            <div
                              key={chat.id}
                              className="p-3 rounded-lg bg-transparent hover:bg-slate-600 cursor-pointer transition-colors"
                              onClick={() => setCurrentChatId(chat.id)}
                            >
                              <div className="text-sm text-[#A7B0C2] truncate">{chat.title}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {groups.week.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-slate-400 mb-3">Previous 7 days</h3>
                        <div className="space-y-2">
                          {groups.week.map((chat) => (
                            <div
                              key={chat.id}
                              className="p-3 rounded-lg bg-transparent hover:bg-slate-600 cursor-pointer transition-colors group"
                              onClick={() => setCurrentChatId(chat.id)}
                            >
                              <div className="flex items-center justify-between">
                                <div className="text-sm text-[#A7B0C2] truncate flex-1">{chat.title}</div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="opacity-0 group-hover:opacity-100 w-6 h-6 text-slate-400 hover:text-white"
                                >
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {groups.month.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-slate-400 mb-3">Previous 30 days</h3>
                        <div className="space-y-2">
                          {groups.month.map((chat) => (
                            <div
                              key={chat.id}
                              className="p-3 rounded-lg bg-transparent hover:bg-slate-600 cursor-pointer transition-colors"
                              onClick={() => setCurrentChatId(chat.id)}
                            >
                              <div className="text-sm text-[#A7B0C2] truncate">{chat.title}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })()}
            </ScrollArea>
          </div>
        )}

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col relative">
          {/* Use the ChatHeader component */}
          <ChatHeader 
            isExpanded={isExpanded}
            onToggleExpand={() => setIsExpanded(!isExpanded)}
            onClose={() => {}}
          />

          {/* Voice Mode Overlay */}
          {isVoiceMode && (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center z-50"
              style={{ backgroundColor: "#0F1827" }}
            >
              <div className="mb-8">
                <VoiceWaveform />
              </div>
              <div className="flex space-x-4">
                <Button
                  size="lg"
                  className="w-16 h-16 rounded-full bg-orange-500 hover:bg-orange-600"
                  onClick={handleVoiceToggle}
                >
                  <AudioButton onClick={() => {}} className="w-8 h-8" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-16 h-16 rounded-full border-slate-600 text-white hover:bg-slate-700"
                  onClick={() => setIsVoiceMode(false)}
                >
                  <CloseButton onClick={() => setIsVoiceMode(false)} className="w-8 h-8" />
                </Button>
              </div>
            </div>
          )}

          {/* Chat Messages */}
          <div 
            className={cn("flex-1 overflow-y-auto relative", isExpanded ? "p-6" : "p-4")}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='146' height='230' viewBox='0 0 146 230' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M73.0382 130.486L43.6858 159.779L114.322 230L143.675 200.706L73.0382 130.486Z' fill='%23141F2F'/%3E%3Cpath d='M116.609 86.9645L43.6858 159.741L73.0764 188.996L146 116.22L116.609 86.9645Z' fill='%23141F2F'/%3E%3Cpath d='M116.533 0L0 116.335L29.3906 145.59L145.924 29.2554L116.533 0Z' fill='%23141F2F'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundSize: isExpanded ? '146px 230px' : '105px 165px'
            }}
          >
            {formattedMessages.length === 0 ? (
              <div className={cn("flex flex-col justify-end h-full pb-4", isExpanded ? "max-w-4xl mx-auto w-full" : "")}>
                <h1 className={cn("font-semibold text-4xl mb-2", isExpanded ? "" : "px-4")}>
                  {"Hi! I'm Jaime, your AI Assistant. How can I help?"}
                </h1>
              </div>
            ) : (
              <div className={cn(isExpanded ? "space-y-6 max-w-4xl mx-auto w-full" : "space-y-4")}>
                {formattedMessages.map((message) => (
                  <div key={message.id} className={isExpanded ? "space-y-4" : ""}>
                    {message.role === "user" && (
                      <div className="flex justify-start mb-4">
                        <div className="flex items-start space-x-[5px]">
                          <svg className="flex-shrink-0" width="36" height="39" viewBox="0 0 36 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g filter="url(#filter0_d_4010_2014)">
                              <path d="M18 26.5H27M22.376 10.122C22.7741 9.72389 23.314 9.50024 23.877 9.50024C24.44 9.50024 24.9799 9.72389 25.378 10.122C25.7761 10.5201 25.9997 11.06 25.9997 11.623C25.9997 12.186 25.7761 12.7259 25.378 13.124L13.368 25.135C13.1301 25.3729 12.836 25.5469 12.513 25.641L9.64098 26.479C9.55493 26.5041 9.46372 26.5056 9.37689 26.4833C9.29006 26.4611 9.2108 26.4159 9.14742 26.3525C9.08404 26.2892 9.03887 26.2099 9.01662 26.1231C8.99437 26.0362 8.99588 25.945 9.02098 25.859L9.85898 22.987C9.9532 22.6643 10.1272 22.3706 10.365 22.133L22.376 10.122Z" stroke="#687389" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </g>
                            <defs>
                              <filter id="filter0_d_4010_2014" x="-6" y="-3.5" width="48" height="48" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                                <feOffset dy="2"/>
                                <feGaussianBlur stdDeviation="3"/>
                                <feComposite in2="hardAlpha" operator="out"/>
                                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.01 0"/>
                                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_4010_2014"/>
                                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_4010_2014" result="shape"/>
                              </filter>
                            </defs>
                          </svg>
                          <div className="bg-[#1E293B] p-3 rounded-lg text-white text-[14px]">
                            {message.content}
                          </div>
                        </div>
                      </div>
                    )}

                    {message.role === "assistant" && (
                      <div className={isExpanded ? "" : "space-y-3"}>
                        <div className={cn(
                          "text-white",
                          isExpanded ? "mb-4" : "text-sm leading-relaxed"
                        )}>
                          {message.content}
                          {status === "streaming" && messages[messages.length - 1].role === "assistant" && 
                           messages[messages.length - 1].id === message.id && (
                            <span className="inline-block animate-pulse">▌</span>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 mb-4">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className={cn(
                              "text-slate-400 hover:text-white",
                              !isExpanded && "w-8 h-8"
                            )}
                          >
                            <ThumbsUp className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className={cn(
                              "text-slate-400 hover:text-white",
                              !isExpanded && "w-8 h-8"
                            )}
                          >
                            <ThumbsDown className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className={cn(
                              "text-slate-400 hover:text-white",
                              !isExpanded && "w-8 h-8"
                            )}
                          >
                            <Star className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className={cn(
                              "text-slate-400 hover:text-white",
                              !isExpanded && "w-8 h-8"
                            )}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {status === "submitted" && formattedMessages.length > 0 && 
                 formattedMessages[formattedMessages.length - 1].role === "user" && (
                  <div className="flex items-center space-x-2 animate-pulse">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                    <div className="text-white">Writing...</div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Suggested Prompts */}
          <div className={cn(
            "pb-2",
            isExpanded ? "max-w-4xl mx-auto w-full px-6" : "px-4"
          )}>
            <div className="mt-2 flex flex-wrap gap-2">
              {SUGGESTED_PROMPTS.map((prompt, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600 text-xs"
                  onClick={() => handlePromptClick(prompt)}
                >
                  {prompt}
                </Button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div>
            <ChatInputArea
              inputValue={input}
              setInputValue={(value) => {
                setInput(value)
              }}
              handleSendMessage={(content) => {
                if (status === "streaming") {
                  stop()
                } else if (content.trim()) {
                  append({
                    role: "user",
                    content: content
                  })
                }
              }}
              handleVoiceToggle={handleVoiceToggle}
              isExpanded={isExpanded}
              errorMessage={error ? error.message || "Something went wrong" : null}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
