import { PostModel } from "../../models/blog/post.model.js";
import { CategoryModel } from "../../models/blog/category.model.js";
import { Service } from "../../models/services/service.model.js";
import { Project } from "../../models/portfolio/project.model.js";
import { CareerModel } from "../../models/Careers/career.model.js";
import { TeamMemberModel } from "../../models/team/team.model.js";
import config from "../../config/config.js";

// Global in-memory knowledge store and index
let knowledgeIndex = null;
let lastIndexTime = 0;
const INDEX_TTL_MS = 15 * 60 * 1000; // Auto refresh every 15 mins

// Comprehensive static company & service knowledge base
const STATIC_KRAVIONA_KNOWLEDGE = [
  {
    id: "static-about",
    type: "page",
    title: "About Kraviona — AI-First Technology & Software Company",
    category: "Company",
    url: "/about",
    description:
      "Kraviona is an AI-first technology and software company building intelligent software, autonomous AI agents, SaaS platforms, and automated digital solutions that help modern businesses scale. Tagline: 'Intelligence Meets Innovation'. Headquarters: East Delhi, Delhi NCR, India.",
    keywords: ["about kraviona", "company info", "what is kraviona", "who are you", "ai company", "software company", "location", "delhi", "delhi ncr", "kraviona kya hai", "founder", "amar kumar"],
  },
  {
    id: "static-contact",
    type: "page",
    title: "Contact Information & Inquiries",
    category: "Contact",
    url: "/contact",
    description:
      "Connect with Kraviona's engineering team directly. Official Email: hello@kraviona.com, Official Phone / WhatsApp: +91 96085 53167. Location: East Delhi, Delhi 110092, India. Online Discovery Call: https://www.kraviona.com/contact.",
    keywords: ["contact", "email", "phone number", "call", "address", "reach out", "support", "office location", "whatsapp", "number", "sampark", "phone"],
  },
  {
    id: "static-services-overview",
    type: "page",
    title: "Kraviona 5 Core Business Verticals",
    category: "Services",
    url: "/services",
    description:
      "Kraviona operates across 5 core business verticals: 01. IT & Technology Services (Custom software, Next.js/React web apps, Node.js/Python microservices, APIs, Cloud), 02. AI & Automation Solutions (Autonomous cognitive AI agents, LLM reasoning workflows, RAG knowledge bases, AI chatbots), 03. SaaS & Software Products (Cloud SaaS platforms, rapid AI MVPs, multi-tenant databases), 04. E-commerce Solutions (AI storefronts, marketplace account handling, automated cataloging), 05. Digital Marketing Services (Technical SEO, AEO, Generative Engine Optimization - GEO, Core Web Vitals speed).",
    keywords: ["services", "what do you offer", "it services", "ai solutions", "saas", "ecommerce", "seo", "hire developers", "kya karte ho", "features", "offerings"],
  },
  {
    id: "static-it-services",
    type: "service",
    title: "IT & Technology Services",
    category: "Services",
    url: "/services",
    description:
      "Custom software engineering, high-performance Next.js App Router and React web applications, scalable Node.js/Python microservices, secure RESTful/GraphQL APIs, enterprise cloud platforms, and modern UI/UX design systems.",
    keywords: ["web development", "custom software", "nextjs", "react", "mern", "api development", "cloud", "software engineering", "enterprise software"],
  },
  {
    id: "static-ai-automation",
    type: "service",
    title: "AI & Automation Solutions (Flagship Focus)",
    category: "Services",
    url: "/solutions",
    description:
      "Strategic flagship AI development: Autonomous cognitive AI agents, multi-step LLM reasoning pipelines, custom context-aware AI chatbots, enterprise Retrieval-Augmented Generation (RAG) knowledge systems, intelligent document processing (IDP/OCR), and business process automation.",
    keywords: ["ai", "ai agents", "automation", "workflows", "llm", "chatbots", "rag", "retrieval augmented generation", "machine learning", "generative ai"],
  },
  {
    id: "static-saas-products",
    type: "service",
    title: "SaaS & Software Products",
    category: "Services",
    url: "/services",
    description:
      "Full-lifecycle cloud SaaS engineering, rapid AI SaaS MVPs built for fast market entry, multi-tenant database isolation, subscription billing (Stripe), and role-based access control (RBAC).",
    keywords: ["saas", "software product", "mvp", "ai mvp", "cloud software", "multi tenant", "stripe billing", "saas development"],
  },
  {
    id: "static-ecommerce",
    type: "service",
    title: "E-commerce Solutions",
    category: "Services",
    url: "/services",
    description:
      "AI-powered online storefronts, headless Next.js and Shopify e-commerce, automated order fulfillment workflows, Amazon and Flipkart seller account management, flat file cataloging, and payment reconciliation.",
    keywords: ["ecommerce", "shopify", "online store", "amazon seller", "flipkart seller", "marketplace", "headless commerce", "cataloging"],
  },
  {
    id: "static-seo-marketing",
    type: "service",
    title: "Digital Marketing & Technical SEO",
    category: "Services",
    url: "/services",
    description:
      "Advanced Technical SEO, Answer Engine Optimization (AEO), Generative Engine Optimization (GEO), sub-second page loads (< 1.8s LCP, 90+ mobile Core Web Vitals), Schema.org graph markup, and B2B growth marketing.",
    keywords: ["seo", "technical seo", "aeo", "geo", "ranking", "google ranking", "core web vitals", "speed", "traffic", "organic search"],
  },
  {
    id: "static-pricing",
    type: "page",
    title: "Transparent Pricing & Engagement Models",
    category: "Pricing",
    url: "/pricing",
    description:
      "Kraviona offers transparent milestone-based project billing, dedicated engineering sprints, and monthly retainers for Technical SEO and AI systems maintenance. Contact hello@kraviona.com or +91 96085 53167 for a free custom technical estimate.",
    keywords: ["pricing", "cost", "rates", "packages", "hire", "charges", "how much", "kitna kharcha", "kitna lagega", "budget", "price", "rate", "fees"],
  },
  {
    id: "static-case-studies",
    type: "page",
    title: "Case Studies & Engineering Results",
    category: "Portfolio",
    url: "/case-studies",
    description:
      "Explore real-world client implementations, architectural transformations, autonomous AI agent pipelines, and SEO scale-ups engineered by Kraviona.",
    keywords: ["portfolio", "case studies", "projects", "work", "past work", "clients", "samples", "examples", "previous work", "kya banaya"],
  },
  {
    id: "static-location",
    type: "page",
    title: "Headquarters & Office Location",
    category: "Company",
    url: "/contact",
    description:
      "Kraviona is headquartered in East Delhi, Delhi NCR, India (PIN 110092). We collaborate with businesses across India and internationally through remote workflows and dedicated project delivery.",
    keywords: ["location", "address", "where are you", "office", "delhi", "east delhi", "delhi ncr", "kahan ho", "headquarters", "city"],
  },
];

import mongoose from "mongoose";

// Common conversational and generic stopwords in English and Hindi/Hinglish
const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for", "with",
  "by", "about", "from", "of", "is", "are", "am", "was", "were", "be", "been",
  "being", "have", "has", "had", "do", "does", "did", "can", "could", "will",
  "would", "should", "may", "might", "must", "how", "what", "why", "when",
  "where", "who", "which", "make", "tell", "me", "us", "you", "your", "my",
  "i", "it", "its", "this", "that", "these", "those", "please",
]);

// Clean and tokenize text for TF-IDF / keyword search
const tokenize = (text = "", filterStopwords = false) => {
  const tokens = String(text)
    .toLowerCase()
    .replace(/[^\w\s\u0900-\u097F]/gi, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1);

  return filterStopwords ? tokens.filter((t) => !STOP_WORDS.has(t)) : tokens;
};

// Hindi / Hinglish query intent recognition
const isHindiOrHinglish = (text = "") => {
  const hindiRegex = /[\u0900-\u097F]/;
  const hinglishWords = [
    "kya", "kaise", "hai", "hain", "karna", "mujhe", "chahiye", "batao",
    "kaha", "kahan", "kaun", "kare", "sakta", "sakte", "mera", "meri",
    "banao", "banwana", "banwani", "kharidna", "rate", "paisa", "kitna",
    "namaste", "dhanyawad", "shukriya", "madad", "sampark", "kaam", "theek",
    "bhai", "karo", "do", "dena", "lagta", "kharcha"
  ];
  if (hindiRegex.test(text)) return true;
  const words = text.toLowerCase().split(/\s+/);
  return words.some((w) => hinglishWords.includes(w));
};

/**
 * Builds the searchable public knowledge index from MongoDB + static data.
 * Guarantees zero unpublished/draft/private data.
 */
export const buildKnowledgeIndex = async () => {
  const docs = [...STATIC_KRAVIONA_KNOWLEDGE];

  try {
    // Only query MongoDB if connected to avoid buffer timeouts
    if (mongoose.connection?.readyState === 1) {
      const now = new Date();

    // 1. Published Blog & News Posts
    const posts = await PostModel.find({
      status: "published",
      $or: [
        { publishedAt: { $exists: false } },
        { publishedAt: null },
        { publishedAt: { $lte: now } },
      ],
      isNoIndex: { $ne: true },
    })
      .select("title slug excerpt content quickAnswer keyTakeaways faqSchema category contentType tags")
      .lean();

    for (const post of posts) {
      const catSlug = post.category?.slug || (post.contentType === "news" ? "news" : "blog");
      // Format strict correct URL: /{category}/{slug}
      const itemUrl = `/${catSlug}/${post.slug}`;
      const faqTexts = Array.isArray(post.faqSchema)
        ? post.faqSchema.map((f) => `${f.question} ${f.answer}`).join(" ")
        : "";
      const takeaways = Array.isArray(post.keyTakeaways)
        ? post.keyTakeaways.join(" ")
        : "";

      docs.push({
        id: `post-${post._id}`,
        type: post.contentType === "news" ? "news" : "blog",
        title: post.title,
        slug: post.slug,
        category: post.category?.name || catSlug,
        categorySlug: catSlug,
        url: itemUrl,
        description: post.quickAnswer || post.excerpt || "",
        body: `${post.excerpt || ""} ${takeaways} ${faqTexts} ${(post.content || "").slice(0, 800)}`,
        keywords: [
          ...(post.tags || []),
          post.title,
          post.category?.name,
          post.contentType,
        ].filter(Boolean),
      });
    }

    // 2. Published Categories
    const categories = await CategoryModel.find({ status: "published" })
      .select("name slug description")
      .lean();

    for (const cat of categories) {
      docs.push({
        id: `category-${cat._id}`,
        type: "category",
        title: `${cat.name} Articles`,
        slug: cat.slug,
        category: "Categories",
        url: `/category/${cat.slug}`,
        description: cat.description || `Browse all articles under ${cat.name}.`,
        body: cat.description || "",
        keywords: [cat.name, cat.slug, "blog category", "topic"],
      });
    }

    // 3. Active Services
    const services = await Service.find({ isActive: true })
      .select("title slug category description features hero faqs")
      .lean();

    for (const s of services) {
      const featuresText = Array.isArray(s.features) ? s.features.join(", ") : "";
      const faqsText = Array.isArray(s.faqs)
        ? s.faqs.map((f) => `${f.question}: ${f.answer}`).join(" ")
        : "";

      docs.push({
        id: `service-${s._id}`,
        type: "service",
        title: s.title,
        slug: s.slug,
        category: s.category || "Service",
        url: `/services/${s.slug}`,
        description: s.description || s.hero?.description || "",
        body: `${featuresText} ${faqsText}`,
        keywords: [s.title, s.category, "service", ...(s.features || [])],
      });
    }

    // 4. Active Portfolio / Projects
    const projects = await Project.find({ isActive: true })
      .select("title slug category description solution results techStack")
      .lean();

    for (const p of projects) {
      const techText = Array.isArray(p.techStack) ? p.techStack.join(", ") : "";
      const resultsText = Array.isArray(p.results) ? p.results.join(", ") : "";

      docs.push({
        id: `project-${p._id}`,
        type: "project",
        title: p.title,
        slug: p.slug,
        category: p.category || "Case Study",
        url: `/case-studies/${p.slug}`,
        description: p.description || "",
        body: `${p.solution || ""} ${resultsText} Tech: ${techText}`,
        keywords: [p.title, p.category, "case study", "project", ...(p.techStack || [])],
      });
    }

    // 5. Published Careers
    const careers = await CareerModel.find({
      status: "published",
      $or: [
        { publishedAt: null },
        { publishedAt: { $exists: false } },
        { publishedAt: { $lte: now } },
      ],
      $or: [
        { "application.deadline": null },
        { "application.deadline": { $exists: false } },
        { "application.deadline": { $gte: now } },
      ],
    })
      .select("jobTitle slug department employmentType workplaceType summary")
      .lean();

    for (const c of careers) {
      docs.push({
        id: `career-${c._id}`,
        type: "career",
        title: `${c.jobTitle} (${c.department})`,
        slug: c.slug,
        category: "Careers",
        url: `/careers/${c.slug}`,
        description: c.summary || `${c.jobTitle} opening at Kraviona.`,
        body: `${c.employmentType || ""} ${c.workplaceType || ""} in ${c.department || ""}`,
        keywords: [c.jobTitle, c.department, "job", "career", "hiring"],
      });
    }

    // 6. Active Team
    const teamMembers = await TeamMemberModel.find({ status: "active" })
      .select("name slug designation bio")
      .lean();

    for (const t of teamMembers) {
      docs.push({
        id: `team-${t._id}`,
        type: "team",
        title: `${t.name} - ${t.designation}`,
        slug: t.slug,
        category: "Team",
        url: "/team",
        description: t.bio || `${t.name}, ${t.designation} at Kraviona.`,
        body: t.bio || "",
        keywords: [t.name, t.designation, "team", "leader"],
      });
    }
  }
} catch (error) {
    console.error("[Chatbot Index Error] Failed building dynamic index:", error?.message);
  }

  // Pre-tokenize docs for rapid BM25 / token matching
  const processedDocs = docs.map((doc) => {
    const titleTokens = tokenize(doc.title);
    const kwTokens = (doc.keywords || []).flatMap(tokenize);
    const descTokens = tokenize(doc.description);
    const bodyTokens = tokenize(doc.body || "");

    return {
      ...doc,
      titleTokens,
      kwTokens,
      descTokens,
      bodyTokens,
    };
  });

  knowledgeIndex = processedDocs;
  lastIndexTime = Date.now();
  return knowledgeIndex;
};

/**
 * Returns cached knowledge index or rebuilds if stale.
 */
export const getKnowledgeIndex = async () => {
  if (!knowledgeIndex || Date.now() - lastIndexTime > INDEX_TTL_MS) {
    await buildKnowledgeIndex();
  }
  return knowledgeIndex;
};

/**
 * Invalidate index cache so newly published content is instantly available.
 */
export const invalidateChatbotIndex = () => {
  knowledgeIndex = null;
  lastIndexTime = 0;
};

/**
 * RAG Search: Scores documents based on query relevance
 */
export const searchKnowledgeBase = async (queryText) => {
  const index = await getKnowledgeIndex();
  const allTokens = tokenize(queryText, false);
  const meaningfulTokens = tokenize(queryText, true);
  const queryTokens = meaningfulTokens.length ? meaningfulTokens : allTokens;

  if (!queryTokens.length) return [];

  // If query contains zero meaningful tokens and no direct brand keywords, don't match random docs
  if (!meaningfulTokens.length && !allTokens.some((t) => ["kraviona", "service", "services", "contact", "about", "seo", "blog", "news", "project", "career"].includes(t))) {
    return [];
  }

  const scoredDocs = [];

  for (const doc of index) {
    let score = 0;
    const matchedTokens = new Set();

    for (const token of queryTokens) {
      // 1. Exact match in title (High weight: 10 pts)
      if (doc.titleTokens.includes(token)) {
        score += 10;
        matchedTokens.add(token);
      } else if (token.length >= 4 && doc.titleTokens.some((t) => t.length >= 4 && (t.startsWith(token) || token.startsWith(t)))) {
        score += 5;
        matchedTokens.add(token);
      }

      // 2. Keyword match (Weight: 6 pts)
      if (doc.kwTokens.includes(token)) {
        score += 6;
        matchedTokens.add(token);
      } else if (token.length >= 4 && doc.kwTokens.some((t) => t.length >= 4 && (t.startsWith(token) || token.startsWith(t)))) {
        score += 3;
        matchedTokens.add(token);
      }

      // 3. Description match (Weight: 3 pts)
      if (doc.descTokens.includes(token)) {
        score += 3;
        matchedTokens.add(token);
      }

      // 4. Body content match (Weight: 1 pt)
      if (doc.bodyTokens.includes(token)) {
        score += 1;
        matchedTokens.add(token);
      }
    }

    // Give bonus for matching multiple distinct query tokens
    if (matchedTokens.size > 1) {
      score *= 1.25 * matchedTokens.size;
    }

    if (score > 0) {
      scoredDocs.push({ ...doc, score });
    }
  }

  scoredDocs.sort((a, b) => b.score - a.score);
  return scoredDocs.slice(0, 4); // Top 4 most relevant chunks
};

/**
 * Attempt to query local Ollama / llama.cpp if available
 */
const queryLocalModel = async (userQuery, contextSnippets, languageMode) => {
  const localUrl = process.env.LOCAL_AI_URL || "http://localhost:11434";
  const modelName = process.env.LOCAL_AI_MODEL || "qwen2.5:0.5b";

  const contextText = contextSnippets
    .map(
      (s) =>
        `Title: ${s.title}\nURL: ${s.url}\nType: ${s.type}\nContent: ${s.description}\n${s.body ? s.body.slice(0, 300) : ""}`
    )
    .join("\n\n---\n\n");

  const systemInstruction = `You are the official Kraviona AI Assistant (https://www.kraviona.com), representing an AI-First Technology & Digital Solutions Company ("Intelligence Meets Innovation").
Your goal is to help visitors understand Kraviona's 5 core business verticals:
01. IT & Technology Services: Custom software, Next.js App Router, React, Node.js, Python, enterprise APIs, and cloud architectures.
02. AI & Automation Solutions (Strategic Flagship Focus): Autonomous cognitive AI agents, multi-step LLM reasoning pipelines, custom AI chatbots, enterprise RAG knowledge systems, intelligent document processing (IDP/OCR), and business process automation.
03. SaaS & Software Products: Full-lifecycle cloud SaaS platforms, rapid AI MVPs, multi-tenant database isolation, and Stripe billing.
04. E-commerce Solutions: AI-powered storefronts, headless Next.js e-commerce, Amazon & Flipkart marketplace management, automated cataloging.
05. Digital Marketing Services: Technical SEO, Answer Engine Optimization (AEO), Generative Engine Optimization (GEO), Core Web Vitals speed optimization (< 1.8s LCP), and B2B growth marketing.

STRICT RULES:
1. Never invent facts. Answer directly and concisely based on Kraviona's verified capabilities.
2. If the answer is NOT present, invite them to connect with our engineering team at hello@kraviona.com, +91 96085 53167, or via /contact.
3. Respond in the same language as the user (${languageMode === "hinglish" ? "Hinglish / Hindi" : "English"}).
4. Always provide exact clickable markdown links (e.g. [Services](/services), [AI Solutions](/solutions), [Contact](/contact)).
5. Never talk about admin credentials, private configs, or internal server details.`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4500); // 4.5s max

  try {
    const response = await fetch(`${localUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model: modelName,
        messages: [
          { role: "system", content: systemInstruction },
          {
            role: "user",
            content: `Context:\n${contextText}\n\nUser Question:\n${userQuery}`,
          },
        ],
        stream: false,
        options: {
          temperature: 0.2,
          num_predict: 250,
        },
      }),
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const rawAnswer = data.message?.content?.trim();
      if (rawAnswer && rawAnswer.length > 10) {
        return rawAnswer;
      }
    }
  } catch (err) {
    // Local Ollama not running or timed out - graceful fallback
  } finally {
    clearTimeout(timeoutId);
  }

  return null;
};

// Direct Intent Matcher for high-accuracy, human-grade conversational responses
const matchDirectIntent = (query, hinglish) => {
  const q = query.toLowerCase().trim();

  // 1. Thanks & Goodbye
  if (/\b(thank(s|\s+you)?|dhanyawad|shukriya|bye|goodbye|alvida|ok|okay|theek\s+hai|thik\s+hai)\b/i.test(q)) {
    return {
      reply: hinglish
        ? "Aapka swagat hai! 🙏 Agar aapko koi aur technical jaankari chahiye ya apna AI/Software project discuss karna ho, Kraviona hamesha madad ke liye tayyar hai. Shubh din!"
        : "You're very welcome! If you need any more technical information or want to explore an AI or software project, Kraviona is always here to assist. Have a wonderful day! 😊",
      sources: [
        { title: "Contact Us", url: "/contact", category: "Contact", type: "page" },
      ],
      type: "courtesy",
    };
  }

  // 2. Page Explanation / Summarize Page / Explain This Page
  if (
    /\b(explain (this |the )?page|summarize (this |the )?page|technical offerings and services|offerings and services presented|page offerings|explain page)\b/i.test(q)
  ) {
    return {
      reply: hinglish
        ? `**Kraviona** ek AI-first technology company hai jo modern businesses ke liye intelligent digital systems build karti hai ("Intelligence Meets Innovation").\n\nHumari 5 core business verticals yeh hain:\n\n• **01. IT & Technology Services**: Custom software engineering, high-performance Next.js App Router & React web apps, Node.js/Python microservices, scalable APIs, aur UI/UX design systems.\n• **02. AI & Automation Solutions** *(Flagship Focus)*: Autonomous cognitive AI agents, multi-step LLM workflows, custom AI chatbots, enterprise RAG systems, aur intelligent document processing.\n• **03. SaaS & Software Products**: Cloud-native SaaS product engineering, rapid AI MVPs, multi-tenant databases, Stripe subscription billing, aur role-based access control (RBAC).\n• **04. E-commerce Solutions**: AI-powered storefronts (Next.js, Headless Shopify), automated order workflows, Amazon/Flipkart marketplace operations, flat file cataloging, aur payout reconciliation.\n• **05. Digital Marketing Services**: Technical SEO, Answer Engine Optimization (AEO), Generative Engine Optimization (GEO), Core Web Vitals speed optimization, aur data-driven B2B growth.\n\nAap explore kar sakte hain: [Services Directory](/services) ya discuss karein apna project: [Contact Page](/contact).`
        : `Kraviona is an **AI-First Technology & Digital Solutions Company** ("Intelligence Meets Innovation") delivering enterprise-grade engineering across 5 core business verticals:\n\n• **01. IT & Technology Services**: Custom software engineering, high-velocity Next.js App Router & React web applications, scalable Node.js/Python backends, enterprise APIs, and UI/UX design systems.\n• **02. AI & Automation Solutions** *(Strategic Focus)*: Autonomous cognitive AI agents, custom AI chatbots, enterprise RAG (Retrieval-Augmented Generation) assistants, intelligent document processing, and business process automation.\n• **03. SaaS & Software Products**: Full-lifecycle cloud SaaS platforms, rapid AI MVPs, multi-tenant database architectures, subscription billing, and role-based access control (RBAC).\n• **04. E-commerce Solutions**: AI-powered online storefronts, headless Next.js e-commerce, Amazon & Flipkart marketplace management, product cataloging, and automated payout reconciliation.\n• **05. Digital Marketing Services**: Technical SEO, Answer Engine Optimization (AEO), Generative Engine Optimization (GEO), Core Web Vitals speed optimization (< 1.8s LCP), and B2B growth marketing.\n\nExplore our complete offerings on the [Services Directory](/services) or schedule a discovery call on our [Contact Page](/contact).`,
      sources: [
        { title: "About Us", url: "/about", category: "Company", type: "page" },
        { title: "Services Directory", url: "/services", category: "Services", type: "page" },
        { title: "AI Solutions", url: "/solutions", category: "AI Solutions", type: "page" },
      ],
      type: "page_explanation",
    };
  }

  // 3. Greetings & Who are you
  if (
    /\b(hi|hello|hey|namaste|greetings|good\s+(morning|afternoon|evening|day)|who are you|what can you do|help|madad|kaise ho|kya haal hai|aap kaun ho)\b/i.test(q)
  ) {
    return {
      reply: hinglish
        ? `Namaste! 👋 Main Kraviona ka AI Assistant hoon.\n\nKraviona ek **AI-First Technology & Digital Solutions Company** hai. Main aapki in 5 core verticals par madad kar sakta hoon:\n\n• **01. IT & Technology Services**: Custom software, Next.js, React, Node.js & scalable web apps\n• **02. AI & Automation Solutions**: Autonomous AI agents, custom chatbots, RAG systems & workflow automation\n• **03. SaaS & Software Products**: Cloud SaaS development, rapid AI MVPs & multi-tenant architectures\n• **04. E-commerce Solutions**: AI storefronts, marketplace account handling & automated cataloging\n• **05. Digital Marketing Services**: Technical SEO, AEO, Generative Engine Optimization (GEO) & growth\n\nAap kis solution ke baare mein jaan-na chahte hain?`
        : `Hello! 👋 I'm Kraviona's AI Assistant.\n\nKraviona is an **AI-First Technology & Digital Solutions Company** ("Intelligence Meets Innovation"). I can assist you across our 5 core business verticals:\n\n• **01. IT & Technology Services**: Custom software, high-performance Next.js & React web applications, and scalable backend APIs\n• **02. AI & Automation Solutions** *(Core Focus)*: Autonomous cognitive AI agents, enterprise RAG knowledge bases, and intelligent process automation\n• **03. SaaS & Software Products**: Full-lifecycle cloud SaaS platforms, rapid AI MVPs, and multi-tenant architectures\n• **04. E-commerce Solutions**: AI-powered storefronts, marketplace seller operations, and automated cataloging\n• **05. Digital Marketing Services**: Technical SEO, Answer Engine Optimization (AEO), Generative Engine Optimization (GEO), and performance growth\n\nHow can I help you today?`,
      sources: [
        { title: "Services Directory", url: "/services", category: "Services", type: "page" },
        { title: "AI Solutions", url: "/solutions", category: "AI Solutions", type: "page" },
        { title: "Case Studies", url: "/case-studies", category: "Portfolio", type: "page" },
      ],
      type: "greeting",
    };
  }

  // 4. Services Overview / Kya karte ho / What do you do
  if (/\b(service|services|kya karte ho|kya karta hai|what do you do|what does kraviona do|what do you offer|what services|offerings|solutions|capabilities|features)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Kraviona 5 core business verticals mein enterprise-grade services provide karta hai:\n\n• **01. IT & Technology Services**: Custom software engineering, high-speed Next.js & React web apps, Node.js/Python APIs, aur UI/UX systems.\n• **02. AI & Automation Solutions** *(Core Focus)*: Autonomous cognitive AI agents, custom chatbots, enterprise RAG knowledge bases, aur workflow automation.\n• **03. SaaS & Software Products**: B2B AI SaaS product engineering, rapid MVPs, multi-tenant cloud architectures, aur subscription billing.\n• **04. E-commerce Solutions**: AI-powered web stores, marketplace account management (Amazon, Flipkart), product cataloging, aur settlement reconciliation.\n• **05. Digital Marketing Services**: Technical SEO, Answer Engine Optimization (AEO), Generative Engine Optimization (GEO), aur data-driven growth.\n\nPoore details ke liye visit karein: [Kraviona Services Directory](/services)`
        : `Kraviona delivers enterprise-grade engineering across 5 core business verticals:\n\n• **01. IT & Technology Services**: Custom software engineering, high-performance Next.js & React web applications, scalable backends, and UI/UX design systems.\n• **02. AI & Automation Solutions** *(Flagship Focus)*: Autonomous cognitive AI agents, custom AI chatbots, enterprise RAG assistants, and intelligent process automation.\n• **03. SaaS & Software Products**: Full-lifecycle cloud SaaS platforms, rapid AI MVPs, multi-tenant databases, and subscription billing.\n• **04. E-commerce Solutions**: AI-powered web storefronts, marketplace seller management (Amazon, Flipkart), cataloging, and payout reconciliation.\n• **05. Digital Marketing Services**: Technical SEO, Answer Engine Optimization (AEO), Generative Engine Optimization (GEO), and performance marketing.\n\nExplore all offerings on our [Services Directory](/services).`,
      sources: [
        { title: "Services Directory", url: "/services", category: "Services", type: "page" },
        { title: "AI Solutions", url: "/solutions", category: "AI Solutions", type: "page" },
      ],
      type: "intent-services",
    };
  }

  // 5. New Project / Website Banwani Hai / Hire
  if (
    /\b(banwani|banwana|banana|banaye|banao)\b/i.test(q) ||
    (/\b(website|web\s*site|web\s*app|app|software|project)\b/i.test(q) && /\b(build|make|create|develop|need|want|chahiye|start|new)\b/i.test(q)) ||
    /\b(hire|developer|quote|quotation|proposal|start project|project discuss)\b/i.test(q)
  ) {
    return {
      reply: hinglish
        ? `Kraviona aapki requirements ke mutabiq custom software, AI agents, SaaS MVPs aur high-speed web apps engineer karta hai!\n\nAap humari engineering team se direct connect kar sakte hain:\n• **WhatsApp / Call**: [+91 96085 53167](tel:+919608553167)\n• **Official Email**: [hello@kraviona.com](mailto:hello@kraviona.com)\n• **Online Discovery Call**: [Contact Page Par Requirement Share Karein](/contact)\n\nHumari team 24 hours ke andar customized scope aur transparent timeline ke saath connect karegi.`
        : `We would love to engineer your project! Kraviona specializes in custom software, autonomous AI agents, SaaS MVPs, and modern Next.js web applications.\n\nConnect directly with our engineering team:\n• **Email**: [hello@kraviona.com](mailto:hello@kraviona.com)\n• **Phone / WhatsApp**: [+91 96085 53167](tel:+919608553167)\n• **Discovery Call**: [Book a Project Consultation on our Contact Page](/contact)\n\nOur team will review your specifications and reply within 1 business day with a customized technical proposal.`,
      sources: [
        { title: "Contact Kraviona", url: "/contact", category: "Contact", type: "page" },
        { title: "Transparent Pricing", url: "/pricing", category: "Pricing", type: "page" },
      ],
      type: "intent-project",
    };
  }

  // 6. Contact / Phone / Email / WhatsApp
  if (/\b(contact|phone|number|email|call|whatsapp|reach|sampark|touch)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Aap Kraviona ki engineering team se in channels ke through direct connect kar sakte hain:\n\n• **Official Email**: [hello@kraviona.com](mailto:hello@kraviona.com)\n• **Phone / WhatsApp**: [+91 96085 53167](tel:+919608553167)\n• **Headquarters**: East Delhi, Delhi NCR, India (PIN 110092)\n• **Online Form**: [Contact Page Par Jaayein](/contact)\n\nHum har enquiry ka response 24 hours ke andar provide karte hain.`
        : `You can reach Kraviona's engineering team directly through:\n\n• **Email**: [hello@kraviona.com](mailto:hello@kraviona.com)\n• **Phone / WhatsApp**: [+91 96085 53167](tel:+919608553167)\n• **Headquarters**: East Delhi, Delhi NCR, India (PIN 110092)\n• **Online Form**: [Contact Us](/contact)\n\nOur engineering team typically responds within 24 hours.`,
      sources: [
        { title: "Contact Us", url: "/contact", category: "Contact", type: "page" },
      ],
      type: "intent-contact",
    };
  }

  // 7. Location / Office / Address
  if (/\b(location|address|where|kahan|office|delhi|headquarters)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Kraviona ka primary headquarters **East Delhi, Delhi NCR, India (PIN 110092)** mein sthit hai.\n\nHum poore India aur international clients ke saath modern remote workflows aur project-based delivery model se collaborate karte hain.\n\nConnect karne ke liye: [Contact Us](/contact) ya email karein [hello@kraviona.com](mailto:hello@kraviona.com).`
        : `Kraviona is headquartered in **East Delhi, Delhi NCR, India (PIN 110092)**.\n\nWe engineer software and deliver AI solutions for clients across India and globally through modern remote engineering workflows.\n\nGet in touch at [hello@kraviona.com](mailto:hello@kraviona.com) or visit our [Contact Page](/contact).`,
      sources: [
        { title: "Contact Us", url: "/contact", category: "Contact", type: "page" },
      ],
      type: "intent-location",
    };
  }

  // 8. Pricing / Cost / Rates / Packages
  if (/\b(price|pricing|cost|charge|charges|rate|rates|fee|fees|kitna kharcha|kitna lagega|budget|paisa|package|packages)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Kraviona transparent aur value-driven pricing models offer karta hai:\n\n• **Project-Based Milestones**: Fixed transparent scope for custom software, SaaS MVPs, aur web applications\n• **Monthly Retainers**: Dedicated Technical SEO, continuous performance monitoring, aur ongoing engineering support\n• **AI Agent & Workflow Sprints**: Tailored to model tokens, agent architecture, aur API complexity\n\nApne project ka transparent technical estimate paane ke liye [Pricing Page](/pricing) visit karein ya connect karein: [Contact Page](/contact).`
        : `Kraviona offers transparent, milestone-driven pricing:\n\n• **Fixed Milestone Sprints**: Predictable budgets for custom software development, rapid SaaS MVPs, and Next.js applications\n• **Monthly Retainers**: Ongoing Technical SEO architectures, speed maintenance, and system monitoring\n• **Custom AI Solutions**: Scoped by agent complexity, knowledge base RAG index size, and workflow integrations\n\nExplore our plans on the [Pricing Page](/pricing) or request a custom proposal on our [Contact Page](/contact).`,
      sources: [
        { title: "Transparent Pricing", url: "/pricing", category: "Pricing", type: "page" },
        { title: "Contact for Quote", url: "/contact", category: "Contact", type: "page" },
      ],
      type: "intent-pricing",
    };
  }

  // 9. IT & Technology Services / Web Development
  if (/\b(web dev|web development|nextjs|next\.js|react|mern|frontend|backend|node|full stack|software dev|custom software)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Hum enterprise-grade custom software aur ultra-fast web applications engineer karte hain using Next.js App Router, React, Node.js, Python, aur cloud microservices.\n\nHar build clean architecture, sub-second latency, aur responsive UI/UX ke saath aati hai.\n\nExplore karein: [IT Services](/services) ya discuss karein: [Contact Page](/contact).`
        : `Kraviona delivers enterprise-grade IT & Technology Services using Next.js App Router, React, Node.js, Python, and cloud microservices. We build scalable software, mission-critical APIs, and high-performance web applications.\n\nExplore our technology capabilities on our [Services Page](/services).`,
      sources: [
        { title: "IT Services", url: "/services", category: "Services", type: "page" },
      ],
      type: "intent-webdev",
    };
  }

  // 10. AI & Automation / AI Agents / Chatbots / RAG
  if (/\b(ai|artificial intelligence|automations?|workflows?|llms?|chatbots?|agents?|rag|machine learning)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `AI Solutions Kraviona ka strategic flagship vertical hai! Hum deliver karte hain:\n\n• **Autonomous AI Agents**: Multi-step reasoning aur automated task execution\n• **Enterprise RAG Knowledge Systems**: Aapke documents aur CRM par trained private chatbots\n• **Intelligent Document Processing (IDP)**: Automated OCR aur structured data extraction\n• **Workflow Automations**: Repetitive operational bottlenecks ko eliminate karna\n\nExplore karein: [AI Solutions](/solutions) ya schedule karein demo: [Contact](/contact).`
        : `AI & Automation is Kraviona's strategic flagship focus! We engineer:\n\n• **Autonomous Cognitive AI Agents**: Multi-step reasoning pipelines that execute complex operations independently\n• **Context-Aware AI Chatbots**: RAG-powered customer and internal knowledge assistants with strict guardrails\n• **Intelligent Document Processing**: Automated OCR, document parsing, and validation\n• **Business Workflow Automation**: Connecting ERPs, CRMs, and APIs with AI-driven decision systems\n\nLearn more on our [AI Solutions Page](/solutions).`,
      sources: [
        { title: "AI Solutions", url: "/solutions", category: "AI Solutions", type: "page" },
        { title: "Services", url: "/services", category: "Services", type: "page" },
      ],
      type: "intent-ai",
    };
  }

  // 11. SaaS & Software Products
  if (/\b(saas|software products?|mvp|ai mvp|multi tenant|stripe)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Kraviona full-lifecycle cloud SaaS platforms aur rapid AI MVPs develop karta hai with multi-tenant database isolation, Stripe subscription billing, aur RBAC security.\n\nApna product launch karein: [Services](/services) ya [Contact Us](/contact).`
        : `Kraviona engineers full-lifecycle cloud SaaS products and rapid AI MVPs engineered for fast time-to-market. Complete with multi-tenant data isolation, Stripe subscription engines, and enterprise security.\n\nExplore our SaaS capabilities on our [Services Page](/services).`,
      sources: [
        { title: "SaaS Products", url: "/services", category: "Services", type: "page" },
      ],
      type: "intent-saas",
    };
  }

  // 12. E-commerce Solutions
  if (/\b(ecommerce|e-commerce|shopify|amazon|flipkart|storefront|marketplace|seller)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Hum AI-powered high-conversion storefronts (Next.js, Headless Shopify) engineer karte hain aur Amazon/Flipkart marketplace seller operations, cataloging aur payout reconciliation automate karte hain.\n\nExplore karein: [Services](/services).`
        : `We engineer high-converting AI-powered online storefronts (Next.js, Headless Shopify) and deliver end-to-end Amazon/Flipkart marketplace seller management, cataloging, and fee reconciliation.\n\nExplore our e-commerce solutions on our [Services Page](/services).`,
      sources: [
        { title: "E-commerce Solutions", url: "/services", category: "Services", type: "page" },
      ],
      type: "intent-ecommerce",
    };
  }

  // 13. Digital Marketing & Technical SEO
  if (/\b(seo|technical seo|aeo|geo|ranking|google ranking|core web vitals|page speed|traffic|organic)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Kraviona data-driven Technical SEO, Answer Engine Optimization (AEO), aur Generative Engine Optimization (GEO) provide karta hai:\n\n• **Core Web Vitals**: < 1.8s LCP aur 90+ mobile speed guarantee\n• **Schema Graph**: Comprehensive JSON-LD structured data Google rich snippets ke liye\n• **AEO & GEO**: Search Generative Experience (SGE) aur AI search engines ke liye citations optimize karna\n\nExplore karein: [Services](/services).`
        : `Kraviona's Technical SEO & Growth practice focuses on high-precision search visibility:\n\n• **Core Web Vitals Optimization**: Guaranteed 90+ mobile & desktop speed scores (< 1.8s LCP)\n• **Answer Engine (AEO) & Generative Optimization (GEO)**: Optimizing for ChatGPT, Perplexity, and Google AI Overviews\n• **Structured Schema.org Architecture**: Enterprise JSON-LD graph indexing\n\nLearn more on our [Services Page](/services).`,
      sources: [
        { title: "Digital Marketing & SEO", url: "/services", category: "Services", type: "page" },
      ],
      type: "intent-seo",
    };
  }

  // 14. Portfolio / Case Studies / Projects
  if (/\b(portfolio|case studies|case study|projects|past work|clients|samples|kya banaya)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Aap Kraviona ke real-world AI implementations, SaaS platforms aur engineering transformation case studies dekh sakte hain:\n\n• [Case Studies Page Par Jaayein](/case-studies)\n\nKisi specific live demonstration ke baare mein baat karne ke liye: [Contact Us](/contact).`
        : `Explore real-world client implementations, architectural transformations, autonomous AI pipelines, and scale-ups engineered by Kraviona:\n\n• [Explore All Case Studies](/case-studies)\n\nInterested in building something similar? Connect with us on our [Contact Page](/contact).`,
      sources: [
        { title: "Case Studies", url: "/case-studies", category: "Portfolio", type: "page" },
      ],
      type: "intent-portfolio",
    };
  }

  // 15. About / Company / Founder
  if (/\b(about|kraviona|company|who are you|founder|amar kumar|agency)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `**Kraviona** ek AI-First Technology & Digital Solutions Company hai ("Intelligence Meets Innovation") jo East Delhi, Delhi NCR, India mein based hai. Founder & Lead Systems Engineer: **Amar Kumar**.\n\nHum modern enterprises ke liye autonomous AI agents, SaaS products, custom software, aur data-driven SEO architectures deliver karte hain.\n\nAur jaankari ke liye visit karein: [About Kraviona](/about).`
        : `**Kraviona** is an AI-First Technology & Digital Solutions Company ("Intelligence Meets Innovation") headquartered in East Delhi, Delhi NCR, India. Founder & Lead Systems Engineer: **Amar Kumar**.\n\nWe engineer autonomous AI agents, intelligent SaaS platforms, custom enterprise software, and Technical SEO architectures.\n\nLearn more on our [About Page](/about).`,
      sources: [
        { title: "About Us", url: "/about", category: "Company", type: "page" },
        { title: "Services Directory", url: "/services", category: "Services", type: "page" },
      ],
      type: "intent-about",
    };
  }

  return null;
};

/**
 * Built-in Local Extractive & Synthesis Engine
 * Clean, readable sentences without raw markdown hash headers.
 */
const synthesizeLocalResponse = (query, relevantDocs, hinglish) => {
  if (!relevantDocs || relevantDocs.length === 0) {
    return {
      reply: hinglish
        ? `Is topic ke baare mein website par specific public content nahi mila.\n\nLekin main Kraviona ke 5 core business verticals: **IT & Technology Services**, **AI & Automation Solutions**, **SaaS Products**, **E-commerce Solutions**, ya **Digital Marketing & SEO** ke baare mein aapki poori madad kar sakta hoon.\n\nAap humari team se direct sampark kar sakte hain: [Contact Page](/contact) ya WhatsApp [+91 96085 53167](tel:+919608553167).`
        : `I couldn't find a specific page on our website regarding that question.\n\nHowever, I can help you with details on:\n• Our Next.js & MERN web development services ([View Services](/services))\n• Technical SEO and site speed optimization\n• Project pricing and past client results ([Case Studies](/case-studies))\n• Reaching our engineering team directly ([Contact Us](/contact))\n\nFeel free to ask about any of the above!`,
      sources: [],
      type: "unmatched",
    };
  }

  const primary = relevantDocs[0];
  const sources = relevantDocs.map((d) => ({
    title: d.title,
    url: d.url,
    category: d.category,
    type: d.type,
  }));

  let responseText = `**${primary.title}**\n${primary.description}\n\n`;

  if (primary.url) {
    responseText += `• [Read more on ${primary.title}](${primary.url})\n`;
  }

  if (relevantDocs.length > 1) {
    responseText += `\n**Related Resources:**\n`;
    relevantDocs.slice(1, 3).forEach((doc) => {
      responseText += `• [${doc.title}](${doc.url})\n`;
    });
  }

  return { reply: responseText, sources, type: "local-rag" };
};

/**
 * Main Public Chat Processor
 */
export const processChatQuery = async (userQuery) => {
  const trimmed = String(userQuery || "").trim();
  const hinglish = isHindiOrHinglish(trimmed);

  // 1. Check high-precision direct intent
  const directResponse = matchDirectIntent(trimmed, hinglish);
  if (directResponse) {
    return directResponse;
  }

  // 2. Search knowledge base
  const relevantDocs = await searchKnowledgeBase(trimmed);

  // 3. Strict grounding test: if no docs found or relevance is too low
  if (!relevantDocs || relevantDocs.length === 0 || relevantDocs[0].score < 4) {
    return synthesizeLocalResponse(trimmed, [], hinglish);
  }

  // 4. Try Local Ollama / SLM model if available on server
  const localModelReply = await queryLocalModel(
    trimmed,
    relevantDocs,
    hinglish ? "hinglish" : "english"
  );

  const sources = relevantDocs.map((d) => ({
    title: d.title,
    url: d.url,
    category: d.category,
    type: d.type,
  }));

  if (localModelReply) {
    return {
      reply: localModelReply,
      sources,
      type: "local-slm",
    };
  }

  // 5. Built-in Local Synthesis without raw hash headers
  return synthesizeLocalResponse(trimmed, relevantDocs, hinglish);
};

/**
 * Common quick questions for the chatbot suggestions
 */
export const getChatSuggestions = () => [
  "What services do you offer?",
  "How can I contact the team?",
  "What are your pricing plans?",
  "Where is Kraviona located?",
  "View portfolio case studies",
];
