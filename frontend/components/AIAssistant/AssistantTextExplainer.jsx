"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Sparkles, X, BookOpen, ExternalLink } from "lucide-react";

/**
 * Technical and Service Knowledge Dictionary
 * Instant, accurate, founder-grade explanations for Kraviona tech stack & terms.
 */
const TECH_EXPLANATIONS = {
  // Web Engineering
  "next.js": "High-performance React framework featuring Server Components, static generation, and instant routing built for 90+ PageSpeed scores.",
  "nextjs": "High-performance React framework featuring Server Components, static generation, and instant routing built for 90+ PageSpeed scores.",
  "react": "Modern component-based JavaScript UI library used for building interactive, reactive, and scalable front-end interfaces.",
  "mern stack": "Full-stack web architecture utilizing MongoDB, Express.js, React, and Node.js for robust, end-to-end web applications.",
  "node.js": "Event-driven asynchronous JavaScript runtime for high-throughput backends, APIs, and microservices.",
  "nodejs": "Event-driven asynchronous JavaScript runtime for high-throughput backends, APIs, and microservices.",
  "full-stack": "End-to-end engineering covering responsive frontend UI, server logic, databases, APIs, and cloud deployments.",
  "full stack": "End-to-end engineering covering responsive frontend UI, server logic, databases, APIs, and cloud deployments.",
  "saas": "Software-as-a-Service applications engineered with subscription billing, multi-tenant databases, and authentication.",
  "api": "Application Programming Interface allowing disparate systems, frontends, and third-party tools to exchange data securely.",
  "rest api": "Standard HTTP architectural style for scalable, stateless web services and data endpoints.",
  "graphql": "Query language for APIs that lets clients request exactly the data they need in a single round-trip.",
  "database": "Optimized structured data storage layer using MongoDB or PostgreSQL with indexing for microsecond query speeds.",
  "mongodb": "Flexible, document-based NoSQL database ideal for scalable modern web apps and rapid schema iteration.",
  "postgresql": "Enterprise relational database system known for reliability, ACID compliance, and complex data relationships.",
  "ui/ux": "User Interface and Experience design focused on visual aesthetics, accessibility, intuitive navigation, and high conversion.",
  "figma": "Collaborative cloud design tool used for crafting wireframes, interactive prototypes, and production design systems.",
  
  // Technical SEO & Performance
  "technical seo": "Optimization of website architecture, crawlability, Core Web Vitals, and structured data to dominate Google search rankings.",
  "core web vitals": "Google's essential user-experience metrics measuring LCP (loading speed), INP (responsiveness), and CLS (visual stability).",
  "lcp": "Largest Contentful Paint: Core Web Vital measuring how quickly the main content of a page becomes visible (target < 2.5s).",
  "cls": "Cumulative Layout Shift: Core Web Vital measuring unexpected visual shifts during loading (target < 0.1).",
  "inp": "Interaction to Next Paint: Core Web Vital assessing overall page responsiveness to user clicks and taps (target < 200ms).",
  "pagespeed": "Google's official performance score evaluating mobile/desktop speed, asset compression, and runtime efficiency.",
  "schema markup": "Structured JSON-LD metadata that helps search engines understand content and qualify for rich search results.",
  "structured data": "Code format providing search engines explicit clues about page content, articles, local business info, and FAQs.",
  "crawl budget": "The number of pages a search engine bot crawls on your site within a given timeframe; optimized via clean routing.",
  "canonical": "HTML link tag specifying the preferred master URL to prevent duplicate content indexing across search engines.",
  "sitemap": "XML index file informing search engines about all discoverable, authoritative URLs on the website.",
  "robots.txt": "Instruction file that directs search engine web crawlers which URLs they can or cannot request from the site.",
  
  // AI & Automation
  "ai automation": "Custom business workflows utilizing LLMs, intelligent agents, and automated pipelines to eliminate manual work.",
  "ai chatbot": "Conversational assistant powered by AI that answers questions, guides visitors, and captures qualified leads 24/7.",
  "llm": "Large Language Model trained on massive datasets to understand natural language, summarize text, and generate responses.",
  "autonomous agent": "Software program that leverages AI to execute multi-step tasks, research data, and trigger workflows independently.",
  "n8n": "Workflow automation platform connecting APIs, webhooks, and AI nodes for custom business integrations.",
  
  // Kraviona Services
  "web development": "Custom digital engineering creating fast, conversion-optimized websites and web applications with Next.js.",
  "digital marketing": "Multi-channel strategy including technical SEO, content marketing, and search visibility to drive qualified inbound leads.",
  "social media marketing": "Targeted brand campaigns across digital platforms designed to boost engagement and customer acquisition.",
  "case studies": "Real-world portfolio breakdowns detailing client challenges, technical architectures, and measurable ROI results.",
};

/**
 * Finds the best explanation for a given phrase or term.
 */
function getExplanationForText(rawText = "") {
  const clean = String(rawText || "")
    .replace(/[^\w\s-]/g, "")
    .toLowerCase()
    .trim();

  if (!clean || clean.length < 2) return null;

  // Direct match
  if (TECH_EXPLANATIONS[clean]) {
    return TECH_EXPLANATIONS[clean];
  }

  // Partial / contains match in dictionary keys
  for (const [key, explanation] of Object.entries(TECH_EXPLANATIONS)) {
    if (clean.includes(key) || key.includes(clean)) {
      return explanation;
    }
  }

  // Smart Contextual Fallback for meaningful phrases
  const words = clean.split(/\s+/);
  if (words.length >= 3 && words.length <= 15) {
    return `"${rawText.trim()}" is an offering in Kraviona's digital engineering and technical solutions catalog.`;
  }

  return null;
}

export default function AssistantTextExplainer({ onActiveChange = () => {} }) {
  const [explanationData, setExplanationData] = useState(null);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0, isSelection: false });

  const hoverTimerRef = useRef(null);
  const typingTimerRef = useRef(null);
  const activeTokenRef = useRef(0);

  // Clear typing animation
  const clearTyping = useCallback(() => {
    if (typingTimerRef.current) {
      clearInterval(typingTimerRef.current);
      typingTimerRef.current = null;
    }
    setIsTyping(false);
  }, []);

  // Dismiss explanation panel
  const dismiss = useCallback(() => {
    clearTyping();
    setExplanationData(null);
    setDisplayedText("");
    onActiveChange(false);
  }, [clearTyping, onActiveChange]);

  // Start smooth typing animation for text
  const startTyping = useCallback(
    (fullText, title, isSelection, posX, posY) => {
      clearTyping();
      const token = ++activeTokenRef.current;

      setExplanationData({ title, fullText });
      setDisplayedText("");
      setIsTyping(true);
      onActiveChange(true);

      // Smart positioning: Keep within viewport boundaries
      if (typeof window !== "undefined") {
        const tooltipWidth = 280;
        const tooltipHeight = 130;
        let clampedX = posX + 16;
        let clampedY = posY + 20;

        // Flip to left if too close to right edge
        if (clampedX + tooltipWidth > window.innerWidth - 16) {
          clampedX = Math.max(16, posX - tooltipWidth - 12);
        }

        // Flip above if too close to bottom edge
        if (clampedY + tooltipHeight > window.innerHeight - 16) {
          clampedY = Math.max(16, posY - tooltipHeight - 16);
        }

        setCoords({ x: clampedX, y: clampedY, isSelection });
      }

      // Smooth typewriter reveal at ~15ms per character
      let charIndex = 0;
      typingTimerRef.current = setInterval(() => {
        if (token !== activeTokenRef.current) {
          clearInterval(typingTimerRef.current);
          return;
        }

        charIndex++;
        if (charIndex <= fullText.length) {
          setDisplayedText(fullText.slice(0, charIndex));
        } else {
          clearInterval(typingTimerRef.current);
          setIsTyping(false);
        }
      }, 14);
    },
    [clearTyping, onActiveChange]
  );

  // 1. Text Selection Listener
  useEffect(() => {
    const handleSelection = () => {
      if (typeof window === "undefined") return;

      const selection = window.getSelection();
      const selected = selection?.toString()?.trim();

      // Clear if selection is dismissed
      if (!selected || selected.length < 2 || selected.length > 300) {
        if (coords.isSelection && explanationData) {
          dismiss();
        }
        return;
      }

      try {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        if (!rect || (rect.width === 0 && rect.height === 0)) return;

        // Get explanation for selected content
        const explanation =
          getExplanationForText(selected) ||
          `"${selected}" represents a technical capability or concept featured on this page.`;

        startTyping(explanation, selected.slice(0, 32), true, rect.left + rect.width / 2, rect.bottom);
      } catch {}
    };

    document.addEventListener("mouseup", handleSelection);
    document.addEventListener("selectionchange", handleSelection);

    return () => {
      document.removeEventListener("mouseup", handleSelection);
      document.removeEventListener("selectionchange", handleSelection);
    };
  }, [coords.isSelection, explanationData, dismiss, startTyping]);

  // 2. Meaningful Text Hover Detection (Debounced 380ms)
  useEffect(() => {
    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target || !(target instanceof HTMLElement)) return;

      // Don't override an active text selection explanation
      if (coords.isSelection && explanationData) return;

      // Filter out non-meaningful, purely decorative or ordinary UI elements
      if (
        target.closest("button") ||
        target.closest("input") ||
        target.closest("textarea") ||
        target.closest("svg") ||
        target.closest("nav") ||
        target.closest("[aria-hidden='true']") ||
        target.closest(".sr-only")
      ) {
        if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
        return;
      }

      // Check for headings, strong tags, links, badges, or meaningful text
      const isMeaningfulTag = /^(H[1-6]|A|STRONG|EM|B|SPAN|P|LI|DT|DD)$/.test(target.tagName);
      const textContent = (target.innerText || "").trim();

      if (!isMeaningfulTag || textContent.length < 3 || textContent.length > 80) {
        return;
      }

      const explanation = getExplanationForText(textContent);
      if (!explanation) return;

      // Debounce hover to prevent triggers on fast mouse sweeping
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);

      const clientX = e.clientX;
      const clientY = e.clientY;

      hoverTimerRef.current = setTimeout(() => {
        startTyping(explanation, textContent.slice(0, 30), false, clientX, clientY);
      }, 380);
    };

    const handleMouseOut = (e) => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
        hoverTimerRef.current = null;
      }

      // Dismiss hover explanation when leaving (unless user selected text)
      if (!coords.isSelection && explanationData) {
        dismiss();
      }
    };

    document.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mouseout", handleMouseOut, { passive: true });

    return () => {
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    };
  }, [coords.isSelection, explanationData, dismiss, startTyping]);

  // 3. Escape Key & Click Outside Dismissal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && explanationData) {
        dismiss();
        if (window.getSelection) {
          window.getSelection().removeAllRanges();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [explanationData, dismiss]);

  if (!explanationData) return null;

  return (
    <div
      className="fixed z-50 pointer-events-auto select-none transition-all duration-200 animate-in fade-in zoom-in-95"
      style={{
        left: `${coords.x}px`,
        top: `${coords.y}px`,
        maxWidth: "300px",
      }}
      role="tooltip"
      aria-live="polite"
    >
      <div className="relative rounded-xl bg-white/95 backdrop-blur-md border border-teal-900/15 shadow-xl p-3 text-slate-800">
        {/* Header with Cyan Accent Dot */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-1.5 mb-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="h-2 w-2 rounded-full bg-[#00F2FE] shadow-[0_0_6px_#00F2FE] shrink-0 animate-pulse" />
            <h4 className="text-[11px] font-bold text-[#0f5960] truncate capitalize">
              {explanationData.title}
            </h4>
          </div>
          <button
            onClick={dismiss}
            className="p-0.5 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors shrink-0"
            aria-label="Dismiss explanation"
          >
            <X className="w-3 h-3" />
          </button>
        </div>

        {/* Typing Animated Body Text */}
        <div className="text-[11px] text-slate-700 leading-relaxed font-medium min-h-[38px]">
          {displayedText}
          {isTyping && (
            <span className="inline-block w-1 h-3 ml-0.5 bg-[#00F2FE] animate-pulse align-middle" />
          )}
        </div>

        {/* Subtle Footer Brand Badge */}
        <div className="mt-2 pt-1 border-t border-slate-100 flex items-center justify-between text-[9px] text-slate-400 font-semibold uppercase tracking-wider">
          <span>Kraviona AI Assistant</span>
          <span className="text-[#0f5960] font-bold">Text Guide</span>
        </div>
      </div>
    </div>
  );
}
