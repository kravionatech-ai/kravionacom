"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  X,
  Send,
  Trash2,
  ExternalLink,
  Bot,
  User,
  Sparkles,
  ChevronDown,
  Maximize2,
  Minimize2,
  CheckCircle2,
  BookOpen,
  FileText,
  HelpCircle,
  Edit3,
  Briefcase,
  RotateCcw,
  PlusCircle,
} from "lucide-react";

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

    // Respect prefers-reduced-motion
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

  // Start welcome typing animation on open if only welcome message is present
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

  // Scroll on new messages or loading state
  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages, isLoading, welcomeCharCount, scrollToBottom]);

  // Keyboard accessibility: Escape to close
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [isOpen, onClose]);

  // Replay action: re-triggers the welcome message typing animation
  const handleReplay = () => {
    startWelcomeTyping();
  };

  const handleSend = () => {
    const text = inputValue.trim();
    if (!text || isLoading) return;

    // Instantly finish welcome typing if in progress
    if (isTypingWelcome) {
      clearInterval(welcomeTypingTimerRef.current);
      setWelcomeCharCount(fullWelcomeText.length);
      setIsTypingWelcome(false);
    }

    onSendMessage(text);
    setInputValue("");
  };

  // Support Enter to send, Shift+Enter for newline
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Formatted markdown text renderer (links & bold)
  const renderFormattedText = (content) => {
    if (!content) return null;
    const lines = content.split("\n");

    return lines.map((line, lineIdx) => {
      const isHeader = /^#{1,6}\s+/.test(line);
      const cleanLine = line.replace(/^#{1,6}\s+/, "");

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
              className="inline-flex items-center gap-0.5 font-semibold text-[#0f5960] hover:text-[#d85e3d] underline decoration-[#0f5960]/30 hover:decoration-[#d85e3d] transition-colors"
            >
              {linkText}
              <ExternalLink className="w-2.5 h-2.5 inline" />
            </Link>
          ) : (
            <a
              key={`link-${lineIdx}-${match.index}`}
              href={linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 font-semibold text-[#0f5960] hover:text-[#d85e3d] underline decoration-[#0f5960]/30 hover:decoration-[#d85e3d] transition-colors"
            >
              {linkText}
              <ExternalLink className="w-2.5 h-2.5 inline" />
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

      if (!line.trim()) return <div key={`empty-${lineIdx}`} className="h-1" />;

      return (
        <p
          key={`line-${lineIdx}`}
          className={`${lineIdx > 0 ? "mt-1" : ""} ${isHeader ? "font-semibold text-slate-900 text-xs" : ""}`}
        >
          {formattedParts}
        </p>
      );
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed z-50 flex flex-col bg-white shadow-2xl border border-teal-900/15 overflow-hidden transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${
        isExpanded
          ? "inset-3 sm:inset-auto sm:bottom-20 sm:right-6 sm:w-[520px] sm:max-w-[calc(100vw-2.5rem)] sm:h-[640px] sm:max-h-[calc(100vh-6.5rem)] rounded-2xl"
          : "inset-x-3 bottom-20 top-16 sm:top-auto sm:bottom-20 sm:right-6 sm:inset-x-auto sm:w-[370px] sm:max-w-[calc(100vw-2.5rem)] sm:h-[520px] sm:max-h-[calc(100vh-6.5rem)] rounded-2xl"
      }`}
      role="dialog"
      aria-modal="true"
      aria-label="Kraviona AI Assistant"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-gradient-to-r from-[#0f5960] via-[#0d4248] to-[#0a454b] text-white select-none">
        <div className="flex items-center gap-2">
          <div className="relative flex h-7 w-7 items-center justify-center rounded-xl bg-white/10 border border-white/20 text-white shadow-inner">
            <Bot className="w-4 h-4 text-[#00F2FE]" />
            <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-1.5 ring-[#0f5960]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs font-bold tracking-tight text-white">Kraviona AI Assistant</h3>
              <span className="text-[8px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-1.5 py-0.2 rounded-full">
                Online
              </span>
            </div>
            <p className="text-[9px] text-teal-100/75 leading-none">Engineering & Technical SEO Guide</p>
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
      <div className="px-3 py-1.5 bg-[#f0f6f7] border-b border-teal-900/10 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[10px] font-medium text-slate-700">
        <button
          onClick={onReadPage}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-teal-200/80 hover:bg-[#0f5960]/10 hover:text-[#0f5960] transition-all shadow-2xs whitespace-nowrap"
        >
          <BookOpen className="w-3 h-3 text-[#0f5960]" />
          <span>Explain This Page</span>
        </button>

        <button
          onClick={onSummarizePage}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-teal-200/80 hover:bg-[#0f5960]/10 hover:text-[#0f5960] transition-all shadow-2xs whitespace-nowrap"
        >
          <FileText className="w-3 h-3 text-[#d85e3d]" />
          <span>Summarize Page</span>
        </button>

        <Link
          href="/services"
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-teal-200/80 hover:bg-[#0f5960]/10 hover:text-[#0f5960] transition-all shadow-2xs whitespace-nowrap"
        >
          <Briefcase className="w-3 h-3 text-teal-600" />
          <span>Our Services</span>
        </Link>

        <Link
          href="/contact"
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-teal-200/80 hover:bg-[#0f5960]/10 hover:text-[#0f5960] transition-all shadow-2xs whitespace-nowrap"
        >
          <Edit3 className="w-3 h-3 text-amber-600" />
          <span>Help With Forms</span>
        </Link>

        {activeFormField && (
          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] whitespace-nowrap animate-pulse">
            <Edit3 className="w-3 h-3 text-amber-600" />
            <span>Guiding: {activeFormField.labelText}</span>
          </div>
        )}
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-3.5 space-y-2.5 bg-[#f8fafb]">
        {messages.map((msg) => {
          const isWelcome = msg.id === "welcome-msg";
          const textToRender =
            isWelcome && isTypingWelcome
              ? msg.text.slice(0, welcomeCharCount)
              : msg.text;

          return (
            <div
              key={msg.id}
              className={`flex gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender === "bot" && (
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white border border-slate-200 text-[#0f5960] shadow-2xs">
                  <Bot className="w-3 h-3 text-[#0f5960]" />
                </div>
              )}

              <div
                className={`max-w-[86%] rounded-xl px-3 py-2 text-[11px] sm:text-[11.5px] leading-snug ${
                  msg.sender === "user"
                    ? "bg-[#0f5960] text-white rounded-br-none shadow-xs"
                    : msg.isError
                    ? "bg-red-50 text-red-700 border border-red-200 rounded-bl-none shadow-xs"
                    : "bg-white text-slate-800 border border-slate-200/90 rounded-bl-none shadow-xs"
                }`}
              >
                <div className="break-words space-y-0.5">
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
                  <div className="mt-2 pt-1.5 border-t border-slate-100 flex flex-wrap gap-1">
                    <span className="text-[8.5px] text-slate-400 w-full font-medium uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5 text-[#0f5960]" /> Verified Pages
                    </span>
                    {msg.sources.map((src, idx) => (
                      <Link
                        key={`src-${idx}`}
                        href={src.url}
                        className="inline-flex items-center gap-1 text-[9.5px] font-medium bg-slate-50 hover:bg-[#0f5960]/10 text-[#0f5960] border border-slate-200 hover:border-teal-300 px-2 py-0.5 rounded-md transition-all"
                      >
                        <span>{src.title}</span>
                        <ExternalLink className="w-2 h-2 text-slate-400" />
                      </Link>
                    ))}
                  </div>
                )}

                {/* Timestamp */}
                <div className="mt-1 flex items-center justify-end text-[8.5px] text-slate-400 font-medium">
                  <span>{msg.timestamp}</span>
                </div>
              </div>

              {msg.sender === "user" && (
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#0f5960] text-white shadow-2xs">
                  <User className="w-3 h-3" />
                </div>
              )}
            </div>
          );
        })}

        {/* Live Thinking / AI Loading State */}
        {isLoading && (
          <div className="flex gap-2 justify-start items-center">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white border border-slate-200 text-[#0f5960] shadow-2xs">
              <Bot className="w-3 h-3 text-[#0f5960]" />
            </div>
            <div className="bg-white border border-slate-200/90 rounded-xl rounded-bl-none px-3 py-2 shadow-xs flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0f5960] animate-bounce" />
              <span
                className="h-1.5 w-1.5 rounded-full bg-[#00F2FE] animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <span
                className="h-1.5 w-1.5 rounded-full bg-[#0f5960] animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
              <span className="text-[10px] text-slate-500 font-medium ml-1">
                Thinking...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Text-Based User Input Bar with Multi-Line & Shift+Enter Support */}
      <div className="p-2.5 bg-white border-t border-slate-200/90">
        <div className="relative flex items-center">
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about web dev, technical SEO, services, or pricing... (Enter to send, Shift+Enter for new line)"
            maxLength={600}
            disabled={isLoading}
            className="w-full pl-3 pr-10 py-2 text-xs text-slate-900 placeholder:text-slate-400 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0f5960]/30 focus:border-[#0f5960] transition-all disabled:opacity-60 resize-none max-h-24 overflow-y-auto leading-relaxed"
          />

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            aria-label="Send query"
            className="absolute right-1.5 p-1.5 rounded-lg bg-[#0f5960] hover:bg-[#0a454b] text-white disabled:opacity-25 disabled:hover:bg-[#0f5960] transition-all shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
