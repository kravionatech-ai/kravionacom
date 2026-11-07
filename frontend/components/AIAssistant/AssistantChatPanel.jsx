"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  X,
  Send,
  ExternalLink,
  User,
  Sparkles,
  Maximize2,
  Minimize2,
  CheckCircle2,
  BookOpen,
  FileText,
  Briefcase,
  RotateCcw,
  PlusCircle,
  Cpu,
  CreditCard,
  Edit3,
} from "lucide-react";

// Mini Kraviona Robot Mascot SVG (Exact visual match to the floating companion)
function MiniRobotAvatar({ className = "w-4 h-4" }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 36 32"
      className={className}
      fill="none"
      aria-hidden="true"
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

      {/* Cyan glowing eyes */}
      <ellipse cx="14" cy="15.5" rx="2.2" ry="3" fill="#00F2FE" />
      <ellipse cx="22" cy="15.5" rx="2.2" ry="3" fill="#00F2FE" />

      {/* Cute nose/mouth dot */}
      <circle cx="18" cy="18.5" r="1.1" fill="#00F2FE" />

      {/* Specular highlights */}
      <circle cx="14.8" cy="14.5" r="0.8" fill="#FFFFFF" />
      <circle cx="22.8" cy="14.5" r="0.8" fill="#FFFFFF" />
    </svg>
  );
}

export default function AssistantChatPanel({
  isOpen = false,
  onClose = () => {},
  messages = [],
  onSendMessage = () => {},
  isLoading = false,
  onNewChat = () => {},
  onReadPage = () => {},
  onSummarizePage = () => {},
  activeFormField = null,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputValue, setInputValue] = useState("");

  // Smooth typing effect state for welcome message
  const [welcomeCharCount, setWelcomeCharCount] = useState(0);
  const [isTypingWelcome, setIsTypingWelcome] = useState(false);
  const welcomeTypingTimerRef = useRef(null);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const welcomeMessage = messages.find((m) => m.id === "welcome-msg");
  const fullWelcomeText = welcomeMessage ? welcomeMessage.text : "";

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Trigger typewriter reveal for welcome message
  const startWelcomeTyping = useCallback(() => {
    if (!fullWelcomeText) return;

    if (welcomeTypingTimerRef.current) {
      clearInterval(welcomeTypingTimerRef.current);
    }

    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setWelcomeCharCount(fullWelcomeText.length);
      setIsTypingWelcome(false);
      return;
    }

    setWelcomeCharCount(0);
    setIsTypingWelcome(true);

    let charIdx = 0;
    welcomeTypingTimerRef.current = setInterval(() => {
      charIdx += 2;
      if (charIdx <= fullWelcomeText.length) {
        setWelcomeCharCount(charIdx);
      } else {
        setWelcomeCharCount(fullWelcomeText.length);
        setIsTypingWelcome(false);
        clearInterval(welcomeTypingTimerRef.current);
      }
    }, 14);
  }, [fullWelcomeText]);

  useEffect(() => {
    if (isOpen) {
      if (messages.length === 1 && messages[0].id === "welcome-msg") {
        startWelcomeTyping();
      } else {
        setWelcomeCharCount(fullWelcomeText.length);
        setIsTypingWelcome(false);
      }
      setTimeout(() => textareaRef.current?.focus(), 200);
      scrollToBottom();
    } else {
      if (welcomeTypingTimerRef.current) {
        clearInterval(welcomeTypingTimerRef.current);
      }
    }
  }, [isOpen, messages.length, fullWelcomeText.length, startWelcomeTyping, scrollToBottom]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages, isLoading, welcomeCharCount, scrollToBottom]);

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [isOpen, onClose]);

  const handleReplay = () => {
    startWelcomeTyping();
  };

  const handleSend = () => {
    const text = inputValue.trim();
    if (!text || isLoading) return;

    if (isTypingWelcome) {
      clearInterval(welcomeTypingTimerRef.current);
      setWelcomeCharCount(fullWelcomeText.length);
      setIsTypingWelcome(false);
    }

    onSendMessage(text);
    setInputValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Formatted markdown text renderer
  const renderFormattedText = (content) => {
    if (!content) return null;
    const lines = content.split("\n");

    return lines.map((line, lineIdx) => {
      const isHeader = /^#{1,6}\s+/.test(line);
      const isBullet = /^[•\-*]\s+/.test(line.trim());
      const cleanLine = line.replace(/^#{1,6}\s+/, "").replace(/^[•\-*]\s+/, "");

      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = linkRegex.exec(cleanLine)) !== null) {
        if (match.index > lastIndex) {
          parts.push(cleanLine.substring(lastIndex, match.index));
        }

        const linkText = match[1];
        const linkUrl = match[2];
        const isInternal = linkUrl.startsWith("/") && !linkUrl.startsWith("//");

        parts.push(
          isInternal ? (
            <Link
              key={`link-${lineIdx}-${match.index}`}
              href={linkUrl}
              className="inline-flex items-center gap-0.5 font-semibold text-[#0f5960] hover:text-[#C85A3C] underline decoration-[#0f5960]/30 hover:decoration-[#C85A3C] transition-colors"
            >
              {linkText}
              <ExternalLink className="w-2.5 h-2.5 inline opacity-75" />
            </Link>
          ) : (
            <a
              key={`link-${lineIdx}-${match.index}`}
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 font-semibold text-[#0f5960] hover:text-[#C85A3C] underline decoration-[#0f5960]/30 hover:decoration-[#C85A3C] transition-colors"
            >
              {linkText}
              <ExternalLink className="w-2.5 h-2.5 inline opacity-75" />
            </a>
          )
        );

        lastIndex = match.index + match[0].length;
      }

      if (lastIndex < cleanLine.length) {
        parts.push(cleanLine.substring(lastIndex));
      }

      const formattedParts = parts.map((part, partIdx) => {
        if (typeof part !== "string") return part;
        const boldRegex = /\*\*([^*]+)\*\*/g;
        const subParts = [];
        let subLast = 0;
        let bMatch;

        while ((bMatch = boldRegex.exec(part)) !== null) {
          if (bMatch.index > subLast) {
            subParts.push(part.substring(subLast, bMatch.index));
          }
          subParts.push(
            <strong key={`b-${lineIdx}-${partIdx}-${bMatch.index}`} className="font-semibold text-slate-900">
              {bMatch[1]}
            </strong>
          );
          subLast = bMatch.index + bMatch[0].length;
        }

        if (subLast < part.length) {
          subParts.push(part.substring(subLast));
        }

        return <React.Fragment key={`p-${partIdx}`}>{subParts}</React.Fragment>;
      });

      if (!line.trim()) return <div key={`empty-${lineIdx}`} className="h-1.5" />;

      return (
        <div
          key={`line-${lineIdx}`}
          className={`flex items-start gap-1.5 ${lineIdx > 0 ? "mt-1" : ""} ${
            isHeader ? "font-semibold text-slate-900 text-xs mt-2" : ""
          }`}
        >
          {isBullet && (
            <span className="inline-block mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#00F2FE] shadow-[0_0_4px_#00F2FE]" />
          )}
          <div className="flex-1 leading-relaxed">{formattedParts}</div>
        </div>
      );
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed z-[70] flex flex-col bg-white shadow-2xl border border-teal-900/15 overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${
        isExpanded
          ? "inset-3 sm:inset-auto sm:bottom-20 sm:right-6 sm:w-[540px] sm:max-w-[calc(100vw-2.5rem)] sm:h-[660px] sm:max-h-[calc(100vh-6.5rem)] rounded-2xl"
          : "inset-x-3 bottom-20 top-16 sm:top-auto sm:bottom-20 sm:right-6 sm:inset-x-auto sm:w-[390px] sm:max-w-[calc(100vw-2.5rem)] sm:h-[540px] sm:max-h-[calc(100vh-6.5rem)] rounded-2xl"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Kraviona AI Assistant"
    >
      {/* Modern Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#1A3840] via-[#16434d] to-[#0f5960] text-white select-none border-b border-white/10">
        <div className="flex items-center gap-2.5">
          {/* Kraviona Mini Robot Mascot Avatar with Pulse Status */}
          <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-black/40 border border-white/20 text-white shadow-inner">
            <MiniRobotAvatar className="w-5 h-5 drop-shadow-[0_0_6px_rgba(0,242,254,0.6)]" />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 ring-1.5 ring-[#1A3840]" />
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold tracking-tight text-white">Kraviona AI Assistant</h3>
              <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-1.5 py-0.5 rounded-full">
                Online
              </span>
            </div>
            <p className="text-[10px] text-teal-100/75 leading-tight mt-0.5">AI-First Systems &amp; Technology Companion</p>
          </div>
        </div>

        {/* Header Action Controls */}
        <div className="flex items-center gap-1">
          {/* Replay Welcome Message Button */}
          <button
            onClick={handleReplay}
            title="Replay welcome message"
            className="p-1.5 rounded-lg text-teal-100 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1 text-[10px] font-medium"
            aria-label="Replay welcome message"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#00F2FE]" />
            <span className="hidden md:inline text-[9.5px]">Replay</span>
          </button>

          {/* New Chat Action Button */}
          <button
            onClick={() => {
              onNewChat();
              startWelcomeTyping();
            }}
            title="Start a new chat conversation"
            className="p-1.5 rounded-lg text-teal-100 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1 text-[10px] font-medium"
            aria-label="New chat"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#00F2FE]" />
            <span className="hidden sm:inline text-[9.5px]">New Chat</span>
          </button>

          {/* Maximize / Minimize Window */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? "Collapse view" : "Expand view"}
            className="hidden sm:inline-flex p-1.5 rounded-lg text-teal-100 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Toggle window size"
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>

          {/* Close Control */}
          <button
            onClick={onClose}
            title="Close assistant"
            className="p-1.5 rounded-lg text-teal-100 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close assistant"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Action Toolbar */}
      <div className="px-3 py-2 bg-[#f4f7f8] border-b border-teal-900/10 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px] font-medium text-slate-700">
        <button
          onClick={onReadPage}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-teal-200/90 hover:bg-[#0f5960]/10 hover:text-[#0f5960] transition-all shadow-2xs whitespace-nowrap"
        >
          <BookOpen className="w-3 h-3 text-[#0f5960]" />
          <span>Explain Page</span>
        </button>

        <button
          onClick={onSummarizePage}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-teal-200/90 hover:bg-[#0f5960]/10 hover:text-[#0f5960] transition-all shadow-2xs whitespace-nowrap"
        >
          <Sparkles className="w-3 h-3 text-[#C85A3C]" />
          <span>Summarize Page</span>
        </button>

        <button
          onClick={() => onSendMessage("Please explain Kraviona's 5 core business verticals and services.")}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-teal-200/90 hover:bg-[#0f5960]/10 hover:text-[#0f5960] transition-all shadow-2xs whitespace-nowrap"
        >
          <Briefcase className="w-3 h-3 text-teal-600" />
          <span>5 Core Pillars</span>
        </button>

        <button
          onClick={() => onSendMessage("Tell me about Kraviona's AI agent development and autonomous automation solutions.")}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-teal-200/90 hover:bg-[#0f5960]/10 hover:text-[#0f5960] transition-all shadow-2xs whitespace-nowrap"
        >
          <Cpu className="w-3 h-3 text-[#00F2FE] drop-shadow-sm" />
          <span>AI Solutions</span>
        </button>

        <button
          onClick={() => onSendMessage("What are Kraviona's transparent pricing models and consultation options?")}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-teal-200/90 hover:bg-[#0f5960]/10 hover:text-[#0f5960] transition-all shadow-2xs whitespace-nowrap"
        >
          <CreditCard className="w-3 h-3 text-amber-600" />
          <span>Pricing Plans</span>
        </button>

        {activeFormField && (
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] whitespace-nowrap animate-pulse">
            <Edit3 className="w-3 h-3 text-amber-600" />
            <span>Guiding: {activeFormField.labelText}</span>
          </div>
        )}
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3 bg-[#f8fafb]">
        {messages.map((msg) => {
          const isWelcome = msg.id === "welcome-msg";
          const textToRender =
            isWelcome && isTypingWelcome
              ? msg.text.slice(0, welcomeCharCount)
              : msg.text;

          return (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender === "bot" && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-black/80 border border-slate-200 text-[#0f5960] shadow-xs">
                  <MiniRobotAvatar className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-[12px] sm:text-[12.5px] leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-[#1A3840] text-white rounded-br-xs shadow-sm"
                    : msg.isError
                    ? "bg-red-50 text-red-700 border border-red-200 rounded-bl-xs shadow-xs"
                    : "bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs shadow-xs"
                }`}
              >
                <div className="break-words space-y-1">
                  {msg.sender === "user" ? (
                    msg.text
                  ) : (
                    <>
                      {renderFormattedText(textToRender)}
                      {isWelcome && isTypingWelcome && (
                        <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-[#00F2FE] animate-pulse align-middle" />
                      )}
                    </>
                  )}
                </div>

                {/* Verified Sources Cited */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                    <span className="text-[9px] text-slate-400 w-full font-semibold uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Verified Sources
                    </span>
                    {msg.sources.map((src, idx) => (
                      <Link
                        key={`src-${idx}`}
                        href={src.url}
                        className="inline-flex items-center gap-1 text-[10px] font-medium bg-slate-50 hover:bg-[#0f5960]/10 text-[#0f5960] border border-slate-200 hover:border-teal-300 px-2 py-0.5 rounded-md transition-all"
                      >
                        <span>{src.title}</span>
                        <ExternalLink className="w-2 h-2 text-slate-400" />
                      </Link>
                    ))}
                  </div>
                )}

                {/* Timestamp */}
                <div className="mt-1 flex items-center justify-end text-[9px] text-slate-400 font-medium">
                  <span>{msg.timestamp}</span>
                </div>
              </div>

              {msg.sender === "user" && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-[#1A3840] text-white shadow-xs">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}

        {/* Live Thinking / AI Loading State */}
        {isLoading && (
          <div className="flex gap-2.5 justify-start items-center">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-black/80 border border-slate-200 text-[#0f5960] shadow-xs">
              <MiniRobotAvatar className="w-4 h-4" />
            </div>
            <div className="bg-white border border-slate-200/90 rounded-2xl rounded-bl-xs px-3.5 py-2.5 shadow-xs flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0f5960] animate-bounce" />
              <span
                className="h-1.5 w-1.5 rounded-full bg-[#00F2FE] animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <span
                className="h-1.5 w-1.5 rounded-full bg-[#0f5960] animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
              <span className="text-[11px] text-slate-500 font-medium ml-1.5">
                AI Assistant is thinking...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Modern Input Bar */}
      <div className="p-3 bg-white border-t border-slate-200/90">
        <div className="relative flex items-center">
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about AI agents, custom software, SaaS, SEO, or pricing..."
            maxLength={600}
            disabled={isLoading}
            className="w-full pl-3.5 pr-11 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 bg-slate-50/80 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f5960]/30 focus:border-[#0f5960] transition-all disabled:opacity-60 resize-none max-h-24 overflow-y-auto leading-relaxed"
          />

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            aria-label="Send query"
            className="absolute right-2 p-1.5 rounded-lg bg-[#C85A3C] hover:bg-[#B04D31] text-white disabled:opacity-30 disabled:hover:bg-[#C85A3C] transition-all shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="mt-1 flex items-center justify-between px-1 text-[9px] text-slate-400">
          <span>Kraviona Intelligence • Press Enter to send</span>
          <span>Shift + Enter for new line</span>
        </div>
      </div>
    </div>
  );
}
