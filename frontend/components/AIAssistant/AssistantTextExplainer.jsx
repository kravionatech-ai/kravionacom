"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Sparkles, X } from "lucide-react";

/**
 * Technical and Service Knowledge Dictionary
 * Comprehensive, verified, accurate explanations for Kraviona tech stack, services & architectural terms.
 */
const TECH_EXPLANATIONS = {
  // Web Engineering & Modern Frameworks
  "next.js": "High-performance React framework featuring Server Components, App Router, static generation, and edge routing engineered for sub-second page loads and 90+ PageSpeed.",
  "nextjs": "High-performance React framework featuring Server Components, App Router, static generation, and edge routing engineered for sub-second page loads and 90+ PageSpeed.",
  "next.js 15": "The latest Next.js release featuring React 19 support, Turbopack for lightning builds, async request APIs, and optimized server-side caching.",
  "nextjs development": "Engineering AI-native, high-velocity web applications using Next.js App Router, Server Actions, and sub-second Core Web Vitals.",
  "react": "Modern declarative JavaScript UI library developed by Meta, widely used for reactive component hierarchies and fast single-page/multi-page web applications.",
  "react.js": "Modern declarative JavaScript UI library developed by Meta, widely used for reactive component hierarchies and fast single-page/multi-page web applications.",
  "react 19": "The cutting-edge React iteration featuring Server Actions, useActionState, native document metadata, and asset preloading.",
  "react development": "Building dynamic, accessible, and reactive frontend architectures using modular React components and modern state management.",
  "mern stack": "Full-stack JavaScript development architecture combining MongoDB, Express.js, React, and Node.js for rapid end-to-end web applications.",
  "mern stack development": "Full-lifecycle enterprise software engineering combining MongoDB, Express.js, React, and Node.js with secure authentication and REST APIs.",
  "node.js": "V8-powered asynchronous, event-driven JavaScript runtime designed for high-concurrency backend services, APIs, and microservices.",
  "nodejs": "V8-powered asynchronous, event-driven JavaScript runtime designed for high-concurrency backend services, APIs, and microservices.",
  "nodejs development": "Event-driven asynchronous backend engineering for real-time applications, microservices, and high-throughput data APIs.",
  "express": "Minimalist and flexible Node.js web application framework providing robust routing and middleware capabilities for RESTful APIs.",
  "express.js": "Minimalist and flexible Node.js web application framework providing robust routing and middleware capabilities for RESTful APIs.",
  "python": "High-level, versatile programming language favored for autonomous AI agents, machine learning workflows, data engineering, and FastAPI/Django backends.",
  "fastapi": "Modern, high-performance Python web framework for building APIs with standard Python type hints and automated OpenAPI documentation.",
  "django": "Batteries-included Python web framework designed for rapid development, secure authentication, and enterprise-grade data management.",
  "typescript": "Strict syntactical superset of JavaScript adding compile-time static types, scalable refactoring, and enterprise code reliability.",
  "javascript": "Core scripting language of the web powering dynamic interactivity, asynchronous events, and full-stack runtime execution.",
  "tailwind css": "Utility-first CSS framework enabling rapid, responsive, and consistent user interface styling directly inside markup without bloated stylesheets.",
  "tailwind": "Utility-first CSS framework enabling rapid, responsive, and consistent user interface styling directly inside markup without bloated stylesheets.",
  "full-stack": "End-to-end software development encompassing user interface frontend, server business logic, database architectures, APIs, and cloud deployments.",
  "full stack": "End-to-end software development encompassing user interface frontend, server business logic, database architectures, APIs, and cloud deployments.",
  "full-stack development": "End-to-end software development encompassing user interface frontend, server business logic, database architectures, APIs, and cloud deployments.",
  "api": "Application Programming Interface allowing disparate software systems, mobile apps, and third-party platforms to exchange data securely.",
  "api development": "Architecting resilient, versioned RESTful and GraphQL endpoints with caching, rate limiting, and automated schema contracts.",
  "rest api": "Standard HTTP architectural pattern for stateless, resource-oriented web services, utilizing standard verbs like GET, POST, PUT, and DELETE.",
  "graphql": "Query language for APIs that lets client applications request precisely the fields they need in a single round-trip.",
  "microservices": "Architectural approach where an application is structured as a collection of independently deployable, loosely coupled modular services.",
  "backend development": "Engineering secure, scalable server microservices, relational/document database schemas, and robust business logic.",
  "web development": "Custom digital engineering creating fast, conversion-optimized websites and web applications with Next.js and React.",
  "web app development": "Engineering mission-critical enterprise web apps with reactive state management, RBAC security, and resilient backends.",

  // Databases & Cloud Architecture
  "database": "Optimized structured data storage and querying layer utilizing MongoDB or PostgreSQL with automated indexing for microsecond query speeds.",
  "database architecture": "Strategic schema modeling, index optimization, sharding, replication, and connection pooling for zero data latency.",
  "mongodb": "Document-oriented NoSQL database storing JSON-like BSON documents, ideal for agile schemas, rapid iteration, and horizontal scaling.",
  "postgresql": "Enterprise open-source relational database system renowned for rock-solid ACID compliance, complex queries, and JSONB document support.",
  "redis": "In-memory data structure store used as a distributed cache, message broker, and session store for sub-millisecond data retrieval.",
  "pinecone": "Managed vector database engineered for machine learning embeddings, semantic similarity search, and high-performance RAG systems.",
  "vector database": "Specialized database designed to store, index, and query high-dimensional vector embeddings generated by LLMs for semantic search.",
  "aws": "Amazon Web Services: Comprehensive cloud computing platform providing scalable hosting, serverless computing (Lambda), S3 storage, and RDS databases.",
  "docker": "Containerization platform that packages software code alongside all its dependencies for identical execution across staging and production.",
  "ci/cd": "Continuous Integration & Continuous Deployment pipelines that automate testing, building, and zero-downtime production releases.",
  "cloudflare": "Global edge network delivering CDN caching, DDoS mitigation, DNS resolution, and edge worker compute to protect and accelerate web traffic.",

  // AI, Automation & Machine Learning
  "ai": "Artificial Intelligence: Computational systems designed to perform tasks requiring human-like intelligence, reasoning, and pattern recognition.",
  "artificial intelligence": "Computational systems designed to perform tasks requiring human-like intelligence, reasoning, and pattern recognition.",
  "ai automation": "Custom business workflows utilizing LLMs, intelligent agents, and automated pipelines to eliminate manual repetitive work.",
  "autonomous agent": "Software program that leverages AI to execute multi-step tasks, research data, make decisions, and trigger external APIs independently.",
  "autonomous agents": "Software programs that leverage AI to execute multi-step tasks, research data, make decisions, and trigger external APIs independently.",
  "autonomous ai agents": "Software programs that leverage AI to execute multi-step tasks, research data, make decisions, and trigger external APIs independently.",
  "ai agents": "Software programs that leverage AI to execute multi-step tasks, research data, make decisions, and trigger external APIs independently.",
  "ai chatbot": "Conversational assistant powered by AI that answers questions, guides visitors, and captures qualified leads 24/7.",
  "ai chatbot development": "Engineering custom AI knowledge assistants using RAG (Retrieval-Augmented Generation), guardrails, and company documentation.",
  "rag": "Retrieval-Augmented Generation: AI architecture combining information retrieval from private documents with LLM reasoning for zero hallucinations.",
  "retrieval augmented generation": "AI architecture combining information retrieval from private documents with LLM reasoning for zero hallucinations.",
  "llm": "Large Language Model: Deep learning model trained on massive text corpora to understand natural language, summarize text, and generate responses.",
  "large language model": "Deep learning model trained on massive text corpora to understand natural language, summarize text, and generate responses.",
  "langchain": "Open-source framework designed to simplify the creation of applications using large language models, agent chains, and vector memory.",
  "n8n": "Workflow automation platform connecting APIs, webhooks, databases, and AI nodes for custom business process integrations.",
  "intelligent document processing": "AI-driven automated extraction, OCR parsing, classification, and validation of data from invoices, receipts, and PDFs.",
  "idp": "Intelligent Document Processing: Automated extraction, OCR parsing, classification, and validation of data from invoices, receipts, and PDFs.",
  "ocr": "Optical Character Recognition: Technology converting scanned document images and PDFs into searchable, editable machine text.",

  // Technical SEO, Performance & Modern Search
  "technical seo": "Optimization of website architecture, crawlability, Core Web Vitals, and structured data to dominate Google search rankings.",
  "core web vitals": "Google's essential user-experience metrics measuring LCP (loading speed), INP (responsiveness), and CLS (visual stability).",
  "lcp": "Largest Contentful Paint: Core Web Vital measuring how quickly the main content of a page becomes visible (target < 2.5s, Kraviona targets < 1.8s).",
  "cls": "Cumulative Layout Shift: Core Web Vital measuring unexpected visual shifts during loading (target < 0.1).",
  "inp": "Interaction to Next Paint: Core Web Vital assessing overall page responsiveness to user clicks and taps (target < 200ms).",
  "pagespeed": "Google's official performance score evaluating mobile/desktop speed, asset compression, and runtime efficiency.",
  "web performance": "Asset minification, Brotli compression, image optimization (AVIF/WebP), and edge caching to achieve sub-second page loads.",
  "web performance optimization": "Deep-tier latency reduction, script tree-shaking, font preloading, and CDN edge distribution.",
  "aeo": "Answer Engine Optimization: Structuring content and schemas so AI answer engines like Perplexity, ChatGPT Search, and Gemini quote your brand directly.",
  "answer engine optimization": "Structuring content and schemas so AI answer engines like Perplexity, ChatGPT Search, and Gemini quote your brand directly.",
  "geo": "Generative Engine Optimization: Formatting web pages and knowledge graphs for citations in AI Overviews and multimodal search engines.",
  "generative engine optimization": "Formatting web pages and knowledge graphs for citations in AI Overviews and multimodal search engines.",
  "schema markup": "Structured JSON-LD metadata that helps search engines understand content and qualify for rich search results and knowledge panels.",
  "structured data": "Standardized format (Schema.org) providing search engines explicit clues about page content, articles, local business info, and FAQs.",
  "crawl budget": "The number of pages a search engine bot crawls on your site within a given timeframe; optimized via clean routing and sitemaps.",
  "canonical": "HTML link tag specifying the preferred master URL to prevent duplicate content indexing across search engines.",
  "sitemap": "XML index file informing search engines about all discoverable, authoritative URLs on the website.",
  "robots.txt": "Directive text file informing search engine web crawlers which URLs they can or cannot request from the site.",

  // SaaS & Enterprise Software
  "saas": "Software-as-a-Service: Cloud application delivery model featuring subscription billing, multi-tenant databases, and authentication.",
  "saas development": "Custom cloud software engineering featuring multi-tenancy, RBAC security, recurring billing, and scalable APIs.",
  "multi-tenant": "Software architecture where a single instance of an application serves multiple client organizations while isolating data securely.",
  "rbac": "Role-Based Access Control: Security method restricting system access to authorized users based on predefined administrative roles.",
  "mvp": "Minimum Viable Product: Core functional software release engineered rapidly (4-8 weeks) to validate market demand with real users.",
  "ai mvp": "Accelerated 4–8 week software build integrating foundational AI models to test market traction with real users.",

  // E-Commerce & Marketplace Operations
  "ecommerce": "Electronic commerce: Online platforms and storefronts engineered for digital product discovery, transactions, and fulfillment.",
  "e-commerce": "Electronic commerce: Online platforms and storefronts engineered for digital product discovery, transactions, and fulfillment.",
  "shopify": "Leading e-commerce platform powering online stores; Kraviona builds both custom Shopify themes and headless Next.js storefronts.",
  "headless commerce": "Decoupled e-commerce architecture separating the Next.js frontend presentation layer from the backend commerce engine.",
  "amazon seller central": "Operations portal for Amazon sellers; Kraviona manages listings, flat files, A+ content, cataloging, and fee reconciliation.",
  "flipkart seller hub": "Seller management interface for Flipkart; Kraviona handles catalog onboarding, tier management, and settlement reconciliation.",
  "cataloging": "Structured e-commerce product data onboarding, category mapping, attribute enrichment, and flat-file creation for online marketplaces.",
  "financial reconciliation": "Automated auditing of marketplace fees, return leakages, weight discrepancies, and payment settlement reconciliations.",

  // Mobile App Development
  "flutter": "Google's open-source UI software development kit for crafting natively compiled multi-platform applications from a single codebase.",
  "react native": "Popular Meta open-source framework for building native iOS and Android mobile apps using React and JavaScript.",
  "mobile app": "Cross-platform mobile application engineered for iOS and Android with native performance, offline caching, and push alerts.",
  "mobile app development": "Building native-speed mobile applications for iOS and Android using React Native and Flutter with real-time sync.",
  "pwa": "Progressive Web Application: Web app using service workers and web manifests to deliver installable app-like experiences on mobile.",

  // UI/UX & Design
  "ui/ux": "User Interface and Experience design focused on visual aesthetics, accessibility, intuitive navigation, and high conversion.",
  "ui/ux design": "Research-driven interface systems designed in Figma with comprehensive design tokens, micro-interactions, and usability testing.",
  "figma": "Collaborative cloud design platform used for crafting wireframes, interactive prototypes, and production design systems.",
  "design system": "Comprehensive library of reusable UI components, typography scales, color tokens, and design standards.",
  "brand identity": "Cohesive brand visual design covering logos, color palettes, typography guidelines, and corporate design tokens.",

  // Digital Marketing & Growth
  "digital marketing": "Comprehensive online growth strategy covering Technical SEO, Generative Engine Optimization, and conversion rate optimization.",
  "social media marketing": "Targeted brand campaigns across digital platforms designed to boost engagement, audience reach, and lead acquisition.",
  "email marketing": "Automated lifecycle messaging, nurture sequences, and retention campaigns driven by customer behavior.",

  // Kraviona & Leadership
  "kraviona": "AI-First Technology & Digital Solutions Company based in East Delhi, India ('Intelligence Meets Innovation').",
  "amar kumar": "Founder & Lead Systems Engineer at Kraviona, specializing in AI-first architectures, full-stack Next.js systems, and GEO/AEO.",
  "east delhi": "Headquarters location of Kraviona (Delhi NCR 110092, India), serving domestic and international clients via modern agile workflows.",
  "discovery call": "Free 30-minute technical consultation with Kraviona's engineering leads to evaluate requirements, scope, and timeline.",
  "case studies": "Real-world portfolio breakdowns detailing client challenges, technical architectures, and measurable ROI results.",
};

/**
 * Proper Canonical Display Casing for Headings
 */
const CANONICAL_TITLES = {
  "next.js": "Next.js",
  "nextjs": "Next.js",
  "next.js 15": "Next.js 15",
  "nextjs development": "Next.js Development",
  "react": "React",
  "react.js": "React.js",
  "react 19": "React 19",
  "react development": "React.js Development",
  "mern stack": "MERN Stack",
  "mern stack development": "MERN Stack Development",
  "node.js": "Node.js",
  "nodejs": "Node.js",
  "nodejs development": "Node.js Development",
  "express": "Express.js",
  "express.js": "Express.js",
  "python": "Python",
  "fastapi": "FastAPI",
  "django": "Django",
  "typescript": "TypeScript",
  "javascript": "JavaScript",
  "tailwind css": "Tailwind CSS",
  "tailwind": "Tailwind CSS",
  "full-stack": "Full-Stack Development",
  "full stack": "Full-Stack Development",
  "full-stack development": "Full-Stack Development",
  "backend development": "Backend Development",
  "api": "API Architecture",
  "api development": "API Development",
  "rest api": "RESTful API",
  "graphql": "GraphQL API",
  "microservices": "Microservices",
  "database": "High-Performance Database",
  "database architecture": "Database Architecture",
  "mongodb": "MongoDB",
  "postgresql": "PostgreSQL",
  "redis": "Redis Cache",
  "pinecone": "Pinecone Vector DB",
  "vector database": "Vector Database",
  "aws": "Amazon Web Services (AWS)",
  "docker": "Docker Containerization",
  "ci/cd": "CI/CD Pipeline",
  "cloudflare": "Cloudflare Edge",
  "ai": "Artificial Intelligence",
  "artificial intelligence": "Artificial Intelligence",
  "ai automation": "AI Automation & Workflows",
  "autonomous agent": "Autonomous AI Agent",
  "autonomous agents": "Autonomous AI Agents",
  "autonomous ai agents": "Autonomous AI Agents",
  "ai agents": "Autonomous AI Agents",
  "ai chatbot": "AI Chatbot",
  "ai chatbot development": "AI Chatbot Development",
  "rag": "RAG (Retrieval-Augmented Generation)",
  "retrieval augmented generation": "Retrieval-Augmented Generation",
  "llm": "LLM (Large Language Model)",
  "large language model": "Large Language Model",
  "langchain": "LangChain",
  "n8n": "n8n Workflow Automation",
  "intelligent document processing": "Intelligent Document Processing (IDP)",
  "idp": "Intelligent Document Processing",
  "ocr": "OCR (Optical Character Recognition)",
  "technical seo": "Technical SEO",
  "core web vitals": "Core Web Vitals",
  "lcp": "LCP (Largest Contentful Paint)",
  "cls": "CLS (Cumulative Layout Shift)",
  "inp": "INP (Interaction to Next Paint)",
  "pagespeed": "Google PageSpeed",
  "web performance": "Web Performance",
  "web performance optimization": "Web Performance Optimization",
  "aeo": "Answer Engine Optimization (AEO)",
  "answer engine optimization": "Answer Engine Optimization (AEO)",
  "geo": "Generative Engine Optimization (GEO)",
  "generative engine optimization": "Generative Engine Optimization (GEO)",
  "schema markup": "Schema Markup (JSON-LD)",
  "structured data": "Structured Data",
  "crawl budget": "Crawl Budget",
  "canonical": "Canonical URL Tag",
  "sitemap": "XML Sitemap",
  "robots.txt": "Robots.txt Directives",
  "saas": "SaaS Engineering",
  "saas development": "SaaS Development",
  "multi-tenant": "Multi-Tenant Architecture",
  "rbac": "Role-Based Access Control (RBAC)",
  "mvp": "Minimum Viable Product (MVP)",
  "ai mvp": "Rapid AI MVP Sprint",
  "ecommerce": "E-Commerce",
  "e-commerce": "E-Commerce Solutions",
  "shopify": "Shopify Engineering",
  "headless commerce": "Headless E-Commerce",
  "amazon seller central": "Amazon Seller Central Operations",
  "flipkart seller hub": "Flipkart Seller Hub Operations",
  "cataloging": "E-Commerce Cataloging",
  "financial reconciliation": "E-Commerce Financial Reconciliation",
  "flutter": "Flutter App Development",
  "react native": "React Native",
  "mobile app": "Cross-Platform Mobile App",
  "mobile app development": "Mobile App Development",
  "pwa": "Progressive Web App (PWA)",
  "ui/ux": "UI/UX Design",
  "ui/ux design": "UI/UX Design & AI Interfaces",
  "figma": "Figma Design System",
  "design system": "Design System",
  "brand identity": "Brand Identity Design",
  "digital marketing": "Digital Marketing & AI Growth",
  "social media marketing": "Social Media Marketing",
  "email marketing": "Email Marketing Automation",
  "kraviona": "Kraviona (AI-First Technology)",
  "amar kumar": "Amar Kumar (Founder & Lead Engineer)",
  "east delhi": "East Delhi Headquarters",
  "discovery call": "Technical Discovery Call",
  "web development": "Web Development",
  "web app development": "Web App Development",
  "case studies": "Case Studies & Portfolio",
};

/**
 * Finds verified technical explanation and canonical title for a given phrase.
 * Strict matching prevents bogus popups on generic text or cursor sweeps.
 */
function getExplanationForText(rawText = "", isHover = false) {
  const clean = String(rawText || "")
    .replace(/[^\w\s.-]/g, " ")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");

  if (!clean || clean.length < 2) return null;

  // Filter out pure numbers, email addresses, URLs, and common non-technical navigation words
  if (/^[\d\s.-]+$/.test(clean)) return null;
  if (/@|\.com|\.in|http|www\./i.test(clean)) return null;
  if (/^(home|about|services|contact|blog|news|terms|privacy|careers|login|admin|submit|send|menu|close|view|more|click)$/i.test(clean)) {
    return null;
  }

  // 1. Direct dictionary match
  if (TECH_EXPLANATIONS[clean]) {
    return {
      explanation: TECH_EXPLANATIONS[clean],
      title: CANONICAL_TITLES[clean] || rawText.trim(),
    };
  }

  // 2. Strict word-boundary matching on dictionary keys
  const matchedEntries = [];
  for (const [key, explanation] of Object.entries(TECH_EXPLANATIONS)) {
    // Only search multi-char keys (min 3 chars or exact AI/ML/SEO)
    const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(?:^|\\s|[(\\[{\",])${escaped}(?=[)\\s\\]}\",:;.]|$)`, "i");
    if (regex.test(clean)) {
      matchedEntries.push({ key, explanation, length: key.length });
    }
  }

  if (matchedEntries.length > 0) {
    // Pick the longest matching key for highest specificity
    matchedEntries.sort((a, b) => b.length - a.length);
    const best = matchedEntries[0];
    return {
      explanation: best.explanation,
      title: CANONICAL_TITLES[best.key] || best.key,
    };
  }

  // On hover: NEVER display generic or fake popups! Return null so cursor movement stays completely clean.
  if (isHover) {
    return null;
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
      const timer = setTimeout(() => dismiss(), 0);
      return () => clearTimeout(timer);
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

        // Get verified explanation for selected content
        const match = getExplanationForText(selected, false);
        if (!match) return;

        startTyping(
          match.explanation,
          match.title,
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

      const match = getExplanationForText(textContent, true);
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
