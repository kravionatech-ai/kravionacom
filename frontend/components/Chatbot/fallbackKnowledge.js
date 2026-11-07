// Instant Client-Side Verified Knowledge Fallback Engine for Kraviona AI
// Ensures 100% availability, verified accuracy, and AI-First positioning across all topics.

const HINGLISH_PATTERNS = [
  "kya", "kaise", "hai", "hain", "karna", "mujhe", "chahiye", "batao",
  "kaha", "kahan", "kaun", "kare", "sakta", "sakte", "mera", "meri",
  "banao", "banwana", "banwani", "kharidna", "rate", "paisa", "kitna",
  "namaste", "dhanyawad", "shukriya", "madad", "sampark", "kaam", "theek",
  "bhai", "karo", "do", "dena", "lagta", "kharcha"
];

export const isHindiOrHinglish = (text = "") => {
  if (/[\u0900-\u097F]/.test(text)) return true;
  const words = text.toLowerCase().split(/\s+/);
  return words.some((w) => HINGLISH_PATTERNS.includes(w));
};

export const getFallbackChatResponse = (query = "") => {
  const q = String(query).toLowerCase().trim();
  const hinglish = isHindiOrHinglish(q);

  // 1. Thanks & Goodbye
  if (/\b(thank(s|\s+you)?|dhanyawad|shukriya|bye|goodbye|alvida|ok|okay|theek\s+hai|thik\s+hai)\b/i.test(q)) {
    return {
      reply: hinglish
        ? "Aapka swagat hai! 🙏 Agar aapko koi aur technical jaankari chahiye ya apna AI/Software project discuss karna ho, Kraviona hamesha madad ke liye tayyar hai. Shubh din!"
        : "You're very welcome! If you need any more technical information or want to explore an AI or software project, Kraviona is always here to assist. Have a wonderful day! 😊",
      sources: [
        { title: "Contact Us", url: "/contact", category: "Contact" },
      ],
      type: "courtesy",
    };
  }

  // 2. Greetings & Who are you
  if (/\b(hi|hello|hey|namaste|greetings|good\s+(morning|afternoon|evening|day)|who are you|what can you do|help|madad|kaise ho|kya haal hai|aap kaun ho)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Namaste! 👋 Main Kraviona ka AI Assistant hoon.\n\nKraviona ek **AI-First Technology & Digital Solutions Company** hai. Main aapki in 5 core verticals par madad kar sakta hoon:\n\n• **01. IT & Technology Services**: Custom software, Next.js, React, Node.js & scalable web apps\n• **02. AI & Automation Solutions**: Autonomous AI agents, custom chatbots, RAG systems & workflow automation\n• **03. SaaS & Software Products**: Cloud SaaS development, rapid AI MVPs & multi-tenant architectures\n• **04. E-commerce Solutions**: AI storefronts, marketplace account handling & automated cataloging\n• **05. Digital Marketing Services**: Technical SEO, AEO, Generative Engine Optimization (GEO) & growth\n\nAap kis solution ke baare mein jaan-na chahte hain?`
        : `Hello! 👋 I'm Kraviona's AI Assistant.\n\nKraviona is an **AI-First Technology & Digital Solutions Company** ("Intelligence Meets Innovation"). I can assist you across our 5 core business verticals:\n\n• **01. IT & Technology Services**: Custom software, high-performance Next.js & React web applications, and scalable backend APIs\n• **02. AI & Automation Solutions** *(Core Focus)*: Autonomous cognitive AI agents, enterprise RAG knowledge bases, and intelligent process automation\n• **03. SaaS & Software Products**: Full-lifecycle cloud SaaS platforms, rapid AI MVPs, and multi-tenant architectures\n• **04. E-commerce Solutions**: AI-powered storefronts, marketplace seller operations, and automated cataloging\n• **05. Digital Marketing Services**: Technical SEO, Answer Engine Optimization (AEO), Generative Engine Optimization (GEO), and performance growth\n\nHow can I help you today?`,
      sources: [
        { title: "Services Directory", url: "/services", category: "Services" },
        { title: "AI Solutions", url: "/solutions", category: "AI Solutions" },
        { title: "Case Studies", url: "/case-studies", category: "Portfolio" },
      ],
      type: "greeting",
    };
  }

  // 3. Page Explanation / Summarize Page / About Kraviona technical offerings
  if (
    /\b(explain (this |the )?page|summarize (this |the )?page|technical offerings and services|about kraviona|offerings and services presented)\b/i.test(q)
  ) {
    return {
      reply: hinglish
        ? `**Kraviona** ek AI-first technology company hai jo modern businesses ke liye intelligent digital systems build karti hai ("Intelligence Meets Innovation").\n\nHumari 5 core business verticals yeh hain:\n\n• **01. IT & Technology Services**: Custom software development, high-performance Next.js App Router & React web apps, Node.js/Python microservices, scalable APIs, aur UI/UX design systems.\n• **02. AI & Automation Solutions** *(Flagship Focus)*: Autonomous cognitive AI agents, multi-step LLM workflows, custom AI chatbots, enterprise RAG systems, aur intelligent document processing.\n• **03. SaaS & Software Products**: Cloud-native SaaS product engineering, rapid AI MVPs, multi-tenant databases, Stripe subscription billing, aur role-based access control (RBAC).\n• **04. E-commerce Solutions**: AI-powered storefronts (Next.js, Headless Shopify), automated order workflows, Amazon/Flipkart marketplace operations, flat file cataloging, aur payout reconciliation.\n• **05. Digital Marketing Services**: Technical SEO, Answer Engine Optimization (AEO), Generative Engine Optimization (GEO), Core Web Vitals speed optimization, aur data-driven B2B growth.\n\nAap explore kar sakte hain: [Services Directory](/services) ya discuss karein apna project: [Contact Page](/contact).`
        : `Kraviona is an **AI-First Technology & Digital Solutions Company** ("Intelligence Meets Innovation") delivering enterprise-grade engineering across 5 core business verticals:\n\n• **01. IT & Technology Services**: Custom software engineering, high-velocity Next.js App Router & React web applications, scalable Node.js/Python backends, enterprise APIs, and UI/UX design systems.\n• **02. AI & Automation Solutions** *(Strategic Focus)*: Autonomous cognitive AI agents, custom AI chatbots, enterprise RAG (Retrieval-Augmented Generation) assistants, intelligent document processing, and business process automation.\n• **03. SaaS & Software Products**: Full-lifecycle cloud SaaS platforms, rapid AI MVPs, multi-tenant database architectures, subscription billing, and role-based access control (RBAC).\n• **04. E-commerce Solutions**: AI-powered online storefronts, headless Next.js e-commerce, Amazon & Flipkart marketplace management, product cataloging, and automated payout reconciliation.\n• **05. Digital Marketing Services**: Technical SEO, Answer Engine Optimization (AEO), Generative Engine Optimization (GEO), Core Web Vitals speed optimization (< 1.8s LCP), and B2B growth marketing.\n\nExplore our complete offerings on the [Services Directory](/services) or schedule a discovery call on our [Contact Page](/contact).`,
      sources: [
        { title: "About Us", url: "/about", category: "Company" },
        { title: "Services Directory", url: "/services", category: "Services" },
        { title: "AI Solutions", url: "/solutions", category: "AI Solutions" },
      ],
      type: "page_explanation",
    };
  }

  // 4. Services Overview / What does Kraviona do
  if (/\b(service|services|kya karte ho|kya karta hai|what do you do|what does kraviona do|what do you offer|what services|offerings|solutions|capabilities|features)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Kraviona 5 core business verticals mein enterprise-grade services provide karta hai:\n\n• **01. IT & Technology Services**: Custom software engineering, high-speed Next.js & React web apps, Node.js/Python APIs, aur UI/UX systems.\n• **02. AI & Automation Solutions** *(Core Focus)*: Autonomous cognitive AI agents, custom chatbots, enterprise RAG knowledge bases, aur workflow automation.\n• **03. SaaS & Software Products**: B2B AI SaaS product engineering, rapid MVPs, multi-tenant cloud architectures, aur subscription billing.\n• **04. E-commerce Solutions**: AI-powered web stores, marketplace account management (Amazon, Flipkart), product cataloging, aur settlement reconciliation.\n• **05. Digital Marketing Services**: Technical SEO, Answer Engine Optimization (AEO), Generative Engine Optimization (GEO), aur data-driven growth.\n\nPoore details ke liye visit karein: [Kraviona Services Directory](/services)`
        : `Kraviona delivers enterprise-grade engineering across 5 core business verticals:\n\n• **01. IT & Technology Services**: Custom software engineering, high-performance Next.js & React web applications, scalable backends, and UI/UX design systems.\n• **02. AI & Automation Solutions** *(Flagship Focus)*: Autonomous cognitive AI agents, custom AI chatbots, enterprise RAG assistants, and intelligent process automation.\n• **03. SaaS & Software Products**: Full-lifecycle cloud SaaS platforms, rapid AI MVPs, multi-tenant databases, and subscription billing.\n• **04. E-commerce Solutions**: AI-powered web storefronts, marketplace seller management (Amazon, Flipkart), cataloging, and payout reconciliation.\n• **05. Digital Marketing Services**: Technical SEO, Answer Engine Optimization (AEO), Generative Engine Optimization (GEO), and performance marketing.\n\nExplore all offerings on our [Services Directory](/services).`,
      sources: [
        { title: "Services Directory", url: "/services", category: "Services" },
        { title: "AI Solutions", url: "/solutions", category: "AI Solutions" },
      ],
      type: "services",
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
        { title: "Contact Kraviona", url: "/contact", category: "Contact" },
        { title: "Transparent Pricing", url: "/pricing", category: "Pricing" },
      ],
      type: "project",
    };
  }

  // 6. Contact / Phone / Email / WhatsApp
  if (/\b(contact|phone|number|email|call|whatsapp|reach|sampark|touch)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Aap Kraviona se direct connect kar sakte hain:\n\n• **Official Email**: [hello@kraviona.com](mailto:hello@kraviona.com)\n• **Phone / WhatsApp**: [+91 96085 53167](tel:+919608553167)\n• **Headquarters**: East Delhi, Delhi 110092, India\n• **Online Form**: [Contact Page](/contact)\n• **Consultation**: Free 30-minute discovery call available.\n\nHum usually 1 business day ke andar reply karte hain.`
        : `You can reach Kraviona directly through:\n\n• **Email**: [hello@kraviona.com](mailto:hello@kraviona.com)\n• **Phone / WhatsApp**: [+91 96085 53167](tel:+919608553167)\n• **Headquarters**: East Delhi, Delhi 110092, India\n• **Consultation**: Free 30-minute discovery call via our [Contact Form](/contact)\n\nOur engineering leads typically respond within 1 business day.`,
      sources: [
        { title: "Contact Us", url: "/contact", category: "Contact" },
      ],
      type: "contact",
    };
  }

  // 7. Location / Office
  if (/\b(location|address|where|kahan|office|delhi|headquarters)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Kraviona ka headquarters **East Delhi, Delhi 110092, India** mein sthit hai.\n\nHum poore India aur global clients (US, UK, UAE, Australia) ke saath modern remote workflows ke through collaborate karte hain.\n\nConnect karne ke liye visit karein: [Contact Page](/contact) ya call karein [+91 96085 53167](tel:+919608553167).`
        : `Kraviona is headquartered in **East Delhi, Delhi 110092, India**.\n\nWe engineer software and deploy AI solutions for clients across India and internationally (US, UK, UAE, Australia) through agile remote workflows.\n\nConnect with our team at [hello@kraviona.com](mailto:hello@kraviona.com) or schedule a call on our [Contact Page](/contact).`,
      sources: [
        { title: "Contact Us", url: "/contact", category: "Contact" },
      ],
      type: "location",
    };
  }

  // 8. Pricing / Cost
  if (/\b(price|pricing|cost|charge|charges|rate|rates|fee|fees|kitna kharcha|kitna lagega|budget|paisa|package|packages)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Kraviona transparent aur value-driven pricing provide karta hai:\n\n• **Custom Software & Web Apps**: Milestone-based phased delivery for web apps, portals & architectures\n• **AI Agent & Automation Systems**: Fixed scope or sprint-based based on agent complexity & tool integrations\n• **SaaS MVP Engineering**: 4 to 8 week accelerated development sprint\n• **Technical SEO & Performance Retainers**: Monthly milestone growth & Core Web Vitals remediation\n\nTransparent pricing plans dekhne ke liye visit karein: [Kraviona Pricing](/pricing) ya direct proposal ke liye connect karein: [Contact](/contact).`
        : `Kraviona provides clear, transparent, and milestone-based pricing models:\n\n• **Custom Software & Web Builds**: Phased fixed milestone quotes for Next.js web applications, portals, and cloud platforms\n• **Autonomous AI Agents & Workflows**: Scoped based on model integrations, RAG complexity, and tool-calling automation\n• **SaaS MVP Development**: Rapid 4 to 8 week full-stack production delivery\n• **Technical SEO & Performance Retainers**: Structured monthly growth retainers\n\nReview our transparent models on the [Pricing Page](/pricing) or request a tailored scope via our [Contact Form](/contact).`,
      sources: [
        { title: "Pricing & Plans", url: "/pricing", category: "Pricing" },
        { title: "Contact for Quote", url: "/contact", category: "Contact" },
      ],
      type: "pricing",
    };
  }

  // 9. AI Agent & Automation Solutions
  if (/\b(ai|artificial intelligence|automations?|workflows?|llms?|chatbots?|agents?|rag|machine learning)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Kraviona autonomous cognitive AI agents aur enterprise automation mein specialize karta hai:\n\n• **Autonomous AI Agents**: Multi-step reasoning loops, API tool calling aur workflow automation\n• **Custom AI Chatbots & RAG**: Internal documents par trained context-aware assistants (zero hallucinations)\n• **Intelligent Document Processing (IDP)**: OCR, automated invoice/form extraction aur data synthesis\n• **Workflow Automation**: LangChain, n8n aur bespoke Python microservices pipelines\n\nExplore karein: [AI & Automation Solutions](/services/performance-ai) ya [Contact Us](/contact).`
        : `Kraviona's AI & Automation practice builds production-grade cognitive systems:\n\n• **Autonomous AI Agents**: Multi-step reasoning, external API execution, and decision automation\n• **Enterprise RAG Knowledge Systems**: Custom chatbots grounded in proprietary business documentation with zero hallucination\n• **Intelligent Document Processing**: OCR, automated entity extraction, and invoice processing\n• **Workflow Orchestration**: Hardened pipelines using LangChain, n8n, and Python microservices\n\nExplore our capabilities on our [AI & Automation Hub](/services/performance-ai).`,
      sources: [
        { title: "AI Automation & Agents", url: "/services/ai-automation", category: "AI" },
        { title: "AI Chatbots & RAG", url: "/services/ai-chatbot-development", category: "AI" },
        { title: "Enterprise Solutions", url: "/solutions", category: "Solutions" },
      ],
      type: "ai",
    };
  }

  // 10. IT & Web Development
  if (/\b(web dev|web development|nextjs|next\.js|react|mern|frontend|backend|node|full stack|software)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Hum modern Next.js App Router, React, Node.js, Express, Python aur MongoDB/PostgreSQL par production-grade web systems aur custom software engineer karte hain.\n\nHar system sub-second speed (< 1.8s LCP), enterprise security (RBAC/JWT), aur seamless AI agent integration ke liye architect hota hai.\n\nExplore karein: [IT & Technology Services](/services/web-development) ya discuss karein apna project: [Contact Page](/contact).`
        : `Kraviona engineers high-performance web systems and custom software using Next.js App Router, React, Node.js, Python, and scalable databases. Every system ships with Core Web Vitals compliance, modular architecture, and AI-ready endpoints.\n\nExplore our web engineering services on our [IT Services Hub](/services/web-development).`,
      sources: [
        { title: "IT & Technology Hub", url: "/services/web-development", category: "Services" },
        { title: "Custom Web Applications", url: "/services/web-app-development", category: "Services" },
      ],
      type: "webdev",
    };
  }

  // 11. Technical SEO, AEO & GEO
  if (/\b(seo|technical seo|aeo|geo|ranking|google ranking|core web vitals|page speed|traffic|organic|answer engine)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Kraviona dual-engine search visibility deliver karta hai: Traditional Google Search (SEO) aur modern AI Answer Engines (AEO / GEO):\n\n• **Core Web Vitals**: Mobile aur desktop par 90+ speed score (< 1.8s LCP)\n• **Answer Engine Optimization (AEO)**: Perplexity, ChatGPT Search aur Google AI Overviews ke liye direct-answer structuring\n• **Schema.org Knowledge Graph**: Deep JSON-LD entity linking\n• **Crawl Architecture**: Clean canonicals, sitemap optimization aur zero crawl waste\n\nAur jaankari ke liye visit karein: [Technical SEO & GEO Services](/services/technical-seo).`
        : `Kraviona provides dual-engine search optimization: traditional Google rankings (Technical SEO) alongside AI Answer Engine citations (AEO & GEO):\n\n• **Core Web Vitals**: Sub-second rendering and 90+ mobile PageSpeed scores\n• **Answer Engine Optimization (AEO/GEO)**: Direct-answer formatting for Perplexity, ChatGPT Search, and Google AI Overviews\n• **Schema.org Knowledge Graph**: Linked entity schemas (Organization, Person, Service, FAQPage)\n• **Crawl Hygiene**: Canonical hygiene, XML sitemaps, and /llms.txt context indexing\n\nLearn more on our [Technical SEO & GEO Services Page](/services/technical-seo).`,
      sources: [
        { title: "Technical SEO, AEO & GEO", url: "/services/technical-seo", category: "SEO" },
        { title: "Web Performance Optimization", url: "/services/web-performance-optimization", category: "Performance" },
      ],
      type: "seo",
    };
  }

  // 12. Portfolio / Case Studies
  if (/\b(portfolio|case studies|case study|projects|past work|clients|samples|kya banaya)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `Aap Kraviona ke real-world software engineering projects, autonomous AI automations aur SEO growth case studies dekh sakte hain:\n\n• [Case Studies Page Par Jaayein](/case-studies)\n• [Software Portfolio Gallery](/gallery)\n\nKisi specific requirement par baat karne ke liye connect karein: [Contact Us](/contact).`
        : `Explore verified client case studies showing how Kraviona engineers scalable software, autonomous AI agents, and technical SEO systems that deliver measurable business results:\n\n• [Explore All Case Studies](/case-studies)\n• [Software Portfolio Gallery](/gallery)\n\nInterested in a similar build? Connect with our team on our [Contact Page](/contact).`,
      sources: [
        { title: "Case Studies", url: "/case-studies", category: "Portfolio" },
        { title: "Gallery", url: "/gallery", category: "Portfolio" },
      ],
      type: "portfolio",
    };
  }

  // 13. About / Company
  if (/\b(about|kraviona|company|founder|amar kumar|agency)\b/i.test(q)) {
    return {
      reply: hinglish
        ? `**Kraviona** ek AI-First Technology & Digital Solutions Company hai ("Intelligence Meets Innovation"). Founded by Amar Kumar (Lead Systems Engineer), hum East Delhi, India se global businesses ke liye intelligent software, autonomous AI agents, SaaS products, aur digital growth systems architect karte hain.\n\nAur jaankari ke liye visit karein: [About Kraviona](/about) ya [Founder Bio](/authors/amar-kumar).`
        : `**Kraviona** is an AI-First Technology & Digital Solutions Company founded by Amar Kumar (Lead Systems Engineer). Headquartered in East Delhi, India, Kraviona engineers custom software, autonomous AI agents, SaaS products, and technical SEO/GEO systems for companies worldwide.\n\nLearn more on our [About Page](/about) or read the founder profile on [Amar Kumar's Author Page](/authors/amar-kumar).`,
      sources: [
        { title: "About Us", url: "/about", category: "Company" },
        { title: "Founder Profile", url: "/authors/amar-kumar", category: "Team" },
        { title: "Services Directory", url: "/services", category: "Services" },
      ],
      type: "about",
    };
  }

  // General Fallback — accurate and surfaces verified options
  return {
    reply: hinglish
      ? `Main is specific sawal par aapko bilkul accurate guidance dena chahta hoon. 🙏\n\nAap Kraviona engineering team se directly connect kar sakte hain:\n• **WhatsApp / Call**: [+91 96085 53167](https://wa.me/919608553167)\n• **Official Email**: [hello@kraviona.com](mailto:hello@kraviona.com)\n• **Discovery Call**: [Contact Form Bharein](/contact)\n\nMain in 5 core verticals par aapki madad kar sakta hoon:\n• 01. IT & Technology Services (Custom Software, Next.js, APIs)\n• 02. AI & Automation Solutions (Autonomous Agents, Chatbots, RAG)\n• 03. SaaS & Software Products (Cloud SaaS, MVPs)\n• 04. E-commerce Solutions (Storefronts, Operations)\n• 05. Digital Marketing Services (Technical SEO, AEO, GEO)`
      : `I want to ensure you get the exact technical guidance for your project. 🙏\n\nThe fastest way to consult directly with our engineering team:\n• **WhatsApp / Phone**: [+91 96085 53167](https://wa.me/919608553167)\n• **Email**: [hello@kraviona.com](mailto:hello@kraviona.com)\n• **Online Discovery Call**: [Contact Page](/contact)\n\nI can assist you across Kraviona's 5 core business verticals:\n• 01. IT & Technology Services (Custom Software, Next.js, React)\n• 02. AI & Automation Solutions (Autonomous AI Agents, Chatbots, RAG)\n• 03. SaaS & Software Products (Cloud SaaS Platforms, MVPs)\n• 04. E-commerce Solutions (AI Storefronts, Operations)\n• 05. Digital Marketing Services (Technical SEO, AEO, GEO)`,
    sources: [
      { title: "Contact Us", url: "/contact", category: "Contact" },
      { title: "Services Directory", url: "/services", category: "Services" },
      { title: "AI Solutions", url: "/solutions", category: "AI Solutions" },
    ],
    type: "fallback",
  };
};
