"use client";

import React, { useState, useEffect, useRef } from "react";
import { Bot, X, MessageSquare, Sparkles } from "lucide-react";

/**
 * AssistantLauncher.jsx
 * Compact, interactive AI Chatbot launcher widget in the bottom-right corner.
 * 
 * Features:
 * - Positioned at bottom: 24px; right: 24px (fixed bottom-6 right-6).
 * - "AI Assistant" text with a natural typing effect and pulsing cyan cursor beam.
 * - Existing cyan accent color (#00F2FE) & transparent robot design aesthetics.
 * - Clicking toggles the chat panel open and closed.
 * - Smooth entrance animation, hover scale, and keyboard accessibility (Enter/Space).
 */
export default function AssistantLauncher({ isOpen = false, onToggle = () => {} }) {
  const FULL_TEXT = "AI Assistant";
  const [typedText, setTypedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  // Smooth typing effect on launcher label
  useEffect(() => {
    // Respect prefers-reduced-motion
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTypedText(FULL_TEXT);
      setIsTypingComplete(true);
      return;
    }

    let charIndex = 0;
    const interval = setInterval(() => {
      charIndex++;
      if (charIndex <= FULL_TEXT.length) {
        setTypedText(FULL_TEXT.slice(0, charIndex));
      } else {
        clearInterval(interval);
        setIsTypingComplete(true);
      }
    }, 75);

    return () => clearInterval(interval);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onToggle();
    }
  };

  return (
    <div
      onClick={onToggle}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-expanded={isOpen}
      aria-label={isOpen ? "Close Kraviona AI Assistant" : "Open Kraviona AI Assistant"}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-3.5 py-2.5 rounded-full bg-gradient-to-r from-[#0f5960] via-[#0d4248] to-[#0a454b] text-white shadow-[0_8px_24px_rgba(15,89,96,0.38)] border border-teal-400/30 cursor-pointer select-none transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-[0_10px_28px_rgba(0,242,254,0.35)] focus:outline-none focus:ring-2 focus:ring-[#00F2FE] focus:ring-offset-2 animate-in fade-in slide-in-from-bottom-3"
    >
      {/* Mini Transparent Robot / Bot Icon with Cyan Glow Accent */}
      <div className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 border border-white/20 text-white shadow-inner">
        {isOpen ? (
          <X className="w-3.5 h-3.5 text-[#00F2FE] transition-transform duration-200 rotate-0 hover:rotate-90" />
        ) : (
          <Bot className="w-3.5 h-3.5 text-[#00F2FE]" />
        )}
        <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F2FE] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00F2FE] shadow-[0_0_6px_#00F2FE]" />
        </span>
      </div>

      {/* Typing Label with Blinking Cyan Cursor */}
      <div className="flex items-center text-xs font-bold tracking-tight text-white pr-0.5">
        <span>{typedText}</span>
        <span
          className={`inline-block w-1 h-3.5 ml-0.5 bg-[#00F2FE] align-middle shadow-[0_0_6px_#00F2FE] ${
            isTypingComplete ? "animate-pulse" : "opacity-100"
          }`}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
