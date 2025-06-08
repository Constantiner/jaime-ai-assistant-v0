'use client'

import React, { useState } from 'react'
import { Button } from './ui/button'
import { Copy } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export const CodeBlock = ({ children, className }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false)
  
  // Extract language from className (format: language-xxx)
  const match = /language-(\w+)/.exec(className || '')
  const language = match ? match[1] : ''
  const codeString = String(children).trim()
  
  const handleCopy = () => {
    navigator.clipboard.writeText(codeString)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  return (
    <div className="relative group my-4 w-full max-w-full">
      <Button 
        size="icon" 
        variant="ghost" 
        className={cn(
          "absolute right-2 top-2 h-8 w-8 z-10 opacity-0 group-hover:opacity-100 transition-opacity", 
          copied ? "text-green-500" : "text-gray-400"
        )}
        onClick={handleCopy}
      >
        <Copy className="h-4 w-4" />
      </Button>
      
      <div className="w-full" style={{ maxWidth: '100%', overflowX: 'auto' }}>
        {language ? (
          <SyntaxHighlighter
            language={language}
            style={atomDark}
            wrapLines={false}
            PreTag="div"
            customStyle={{
              margin: 0,
              borderRadius: '0.375rem',
              backgroundColor: '#1E293B', 
              fontSize: '0.875rem',
              border: copied ? '1px solid #10B981' : '1px solid #334155',
              maxWidth: 'none',  // Allow content to be its natural width
              width: 'fit-content', // Make container fit content width
              minWidth: '100%',  // But ensure it's at least 100% wide
            }}
            codeTagProps={{
              style: {
                whiteSpace: 'pre',
                wordBreak: 'keep-all',
              }
            }}
          >
            {codeString}
          </SyntaxHighlighter>
        ) : (
          <code className={cn(
            "block bg-[#1E293B] rounded-md p-4 text-sm text-white", 
            copied ? "border border-green-500" : "border border-slate-700"
          )}>
            {codeString}
          </code>
        )}
      </div>
      
      {language && (
        <div className="absolute top-[-10px] right-2 bg-[#1E293B] px-2 text-xs text-gray-400 rounded">
          {language}
        </div>
      )}
      
      {copied && (
        <div className="absolute top-2 right-12 bg-green-500 text-white px-2 py-1 rounded text-xs">
          Copied!
        </div>
      )}
    </div>
  )
}