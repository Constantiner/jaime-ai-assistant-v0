"use client";

import { useEffect, useRef, useState } from "react";
import { Markdown } from "./markdown";

interface MarkdownToHtmlProps {
  markdown: string;
  onHtmlCapture: (html: string) => void;
}

/**
 * Utility component to capture the HTML output of the Markdown renderer
 * This component renders the markdown temporarily and captures the resulting HTML
 */
export const MarkdownToHtml = ({ markdown, onHtmlCapture }: MarkdownToHtmlProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const captureComplete = useRef(false); // Add ref outside of the effect

  useEffect(() => {
    // Reset capture flag when dependencies change
    captureComplete.current = false;
    
    if (ref.current) {
      // Ensure the DOM is fully rendered
      const timeoutId = setTimeout(() => {
        if (ref.current && !captureComplete.current) {
          captureComplete.current = true;
          
          // Capture the HTML content after render
          const html = ref.current.innerHTML;
          
          // Clean up the HTML by removing any unnecessary attributes that might affect pasting
          const cleanHtml = html
            .replace(/\sclass="[^"]*"/g, '') // Remove class attributes
            .replace(/\sstyle="[^"]*"/g, '');  // Remove style attributes
          
          // Pass the clean HTML back to the parent component
          onHtmlCapture(cleanHtml);
        }
      }, 0);
      
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [markdown, onHtmlCapture]);

  // Render it in a hidden div
  return (
    <div className="absolute left-[-9999px] top-[-9999px] invisible" ref={ref}>
      <Markdown>{markdown}</Markdown>
    </div>
  );
};
