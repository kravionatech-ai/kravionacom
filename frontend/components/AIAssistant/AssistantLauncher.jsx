"use client";

import React, { useState, useEffect } from "react";
import { X, Sparkles } from "lucide-react";

/**
 * AssistantLauncher.jsx
 * Interactive AI Assistant launcher in bottom-right corner.
 *
 * Features:
 * - Miniature Kraviona Robot Mascot SVG (exact match to the companion robot face).
 * - Clean status beacon with subtle pulse.
 * - "AI Assistant" typing animation with glowing Sparkles indicator.
 * - Perfectly aligned with WhatsApp floating button above.
 */
export default function AssistantLauncher({ isOpen = false, onToggle = () => {} }) {
  const FULL_TEXT = "AI Assistant";
  const [typedText, setTypedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  // Smooth typing effect on launcher label
  useEffect(() => {
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
      className="group fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-3.5 py-2.5 rounded-full bg-gradient-to-r from-[#1A3840] via-[#16434d] to-[#0f5960] text-white shadow-[0_8px_24px_rgba(26,56,64,0.45)] border border-[#00F2FE]/40 cursor-pointer select-none transition-all duration-300 hover:scale-105 hover:border-[#00F2FE]/80 hover:shadow-[0_10px_28px_rgba(0,242,254,0.35)] active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#00F2FE] focus:ring-offset-2 animate-in fade-in slide-in-from-bottom-3"
    >
      {/* Mini Kraviona Robot Mascot Icon */}
      <div className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black/30 border border-white/20 shadow-inner overflow-hidden">
        {isOpen ? (
          <X className="w-4 h-4 text-[#00F2FE] transition-transform duration-200 rotate-0 group-hover:rotate-90" />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 36 32"
            className="w-5 h-5 drop-shadow-[0_0_4px_rgba(0,242,254,0.5)] transition-transform duration-200 group-hover:scale-110"
            fill="none"
          >
            {/* Left earpod capsule */}
            <rect x="0.5" y="10" width="4" height="12" rx="2" fill="#00F2FE" />
            <rect x="1.5" y="12" width="2" height="8" rx="1" fill="#FFFFFF" opacity="0.8" />

            {/* Right earpod capsule */}
            <rect x="31.5" y="10" width="4" height="12" rx="2" fill="#00F2FE" />
            <rect x="32.5" y="12" width="2" height="8" rx="1" fill="#FFFFFF" opacity="0.8" />

            {/* Outer white curved helmet / shell */}
            <rect x="3.5" y="2" width="29" height="28" rx="14" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" />

            {/* Inner dark glossy visor screen */}
            <rect x="6.5" y="5" width="23" height="22" rx="10" fill="#0B1315" />

            {/* Cyan glowing eyes (exact match to Kraviona robot companion!) */}
            <ellipse cx="14" cy="15.5" rx="2.2" ry="3" fill="#00F2FE" />
            <ellipse cx="22" cy="15.5" rx="2.2" ry="3" fill="#00F2FE" />

            {/* Cute nose/mouth dot */}
            <circle cx="18" cy="18.5" r="1.1" fill="#00F2FE" />

            {/* Specular highlights */}
            <circle cx="14.8" cy="14.5" r="0.8" fill="#FFFFFF" />
            <circle cx="22.8" cy="14.5" r="0.8" fill="#FFFFFF" />
          </svg>
        )}

        {/* Clean, integrated online indicator dot inside the badge */}
        {!isOpen && (
          <span className="absolute bottom-0.5 right-0.5 flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F2FE] opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#00F2FE]" />
          </span>
        )}
      </div>

      {/* Typing Label with Clean Sparkle Accent */}
      <div className="flex items-center text-[13px] font-semibold tracking-wide text-white pr-0.5">
        <span>{typedText}</span>
        {isTypingComplete ? (
          <Sparkles className="w-3.5 h-3.5 text-[#00F2FE] ml-1.5 animate-pulse drop-shadow-[0_0_6px_#00F2FE]" />
        ) : (
          <span
            className="inline-block w-[1.5px] h-3.5 ml-1 bg-[#00F2FE] align-middle shadow-[0_0_6px_#00F2FE] animate-pulse"
            aria-hidden="true"
          />
        )}
      </div>
    </div>
  );
}
