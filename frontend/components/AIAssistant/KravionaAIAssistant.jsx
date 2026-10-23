"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import RobotCursorFollower from "./RobotCursorFollower";
import AssistantChatPanel from "./AssistantChatPanel";
import AssistantTextExplainer from "./AssistantTextExplainer";
import {
  extractPageContext,
  getRouteAnnouncement,
} from "./AssistantPageContext";
import { attachFormObserver } from "./AssistantFormGuide";
import { getFallbackChatResponse } from "@/components/Chatbot/fallbackKnowledge";

const INITIAL_WELCOME = {
  id: "welcome-msg",
  sender: "bot",
  text: `Hello! 👋 I'm Kraviona's AI Assistant.

I can guide you through our **Web Development** and **Technical SEO** services, explain technical concepts on hover or text selection, summarize pages, or answer questions about your digital project. How can I assist you today?`,
  sources: [],
  timestamp: "Just now",
};

export default function KravionaAIAssistant() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [expression, setExpression] = useState("idle");
  const [speechBubble, setSpeechBubble] = useState(null);
  const [overrideGaze, setOverrideGaze] = useState(null);
  const [viseme, setViseme] = useState(0);

  // Chat conversation state
  const [messages, setMessages] = useState([INITIAL_WELCOME]);
  const [isLoading, setIsLoading] = useState(false);

  // Form guidance state
  const [activeFormField, setActiveFormField] = useState(null);

  const bubbleTimeoutRef = useRef(null);

  const showTemporaryBubble = useCallback((text, durationMs = 4500) => {
    setSpeechBubble(text);
    if (bubbleTimeoutRef.current) clearTimeout(bubbleTimeoutRef.current);
    bubbleTimeoutRef.current = setTimeout(() => {
      setSpeechBubble(null);
    }, durationMs);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Form field observer integration (Visual guidance only, zero audio)
  useEffect(() => {
    if (!mounted) return;

    const cleanup = attachFormObserver({
      onFieldFocus: (meta) => {
        setActiveFormField(meta);
        setExpression("curious");

        // Compute gaze toward field center
        if (typeof window !== "undefined") {
          const rx = (meta.fieldCenterX - window.innerWidth / 2) / (window.innerWidth / 2);
          const ry = (meta.fieldCenterY - window.innerHeight / 2) / (window.innerHeight / 2);
          setOverrideGaze({ x: rx, y: ry });
        }

        showTemporaryBubble(meta.guidance, 4500);
      },
      onFieldBlur: () => {
        setActiveFormField(null);
        setOverrideGaze(null);
        setExpression("idle");
      },
      onValidationNotice: (msg) => {
        showTemporaryBubble(`Notice: ${msg}`, 4000);
      },
    });

    return () => cleanup();
  }, [mounted, showTemporaryBubble]);

  // Send message to AI endpoint (with instant verified knowledge fallback)
  const handleSendMessage = async (textToSend) => {
    const query = String(textToSend).trim();
    if (!query || isLoading) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setExpression("thinking");

    let replyText = null;
    let replySources = [];

    // 1. Try GET API route handler
    try {
      const res = await fetch(`/api/assistant/chat?message=${encodeURIComponent(query)}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.reply) {
          replyText = json.data.reply;
          replySources = json.data.sources || [];
        }
      }
    } catch {
      // Proceed to fallback
    }

    // 2. Client-side verified knowledge fallback
    if (!replyText) {
      const fallback = getFallbackChatResponse(query);
      replyText = fallback.reply;
      replySources = fallback.sources || [];
    }

    const botMsg = {
      id: `bot-${Date.now()}`,
      sender: "bot",
      text: replyText,
      sources: replySources,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, botMsg]);
    setIsLoading(false);
    setExpression("happy");
    setTimeout(() => setExpression("idle"), 2500);
  };

  // Action: Explain Page
  const handleReadPage = () => {
    setIsOpen(true);
    const context = extractPageContext();
    handleSendMessage(`Please explain the technical offerings and services presented on this page: "${context.title} — ${context.h1}".`);
  };

  // Action: Summarize Page
  const handleSummarizePage = () => {
    setIsOpen(true);
    const context = extractPageContext();
    handleSendMessage(`Please summarize the key offerings and business advantages of this page: "${context.title} — ${context.h1}".`);
  };

  if (!mounted) return null;

  // Prevent assistant from appearing on admin or login pages
  if (pathname && (pathname.startsWith("/admin") || pathname.startsWith("/login"))) {
    return null;
  }

  return (
    <>
      {/* Real-time Hover & Text Selection Explainer Panel (Typing Animation, Auto Viewport Bounds) */}
      <AssistantTextExplainer
        onActiveChange={(active) => {
          setExpression(active ? "curious" : "idle");
        }}
      />

      {/* Smooth Following Cursor Robot Companion (Transparent, Zero Background/Backdrop Glow) */}
      <RobotCursorFollower
        expression={expression}
        isSpeaking={false}
        viseme={viseme}
        speechBubble={speechBubble}
        overrideGaze={overrideGaze}
        isOpen={isOpen}
        onClick={() => {
          setIsOpen(true);
        }}
      />

      {/* 100% Text-Based AI Assistant Chat Window (All Audio Controls & TTS Removed) */}
      <AssistantChatPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        onClearChat={() => setMessages([INITIAL_WELCOME])}
        onReadPage={handleReadPage}
        onSummarizePage={handleSummarizePage}
        activeFormField={activeFormField}
      />
    </>
  );
}
