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

  // 1. Courtesy, Thanks & Goodbye
  if (/\b(thank(s|\s+you)?|dhanyawad|shukriya|bye|goodbye|alvida|ok|okay|theek\s+hai|thik\s+hai|great|awesome|badhiya|shandar)\b/i.test(q)) {
    return {
      reply: hinglish
        ? "Aapka bahut-bahut swagat hai! 🙏 Agar aapko koi aur technical sawal ho ya apna software/AI project discuss karna ho, Kraviona team hamesha madad ke liye tayyar hai. Call/WhatsApp: [+91 96085 53167](tel:+919608553167). Aapka din shubh rahe!"
        : "You're very welcome! If you need any more technical information, architectural guidance, or want to explore an AI or software project, Kraviona is always here to assist. Have a wonderful day! 😊",
      sources: [
        { title: "Contact Us", url: "/contact", category: "Contact", type: "page" },
      ],
      type: "courtesy",
    };
  }

  // 2. Greetings
  if (
    /\b(hi|hello|hey|namaste|greetings|good\s+(morning|afternoon|evening|day)|kaise ho|kya haal hai|wassup|kya chal raha hai)\b/i.test(q)
  ) {
    return {
      reply: hinglish
        ? `Namaste! 👋 Main Kraviona ka official AI Assistant hoon.\n\nKraviona ek **AI-First Technology & Digital Solutions Company** hai ("Intelligence Meets Innovation"). Main aapko in 5 core verticals par direct guidance de sakta hoon:\n\n• **01. IT & Technology Services**: Next.js 15, React 19, Node.js, Python, MERN & Mobile Apps\n• **02. AI & Automation Solutions**: Autonomous AI Agents, RAG knowledge bots, IDP & n8n workflows\n• **03. SaaS & Software Products**: Rapid AI MVPs (4-8 weeks), multi-tenant SaaS & Stripe billing\n• **04. E-commerce Solutions**: AI storefronts, Headless Shopify, Amazon/Flipkart seller operations\n• **05. Digital Marketing & Technical SEO**: < 1.8s LCP Core Web Vitals, AEO (Perplexity/ChatGPT) & GEO\n\nAap kis solution ya project ke baare mein jaanna chahte hain?`
        : `Hello! 👋 I'm Kraviona's official AI Assistant.\n\nKraviona is an **AI-First Technology & Digital Solutions Company** ("Intelligence Meets Innovation") headquartered in East Delhi, India. I can assist you across our 5 core pillars:\n\n• **01. IT & Technology Services**: High-performance Next.js 15, React 19, Node.js, Python backends, and cross-platform mobile apps\n• **02. AI & Automation Solutions** *(Flagship Focus)*: Autonomous cognitive AI agents, enterprise RAG knowledge bases, and multi-step workflows\n• **03. SaaS & Software Products**: Rapid 4–8 week AI MVPs, cloud architectures, and multi-tenant platforms\n• **04. E-commerce Solutions**: AI-powered Next.js storefronts, Headless Shopify, and Amazon/Flipkart seller management\n• **05. Digital Marketing & Technical SEO**: Guaranteed Core Web Vitals (< 1.8s LCP), AEO, and Generative Engine Optimization (GEO)\n\nHow can I help engineer your next build?`,
      sources: [
        { title: "Services Directory", url: "/services", category: "Services", type: "page" },
        { title: "AI Solutions", url: "/solutions", category: "AI Solutions", type: "page" },
        { title: "Case Studies", url: "/case-studies", category: "Portfolio", type: "page" },
      ],
      type: "greeting",
    };
  }

  // 3. Founder & Leadership (Amar Kumar)
  if (/\b(founder|ceo|amar kumar|amar|lead engineer|owner|kiska company|kraviona kiski hai|who founded)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `**Amar Kumar** Kraviona ke Founder aur Lead Systems Engineer hain.\n\n• **Role**: Full-stack architect & AI systems engineer jo direct technical discovery, custom software delivery aur AI agent pipelines lead karte hain.\n• **Expertise**: Next.js App Router, MERN stack, Python microservices, Autonomous AI Agents, Technical SEO aur Generative Engine Optimization (GEO).\n• **Direct Connect**: Aap Amar Kumar se discovery call schedule kar sakte hain: [Amar Kumar Author Profile](/authors/amar-kumar) ya call karein [+91 96085 53167](tel:+919608553167).`
        : `**Amar Kumar** is the Founder & Lead Systems Engineer at Kraviona.\n\n• **Background**: Hands-on systems engineer specializing in AI-first architectures, scalable Next.js and MERN web applications, enterprise microservices, and Generative Engine Optimization (GEO).\n• **Approach**: Every project undergoes founder-led technical discovery to ensure clean architectural specifications and high engineering rigor.\n• **Connect**: Learn more on [Amar Kumar's Profile](/authors/amar-kumar) or schedule a technical discovery call via our [Contact Page](/contact).`,
      sources: [
        { title: "Founder Profile", url: "/authors/amar-kumar", category: "Team", type: "page" },
        { title: "About Us", url: "/about", category: "Company", type: "page" },
      ],
      type: "intent-founder",
    };
  }

  // 4. About Kraviona / Company Identity
  if (/\b(who are you|what is kraviona|kraviona kya hai|about kraviona|about us|company overview|kya company hai)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `**Kraviona** ek modern **AI-First Technology & Digital Solutions Company** hai ("Intelligence Meets Innovation"), jiska headquarters **East Delhi, Delhi NCR, India** mein sthit hai.\n\nHum high-performance software engineering, autonomous AI agents, enterprise SaaS platforms, aur Technical SEO systems engineer karte hain. Hum India ke saath-saath US, UK, UAE aur Australia ke clients ke saath agile remote workflows se deliver karte hain.\n\n• **Core Verticals**: IT & Tech Services, AI & Automation, SaaS Products, E-commerce, aur Digital Marketing.\n• **Founder**: Amar Kumar (Lead Systems Engineer)\n• **Headquarters**: East Delhi, Delhi 110092\n• **Direct Contact**: [hello@kraviona.com](mailto:hello@kraviona.com) | [+91 96085 53167](tel:+919608553167)`
        : `**Kraviona** is an **AI-First Technology & Digital Solutions Company** ("Intelligence Meets Innovation") headquartered in East Delhi, Delhi NCR, India.\n\nWe engineer custom software, autonomous AI agent pipelines, multi-tenant cloud SaaS platforms, and Technical SEO/GEO architectures for modern startups and growing enterprises worldwide.\n\n• **Headquarters**: East Delhi, Delhi 110092, India\n• **Leadership**: Amar Kumar (Founder & Lead Systems Engineer)\n• **5 Core Verticals**: IT Engineering, AI & Automation, SaaS Platforms, E-commerce, and Technical SEO\n• **Explore**: [About Us](/about) | [Services Directory](/services) | [Contact](/contact)`,
      sources: [
        { title: "About Us", url: "/about", category: "Company", type: "page" },
        { title: "Services Directory", url: "/services", category: "Services", type: "page" },
      ],
      type: "intent-about",
    };
  }

  // 5. Tech Stack & Technologies Used
  if (/\b(tech stack|technologies|what tools|tools you use|stack kya hai|technology stack|programming languages|kaunsi technology|kis technology)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Kraviona production-grade, modern open-source aur cloud technologies par systems build karta hai:\n\n• **Frontend**: Next.js 15 (App Router, Server Actions), React 19, TypeScript, Tailwind CSS\n• **Backend & APIs**: Node.js, Express.js, Python (FastAPI, Django), RESTful APIs, GraphQL\n• **Databases**: MongoDB, PostgreSQL, Redis (Caching), Pinecone (Vector Embeddings)\n• **Mobile**: React Native, Flutter (iOS & Android cross-platform), Progressive Web Apps (PWA)\n• **AI & Automation**: Autonomous Agents, LangChain, LlamaIndex, n8n, OpenAI, Gemini, Claude, IDP/OCR\n• **DevOps & Cloud**: Docker, AWS (ECS, S3, RDS), Cloudflare, Vercel, GitHub Actions CI/CD\n• **SEO & Performance**: Core Web Vitals optimization (< 1.8s LCP), Schema.org JSON-LD, AEO/GEO\n\nKisi specific stack requirement par discuss karne ke liye: [Contact Us](/contact).`
        : `Kraviona's production engineering stack is built for high speed, strict type safety, and seamless AI integration:\n\n• **Frontend**: Next.js 15 (App Router, Server Components), React 19, TypeScript, Tailwind CSS\n• **Backend & Microservices**: Node.js, Express.js, Python (FastAPI, Django), RESTful & GraphQL APIs\n• **Data Layer**: MongoDB, PostgreSQL, Redis caching, Pinecone vector database\n• **Mobile Engineering**: React Native, Flutter (iOS & Android native parity), PWAs\n• **AI & Automation**: Autonomous AI Agents, LangChain, n8n orchestration, OpenAI/Gemini/Claude integrations, RAG\n• **Cloud & DevOps**: AWS, Docker containers, Cloudflare edge, CI/CD automated deployments\n• **Performance Standards**: Guaranteed Core Web Vitals compliance (< 1.8s LCP, 90+ Mobile PageSpeed)\n\nReview our engineering practices on our [Services Hub](/services).`,
      sources: [
        { title: "IT Services", url: "/services/web-development", category: "Services", type: "page" },
        { title: "AI Solutions", url: "/solutions", category: "AI Solutions", type: "page" },
      ],
      type: "intent-tech-stack",
    };
  }

  // 6. Mobile App Development (Android, iOS, Flutter, React Native)
  if (/\b(mobile app|app development|android|ios|flutter|react native|pwa|mobile application|phone app)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Haan! Kraviona high-performance cross-platform mobile apps develop karta hai:\n\n• **React Native & Flutter**: Single clean codebase se iOS aur Android dono ke liye native-speed mobile applications.\n• **Features**: Offline data synchronization, push notifications, biometric auth, secure REST/GraphQL API integration aur payment gateways.\n• **Progressive Web Apps (PWA)**: App-like mobile experience bina App Store friction ke.\n• **AI Integrations**: Mobile apps mein AI chatbots, computer vision aur intelligent workflows integrate karna.\n\nApna mobile app project discuss karne ke liye: [Contact Kraviona](/contact) ya Call/WhatsApp [+91 96085 53167](tel:+919608553167).`
        : `Yes! Kraviona engineers enterprise-grade cross-platform mobile applications for iOS and Android:\n\n• **Frameworks**: React Native and Flutter for native-performance execution from a single maintainable codebase\n• **Capabilities**: Offline-first local storage, biometric security, push notifications, real-time WebSockets, and seamless payment gateway integrations\n• **Progressive Web Apps (PWAs)**: Fast, installable, responsive web experiences optimized for mobile browsers\n• **AI-Powered Mobile Features**: Integrating local on-device ML or cloud RAG/chat endpoints into mobile flows\n\nSchedule a mobile discovery consultation on our [Contact Page](/contact) or call [+91 96085 53167](tel:+919608553167).`,
      sources: [
        { title: "Custom Web & Mobile Apps", url: "/services/web-app-development", category: "Services", type: "page" },
        { title: "Contact Us", url: "/contact", category: "Contact", type: "page" },
      ],
      type: "intent-mobile",
    };
  }

  // 7. Python, Django, FastAPI & Backend Microservices
  if (/\b(python|django|fastapi|backend dev|backend development|api development|microservices|rest api|graphql)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Haan, Kraviona **Python (FastAPI, Django)** aur **Node.js** par mission-critical backend microservices aur APIs engineer karta hai:\n\n• **FastAPI**: Ultra-fast asynchronous microservices AI models, agent orchestration aur real-time data processing ke liye.\n• **Django**: Complex enterprise data models, admin portals aur secure authentication ke liye.\n• **Node.js & Express**: High-throughput event-driven microservices aur streaming APIs.\n• **Security & Standards**: JWT/OAuth2 authentication, rate limiting, Swagger/OpenAPI documentation, aur Redis caching.\n\nExplore karein: [Backend & API Development](/services/backend-development) ya connect karein: [Contact](/contact).`
        : `Yes, Kraviona specializes in Python (FastAPI, Django) and Node.js backend engineering:\n\n• **FastAPI**: Asynchronous, high-throughput microservices designed for AI tool calling, data processing, and streaming endpoints\n• **Django**: Robust enterprise software backends with complex relational models and automated administrative tooling\n• **Node.js & Express**: Event-driven microservices architected for low-latency JSON handling\n• **Security & Architecture**: JWT/OAuth2 RBAC, Redis caching, rate limiting, and automated OpenAPI contracts\n\nExplore our backend engineering capabilities on our [Backend Services Page](/services/backend-development).`,
      sources: [
        { title: "Backend Development", url: "/services/backend-development", category: "Services", type: "page" },
        { title: "API Development", url: "/services/api-development", category: "Services", type: "page" },
      ],
      type: "intent-python-backend",
    };
  }

  // 8. Database Architecture & Optimization
  if (/\b(database|database architecture|mongodb|postgresql|postgres|redis|pinecone|vector database|sql|nosql)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Kraviona enterprise-grade database architectures aur data layers design karta hai:\n\n• **MongoDB & PostgreSQL**: Relational (ACID) aur Document data models, automated schema migrations, aur query optimization.\n• **Redis**: In-memory distributed caching, token session stores, aur rate limiting layers.\n• **Pinecone & Vector Databases**: Vector embeddings storage, hybrid semantic search, aur RAG pipelines.\n• **Performance Guarantee**: Microsecond query response time, zero deadlock indexes, aur high-availability replication.\n\nExplore karein: [Database Architecture](/services/database-architecture) ya [Contact Us](/contact).`
        : `Kraviona engineers resilient, zero-latency database architectures:\n\n• **PostgreSQL & MongoDB**: Production schema modeling, ACID transactions, complex indexing, and zero-downtime migrations\n• **Redis In-Memory Caching**: High-throughput distributed cache, session management, and pub/sub message brokers\n• **Pinecone & Vector Data**: High-dimensional vector storage, hybrid search, and semantic embeddings for enterprise RAG\n• **Reliability**: Connection pooling, automated failovers, and multi-region read replicas\n\nLearn more on our [Database Architecture Page](/services/database-architecture).`,
      sources: [
        { title: "Database Architecture", url: "/services/database-architecture", category: "Services", type: "page" },
      ],
      type: "intent-database",
    };
  }

  // 9. AI Agents, Autonomous Automation & n8n / LangChain
  if (/\b(ai agent|ai agents|autonomous agent|autonomous agents|agentic|workflow automation|n8n|langchain|llamaindex|ai automation)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `AI & Automation Kraviona ka strategic flagship vertical hai! Hum production-ready autonomous systems engineer karte hain:\n\n• **Autonomous AI Agents**: Multi-step reasoning loops jo self-correct karte hain aur external APIs/tools autonomously trigger karte hain.\n• **Workflow Orchestration**: n8n, LangChain aur Python microservices se complex business processes ko automate karna (ERP, CRM, email pipelines).\n• **Intelligent Document Processing (IDP)**: OCR, automated invoice extraction, aur unstructured PDF data structuring.\n• **Zero Hallucination**: Guardrails aur human-in-the-loop escalation systems.\n\nLive demo ya scoping ke liye connect karein: [AI & Automation Solutions](/services/ai-automation) ya [Contact Us](/contact).`
        : `AI & Automation is Kraviona's strategic flagship focus! We engineer production-grade autonomous agent systems:\n\n• **Autonomous Cognitive AI Agents**: Multi-step reasoning pipelines that execute complex tasks, invoke tool APIs, and adapt autonomously\n• **Workflow Orchestration**: Custom automation pipelines built with n8n, LangChain, and Python connecting ERPs, CRMs, and email hubs\n• **Intelligent Document Processing (IDP)**: Automated OCR parsing, invoice data extraction, and document categorization\n• **Enterprise Guardrails**: Strict boundary controls, deterministic schema outputs, and human-in-the-loop escalations\n\nExplore our solutions on the [AI & Automation Hub](/services/ai-automation) or book a consultation on our [Contact Page](/contact).`,
      sources: [
        { title: "AI Automation & Agents", url: "/services/ai-automation", category: "AI", type: "page" },
        { title: "AI Chatbots & RAG", url: "/services/ai-chatbot-development", category: "AI", type: "page" },
      ],
      type: "intent-ai",
    };
  }

  // 10. AI Chatbots & Enterprise RAG Systems
  if (/\b(ai chatbot|chatbot|chatbots|rag|retrieval augmented generation|custom chatbot|whatsapp bot)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Kraviona context-aware, enterprise-grade AI Chatbots aur RAG systems build karta hai:\n\n• **Enterprise RAG**: Aapke internal SOPs, PDFs, Notion docs, aur product catalogs par trained private AI knowledge base (Zero Hallucination).\n• **Multi-Channel**: Website widget, WhatsApp Business API, Slack, aur CRM integration.\n• **Lead Generation**: 24/7 visitor engagement, query resolution, aur qualified lead capture.\n• **Multi-Language**: English, Hindi, Hinglish aur 50+ languages natively supported.\n\nAur jaankari ke liye visit karein: [AI Chatbot Development](/services/ai-chatbot-development) ya transparent pricing dekhein: [Pricing](/pricing).`
        : `Kraviona engineers context-aware, enterprise-grade AI Chatbots and RAG knowledge assistants:\n\n• **Enterprise RAG (Retrieval-Augmented Generation)**: Grounded in your proprietary documentation, catalogs, and databases with zero hallucination\n• **Omnichannel Deployment**: Seamless deployment across Web, WhatsApp Business API, Slack, and internal tooling\n• **24/7 Lead Capture**: Automatically qualifies inbound prospects and forwards leads directly to your CRM or email\n• **Multilingual Native Support**: Fluent in English, Hindi, Hinglish, and over 50 global languages\n\nExplore details on our [AI Chatbot Development Page](/services/ai-chatbot-development) or view our [Pricing Plans](/pricing).`,
      sources: [
        { title: "AI Chatbot Development", url: "/services/ai-chatbot-development", category: "AI", type: "page" },
        { title: "Pricing & Plans", url: "/pricing", category: "Pricing", type: "page" },
      ],
      type: "intent-ai-chatbot",
    };
  }

  // 11. E-commerce Storefronts & Headless Commerce
  if (/\b(ecommerce|e-commerce|shopify|headless commerce|online store|online dukaan|woocommerce|store development)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Kraviona high-converting, AI-powered e-commerce storefronts engineer karta hai:\n\n• **Custom Next.js Storefronts**: Sub-second page loads, headless architectures, dynamic product catalogs aur seamless checkout.\n• **Shopify & Headless Shopify**: Custom Shopify liquid themes ya Next.js + Shopify Storefront API integrations.\n• **Conversion Optimization**: AI recommendations, 1-click checkout, automated order tracking, aur payment gateways (Razorpay, Stripe, Cashfree).\n• **Marketplace Sync**: Storefront inventory ko Amazon aur Flipkart se automatically sync karna.\n\nApna e-commerce build shuru karein: [E-Commerce Development](/services/ecommerce-development-marketing) ya direct call karein [+91 96085 53167](tel:+919608553167).`
        : `Kraviona engineers high-converting, AI-native e-commerce storefronts:\n\n• **Next.js AI Storefronts**: Sub-second rendering, dynamic product filtering, and instant edge checkout\n• **Headless Shopify**: Decoupled Next.js frontends powered by the Shopify Storefront API for maximum flexibility and PageSpeed\n• **Full Checkout & Payment Integration**: Seamless support for Stripe, Razorpay, Cashfree, and automated tax calculation\n• **Omnichannel Sync**: Live inventory synchronization between your website, Amazon, and Flipkart\n\nLearn more on our [E-Commerce Development Page](/services/ecommerce-development-marketing) or contact us for a proposal on our [Contact Page](/contact).`,
      sources: [
        { title: "AI E-Commerce Development", url: "/services/ecommerce-development-marketing", category: "E-Commerce", type: "page" },
        { title: "Contact Us", url: "/contact", category: "Contact", type: "page" },
      ],
      type: "intent-ecommerce",
    };
  }

  // 12. Amazon & Flipkart Marketplace Operations
  if (/\b(amazon|flipkart|marketplace|seller account|cataloging|flat file|reconciliation|seller training|accounting)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Kraviona Amazon aur Flipkart sellers ke liye end-to-end operational management provide karta hai:\n\n• **Account Operations**: Seller Central / Hub onboarding, policy compliance, buy-box health, aur brand registry.\n• **AI Cataloging**: Error-free bulk flat-file uploads, A+ content, bullet points, aur SEO keyword indexing.\n• **Financial Reconciliation**: Marketplace fee overcharges, return leakages, weight discrepancies, aur payment settlement audits.\n• **Advertising & ROAS**: Sponsored Ads, brand campaigns, aur ROAS optimization.\n\nExplore karein: [Account Management](/services/account-management) | [Cataloging](/services/cataloging) | [Reconciliation](/services/accounting).`
        : `Kraviona provides comprehensive marketplace operations for Amazon and Flipkart sellers:\n\n• **Account Health & Management**: Onboarding, Buy Box optimization, Brand Registry, and policy compliance\n• **AI-Assisted Cataloging**: Flat-file batch uploads, category mapping, A+ Content, and keyword-rich listings\n• **Financial Reconciliation**: Recovering revenue leakages from weight discrepancies, return anomalies, and fee overcharges\n• **Advertising & ROAS**: Precision PPC campaigns designed to maximize return on ad spend\n\nExplore our marketplace services: [Account Operations](/services/account-management) and [Financial Reconciliation](/services/accounting).`,
      sources: [
        { title: "E-Commerce Account Operations", url: "/services/account-management", category: "E-Commerce", type: "page" },
        { title: "E-Commerce Financial Reconciliation", url: "/services/accounting", category: "E-Commerce", type: "page" },
      ],
      type: "intent-marketplace",
    };
  }

  // 13. Technical SEO, Core Web Vitals, AEO & GEO
  if (/\b(seo|technical seo|aeo|geo|ranking|google ranking|core web vitals|page speed|speed|lcp|inp|cls|answer engine|generative engine)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Kraviona dual-engine search visibility provide karta hai: Traditional Google Search (SEO) + AI Answer Engines (AEO / GEO):\n\n• **Core Web Vitals Speed**: Sub-second rendering (< 1.8s LCP), 90+ mobile PageSpeed scores, zero layout shift (CLS < 0.05).\n• **Answer Engine Optimization (AEO)**: Perplexity aur ChatGPT Search ke direct citations ke liye data structuring.\n• **Generative Engine Optimization (GEO)**: Google AI Overviews aur multimodal search ke liye Schema graph indexing.\n• **Technical Crawl Hygiene**: Zero crawl waste, automated canonicals, XML sitemaps, aur /llms.txt context file.\n\nApni site ka SEO audit karwane ke liye visit karein: [Technical SEO & GEO Services](/services/technical-seo).`
        : `Kraviona delivers dual-engine search optimization: traditional Google rankings (Technical SEO) alongside AI Answer Engine citations (AEO & GEO):\n\n• **Core Web Vitals Performance**: Guaranteed sub-second LCP (< 1.8s) and 90+ mobile PageSpeed scores\n• **Answer Engine Optimization (AEO)**: Structured content formatted for direct citations in Perplexity, ChatGPT Search, and Gemini\n• **Generative Engine Optimization (GEO)**: Entity graph linking for Google AI Overviews\n• **Crawl Architecture**: Canonical hygiene, XML sitemaps, and /llms.txt context indexing to maximize search crawl budget\n\nExplore our technical search services on the [Technical SEO & GEO Page](/services/technical-seo).`,
      sources: [
        { title: "Technical SEO, AEO & GEO", url: "/services/technical-seo", category: "SEO", type: "page" },
        { title: "Web Performance Optimization", url: "/services/web-performance-optimization", category: "Performance", type: "page" },
      ],
      type: "intent-seo",
    };
  }

  // 14. SaaS Development & Rapid AI MVPs
  if (/\b(saas|software product|mvp|ai mvp|multi tenant|stripe billing|subscription|saas kaise banaye)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Kraviona cloud SaaS products aur rapid AI MVPs develop karta hai:\n\n• **Rapid MVP Sprint**: 4 se 8 weeks mein functional, market-ready AI SaaS product build karna.\n• **Multi-Tenant Architecture**: Robust tenant data isolation, subdomains, aur row-level security.\n• **Subscription Billing**: Stripe / Razorpay recurring billing, webhooks, tiers, aur invoice generation.\n• **Enterprise Security**: Role-based access control (RBAC), audit logging, aur GDPR/data compliance.\n\nApna SaaS idea discuss karne ke liye: [SaaS Development](/services/saas-development) ya [Contact Us](/contact).`
        : `Kraviona engineers full-lifecycle cloud SaaS products and rapid AI MVPs:\n\n• **Rapid AI MVP Delivery**: Production-ready, validated MVPs launched in 4 to 8 weeks\n• **Multi-Tenant Architecture**: Strict database data isolation, custom subdomains, and row-level security\n• **Subscription Billing Engine**: Integrated Stripe/Razorpay recurring billing, usage-based metering, and tiered plans\n• **Enterprise Security**: Role-Based Access Control (RBAC), JWT sessions, and audit logging\n\nExplore our SaaS capabilities on our [SaaS Development Page](/services/saas-development).`,
      sources: [
        { title: "SaaS Development", url: "/services/saas-development", category: "Services", type: "page" },
        { title: "Pricing & Plans", url: "/pricing", category: "Pricing", type: "page" },
      ],
      type: "intent-saas",
    };
  }

  // 15. Pricing, Rates & Estimates
  if (/\b(price|pricing|cost|charge|charges|rate|rates|fee|fees|kitna kharcha|kitna lagega|budget|paisa|package|packages|how much)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Kraviona transparent aur value-driven pricing models offer karta hai:\n\n• **Milestone-Based Project Sprints**: Custom software, web apps aur SaaS builds ke liye fixed transparent milestone quotes (Zero hidden costs).\n• **Rapid AI SaaS MVPs**: 4–8 week accelerated delivery plans.\n• **Autonomous AI Agents & Workflows**: Scoped based on model complexity, tool calling, aur RAG index size.\n• **Monthly Retainers**: Dedicated Technical SEO, continuous performance monitoring, aur ongoing engineering support.\n• **Free Discovery Call**: Free 30-minute consultation jismein complete technical scope aur timeline provide ki jaati hai.\n\nDetailed pricing plans dekhne ke liye visit karein: [Kraviona Pricing](/pricing) ya tailored quotation ke liye [Contact Karein](/contact).`
        : `Kraviona offers transparent, milestone-driven pricing with zero hidden fees:\n\n• **Fixed Milestone Sprints**: Predictable, phased budgets for custom software development, Next.js web applications, and portals\n• **Rapid AI SaaS MVPs**: 4 to 8 week accelerated delivery packages designed for early-stage founders\n• **Autonomous AI & RAG Systems**: Transparently scoped based on agent reasoning loops, tool-calling APIs, and knowledge base scale\n• **Monthly Retainers**: Structured retainers for ongoing Technical SEO, performance optimization, and systems maintenance\n• **Free Technical Discovery**: Free 30-minute discovery call to evaluate your exact specifications\n\nReview our transparent models on the [Pricing Page](/pricing) or request a tailored estimate on our [Contact Form](/contact).`,
      sources: [
        { title: "Transparent Pricing", url: "/pricing", category: "Pricing", type: "page" },
        { title: "Contact for Quote", url: "/contact", category: "Contact", type: "page" },
      ],
      type: "intent-pricing",
    };
  }

  // 16. Web Development, MERN & Next.js Website Build
  if (/\b(web dev|web development|nextjs|next\.js|react|mern|website|web app|custom software|software development|build website|banwana|banwani)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Kraviona custom software aur modern web applications engineer karta hai using Next.js 15, React 19, Node.js, Python aur scalable databases:\n\n• **High Performance**: Sub-second page loads (< 1.8s LCP) aur 90+ mobile Google PageSpeed scores.\n• **Security & Architecture**: Enterprise RBAC, JWT auth, clean API contracts, aur zero technical debt.\n• **AI Ready**: Modular architecture jo autonomous AI agents aur LLM workflows ke saath easily integrate hoti hai.\n• **Full Stack Delivery**: UI/UX Figma design se lekar cloud AWS/Docker deployment tak complete ownership.\n\nApna project discuss karne ke liye connect karein: [Contact Page](/contact) ya Call/WhatsApp [+91 96085 53167](tel:+919608553167).`
        : `Kraviona engineers high-performance web systems and custom software using Next.js 15, React 19, Node.js, Python, and scalable databases:\n\n• **Speed & SEO**: Built on Next.js Server Components for sub-second rendering (< 1.8s LCP) and 90+ mobile PageSpeed scores\n• **Enterprise Reliability**: Clean modular architecture, TypeScript type safety, and robust authentication (RBAC)\n• **AI Native**: Built from day one to connect with autonomous agents, LLM pipelines, and vector search\n• **End-to-End Ownership**: From Figma UI/UX design to cloud deployment on AWS/Docker\n\nSchedule a project consultation on our [Contact Page](/contact) or call [+91 96085 53167](tel:+919608553167).`,
      sources: [
        { title: "IT Services", url: "/services/web-development", category: "Services", type: "page" },
        { title: "Custom Web Applications", url: "/services/web-app-development", category: "Services", type: "page" },
      ],
      type: "intent-webdev",
    };
  }

  // 17. Contact Details, Phone, WhatsApp, Email
  if (/\b(contact|phone|number|email|call|whatsapp|reach|sampark|touch|baat karni hai|kaise mile)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Aap Kraviona ki engineering team se directly connect kar sakte hain:\n\n• **Phone / WhatsApp**: [+91 96085 53167](tel:+919608553167) *(Immediate Response)*\n• **Official Email**: [hello@kraviona.com](mailto:hello@kraviona.com)\n• **Headquarters**: East Delhi, Delhi NCR, India (PIN 110092)\n• **Online Discovery Call**: [Contact Page Par Requirement Share Karein](/contact)\n• **Response Time**: Usually 1 business day ke andar customized technical response milta hai.`
        : `You can reach Kraviona's engineering team directly through:\n\n• **Phone / WhatsApp**: [+91 96085 53167](tel:+919608553167)\n• **Official Email**: [hello@kraviona.com](mailto:hello@kraviona.com)\n• **Headquarters**: East Delhi, Delhi NCR, India (PIN 110092)\n• **Discovery Consultation**: Free 30-minute technical session booked via our [Contact Form](/contact)\n\nOur engineering leads typically reply within 1 business day with a customized technical scope.`,
      sources: [
        { title: "Contact Kraviona", url: "/contact", category: "Contact", type: "page" },
      ],
      type: "intent-contact",
    };
  }

  // 18. Location & Office
  if (/\b(location|address|where|kahan|office|delhi|headquarters|sthit)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Kraviona ka primary headquarters **East Delhi, Delhi NCR, India (PIN 110092)** mein sthit hai.\n\nHum poore India ke saath-saath international clients (US, UK, UAE, Australia) ke saath modern agile remote engineering workflows aur dedicated project sprints se collaborate karte hain.\n\nDirect sampark karein: [Contact Us](/contact) ya Call/WhatsApp [+91 96085 53167](tel:+919608553167).`
        : `Kraviona is headquartered in **East Delhi, Delhi NCR, India (PIN 110092)**.\n\nWe collaborate with clients across India and internationally (US, UK, UAE, Australia) through agile remote workflows and dedicated project delivery sprints.\n\nGet in touch via [hello@kraviona.com](mailto:hello@kraviona.com) or schedule a consultation on our [Contact Page](/contact).`,
      sources: [
        { title: "Contact Us", url: "/contact", category: "Contact", type: "page" },
      ],
      type: "intent-location",
    };
  }

  // 19. Portfolio & Case Studies
  if (/\b(portfolio|case studies|case study|projects|past work|clients|samples|previous work|kya banaya)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Aap Kraviona ke real-world production engineering case studies aur software implementations dekh sakte hain:\n\n• **Verified Case Studies**: Architectural transformations, autonomous AI agents aur SEO scale-ups — [Case Studies Page Par Jaayein](/case-studies)\n• **Software Portfolio Gallery**: UI/UX designs aur live applications — [Gallery Page](/gallery)\n\nKisi specific live demonstration ke baare mein baat karne ke liye: [Contact Us](/contact).`
        : `Explore real-world client implementations, architectural transformations, autonomous AI pipelines, and verified SEO results engineered by Kraviona:\n\n• **All Case Studies**: [Explore Client Case Studies](/case-studies)\n• **Software Portfolio Gallery**: [Browse Visual Gallery](/gallery)\n\nInterested in a similar high-performance build? Connect with us on our [Contact Page](/contact).`,
      sources: [
        { title: "Case Studies", url: "/case-studies", category: "Portfolio", type: "page" },
      ],
      type: "intent-portfolio",
    };
  }

  // 20. Process, Timeline & Methodology
  if (/\b(process|workflow|how do you work|kaise kaam karte ho|timeline|kitna time lagta hai|steps|methodology)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Kraviona ka engineering workflow 4 clear, transparent stages mein operate karta hai:\n\n1. **Discovery & Architecture (Days 1–3)**: Founder-led requirement scoping, data modeling, aur API contract definitions.\n2. **UI/UX & Wireframing (Week 1)**: Interactive Figma prototypes aur component design systems.\n3. **Agile Milestone Sprints (Weeks 2–6)**: Staging preview links ke saath weekly checkpoints aur active progress demos.\n4. **QA, Security & Production Launch**: Sub-second Core Web Vitals optimization, penetration test, production deploy, plus **30 days post-launch warranty**.\n\nApna project start karne ke liye: [Schedule a Discovery Call](/contact).`
        : `Kraviona follows a transparent 4-stage engineering methodology:\n\n1. **Technical Discovery & Architecture (Days 1–3)**: Founder-led technical scoping, database schema design, and API contract specifications.\n2. **UI/UX & Component Systems (Week 1)**: Interactive Figma design prototypes and design tokens.\n3. **Agile Milestone Sprints (Weeks 2–6)**: Weekly deliverables with live staging previews for continuous client visibility.\n4. **Benchmarking & Production Deployment**: Core Web Vitals auditing (< 1.8s LCP), security verification, production cloud deploy, plus **30 days of post-launch warranty support**.\n\nSchedule a discovery session on our [Contact Page](/contact).`,
      sources: [
        { title: "Services Directory", url: "/services", category: "Services", type: "page" },
      ],
      type: "intent-process",
    };
  }

  // 21. Code Ownership & NDA
  if (/\b(code ownership|ownership|ip rights|nda|confidentiality|intellectual property|security|guarantee)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Kraviona mein aapke project ki security aur intellectual property 100% protected hai:\n\n• **100% Client Code Ownership**: Milestone completion par saara source code, repositories, database schemas aur assets 100% aapke naam transfer hote hain.\n• **Mutual NDA**: Project shuru hone se pehle mutual Non-Disclosure Agreement (NDA) sign hota hai.\n• **Zero Vendor Lock-in**: Clean, modular, well-documented code jisko aapki in-house team kabhi bhi independently maintain kar sakti hai.\n\nPolicy details ke liye visit karein: [Terms & Conditions](/terms).`
        : `At Kraviona, your intellectual property and project security are strictly protected:\n\n• **100% Client Code Ownership**: All source code, database architectures, and digital assets belong 100% to you upon milestone delivery\n• **Mutual NDA Protection**: We sign a standard mutual Non-Disclosure Agreement before discussing proprietary technical details\n• **Zero Vendor Lock-in**: Codebases are documented, strictly typed (TypeScript), and architected for easy in-house handoff\n\nReview our standards on our [Terms Page](/terms).`,
      sources: [
        { title: "Terms & Conditions", url: "/terms", category: "Legal", type: "page" },
      ],
      type: "intent-security",
    };
  }

  // 22. General Services Overview
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
