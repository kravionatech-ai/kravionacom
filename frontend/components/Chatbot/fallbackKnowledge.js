// Instant Verified Knowledge & Reasoning Engine for Kraviona AI Assistant
// Ensures 100% uptime, factual accuracy, and high-precision answers in English, Hindi & Hinglish.

const HINGLISH_PATTERNS = [
  "kya", "kaise", "hai", "hain", "karna", "mujhe", "chahiye", "batao",
  "kaha", "kahan", "kaun", "kare", "sakta", "sakte", "mera", "meri",
  "banao", "banwana", "banwani", "kharidna", "rate", "paisa", "kitna",
  "namaste", "dhanyawad", "shukriya", "madad", "sampark", "kaam", "theek",
  "bhai", "karo", "do", "dena", "lagta", "kharcha", "aap", "hum", "chalta",
  "hoga", "hogi", "bataiye", "seekhna", "sikhao", "dikhao"
];

export const isHindiOrHinglish = (text = "") => {
  if (/[\u0900-\u097F]/.test(text)) return true;
  const words = text.toLowerCase().split(/\s+/);
  return words.some((w) => HINGLISH_PATTERNS.includes(w));
};

export const getFallbackChatResponse = (query = "", pageContext = null) => {
  const q = String(query).toLowerCase().trim();
  const hinglish = isHindiOrHinglish(q);

  // 1. Courtesy, Thanks & Goodbye
  if (/\b(thank(s|\s+you)?|dhanyawad|shukriya|bye|goodbye|alvida|ok|okay|theek\s+hai|thik\s+hai|great|awesome|badhiya|shandar)\b/i.test(q)) {
    return {
      reply: hinglish
        ? "Aapka bahut-bahut swagat hai! 🙏 Agar aapko koi aur technical sawal ho ya apna software/AI project discuss karna ho, Kraviona team hamesha madad ke liye tayyar hai. Call/WhatsApp: [+91 96085 53167](tel:+919608553167). Aapka din shubh rahe!"
        : "You're very welcome! If you need any more technical information, architectural guidance, or want to explore an AI or software project, Kraviona is always here to assist. Have a wonderful day! 😊",
      sources: [{ title: "Contact Kraviona", url: "/contact", category: "Contact" }],
      type: "courtesy",
    };
  }

  // 2. Greetings
  if (/\b(hi|hello|hey|namaste|greetings|good\s+(morning|afternoon|evening|day)|kaise ho|kya haal hai|wassup|kya chal raha hai)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Namaste! 👋 Main Kraviona ka official AI Assistant hoon.\n\nKraviona ek **AI-First Technology & Digital Solutions Company** hai ("Intelligence Meets Innovation"). Main aapko in 5 core verticals par direct guidance de sakta hoon:\n\n• **01. IT & Technology Services**: Next.js 15, React 19, Node.js, Python, MERN & Mobile Apps\n• **02. AI & Automation Solutions**: Autonomous AI Agents, RAG knowledge bots, IDP & n8n workflows\n• **03. SaaS & Software Products**: Rapid AI MVPs (4-8 weeks), multi-tenant SaaS & Stripe billing\n• **04. E-commerce Solutions**: AI storefronts, Headless Shopify, Amazon/Flipkart seller operations\n• **05. Digital Marketing & Technical SEO**: < 1.8s LCP Core Web Vitals, AEO (Perplexity/ChatGPT) & GEO\n\nAap kis solution ya project ke baare mein jaanna chahte hain?`
        : `Hello! 👋 I'm Kraviona's official AI Assistant.\n\nKraviona is an **AI-First Technology & Digital Solutions Company** ("Intelligence Meets Innovation") headquartered in East Delhi, India. I can assist you across our 5 core pillars:\n\n• **01. IT & Technology Services**: High-performance Next.js 15, React 19, Node.js, Python backends, and cross-platform mobile apps\n• **02. AI & Automation Solutions** *(Flagship Focus)*: Autonomous cognitive AI agents, enterprise RAG knowledge bases, and multi-step workflows\n• **03. SaaS & Software Products**: Rapid 4–8 week AI MVPs, cloud architectures, and multi-tenant platforms\n• **04. E-commerce Solutions**: AI-powered Next.js storefronts, Headless Shopify, and Amazon/Flipkart seller management\n• **05. Digital Marketing & Technical SEO**: Guaranteed Core Web Vitals (< 1.8s LCP), AEO, and Generative Engine Optimization (GEO)\n\nHow can I help engineer your next build?`,
      sources: [
        { title: "Services Directory", url: "/services", category: "Services" },
        { title: "AI Solutions", url: "/solutions", category: "AI Solutions" },
        { title: "Case Studies", url: "/case-studies", category: "Portfolio" },
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
        { title: "Founder Profile", url: "/authors/amar-kumar", category: "Team" },
        { title: "About Kraviona", url: "/about", category: "Company" },
      ],
      type: "founder",
    };
  }

  // 4. About Kraviona / Company Identity
  if (/\b(who are you|what is kraviona|kraviona kya hai|about kraviona|about us|company overview|kya company hai)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `**Kraviona** ek modern **AI-First Technology & Digital Solutions Company** hai ("Intelligence Meets Innovation"), jiska headquarters **East Delhi, Delhi NCR, India** mein sthit hai.\n\nHum high-performance software engineering, autonomous AI agents, enterprise SaaS platforms, aur Technical SEO systems engineer karte hain. Hum India ke saath-saath US, UK, UAE aur Australia ke clients ke saath agile remote workflows se deliver karte hain.\n\n• **Core Verticals**: IT & Tech Services, AI & Automation, SaaS Products, E-commerce, aur Digital Marketing.\n• **Founder**: Amar Kumar (Lead Systems Engineer)\n• **Headquarters**: East Delhi, Delhi 110092\n• **Direct Contact**: [hello@kraviona.com](mailto:hello@kraviona.com) | [+91 96085 53167](tel:+919608553167)`
        : `**Kraviona** is an **AI-First Technology & Digital Solutions Company** ("Intelligence Meets Innovation") headquartered in East Delhi, Delhi NCR, India.\n\nWe engineer custom software, autonomous AI agent pipelines, multi-tenant cloud SaaS platforms, and Technical SEO/GEO architectures for modern startups and growing enterprises worldwide.\n\n• **Headquarters**: East Delhi, Delhi 110092, India\n• **Leadership**: Amar Kumar (Founder & Lead Systems Engineer)\n• **5 Core Verticals**: IT Engineering, AI & Automation, SaaS Platforms, E-commerce, and Technical SEO\n• **Explore**: [About Us](/about) | [Services Directory](/services) | [Contact](/contact)`,
      sources: [
        { title: "About Us", url: "/about", category: "Company" },
        { title: "Services Directory", url: "/services", category: "Services" },
        { title: "Founder Profile", url: "/authors/amar-kumar", category: "Team" },
      ],
      type: "about",
    };
  }

  // 5. Tech Stack & Technologies Used
  if (/\b(tech stack|technologies|what tools|tools you use|stack kya hai|technology stack|programming languages|kaunsi technology|kis technology)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Kraviona production-grade, modern open-source aur cloud technologies par systems build karta hai:\n\n• **Frontend**: Next.js 15 (App Router, Server Actions), React 19, TypeScript, Tailwind CSS\n• **Backend & APIs**: Node.js, Express.js, Python (FastAPI, Django), RESTful APIs, GraphQL\n• **Databases**: MongoDB, PostgreSQL, Redis (Caching), Pinecone (Vector Embeddings)\n• **Mobile**: React Native, Flutter (iOS & Android cross-platform), Progressive Web Apps (PWA)\n• **AI & Automation**: Autonomous Agents, LangChain, LlamaIndex, n8n, OpenAI, Gemini, Claude, IDP/OCR\n• **DevOps & Cloud**: Docker, AWS (ECS, S3, RDS), Cloudflare, Vercel, GitHub Actions CI/CD\n• **SEO & Performance**: Core Web Vitals optimization (< 1.8s LCP), Schema.org JSON-LD, AEO/GEO\n\nKisi specific stack requirement par discuss karne ke liye: [Contact Us](/contact).`
        : `Kraviona's production engineering stack is built for high speed, strict type safety, and seamless AI integration:\n\n• **Frontend**: Next.js 15 (App Router, Server Components), React 19, TypeScript, Tailwind CSS\n• **Backend & Microservices**: Node.js, Express.js, Python (FastAPI, Django), RESTful & GraphQL APIs\n• **Data Layer**: MongoDB, PostgreSQL, Redis caching, Pinecone vector database\n• **Mobile Engineering**: React Native, Flutter (iOS & Android native parity), PWAs\n• **AI & Automation**: Autonomous AI Agents, LangChain, n8n orchestration, OpenAI/Gemini/Claude integrations, RAG\n• **Cloud & DevOps**: AWS, Docker containers, Cloudflare edge, CI/CD automated deployments\n• **Performance Standards**: Guaranteed Core Web Vitals compliance (< 1.8s LCP, 90+ Mobile PageSpeed)\n\nReview our engineering practices on our [Services Hub](/services).`,
      sources: [
        { title: "IT Services", url: "/services/web-development", category: "Services" },
        { title: "AI Solutions", url: "/solutions", category: "AI Solutions" },
      ],
      type: "tech_stack",
    };
  }

  // 6. Mobile App Development (Android, iOS, Flutter, React Native)
  if (/\b(mobile app|app development|android|ios|flutter|react native|pwa|mobile application|phone app)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Haan! Kraviona high-performance cross-platform mobile apps develop karta hai:\n\n• **React Native & Flutter**: Single clean codebase se iOS aur Android dono ke liye native-speed mobile applications.\n• **Features**: Offline data synchronization, push notifications, biometric auth, secure REST/GraphQL API integration aur payment gateways.\n• **Progressive Web Apps (PWA)**: App-like mobile experience bina App Store friction ke.\n• **AI Integrations**: Mobile apps mein AI chatbots, computer vision aur intelligent workflows integrate karna.\n\nApna mobile app project discuss karne ke liye: [Contact Kraviona](/contact) ya Call/WhatsApp [+91 96085 53167](tel:+919608553167).`
        : `Yes! Kraviona engineers enterprise-grade cross-platform mobile applications for iOS and Android:\n\n• **Frameworks**: React Native and Flutter for native-performance execution from a single maintainable codebase\n• **Capabilities**: Offline-first local storage, biometric security, push notifications, real-time WebSockets, and seamless payment gateway integrations\n• **Progressive Web Apps (PWAs)**: Fast, installable, responsive web experiences optimized for mobile browsers\n• **AI-Powered Mobile Features**: Integrating local on-device ML or cloud RAG/chat endpoints into mobile flows\n\nSchedule a mobile discovery consultation on our [Contact Page](/contact) or call [+91 96085 53167](tel:+919608553167).`,
      sources: [
        { title: "Custom Web & Mobile Apps", url: "/services/web-app-development", category: "Services" },
        { title: "Contact Us", url: "/contact", category: "Contact" },
      ],
      type: "mobile_apps",
    };
  }

  // 7. Python, Django, FastAPI & Backend Microservices
  if (/\b(python|django|fastapi|backend dev|backend development|api development|microservices|rest api|graphql)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Haan, Kraviona **Python (FastAPI, Django)** aur **Node.js** par mission-critical backend microservices aur APIs engineer karta hai:\n\n• **FastAPI**: Ultra-fast asynchronous microservices AI models, agent orchestration aur real-time data processing ke liye.\n• **Django**: Complex enterprise data models, admin portals aur secure authentication ke liye.\n• **Node.js & Express**: High-throughput event-driven microservices aur streaming APIs.\n• **Security & Standards**: JWT/OAuth2 authentication, rate limiting, Swagger/OpenAPI documentation, aur Redis caching.\n\nExplore karein: [Backend & API Development](/services/backend-development) ya connect karein: [Contact](/contact).`
        : `Yes, Kraviona specializes in Python (FastAPI, Django) and Node.js backend engineering:\n\n• **FastAPI**: Asynchronous, high-throughput microservices designed for AI tool calling, data processing, and streaming endpoints\n• **Django**: Robust enterprise software backends with complex relational models and automated administrative tooling\n• **Node.js & Express**: Event-driven microservices architected for low-latency JSON handling\n• **Security & Architecture**: JWT/OAuth2 RBAC, Redis caching, rate limiting, and automated OpenAPI contracts\n\nExplore our backend engineering capabilities on our [Backend Services Page](/services/backend-development).`,
      sources: [
        { title: "Backend Development", url: "/services/backend-development", category: "Services" },
        { title: "API Development", url: "/services/api-development", category: "Services" },
      ],
      type: "python_backend",
    };
  }

  // 8. Database Architecture & Optimization
  if (/\b(database|database architecture|mongodb|postgresql|postgres|redis|pinecone|vector database|sql|nosql)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Kraviona enterprise-grade database architectures aur data layers design karta hai:\n\n• **MongoDB & PostgreSQL**: Relational (ACID) aur Document data models, automated schema migrations, aur query optimization.\n• **Redis**: In-memory distributed caching, token session stores, aur rate limiting layers.\n• **Pinecone & Vector Databases**: Vector embeddings storage, hybrid semantic search, aur RAG pipelines.\n• **Performance Guarantee**: Microsecond query response time, zero deadlock indexes, aur high-availability replication.\n\nExplore karein: [Database Architecture](/services/database-architecture) ya [Contact Us](/contact).`
        : `Kraviona engineers resilient, zero-latency database architectures:\n\n• **PostgreSQL & MongoDB**: Production schema modeling, ACID transactions, complex indexing, and zero-downtime migrations\n• **Redis In-Memory Caching**: High-throughput distributed cache, session management, and pub/sub message brokers\n• **Pinecone & Vector Data**: High-dimensional vector storage, hybrid search, and semantic embeddings for enterprise RAG\n• **Reliability**: Connection pooling, automated failovers, and multi-region read replicas\n\nLearn more on our [Database Architecture Page](/services/database-architecture).`,
      sources: [
        { title: "Database Architecture", url: "/services/database-architecture", category: "Services" },
      ],
      type: "database",
    };
  }

  // 9. AI Agents, Autonomous Automation & n8n / LangChain
  if (/\b(ai agent|ai agents|autonomous agent|autonomous agents|agentic|workflow automation|n8n|langchain|llamaindex|ai automation)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `AI & Automation Kraviona ka strategic flagship vertical hai! Hum production-ready autonomous systems engineer karte hain:\n\n• **Autonomous AI Agents**: Multi-step reasoning loops jo self-correct karte hain aur external APIs/tools autonomously trigger karte hain.\n• **Workflow Orchestration**: n8n, LangChain aur Python microservices se complex business processes ko automate karna (ERP, CRM, email pipelines).\n• **Intelligent Document Processing (IDP)**: OCR, automated invoice extraction, aur unstructured PDF data structuring.\n• **Zero Hallucination**: Guardrails aur human-in-the-loop escalation systems.\n\nLive demo ya scoping ke liye connect karein: [AI & Automation Solutions](/services/ai-automation) ya [Contact Us](/contact).`
        : `AI & Automation is Kraviona's strategic flagship focus! We engineer production-grade autonomous agent systems:\n\n• **Autonomous Cognitive AI Agents**: Multi-step reasoning pipelines that execute complex tasks, invoke tool APIs, and adapt autonomously\n• **Workflow Orchestration**: Custom automation pipelines built with n8n, LangChain, and Python connecting ERPs, CRMs, and email hubs\n• **Intelligent Document Processing (IDP)**: Automated OCR parsing, invoice data extraction, and document categorization\n• **Enterprise Guardrails**: Strict boundary controls, deterministic schema outputs, and human-in-the-loop escalations\n\nExplore our solutions on the [AI & Automation Hub](/services/ai-automation) or book a consultation on our [Contact Page](/contact).`,
      sources: [
        { title: "AI Automation & Agents", url: "/services/ai-automation", category: "AI" },
        { title: "AI Chatbots & RAG", url: "/services/ai-chatbot-development", category: "AI" },
        { title: "Solutions Hub", url: "/solutions", category: "AI Solutions" },
      ],
      type: "ai_agents",
    };
  }

  // 10. AI Chatbots & Enterprise RAG Systems
  if (/\b(ai chatbot|chatbot|chatbots|rag|retrieval augmented generation|custom chatbot|whatsapp bot)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Kraviona context-aware, enterprise-grade AI Chatbots aur RAG systems build karta hai:\n\n• **Enterprise RAG**: Aapke internal SOPs, PDFs, Notion docs, aur product catalogs par trained private AI knowledge base (Zero Hallucination).\n• **Multi-Channel**: Website widget, WhatsApp Business API, Slack, aur CRM integration.\n• **Lead Generation**: 24/7 visitor engagement, query resolution, aur qualified lead capture.\n• **Multi-Language**: English, Hindi, Hinglish aur 50+ languages natively supported.\n\nAur jaankari ke liye visit karein: [AI Chatbot Development](/services/ai-chatbot-development) ya transparent pricing dekhein: [Pricing](/pricing).`
        : `Kraviona engineers context-aware, enterprise-grade AI Chatbots and RAG knowledge assistants:\n\n• **Enterprise RAG (Retrieval-Augmented Generation)**: Grounded in your proprietary documentation, catalogs, and databases with zero hallucination\n• **Omnichannel Deployment**: Seamless deployment across Web, WhatsApp Business API, Slack, and internal tooling\n• **24/7 Lead Capture**: Automatically qualifies inbound prospects and forwards leads directly to your CRM or email\n• **Multilingual Native Support**: Fluent in English, Hindi, Hinglish, and over 50 global languages\n\nExplore details on our [AI Chatbot Development Page](/services/ai-chatbot-development) or view our [Pricing Plans](/pricing).`,
      sources: [
        { title: "AI Chatbot Development", url: "/services/ai-chatbot-development", category: "AI" },
        { title: "Pricing & Plans", url: "/pricing", category: "Pricing" },
      ],
      type: "ai_chatbot",
    };
  }

  // 11. E-commerce Storefronts & Headless Commerce
  if (/\b(ecommerce|e-commerce|shopify|headless commerce|online store|online dukaan|woocommerce|store development)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Kraviona high-converting, AI-powered e-commerce storefronts engineer karta hai:\n\n• **Custom Next.js Storefronts**: Sub-second page loads, headless architectures, dynamic product catalogs aur seamless checkout.\n• **Shopify & Headless Shopify**: Custom Shopify liquid themes ya Next.js + Shopify Storefront API integrations.\n• **Conversion Optimization**: AI recommendations, 1-click checkout, automated order tracking, aur payment gateways (Razorpay, Stripe, Cashfree).\n• **Marketplace Sync**: Storefront inventory ko Amazon aur Flipkart se automatically sync karna.\n\nApna e-commerce build shuru karein: [E-Commerce Development](/services/ecommerce-development-marketing) ya direct call karein [+91 96085 53167](tel:+919608553167).`
        : `Kraviona engineers high-converting, AI-native e-commerce storefronts:\n\n• **Next.js AI Storefronts**: Sub-second rendering, dynamic product filtering, and instant edge checkout\n• **Headless Shopify**: Decoupled Next.js frontends powered by the Shopify Storefront API for maximum flexibility and PageSpeed\n• **Full Checkout & Payment Integration**: Seamless support for Stripe, Razorpay, Cashfree, and automated tax calculation\n• **Omnichannel Sync**: Live inventory synchronization between your website, Amazon, and Flipkart\n\nLearn more on our [E-Commerce Development Page](/services/ecommerce-development-marketing) or contact us for a proposal on our [Contact Page](/contact).`,
      sources: [
        { title: "AI E-Commerce Development", url: "/services/ecommerce-development-marketing", category: "E-Commerce" },
        { title: "Contact Us", url: "/contact", category: "Contact" },
      ],
      type: "ecommerce",
    };
  }

  // 12. Amazon & Flipkart Marketplace Operations, Cataloging & Reconciliation
  if (/\b(amazon|flipkart|marketplace|seller account|cataloging|flat file|reconciliation|seller training|accounting)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Kraviona Amazon aur Flipkart sellers ke liye end-to-end operational management provide karta hai:\n\n• **Account Operations**: Seller Central / Hub onboarding, policy compliance, buy-box health, aur brand registry.\n• **AI Cataloging**: Error-free bulk flat-file uploads, A+ content, bullet points, aur SEO keyword indexing.\n• **Financial Reconciliation**: Marketplace fee overcharges, return leakages, weight discrepancies, aur payment settlement audits.\n• **Advertising & ROAS**: Sponsored Ads, brand campaigns, aur ROAS optimization.\n\nExplore karein: [Account Management](/services/account-management) | [Cataloging](/services/cataloging) | [Reconciliation](/services/accounting).`
        : `Kraviona provides comprehensive marketplace operations for Amazon and Flipkart sellers:\n\n• **Account Health & Management**: Onboarding, Buy Box optimization, Brand Registry, and policy compliance\n• **AI-Assisted Cataloging**: Flat-file batch uploads, category mapping, A+ Content, and keyword-rich listings\n• **Financial Reconciliation**: Recovering revenue leakages from weight discrepancies, return anomalies, and fee overcharges\n• **Advertising & ROAS**: Precision PPC campaigns designed to maximize return on ad spend\n\nExplore our marketplace services: [Account Operations](/services/account-management) and [Financial Reconciliation](/services/accounting).`,
      sources: [
        { title: "E-Commerce Account Operations", url: "/services/account-management", category: "E-Commerce" },
        { title: "E-Commerce Financial Reconciliation", url: "/services/accounting", category: "E-Commerce" },
      ],
      type: "marketplace",
    };
  }

  // 13. Technical SEO, Core Web Vitals, AEO & GEO
  if (/\b(seo|technical seo|aeo|geo|ranking|google ranking|core web vitals|page speed|speed|lcp|inp|cls|answer engine|generative engine)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Kraviona dual-engine search visibility provide karta hai: Traditional Google Search (SEO) + AI Answer Engines (AEO / GEO):\n\n• **Core Web Vitals Speed**: Sub-second rendering (< 1.8s LCP), 90+ mobile PageSpeed scores, zero layout shift (CLS < 0.05).\n• **Answer Engine Optimization (AEO)**: Perplexity aur ChatGPT Search ke direct citations ke liye data structuring.\n• **Generative Engine Optimization (GEO)**: Google AI Overviews aur multimodal search ke liye Schema graph indexing.\n• **Technical Crawl Hygiene**: Zero crawl waste, automated canonicals, XML sitemaps, aur /llms.txt context file.\n\nApni site ka SEO audit karwane ke liye visit karein: [Technical SEO & GEO Services](/services/technical-seo).`
        : `Kraviona delivers dual-engine search optimization: traditional Google rankings (Technical SEO) alongside AI Answer Engine citations (AEO & GEO):\n\n• **Core Web Vitals Performance**: Guaranteed sub-second LCP (< 1.8s) and 90+ mobile PageSpeed scores\n• **Answer Engine Optimization (AEO)**: Structured content formatted for direct citations in Perplexity, ChatGPT Search, and Gemini\n• **Generative Engine Optimization (GEO)**: Entity graph linking for Google AI Overviews\n• **Crawl Architecture**: Canonical hygiene, XML sitemaps, and /llms.txt context indexing to maximize search crawl budget\n\nExplore our technical search services on the [Technical SEO & GEO Page](/services/technical-seo).`,
      sources: [
        { title: "Technical SEO, AEO & GEO", url: "/services/technical-seo", category: "SEO" },
        { title: "Web Performance Optimization", url: "/services/web-performance-optimization", category: "Performance" },
      ],
      type: "seo",
    };
  }

  // 14. SaaS Development & Rapid AI MVPs
  if (/\b(saas|software product|mvp|ai mvp|multi tenant|stripe billing|subscription|saas kaise banaye)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Kraviona cloud SaaS products aur rapid AI MVPs develop karta hai:\n\n• **Rapid MVP Sprint**: 4 se 8 weeks mein functional, market-ready AI SaaS product build karna.\n• **Multi-Tenant Architecture**: Robust tenant data isolation, subdomains, aur row-level security.\n• **Subscription Billing**: Stripe / Razorpay recurring billing, webhooks, tiers, aur invoice generation.\n• **Enterprise Security**: Role-based access control (RBAC), audit logging, aur GDPR/data compliance.\n\nApna SaaS idea discuss karne ke liye: [SaaS Development](/services/saas-development) ya [Contact Us](/contact).`
        : `Kraviona engineers full-lifecycle cloud SaaS products and rapid AI MVPs:\n\n• **Rapid AI MVP Delivery**: Production-ready, validated MVPs launched in 4 to 8 weeks\n• **Multi-Tenant Architecture**: Strict database data isolation, custom subdomains, and row-level security\n• **Subscription Billing Engine**: Integrated Stripe/Razorpay recurring billing, usage-based metering, and tiered plans\n• **Enterprise Security**: Role-Based Access Control (RBAC), JWT sessions, and audit logging\n\nExplore our SaaS capabilities on our [SaaS Development Page](/services/saas-development).`,
      sources: [
        { title: "SaaS Development", url: "/services/saas-development", category: "Services" },
        { title: "Pricing & Plans", url: "/pricing", category: "Pricing" },
      ],
      type: "saas",
    };
  }

  // 15. Pricing, Rates & Estimates ("kitna kharcha", "rate", "cost")
  if (/\b(price|pricing|cost|charge|charges|rate|rates|fee|fees|kitna kharcha|kitna lagega|budget|paisa|package|packages|how much)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Kraviona transparent aur value-driven pricing models offer karta hai:\n\n• **Milestone-Based Project Sprints**: Custom software, web apps aur SaaS builds ke liye fixed transparent milestone quotes (Zero hidden costs).\n• **Rapid AI SaaS MVPs**: 4–8 week accelerated delivery plans.\n• **Autonomous AI Agents & Workflows**: Scoped based on model complexity, tool calling, aur RAG index size.\n• **Monthly Retainers**: Dedicated Technical SEO, continuous performance monitoring, aur ongoing engineering support.\n• **Free Discovery Call**: Free 30-minute consultation jismein complete technical scope aur timeline provide ki jaati hai.\n\nDetailed pricing plans dekhne ke liye visit karein: [Kraviona Pricing](/pricing) ya tailored quotation ke liye [Contact Karein](/contact).`
        : `Kraviona offers transparent, milestone-driven pricing with zero hidden fees:\n\n• **Fixed Milestone Sprints**: Predictable, phased budgets for custom software development, Next.js web applications, and portals\n• **Rapid AI SaaS MVPs**: 4 to 8 week accelerated delivery packages designed for early-stage founders\n• **Autonomous AI & RAG Systems**: Transparently scoped based on agent reasoning loops, tool-calling APIs, and knowledge base scale\n• **Monthly Retainers**: Structured retainers for ongoing Technical SEO, performance optimization, and systems maintenance\n• **Free Technical Discovery**: Free 30-minute discovery call to evaluate your exact specifications\n\nReview our transparent models on the [Pricing Page](/pricing) or request a tailored estimate on our [Contact Form](/contact).`,
      sources: [
        { title: "Transparent Pricing", url: "/pricing", category: "Pricing" },
        { title: "Contact for Quote", url: "/contact", category: "Contact" },
      ],
      type: "pricing",
    };
  }

  // 16. Web Development, MERN & Next.js Website Build
  if (/\b(web dev|web development|nextjs|next\.js|react|mern|website|web app|custom software|software development|build website|banwana|banwani)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Kraviona custom software aur modern web applications engineer karta hai using Next.js 15, React 19, Node.js, Python aur scalable databases:\n\n• **High Performance**: Sub-second page loads (< 1.8s LCP) aur 90+ mobile Google PageSpeed scores.\n• **Security & Architecture**: Enterprise RBAC, JWT auth, clean API contracts, aur zero technical debt.\n• **AI Ready**: Modular architecture jo autonomous AI agents aur LLM workflows ke saath easily integrate hoti hai.\n• **Full Stack Delivery**: UI/UX Figma design se lekar cloud AWS/Docker deployment tak complete ownership.\n\nApna project discuss karne ke liye connect karein: [Contact Page](/contact) ya Call/WhatsApp [+91 96085 53167](tel:+919608553167).`
        : `Kraviona engineers high-performance web systems and custom software using Next.js 15, React 19, Node.js, Python, and scalable databases:\n\n• **Speed & SEO**: Built on Next.js Server Components for sub-second rendering (< 1.8s LCP) and 90+ mobile PageSpeed scores\n• **Enterprise Reliability**: Clean modular architecture, TypeScript type safety, and robust authentication (RBAC)\n• **AI Native**: Built from day one to connect with autonomous agents, LLM pipelines, and vector search\n• **End-to-End Ownership**: From Figma UI/UX design to cloud deployment on AWS/Docker\n\nSchedule a project consultation on our [Contact Page](/contact) or call [+91 96085 53167](tel:+919608553167).`,
      sources: [
        { title: "IT & Technology Services", url: "/services/web-development", category: "Services" },
        { title: "Custom Web Applications", url: "/services/web-app-development", category: "Services" },
        { title: "Next.js Development", url: "/services/nextjs-development", category: "Services" },
      ],
      type: "webdev",
    };
  }

  // 17. UI/UX Design & Design Systems
  if (/\b(ui|ux|ui\/ux|figma|design system|wireframe|prototype|interface design)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Kraviona human-centered UI/UX design aur enterprise design systems create karta hai:\n\n• **Figma Design Systems**: Reusable component libraries, tokens, typography scales aur light/dark themes.\n• **Interactive Prototypes**: Clickable user journeys aur usability testing code likhne se pehle.\n• **High Conversion**: CRO principles par designed landing pages jo visitors ko qualified leads mein convert karte hain.\n\nExplore karein: [UI/UX Design Services](/services/ui-ux-design) ya discuss karein apna concept: [Contact](/contact).`
        : `Kraviona delivers research-driven UI/UX design and scalable design systems:\n\n• **Figma Design Systems**: Reusable component architectures, design tokens, and accessibility guidelines (WCAG)\n• **Clickable Prototyping**: Interactive wireframes and user journeys tested before engineering begins\n• **Conversion-Centered UX**: Data-backed layout structures optimized to turn visitors into active clients\n\nLearn more on our [UI/UX Design Page](/services/ui-ux-design).`,
      sources: [
        { title: "UI/UX Design & AI Interfaces", url: "/services/ui-ux-design", category: "Design" },
      ],
      type: "ui_ux",
    };
  }

  // 18. Contact Details, Phone, WhatsApp, Email
  if (/\b(contact|phone|number|email|call|whatsapp|reach|sampark|touch|baat karni hai|kaise mile)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Aap Kraviona ki engineering team se directly connect kar sakte hain:\n\n• **Phone / WhatsApp**: [+91 96085 53167](tel:+919608553167) *(Immediate Response)*\n• **Official Email**: [hello@kraviona.com](mailto:hello@kraviona.com)\n• **Headquarters**: East Delhi, Delhi NCR, India (PIN 110092)\n• **Online Discovery Call**: [Contact Page Par Requirement Share Karein](/contact)\n• **Response Time**: Usually 1 business day ke andar customized technical response milta hai.`
        : `You can reach Kraviona's engineering team directly through:\n\n• **Phone / WhatsApp**: [+91 96085 53167](tel:+919608553167)\n• **Official Email**: [hello@kraviona.com](mailto:hello@kraviona.com)\n• **Headquarters**: East Delhi, Delhi NCR, India (PIN 110092)\n• **Discovery Consultation**: Free 30-minute technical session booked via our [Contact Form](/contact)\n\nOur engineering leads typically reply within 1 business day with a customized technical scope.`,
      sources: [
        { title: "Contact Kraviona", url: "/contact", category: "Contact" },
      ],
      type: "contact",
    };
  }

  // 19. Location & Headquarters ("kahan ho", "office", "delhi")
  if (/\b(location|address|where|kahan|office|delhi|headquarters|sthit)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Kraviona ka primary headquarters **East Delhi, Delhi NCR, India (PIN 110092)** mein sthit hai.\n\nHum poore India ke saath-saath international clients (US, UK, UAE, Australia) ke saath modern agile remote engineering workflows aur dedicated project sprints se collaborate karte hain.\n\nDirect sampark karein: [Contact Us](/contact) ya Call/WhatsApp [+91 96085 53167](tel:+919608553167).`
        : `Kraviona is headquartered in **East Delhi, Delhi NCR, India (PIN 110092)**.\n\nWe collaborate with clients across India and internationally (US, UK, UAE, Australia) through agile remote workflows and dedicated project delivery sprints.\n\nGet in touch via [hello@kraviona.com](mailto:hello@kraviona.com) or schedule a consultation on our [Contact Page](/contact).`,
      sources: [
        { title: "Contact Us", url: "/contact", category: "Contact" },
      ],
      type: "location",
    };
  }

  // 20. Portfolio, Case Studies & Past Work
  if (/\b(portfolio|case studies|case study|projects|past work|clients|samples|previous work|kya banaya)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Aap Kraviona ke real-world production engineering case studies aur software implementations dekh sakte hain:\n\n• **Verified Case Studies**: Architectural transformations, autonomous AI agents aur SEO scale-ups — [Case Studies Page Par Jaayein](/case-studies)\n• **Software Portfolio Gallery**: UI/UX designs aur live applications — [Gallery Page](/gallery)\n\nKisi specific live demonstration ke baare mein baat karne ke liye: [Contact Us](/contact).`
        : `Explore real-world client implementations, architectural transformations, autonomous AI pipelines, and verified SEO results engineered by Kraviona:\n\n• **All Case Studies**: [Explore Client Case Studies](/case-studies)\n• **Software Portfolio Gallery**: [Browse Visual Gallery](/gallery)\n\nInterested in a similar high-performance build? Connect with us on our [Contact Page](/contact).`,
      sources: [
        { title: "Case Studies", url: "/case-studies", category: "Portfolio" },
        { title: "Gallery", url: "/gallery", category: "Portfolio" },
      ],
      type: "portfolio",
    };
  }

  // 21. Development Process & How We Work
  if (/\b(process|workflow|how do you work|kaise kaam karte ho|timeline|kitna time lagta hai|steps|methodology)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Kraviona ka engineering workflow 4 clear, transparent stages mein operate karta hai:\n\n1. **Discovery & Architecture (Days 1–3)**: Founder-led requirement scoping, data modeling, aur API contract definitions.\n2. **UI/UX & Wireframing (Week 1)**: Interactive Figma prototypes aur component design systems.\n3. **Agile Milestone Sprints (Weeks 2–6)**: Staging preview links ke saath weekly checkpoints aur active progress demos.\n4. **QA, Security & Production Launch**: Sub-second Core Web Vitals optimization, penetration test, production deploy, plus **30 days post-launch warranty**.\n\nApna project start karne ke liye: [Schedule a Discovery Call](/contact).`
        : `Kraviona follows a transparent 4-stage engineering methodology:\n\n1. **Technical Discovery & Architecture (Days 1–3)**: Founder-led technical scoping, database schema design, and API contract specifications.\n2. **UI/UX & Component Systems (Week 1)**: Interactive Figma design prototypes and design tokens.\n3. **Agile Milestone Sprints (Weeks 2–6)**: Weekly deliverables with live staging previews for continuous client visibility.\n4. **Benchmarking & Production Deployment**: Core Web Vitals auditing (< 1.8s LCP), security verification, production cloud deploy, plus **30 days of post-launch warranty support**.\n\nSchedule a discovery session on our [Contact Page](/contact).`,
      sources: [
        { title: "Services Directory", url: "/services", category: "Services" },
        { title: "Contact Us", url: "/contact", category: "Contact" },
      ],
      type: "process",
    };
  }

  // 22. Code Ownership, IP Rights & NDA
  if (/\b(code ownership|ownership|ip rights|nda|confidentiality|intellectual property|security|guarantee)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Kraviona mein aapke project ki security aur intellectual property 100% protected hai:\n\n• **100% Client Code Ownership**: Milestone completion par saara source code, repositories, database schemas aur assets 100% aapke naam transfer hote hain.\n• **Mutual NDA**: Project shuru hone se pehle mutual Non-Disclosure Agreement (NDA) sign hota hai.\n• **Zero Vendor Lock-in**: Clean, modular, well-documented code jisko aapki in-house team kabhi bhi independently maintain kar sakti hai.\n\nPolicy details ke liye visit karein: [Terms & Conditions](/terms).`
        : `At Kraviona, your intellectual property and project security are strictly protected:\n\n• **100% Client Code Ownership**: All source code, database architectures, and digital assets belong 100% to you upon milestone delivery\n• **Mutual NDA Protection**: We sign a standard mutual Non-Disclosure Agreement before discussing proprietary technical details\n• **Zero Vendor Lock-in**: Codebases are documented, strictly typed (TypeScript), and architected for easy in-house handoff\n\nReview our standards on our [Terms Page](/terms).`,
      sources: [
        { title: "Terms & Conditions", url: "/terms", category: "Legal" },
        { title: "Contact Us", url: "/contact", category: "Contact" },
      ],
      type: "security_ip",
    };
  }

  // 23. Careers & Job Openings
  if (/\b(careers|jobs|hiring|job opening|apply|work with kraviona|naukri|internship)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Kraviona talented software engineers, AI developers, aur digital marketers ko hamesha welcome karta hai!\n\n• Current openings dekhne aur apply karne ke liye visit karein: [Careers Page](/careers)\n• Direct resume send karein: [hello@kraviona.com](mailto:hello@kraviona.com) with subject "Career Opportunity - [Your Skill/Role]".`
        : `Kraviona is always excited to collaborate with passionate software engineers, AI developers, and digital marketing specialists:\n\n• Explore current job openings and apply on our [Careers Page](/careers)\n• Alternatively, send your portfolio/resume directly to [hello@kraviona.com](mailto:hello@kraviona.com) with the subject line "Career Opportunity - [Your Role]".`,
      sources: [
        { title: "Careers Page", url: "/careers", category: "Careers" },
      ],
      type: "careers",
    };
  }

  // 24. Page Context / Explain Current Page
  if (/\b(explain (this |the )?page|summarize (this |the )?page|technical offerings and services presented|page offerings|explain page)\b/i.test(q)) {
    let pageSummary = "";
    if (pageContext?.title || pageContext?.h1) {
      pageSummary = `You are currently viewing **${pageContext.title || pageContext.h1}**.\n\n`;
    }
    return {
      reply: hinglish
        ? `${pageSummary}**Kraviona** ek AI-first technology company hai jo modern businesses ke liye intelligent digital systems build karti hai ("Intelligence Meets Innovation").\n\nHumari 5 core business verticals yeh hain:\n• **01. IT & Technology Services**: Next.js 15, React 19, Node.js, Python, APIs & Custom Web/Mobile Apps\n• **02. AI & Automation Solutions**: Autonomous AI Agents, RAG knowledge systems & automated workflows\n• **03. SaaS & Software Products**: Rapid AI MVPs (4-8 weeks), multi-tenant cloud platforms & Stripe billing\n• **04. E-commerce Solutions**: AI-powered storefronts (Next.js, Headless Shopify) & Amazon/Flipkart management\n• **05. Digital Marketing Services**: Technical SEO, Core Web Vitals (< 1.8s LCP), AEO & GEO\n\nExplore karein: [Services Directory](/services) ya connect karein: [Contact Page](/contact).`
        : `${pageSummary}Kraviona is an **AI-First Technology & Digital Solutions Company** ("Intelligence Meets Innovation") delivering enterprise-grade engineering across 5 core verticals:\n\n• **01. IT & Technology Services**: Custom software, high-velocity Next.js 15 & React 19 web applications, and scalable backend APIs\n• **02. AI & Automation Solutions** *(Strategic Focus)*: Autonomous cognitive AI agents, enterprise RAG knowledge bases, and workflow automation\n• **03. SaaS & Software Products**: Rapid AI MVPs (4 to 8 week delivery), cloud SaaS platforms, and multi-tenant architectures\n• **04. E-commerce Solutions**: AI-powered online storefronts, headless Next.js e-commerce, and marketplace seller management\n• **05. Digital Marketing Services**: Technical SEO, Answer Engine Optimization (AEO), Generative Engine Optimization (GEO), and Core Web Vitals speed\n\nExplore our complete offerings on the [Services Directory](/services) or schedule a discovery call on our [Contact Page](/contact).`,
      sources: [
        { title: "About Us", url: "/about", category: "Company" },
        { title: "Services Directory", url: "/services", category: "Services" },
      ],
      type: "page_explanation",
    };
  }

  // 25. General Services Overview (Fallback for generic "services")
  if (/\b(services|kya karte ho|kya karta hai|what do you do|what does kraviona do|what do you offer|what services|offerings|solutions|capabilities)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Kraviona 5 core business verticals mein enterprise-grade engineering deliver karta hai:\n\n• **01. IT & Technology Services**: Custom software, Next.js 15, React 19, Node.js, Python, RESTful/GraphQL APIs, aur Mobile Apps\n• **02. AI & Automation Solutions** *(Flagship Focus)*: Autonomous AI agents, custom chatbots, enterprise RAG knowledge bases, aur workflow automation\n• **03. SaaS & Software Products**: Cloud SaaS product engineering, rapid AI MVPs, multi-tenant databases, aur Stripe subscription billing\n• **04. E-commerce Solutions**: AI storefronts, Headless Shopify, Amazon & Flipkart marketplace account operations, cataloging aur fee reconciliation\n• **05. Digital Marketing Services**: Technical SEO, Core Web Vitals speed (< 1.8s LCP), Answer Engine Optimization (AEO), aur GEO\n\nPoore details ke liye visit karein: [Kraviona Services Directory](/services)`
        : `Kraviona delivers enterprise-grade engineering across 5 core business verticals:\n\n• **01. IT & Technology Services**: Custom software engineering, high-performance Next.js 15 & React 19 web applications, and scalable backend APIs\n• **02. AI & Automation Solutions** *(Strategic Flagship Focus)*: Autonomous cognitive AI agents, custom AI chatbots, enterprise RAG knowledge systems, and process automation\n• **03. SaaS & Software Products**: Cloud SaaS engineering, rapid 4–8 week AI MVPs, multi-tenant database isolation, and Stripe billing\n• **04. E-commerce Solutions**: AI-powered online storefronts, headless Next.js e-commerce, Amazon & Flipkart marketplace operations, and cataloging\n• **05. Digital Marketing Services**: Technical SEO, Answer Engine Optimization (AEO), Generative Engine Optimization (GEO), and Core Web Vitals speed (< 1.8s LCP)\n\nExplore all offerings on our [Services Directory](/services).`,
      sources: [
        { title: "Services Directory", url: "/services", category: "Services" },
        { title: "AI Solutions", url: "/solutions", category: "AI Solutions" },
      ],
      type: "services",
    };
  }

  // 26. Intelligent Keyword-Grounded Fallback
  return {
    reply: hinglish
      ? `Main aapke sawal par exact guidance dena chahta hoon! 🙏\n\nKraviona aapki in 5 core areas par madad kar sakta hai:\n• **01. IT & Technology Services** (Custom Software, Next.js, APIs, Mobile Apps)\n• **02. AI & Automation Solutions** (Autonomous Agents, Chatbots, RAG Workflows)\n• **03. SaaS & Software Products** (Rapid AI MVPs, Cloud SaaS, Billing)\n• **04. E-commerce Solutions** (AI Storefronts, Amazon/Flipkart Operations)\n• **05. Digital Marketing & SEO** (Technical SEO, Core Web Vitals, AEO, GEO)\n\nAap Kraviona engineering team se directly connect karke technical scope discuss kar sakte hain:\n• **Phone / WhatsApp**: [+91 96085 53167](tel:+919608553167)\n• **Official Email**: [hello@kraviona.com](mailto:hello@kraviona.com)\n• **Discovery Call**: [Contact Form Bharein](/contact)`
      : `I want to ensure you get the exact technical guidance for your project! 🙏\n\nKraviona specializes across 5 core engineering pillars:\n• **01. IT & Technology Services** (Custom Software, Next.js 15, React 19, APIs, Mobile Apps)\n• **02. AI & Automation Solutions** (Autonomous AI Agents, Enterprise RAG, Workflow Automation)\n• **03. SaaS & Software Products** (Rapid 4–8 week AI MVPs, Cloud Multi-Tenant Platforms)\n• **04. E-commerce Solutions** (AI-Powered Storefronts, Marketplace Seller Operations)\n• **05. Digital Marketing & SEO** (Technical SEO, Core Web Vitals < 1.8s LCP, AEO, GEO)\n\nConnect directly with our engineering leadership to discuss your specifications:\n• **Phone / WhatsApp**: [+91 96085 53167](tel:+919608553167)\n• **Official Email**: [hello@kraviona.com](mailto:hello@kraviona.com)\n• **Online Discovery Call**: [Book on our Contact Page](/contact)`,
    sources: [
      { title: "Contact Us", url: "/contact", category: "Contact" },
      { title: "Services Directory", url: "/services", category: "Services" },
      { title: "AI Solutions", url: "/solutions", category: "AI Solutions" },
    ],
    type: "fallback",
  };
};
