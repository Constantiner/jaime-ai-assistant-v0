"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Star, Trash2, ThumbsUp, ThumbsDown, Copy, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { JaimeLogo } from "./jaime-logo"
import { ExpandButton } from "./expand-button"
import { CloseButton } from "./close-button"
import { SendTextButton } from "./send-text-button"
import { AudioButton } from "./audio-button"

interface Message {
  id: string
  type: "user" | "assistant" | "error"
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
  const [inputValue, setInputValue] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [showError, setShowError] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content:
          "First Line Software is now a Select Implementation Partner of InterSystems, recognizing its expertise in healthcare IT solutions like HealthShare.\n\nPlease follow this link to find most relevant information or schedule a demo here.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
    }, 1000)
  }

  const handlePromptClick = (prompt: string) => {
    if (prompt === "Talk to an expert") {
      handleSendMessage("Tell me about your company relationships with InterSystems")
    } else {
      handleSendMessage(prompt)
    }
  }

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

  const showErrorMessage = () => {
    const errorMessage: Message = {
      id: Date.now().toString(),
      type: "error",
      content: "Sorry, something went wrong. We are on it.",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, errorMessage])
    setShowError(true)
    setTimeout(() => setShowError(false), 5000)
  }

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

  if (isExpanded) {
    return (
      <div
        className="fixed inset-5 text-white flex rounded-2xl overflow-hidden shadow-[0_0_25px_3px_rgba(246,141,46,0.7)]"
        style={{ backgroundColor: "#0F1827" }}
      >
        {/* Sidebar */}
        <div className="w-96 bg-slate-800 flex flex-col">
          {/* Header */}
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

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col relative">
          {/* Top Right Buttons - Positioned absolutely */}
          <div className="absolute top-4 right-4 flex items-center space-x-2 z-10">
            <ExpandButton isExpanded={isExpanded} onClick={() => setIsExpanded(false)} />
            <CloseButton onClick={() => {}} />
          </div>

          {/* Chat Header */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent border-[#1E293B] text-[#687389] hover:bg-[#1E293B] hover:text-white"
              >
                <Star className="w-4 h-4 mr-2" />
                Show Starred
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent border-[#1E293B] text-[#687389] hover:bg-[#1E293B] hover:text-white"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Conversation
              </Button>
            </div>
          </div>

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
          <div className="flex-1 p-6 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <h1 className="text-2xl font-bold mb-2">{"Hi! I'm Jaime, your AI Assistant. How can I help?"}</h1>
                <div className="flex flex-wrap gap-2 mt-8">
                  {SUGGESTED_PROMPTS.slice(0, 3).map((prompt, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                      onClick={() => handlePromptClick(prompt)}
                    >
                      {prompt}
                    </Button>
                  ))}
                  <Button
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                    onClick={() => handlePromptClick("Talk to an expert")}
                  >
                    Talk to an expert
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6 max-w-4xl mx-auto">
                {messages.map((message) => (
                  <div key={message.id} className="space-y-4">
                    {message.type === "user" && (
                      <div className="flex justify-end">
                        <div className="bg-slate-700 rounded-lg p-4 max-w-2xl">
                          <div className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-slate-600 rounded-full flex items-center justify-center text-xs">
                              U
                            </div>
                            <div className="text-white">{message.content}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {message.type === "assistant" && (
                      <div>
                        <div className="text-white mb-4">{message.content}</div>
                        <div className="flex items-center space-x-2 mb-4">
                          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                            <ThumbsUp className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                            <ThumbsDown className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                            <Star className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {SUGGESTED_PROMPTS.slice(0, 3).map((prompt, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                              onClick={() => handlePromptClick(prompt)}
                            >
                              {prompt}
                            </Button>
                          ))}
                          <Button
                            size="sm"
                            className="bg-orange-500 hover:bg-orange-600 text-white"
                            onClick={() => handlePromptClick("Talk to an expert")}
                          >
                            Talk to an expert
                          </Button>
                        </div>
                      </div>
                    )}

                    {message.type === "error" && (
                      <div className="flex items-center space-x-2 text-red-400 text-sm">
                        <div className="w-2 h-2 bg-red-500 rounded-full" />
                        {message.content}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center space-x-2 bg-slate-800 rounded-lg p-3">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Tell me about your company relationships with InterSystems"
                  className="flex-1 bg-transparent border-none text-white placeholder-slate-400 focus:ring-0"
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && inputValue.trim()) {
                      handleSendMessage(inputValue)
                    }
                  }}
                />
                <div className="flex items-center space-x-2">
                  <AudioButton onClick={handleVoiceToggle} />
                  <SendTextButton
                    hasText={inputValue.trim().length > 0}
                    onClick={() => handleSendMessage(inputValue)}
                  />
                </div>
              </div>
              <div className="text-xs text-slate-500 mt-2 text-center">
                Jaime is powered by Generative AI technology, which may produce inaccurate information. Please{" "}
                <span className="underline cursor-pointer">contact our team</span> for any questions.
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Compact View
  return (
    <div
      className="w-[400px] h-[718px] text-white rounded-2xl flex flex-col relative overflow-hidden shadow-[0_0_25px_3px_rgba(246,141,46,0.7)]"
      style={{ backgroundColor: "#0F1827" }}
    >
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

      {/* Header */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <JaimeLogo className="w-6 h-6" />
            <span className="text-lg font-semibold">Jaime AI Assistant</span>
          </div>
          <div className="flex items-center space-x-2">
            <ExpandButton isExpanded={isExpanded} onClick={() => setIsExpanded(true)} />
            <CloseButton onClick={() => {}} />
          </div>
        </div>

        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="bg-transparent border-[#1E293B] text-[#687389] hover:bg-[#1E293B] hover:text-white"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M14 2V6C14 6.53043 14.2107 7.03914 14.5858 7.41421C14.9609 7.78929 15.4696 8 16 8H20M9 15H15M12 18V12M15 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V7L15 2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="bg-transparent border-[#1E293B] text-[#687389] hover:bg-[#1E293B] hover:text-white"
          >
            <Star className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="bg-transparent border-[#1E293B] text-[#687389] hover:bg-[#1E293B] hover:text-white"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Chat Content */}
      <ScrollArea className="flex-1 p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col h-full">
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-2xl font-bold mb-8 leading-tight">
                  {"Hi! I'm Jaime, your AI Assistant. How can I help?"}
                </h1>
                <div className="space-y-3">
                  {SUGGESTED_PROMPTS.slice(0, 3).map((prompt, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full bg-slate-700 border-slate-600 text-white hover:bg-slate-600 text-left justify-start"
                      onClick={() => handlePromptClick(prompt)}
                    >
                      {prompt}
                    </Button>
                  ))}
                  <Button
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                    onClick={() => handlePromptClick("Talk to an expert")}
                  >
                    Talk to an expert
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id}>
                {message.type === "user" && (
                  <div className="flex justify-end mb-4">
                    <div className="bg-slate-700 rounded-lg p-3 max-w-[280px]">
                      <div className="flex items-start space-x-2">
                        <div className="w-5 h-5 bg-slate-600 rounded-full flex items-center justify-center text-xs mt-0.5">
                          <span className="text-slate-300">✏️</span>
                        </div>
                        <div className="text-white text-sm">{message.content}</div>
                      </div>
                    </div>
                  </div>
                )}

                {message.type === "assistant" && (
                  <div className="space-y-3">
                    <div className="text-white text-sm leading-relaxed">{message.content}</div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="icon" className="w-8 h-8 text-slate-400 hover:text-white">
                        <ThumbsUp className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="w-8 h-8 text-slate-400 hover:text-white">
                        <ThumbsDown className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="w-8 h-8 text-slate-400 hover:text-white">
                        <Star className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="w-8 h-8 text-slate-400 hover:text-white">
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {SUGGESTED_PROMPTS.slice(0, 3).map((prompt, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="w-full bg-slate-700 border-slate-600 text-white hover:bg-slate-600 text-left justify-start text-xs"
                          onClick={() => handlePromptClick(prompt)}
                        >
                          {prompt}
                        </Button>
                      ))}
                      <Button
                        size="sm"
                        className="bg-orange-500 hover:bg-orange-600 text-white text-xs"
                        onClick={() => handlePromptClick("Talk to an expert")}
                      >
                        Talk to an expert
                      </Button>
                    </div>
                  </div>
                )}

                {message.type === "error" && (
                  <div className="flex items-center space-x-2 text-red-400 text-sm mb-4">
                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                    {message.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4">
        <div className="flex items-center space-x-2 bg-slate-800 rounded-lg p-3 mb-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type here in any language or use audio mode..."
            className="flex-1 bg-transparent border-none text-white placeholder-slate-500 focus:ring-0 text-sm"
            onKeyPress={(e) => {
              if (e.key === "Enter" && inputValue.trim()) {
                handleSendMessage(inputValue)
              }
            }}
          />
          <div className="flex items-center space-x-2">
            <AudioButton onClick={handleVoiceToggle} />
            <SendTextButton hasText={inputValue.trim().length > 0} onClick={() => handleSendMessage(inputValue)} />
          </div>
        </div>
        <div className="text-xs text-slate-500 text-center leading-tight">
          Jaime is powered by Generative AI technology, which may produce inaccurate information. Please{" "}
          <span className="underline cursor-pointer">contact our team</span> for any questions.
        </div>
      </div>
    </div>
  )
}
