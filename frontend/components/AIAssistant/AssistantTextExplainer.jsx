"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Sparkles, X, BookOpen, Layers } from "lucide-react";

/**
 * Technical and Service Knowledge Dictionary
 * Instant, accurate, founder-grade explanations for Kraviona tech stack & terms.
 */
const TECH_EXPLANATIONS = {
  // Web Engineering & Frameworks
  "next.js": "High-performance React framework featuring Server Components, static generation, and instant routing built for 90+ PageSpeed scores.",
  "nextjs": "High-performance React framework featuring Server Components, static generation, and instant routing built for 90+ PageSpeed scores.",
  "react": "Modern component-based JavaScript UI library used for building interactive, reactive, and scalable front-end interfaces.",
  "react.js": "Modern component-based JavaScript UI library used for building interactive, reactive, and scalable front-end interfaces.",
  "mern stack": "Full-stack web architecture utilizing MongoDB, Express.js, React, and Node.js for robust, end-to-end web applications.",
  "node.js": "Event-driven asynchronous JavaScript runtime for high-throughput backends, APIs, and microservices.",
  "nodejs": "Event-driven asynchronous JavaScript runtime for high-throughput backends, APIs, and microservices.",
  "full-stack": "End-to-end engineering covering responsive frontend UI, server logic, databases, APIs, and cloud deployments.",
  "full stack": "End-to-end engineering covering responsive frontend UI, server logic, databases, APIs, and cloud deployments.",
  "full-stack development": "End-to-end engineering covering responsive frontend UI, server logic, databases, APIs, and cloud deployments.",
  "saas": "Software-as-a-Service applications engineered with subscription billing, multi-tenant databases, and authentication.",
  "saas development": "Custom cloud software engineering featuring multi-tenancy, RBAC, recurring billing, and scalable APIs.",
  "api": "Application Programming Interface allowing disparate systems, frontends, and third-party tools to exchange data securely.",
  "api development": "Architecting resilient, versioned RESTful and GraphQL endpoints with caching and rate limiting.",
  "rest api": "Standard HTTP architectural style for scalable, stateless web services and data endpoints.",
  "graphql": "Query language for APIs that lets clients request exactly the data they need in a single round-trip.",
  "database": "Optimized structured data storage layer using MongoDB or PostgreSQL with indexing for microsecond query speeds.",
  "database architecture": "Strategic schema modeling, index optimization, sharding, and connection pooling for zero data latency.",
  "mongodb": "Flexible, document-based NoSQL database ideal for scalable modern web apps and rapid schema iteration.",
  "postgresql": "Enterprise relational database system known for reliability, ACID compliance, and complex data relationships.",
  "typescript": "Strictly typed superset of JavaScript providing compile-time type safety, cleaner refactoring, and fewer runtime errors.",
  "ui/ux": "User Interface and Experience design focused on visual aesthetics, accessibility, intuitive navigation, and high conversion.",
  "ui/ux design": "Research-driven interface systems designed in Figma with comprehensive design tokens, micro-interactions, and usability testing.",
  "figma": "Collaborative cloud design tool used for crafting wireframes, interactive prototypes, and production design systems.",
  
  // Technical SEO & Performance
  "technical seo": "Optimization of website architecture, crawlability, Core Web Vitals, and structured data to dominate Google search rankings.",
  "core web vitals": "Google's essential user-experience metrics measuring LCP (loading speed), INP (responsiveness), and CLS (visual stability).",
  "lcp": "Largest Contentful Paint: Core Web Vital measuring how quickly the main content of a page becomes visible (target < 2.5s).",
  "cls": "Cumulative Layout Shift: Core Web Vital measuring unexpected visual shifts during loading (target < 0.1).",
  "inp": "Interaction to Next Paint: Core Web Vital assessing overall page responsiveness to user clicks and taps (target < 200ms).",
  "pagespeed": "Google's official performance score evaluating mobile/desktop speed, asset compression, and runtime efficiency.",
  "web performance": "Asset minification, Brotli compression, image optimization (AVIF/WebP), and edge caching to achieve sub-second page loads.",
  "web performance optimization": "Deep-tier latency reduction, script tree-shaking, font preloading, and CDN edge distribution.",
  "schema markup": "Structured JSON-LD metadata that helps search engines understand content and qualify for rich search results.",
  "structured data": "Code format providing search engines explicit clues about page content, articles, local business info, and FAQs.",
  "crawl budget": "The number of pages a search engine bot crawls on your site within a given timeframe; optimized via clean routing.",
  "canonical": "HTML link tag specifying the preferred master URL to prevent duplicate content indexing across search engines.",
  "sitemap": "XML index file informing search engines about all discoverable, authoritative URLs on the website.",
  "robots.txt": "Instruction file that directs search engine web crawlers which URLs they can or cannot request from the site.",
  
  // AI & Automation
  "ai automation": "Custom business workflows utilizing LLMs, intelligent agents, and automated pipelines to eliminate manual work.",
  "ai chatbot": "Conversational assistant powered by AI that answers questions, guides visitors, and captures qualified leads 24/7.",
  "ai chatbot development": "Engineering custom AI knowledge assistants using RAG (Retrieval-Augmented Generation) and vector embeddings.",
  "llm": "Large Language Model trained on massive datasets to understand natural language, summarize text, and generate responses.",
  "autonomous agent": "Software program that leverages AI to execute multi-step tasks, research data, and trigger workflows independently.",
  "n8n": "Workflow automation platform connecting APIs, webhooks, and AI nodes for custom business integrations.",
  
  // Kraviona Core Offerings
  "web development": "Custom digital engineering creating fast, conversion-optimized websites and web applications with Next.js.",
  "web app development": "Engineering mission-critical enterprise web apps with reactive state management and resilient backends.",
  "digital marketing": "Multi-channel strategy including technical SEO, content marketing, and search visibility to drive qualified inbound leads.",
  "social media marketing": "Targeted brand campaigns across digital platforms designed to boost engagement and customer acquisition.",
  "case studies": "Real-world portfolio breakdowns detailing client challenges, technical architectures, and measurable ROI results.",
};

/**
 * Proper Canonical Display Casing for Headings
 */
const CANONICAL_TITLES = {
  "next.js": "Next.js",
  "nextjs": "Next.js",
  "react": "React",
  "react.js": "React.js",
  "mern stack": "MERN Stack",
  "node.js": "Node.js",
  "nodejs": "Node.js",
  "full-stack": "Full-Stack Development",
  "full stack": "Full-Stack Development",
  "full-stack development": "Full-Stack Development",
  "saas": "SaaS Engineering",
  "saas development": "SaaS Development",
  "api": "API Architecture",
  "api development": "API Development",
  "rest api": "RESTful API",
  "graphql": "GraphQL API",
  "database": "High-Performance Database",
  "database architecture": "Database Architecture",
  "mongodb": "MongoDB",
  "postgresql": "PostgreSQL",
  "typescript": "TypeScript",
  "ui/ux": "UI/UX Design",
  "ui/ux design": "UI/UX Design",
  "figma": "Figma Design",
  "technical seo": "Technical SEO",
  "core web vitals": "Core Web Vitals",
  "lcp": "LCP (Largest Contentful Paint)",
  "cls": "CLS (Cumulative Layout Shift)",
  "inp": "INP (Interaction to Next Paint)",
  "pagespeed": "Google PageSpeed",
  "web performance": "Web Performance",
  "web performance optimization": "Web Performance Optimization",
  "schema markup": "Schema Markup (JSON-LD)",
  "structured data": "Structured Data",
  "crawl budget": "Crawl Budget",
  "canonical": "Canonical URL Tag",
  "sitemap": "XML Sitemap",
  "robots.txt": "Robots.txt Directives",
  "ai automation": "AI Automation",
  "ai chatbot": "AI Chatbot",
  "ai chatbot development": "AI Chatbot Development",
  "llm": "LLM (Large Language Model)",
  "autonomous agent": "Autonomous Agent",
  "n8n": "n8n Automation",
  "web development": "Web Development",
  "web app development": "Web App Development",
  "digital marketing": "Digital Marketing",
  "social media marketing": "Social Media Marketing",
  "case studies": "Case Studies & Portfolio",
};

/**
 * Finds the best explanation and canonical title for a given phrase.
 */
function getExplanationForText(rawText = "") {
  const clean = String(rawText || "")
    .replace(/[^\w\s-]/g, "")
    .toLowerCase()
    .trim();

  if (!clean || clean.length < 2) return null;

  // 1. Direct dictionary match
  if (TECH_EXPLANATIONS[clean]) {
    return {
      explanation: TECH_EXPLANATIONS[clean],
      title: CANONICAL_TITLES[clean] || rawText.trim(),
    };
  }

  // 2. Partial / substring match in dictionary keys
  for (const [key, explanation] of Object.entries(TECH_EXPLANATIONS)) {
    if (clean === key || clean.includes(key) || (key.length > 4 && key.includes(clean))) {
      return {
        explanation,
        title: CANONICAL_TITLES[key] || rawText.trim(),
      };
    }
  }

  // 3. Smart contextual fallback for meaningful technical phrases (3-12 words)
  const words = clean.split(/\s+/);
  if (words.length >= 2 && words.length <= 12) {
    const formattedTitle = rawText
      .trim()
      .split(/\s+/)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    return {
      explanation: `"${rawText.trim()}" is an offering in Kraviona's digital engineering and technical solutions catalog.`,
      title: formattedTitle.slice(0, 36),
    };
  }

  return null;
}

/**
 * Precise, collision-free positioning engine.
 * Ensures:
 * 1. The robot follower (sitting at cursor +26px X, +22px Y) NEVER overlaps the popup.
 * 2. The hovered or selected text is NEVER covered.
 * 3. The bottom-right AI launcher widget is NEVER obscured.
 * 4. The popup stays 100% inside the viewport on all screen sizes with safe 16px margins.
 */
function calculateSmartPosition({
  targetRect = null,
  cursorX = 0,
  cursorY = 0,
  tooltipWidth = 320,
  tooltipHeight = 150,
}) {
  if (typeof window === "undefined") {
    return { x: 16, y: 16, width: tooltipWidth };
  }

  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const PADDING = 16;
  const actualWidth = Math.min(tooltipWidth, vw - PADDING * 2);

  // Bottom-right reserved zone for AI Assistant launcher + WhatsApp
  const launcherReservedLeft = vw - 220;
  const launcherReservedTop = vh - 150;

  // Resolve target boundaries
  const target = targetRect
    ? {
        left: targetRect.left,
        right: targetRect.right,
        top: targetRect.top,
        bottom: targetRect.bottom,
      }
    : {
        left: cursorX - 12,
        right: cursorX + 12,
        top: cursorY - 12,
        bottom: cursorY + 12,
      };

  let x = PADDING;
  let y = PADDING;

  // =========================================================================
  // Strategy 1: Position ABOVE the target and cursor (Preferred & cleanest)
  // - Leaves the target text completely visible below.
  // - The robot sits at cursor + 22px to + 105px Y, so placing above ensures
  //   at least 30-60px vertical separation between popup bottom and robot top.
  // =========================================================================
  const spaceAbove = target.top - PADDING;
  if (spaceAbove >= tooltipHeight + 14) {
    y = target.top - tooltipHeight - 12;

    // Horizontally center above the target or cursor, clamped to viewport margins
    const idealX = cursorX
      ? cursorX - actualWidth / 2
      : target.left + (target.right - target.left) / 2 - actualWidth / 2;

    x = Math.max(PADDING, Math.min(idealX, vw - actualWidth - PADDING));
    return { x, y, width: actualWidth };
  }

  // =========================================================================
  // Strategy 2: Target is near top of screen; place to the LEFT of cursor/robot
  // - Robot sits to the RIGHT of cursor (cursorX + 26 to cursorX + 105).
  // - Popup is placed to the LEFT of cursor (cursorX - actualWidth - 32).
  // - Clear 58px horizontal buffer ensures zero collision with robot.
  // =========================================================================
  if (cursorX && cursorX - actualWidth - 32 >= PADDING) {
    x = cursorX - actualWidth - 32;
    y = Math.max(PADDING, Math.min(cursorY - 24, vh - tooltipHeight - PADDING));
    return { x, y, width: actualWidth };
  }

  // =========================================================================
  // Strategy 3: Target is near top-left; place to the RIGHT of the robot
  // - Robot right edge is ~cursorX + 105.
  // - Popup starts at cursorX + 125, giving a 20px clear buffer.
  // =========================================================================
  if (cursorX && cursorX + 125 + actualWidth <= vw - PADDING) {
    x = cursorX + 125;
    y = Math.max(PADDING, Math.min(cursorY - 24, vh - tooltipHeight - PADDING));
    return { x, y, width: actualWidth };
  }

  // =========================================================================
  // Strategy 4: Place BELOW the robot & target
  // - Robot bottom is ~cursorY + 105.
  // - Popup starts below robot at cursorY + 115 + 14px = cursorY + 129px.
  // =========================================================================
  const robotBottom = cursorY ? cursorY + 105 : target.bottom;
  const spaceBelow = vh - Math.max(target.bottom, robotBottom) - PADDING;

  if (spaceBelow >= tooltipHeight + 14) {
    y = Math.max(target.bottom, robotBottom) + 14;
    const idealX = cursorX ? cursorX - actualWidth / 2 : target.left;
    x = Math.max(PADDING, Math.min(idealX, vw - actualWidth - PADDING));

    // Avoid colliding with bottom-right floating launcher
    if (x + actualWidth > launcherReservedLeft && y + tooltipHeight > launcherReservedTop) {
      x = Math.max(PADDING, launcherReservedLeft - actualWidth - 16);
    }

    return { x, y, width: actualWidth };
  }

  // =========================================================================
  // Strategy 5: Safe Edge Fallback (Mobile / narrow viewports)
  // - Clamp within safe viewport box. Avoid bottom-right launcher.
  // =========================================================================
  x = Math.max(PADDING, Math.min(target.left, vw - actualWidth - PADDING));
  y = Math.max(PADDING, Math.min(target.bottom + 14, vh - tooltipHeight - PADDING));

  if (x + actualWidth > launcherReservedLeft && y + tooltipHeight > launcherReservedTop) {
    x = Math.max(PADDING, launcherReservedLeft - actualWidth - 16);
  }

  return { x, y, width: actualWidth };
}

export default function AssistantTextExplainer({
  disabled = false,
  onActiveChange = () => {},
  onBoundsChange = () => {},
}) {
  const [explanationData, setExplanationData] = useState(null);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0, width: 340, isSelection: false });

  const hoverTimerRef = useRef(null);
  const typingTimerRef = useRef(null);
  const dismissGraceTimerRef = useRef(null);
  const activeTokenRef = useRef(0);

  const activeTargetRef = useRef(null);
  const isHoveringTooltipRef = useRef(false);
  const popupRef = useRef(null);

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
    if (dismissGraceTimerRef.current) {
      clearTimeout(dismissGraceTimerRef.current);
      dismissGraceTimerRef.current = null;
    }
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    clearTyping();
    activeTargetRef.current = null;
    isHoveringTooltipRef.current = false;
    setExplanationData(null);
    setDisplayedText("");
    onActiveChange(false);
    onBoundsChange(null);
  }, [clearTyping, onActiveChange, onBoundsChange]);

  // Synchronize precise physical bounds with robot collision avoidance engine
  useEffect(() => {
    if (!explanationData) {
      onBoundsChange(null);
      return;
    }

    if (popupRef.current) {
      const rect = popupRef.current.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        onBoundsChange({
          left: rect.left,
          top: rect.top,
          right: rect.right,
          bottom: rect.bottom,
          width: rect.width,
          height: rect.height,
        });
        return;
      }
    }

    if (coords.x > 0) {
      onBoundsChange({
        left: coords.x,
        top: coords.y,
        right: coords.x + coords.width,
        bottom: coords.y + 175,
        width: coords.width,
        height: 175,
      });
    }
  }, [explanationData, coords, displayedText, onBoundsChange]);

  // Automatically dismiss if disabled changes to true
  useEffect(() => {
    if (disabled && explanationData) {
      dismiss();
    }
  }, [disabled, explanationData, dismiss]);

  // Start smooth typing animation and position popup
  const startTyping = useCallback(
    (fullText, title, isSelection, targetRect, posX, posY) => {
      clearTyping();
      if (dismissGraceTimerRef.current) {
        clearTimeout(dismissGraceTimerRef.current);
        dismissGraceTimerRef.current = null;
      }

      const token = ++activeTokenRef.current;

      setExplanationData({ title, fullText, isSelection });
      setDisplayedText("");
      setIsTyping(true);
      onActiveChange(true);

      // Calculate precision collision-free position
      const pos = calculateSmartPosition({
        targetRect,
        cursorX: posX,
        cursorY: posY,
        tooltipWidth: 320,
        tooltipHeight: 155,
      });

      setCoords({ x: pos.x, y: pos.y, width: pos.width, isSelection });

      // Smooth typewriter reveal (~14ms per 2 chars for natural, swift delivery)
      let charIndex = 0;
      typingTimerRef.current = setInterval(() => {
        if (token !== activeTokenRef.current) {
          clearInterval(typingTimerRef.current);
          return;
        }

        charIndex += 2;
        if (charIndex <= fullText.length) {
          setDisplayedText(fullText.slice(0, charIndex));
        } else {
          setDisplayedText(fullText);
          clearInterval(typingTimerRef.current);
          setIsTyping(false);
        }
      }, 14);
    },
    [clearTyping, onActiveChange]
  );

  // 1. Text Selection Listener (Selection explanations remain until unselected or Esc)
  useEffect(() => {
    const handleSelection = () => {
      if (typeof window === "undefined" || disabled) return;

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
        const match = getExplanationForText(selected);
        const explanation =
          match?.explanation ||
          `"${selected}" represents a technical capability or concept featured on Kraviona.com.`;
        const title = match?.title || selected.slice(0, 32);

        startTyping(
          explanation,
          title,
          true,
          rect,
          rect.left + rect.width / 2,
          rect.top
        );
      } catch {}
    };

    document.addEventListener("mouseup", handleSelection);
    document.addEventListener("selectionchange", handleSelection);

    return () => {
      document.removeEventListener("mouseup", handleSelection);
      document.removeEventListener("selectionchange", handleSelection);
    };
  }, [coords.isSelection, explanationData, disabled, dismiss, startTyping]);

  // 2. Meaningful Text Hover Detection (Debounced 360ms with grace exit)
  useEffect(() => {
    const handleMouseOver = (e) => {
      if (disabled) return;
      const target = e.target;
      if (!target || !(target instanceof HTMLElement)) return;

      // Don't interrupt an active user text selection
      if (coords.isSelection && explanationData) return;

      // If mouse is inside the popup itself, cancel any pending dismiss
      if (popupRef.current && popupRef.current.contains(target)) {
        if (dismissGraceTimerRef.current) {
          clearTimeout(dismissGraceTimerRef.current);
          dismissGraceTimerRef.current = null;
        }
        isHoveringTooltipRef.current = true;
        return;
      }

      // Filter out non-meaningful, purely decorative, interactive inputs or widgets
      if (
        target.closest("button") ||
        target.closest("input") ||
        target.closest("textarea") ||
        target.closest("svg") ||
        target.closest("nav") ||
        target.closest("[aria-hidden='true']") ||
        target.closest(".sr-only") ||
        target.closest("[role='dialog']") ||
        target.closest("[role='button']")
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

      const match = getExplanationForText(textContent);
      if (!match) return;

      // Debounce hover to prevent triggers on fast mouse sweeping
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
      if (dismissGraceTimerRef.current) {
        clearTimeout(dismissGraceTimerRef.current);
        dismissGraceTimerRef.current = null;
      }

      const clientX = e.clientX;
      const clientY = e.clientY;
      const rect = target.getBoundingClientRect();
      activeTargetRef.current = target;

      hoverTimerRef.current = setTimeout(() => {
        startTyping(match.explanation, match.title, false, rect, clientX, clientY);
      }, 360);
    };

    const handleMouseOut = (e) => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
        hoverTimerRef.current = null;
      }

      // If text selection is active, do not dismiss on mouseout
      if (coords.isSelection) return;

      // Check if mouse moved into popup or is still on target
      const related = e.relatedTarget;
      if (
        related &&
        (popupRef.current?.contains(related) ||
          activeTargetRef.current?.contains(related))
      ) {
        return;
      }

      // Grace period (260ms) before dismissing hover explanation so user can move mouse into tooltip
      if (explanationData) {
        if (dismissGraceTimerRef.current) clearTimeout(dismissGraceTimerRef.current);
        dismissGraceTimerRef.current = setTimeout(() => {
          if (!isHoveringTooltipRef.current) {
            dismiss();
          }
        }, 260);
      }
    };

    document.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mouseout", handleMouseOut, { passive: true });

    return () => {
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
      if (dismissGraceTimerRef.current) clearTimeout(dismissGraceTimerRef.current);
    };
  }, [coords.isSelection, explanationData, disabled, dismiss, startTyping]);

  // 3. Escape Key & Page Scroll Dismissal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && explanationData) {
        dismiss();
        if (window.getSelection) {
          window.getSelection().removeAllRanges();
        }
      }
    };

    // Smoothly dismiss hover explanation on scroll to avoid covering new content
    const handleScroll = () => {
      if (!coords.isSelection && explanationData) {
        dismiss();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [explanationData, coords.isSelection, dismiss]);

  // Mouse entering and leaving the tooltip container itself
  const handleTooltipMouseEnter = () => {
    isHoveringTooltipRef.current = true;
    if (dismissGraceTimerRef.current) {
      clearTimeout(dismissGraceTimerRef.current);
      dismissGraceTimerRef.current = null;
    }
  };

  const handleTooltipMouseLeave = () => {
    isHoveringTooltipRef.current = false;
    if (!coords.isSelection && explanationData) {
      dismissGraceTimerRef.current = setTimeout(() => {
        dismiss();
      }, 260);
    }
  };

  if (!explanationData) return null;

  return (
    <div
      ref={popupRef}
      className="fixed z-[60] pointer-events-auto select-none transition-all duration-200 animate-in fade-in zoom-in-95"
      style={{
        left: `${coords.x}px`,
        top: `${coords.y}px`,
        width: `${coords.width}px`,
        maxWidth: "calc(100vw - 32px)",
      }}
      role="tooltip"
      aria-live="polite"
      onMouseEnter={handleTooltipMouseEnter}
      onMouseLeave={handleTooltipMouseLeave}
    >
      <div className="relative w-full rounded-2xl bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border border-teal-500/25 shadow-[0_16px_40px_rgba(15,89,96,0.22),0_2px_10px_rgba(0,0,0,0.08)] overflow-hidden">
        {/* Header Row: Guaranteed left padding, unblocked heading title, and top-right close button */}
        <div className="relative flex items-center justify-between gap-3 px-4 pt-3.5 pb-2.5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/50">
          <div className="flex items-center gap-2.5 min-w-0 pr-8">
            {/* Glowing Cyan Status Dot */}
            <span className="relative flex h-2.5 w-2.5 shrink-0 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F2FE] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00F2FE] shadow-[0_0_8px_#00F2FE]" />
            </span>

            {/* Canonical Title: Starts after left padding and remains completely visible */}
            <h4 className="text-[13px] font-bold text-[#0f5960] dark:text-teal-300 tracking-tight leading-snug whitespace-normal break-words">
              {explanationData.title}
            </h4>

            {/* Context Badge */}
            <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold bg-teal-50 dark:bg-teal-950/60 text-[#0f5960] dark:text-teal-300 border border-teal-200/50 dark:border-teal-800/50 shrink-0">
              {explanationData.isSelection ? "Selection" : "Definition"}
            </span>
          </div>

          {/* Accessible Close Button strictly anchored at the top-right with clear hit area */}
          <button
            type="button"
            onClick={dismiss}
            className="absolute top-2.5 right-3 flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-[#00F2FE]"
            aria-label="Close explanation popup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Text with Smooth Typewriter Effect */}
        <div className="px-4 py-3 text-xs sm:text-[12.5px] text-slate-700 dark:text-slate-300 leading-relaxed font-normal min-h-[46px]">
          {displayedText}
          {isTyping && (
            <span
              className="inline-block w-1.5 h-3.5 ml-1 bg-[#00F2FE] shadow-[0_0_8px_#00F2FE] rounded-sm animate-pulse align-middle"
              aria-hidden="true"
            />
          )}
        </div>

        {/* Footer Meta Row */}
        <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/30 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 font-medium">
          <div className="flex items-center gap-1.5 text-teal-800 dark:text-teal-400 font-semibold">
            <Sparkles className="w-3 h-3 text-[#00F2FE]" />
            <span>Kraviona AI Assistant</span>
          </div>
          <span className="text-slate-400 text-[9px]">Press Esc to dismiss</span>
        </div>
      </div>
    </div>
  );
}
