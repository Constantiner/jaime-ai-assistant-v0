'use client'

import Link from 'next/link'
import React, { memo } from 'react'
import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { CodeBlock } from './code-block'

// Custom types for ReactMarkdown components
interface CodeProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children: React.ReactNode;
  [key: string]: any;
}

// Markdown component configuration
const components: Partial<Components> = {
  // Use CodeBlock for syntax highlighting and prevent nesting issues
  code: function({ node, inline, className, children, ...props }: any) {
    if (inline) {
      return (
        <code className="px-1 py-0.5 bg-[#1E293B] text-white rounded text-sm" {...props}>
          {children}
        </code>
      );
    }
    
    // Non-inline code blocks should break out of paragraphs
    return (
      <CodeBlock className={className} inline={inline}>
        {String(children).trim()}
      </CodeBlock>
    );
  },
  // No need for pre tags as CodeBlock handles this
  pre: () => null,
  // Modify paragraph component to handle code blocks inside
  p: ({ node, children, ...props }) => {
    // Check if children contains CodeBlock
    const hasCodeBlock = React.Children.toArray(children).some(
      (child) => 
        React.isValidElement(child) && 
        (child.type === CodeBlock || 
         (typeof child.type === 'function' && child.type.name === 'CodeBlock'))
    );
    
    // If paragraph contains code block, just render children without paragraph wrapper
    if (hasCodeBlock) {
      return <>{children}</>;
    }
    
    // Otherwise, render normal paragraph
    return (
      <p className="mb-2 leading-relaxed" {...props}>
        {children}
      </p>
    );
  },
  ol: ({ node, children, ...props }) => (
    <ol className="list-decimal list-outside ml-4" {...props}>
      {children}
    </ol>
  ),
  li: ({ node, children, ...props }) => (
    <li className="py-1" {...props}>
      {children}
    </li>
  ),
  ul: ({ node, children, ...props }) => (
    <ul className="list-disc list-outside ml-4" {...props}>
      {children}
    </ul>
  ),
  strong: ({ node, children, ...props }) => (
    <span className="font-semibold" {...props}>
      {children}
    </span>
  ),
  a: ({ node, children, ...props }) => {
    // Check if href is external
    const href = props.href || '';
    const isExternal = href.startsWith('http') || href.startsWith('https');
    
    if (isExternal) {
      return (
        <a
          className="text-[#F68D2E] hover:opacity-80"
          target="_blank"
          rel="noreferrer noopener"
          href={href}
        >
          {children}
        </a>
      );
    }
    
    return (
      <Link
        className="text-[#F68D2E] hover:opacity-80"
        href={href}
        {...props}
      >
        {children}
      </Link>
    );
  },
  h1: ({ node, children, ...props }) => (
    <h1 className="text-3xl font-semibold mt-6 mb-2" {...props}>
      {children}
    </h1>
  ),
  h2: ({ node, children, ...props }) => (
    <h2 className="text-2xl font-semibold mt-6 mb-2" {...props}>
      {children}
    </h2>
  ),
  h3: ({ node, children, ...props }) => (
    <h3 className="text-xl font-semibold mt-6 mb-2" {...props}>
      {children}
    </h3>
  ),
  h4: ({ node, children, ...props }) => (
    <h4 className="text-lg font-semibold mt-6 mb-2" {...props}>
      {children}
    </h4>
  ),
  h5: ({ node, children, ...props }) => (
    <h5 className="text-base font-semibold mt-6 mb-2" {...props}>
      {children}
    </h5>
  ),
  h6: ({ node, children, ...props }) => (
    <h6 className="text-sm font-semibold mt-6 mb-2" {...props}>
      {children}
    </h6>
  ),
  blockquote: ({ node, children, ...props }) => (
    <blockquote className="border-l-4 border-[#F68D2E] pl-4 italic my-2" {...props}>
      {children}
    </blockquote>
  ),
};

const remarkPlugins = [remarkGfm];

const NonMemoizedMarkdown = ({ children }: { children: string }) => {
  return (
    <div className="markdown-wrapper w-full max-w-full overflow-hidden">
      <ReactMarkdown 
        remarkPlugins={remarkPlugins} 
        components={components}
        unwrapDisallowed={true}
        skipHtml={false}
        disallowedElements={['pre']} // Prevent pre elements from being rendered
      >
        {children}
      </ReactMarkdown>
    </div>
  );
};

// Add a style for proper code block width containment
const MarkdownStyles = () => (
  <style jsx global>{`
    .markdown-wrapper {
      width: 100%;
      max-width: 100%;
      overflow: hidden;
      word-break: break-word;
    }

    .markdown-wrapper pre, 
    .markdown-wrapper code,
    .markdown-wrapper .react-syntax-highlighter-line-number {
      max-width: 100%;
      white-space: pre;
      word-break: normal;
    }

    .markdown-wrapper table {
      display: block;
      max-width: 100%;
      overflow-x: auto;
      border-collapse: collapse;
    }

    .markdown-wrapper img {
      max-width: 100%;
      height: auto;
    }
    
    .markdown-wrapper * {
      max-width: 100%;
      overflow-wrap: break-word;
      box-sizing: border-box;
    }
    
    /* Make sure syntax highlighter doesn't expand beyond container */
    .markdown-wrapper .react-syntax-highlighter {
      max-width: 100% !important;
    }
  `}</style>
);

interface MarkdownProps {
  children: string;
}

export const Markdown = memo<MarkdownProps>(
  ({ children }) => (
    <>
      <MarkdownStyles />
      <NonMemoizedMarkdown children={children} />
    </>
  ),
  (prevProps: MarkdownProps, nextProps: MarkdownProps) => prevProps.children === nextProps.children,
);