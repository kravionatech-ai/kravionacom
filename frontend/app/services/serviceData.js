import { SOCIAL_LINKS } from "@/lib/social";

export const SERVICE_EXPERT = {
  name: "Amar Kumar",
  jobTitle: "Founder & Lead Engineer",
  email: SOCIAL_LINKS.email,
  phone: "+91 96085 53167",
  phoneHref: `tel:${SOCIAL_LINKS.phone}`,
  whatsapp: SOCIAL_LINKS.whatsapp,
  linkedin: "https://www.linkedin.com/in/amarkumar96085/",
  companyLinkedin: SOCIAL_LINKS.linkedin,
  facebook: SOCIAL_LINKS.facebook,
  website: "https://www.kraviona.com",
  address: "East Delhi, Delhi 110092, India",
  availability: "Monday to Saturday, 9:00 AM - 7:00 PM IST",
  responseTime: "Usually replies within 1 business day",
  consultation: "Free 30-minute discovery call",
  image: "/amar.jpeg",
  bio: "Full-stack developer and founder of Kraviona Tech Solutions, focused on MERN stack engineering, technical SEO, marketplace growth, and performance-first digital systems.",
  credentials: [
    "Founder-led technical discovery",
    "MERN stack and Next.js delivery experience",
    "Technical SEO and Core Web Vitals implementation",
    "Marketplace seller growth and automation support",
  ],
  knowsAbout: [
    "MERN stack development",
    "Technical SEO",
    "Marketplace account growth",
    "Digital marketing automation",
    "SaaS architecture",
  ],
};

export const CATEGORY_DETAILS = {
  "Web Development": {
    intro:
      "Built for teams that need reliable software, clean user experiences, and a website or application that can keep growing after launch.",
    deliverables: [
      "Responsive page and application UI",
      "Frontend and backend implementation",
      "Authentication, forms, dashboards, and integrations",
      "SEO-ready structure, performance cleanup, and deployment support",
    ],
    process: [
      "Requirement mapping and technical scope",
      "Wireframe or component structure planning",
      "Development with review checkpoints",
      "Testing, launch, and post-launch improvements",
    ],
    idealFor: [
      "Startups building MVPs",
      "Businesses modernizing old websites",
      "Teams needing dashboards or custom portals",
      "Brands that need SEO-friendly web foundations",
    ],
    faqs: [
      {
        question: "Will the website be mobile-friendly?",
        answer:
          "Yes. Every service page and project is planned around responsive layouts, performance, and clean user journeys across mobile, tablet, and desktop.",
      },
      {
        question: "Can Kraviona handle both frontend and backend?",
        answer:
          "Yes. Kraviona works across React, Next.js, Node.js, APIs, databases, integrations, and deployment workflows.",
      },
    ],
  },
  "Backend & Architecture": {
    intro:
      "For products that need stable APIs, secure data flows, clean backend logic, and architecture that does not collapse as usage grows.",
    deliverables: [
      "API architecture and endpoint development",
      "Database modeling, validation, and access control",
      "Authentication, authorization, and integration workflows",
      "Deployment guidance, logging, and maintainability notes",
    ],
    process: [
      "System audit and data flow mapping",
      "API and database schema planning",
      "Secure backend implementation",
      "Testing, documentation, and release support",
    ],
    idealFor: [
      "SaaS founders",
      "Mobile app teams needing APIs",
      "Businesses replacing manual workflows",
      "Products with scaling or security concerns",
    ],
    faqs: [
      {
        question: "Do you document APIs?",
        answer:
          "Yes. API projects can include clear endpoint documentation, request examples, validation notes, and integration guidance.",
      },
      {
        question: "Can you improve an existing backend?",
        answer:
          "Yes. Kraviona can audit existing APIs, database queries, auth flows, and deployment setup before recommending focused improvements.",
      },
    ],
  },
  "Performance & AI": {
    intro:
      "Focused on speed, search visibility, automation, and AI workflows that help teams save time while improving technical quality.",
    deliverables: [
      "Core Web Vitals and performance fixes",
      "Technical SEO and schema improvements",
      "AI chatbot, LLM, and automation workflow setup",
      "Measurement, tracking, and improvement reports",
    ],
    process: [
      "Audit current performance, SEO, or workflow gaps",
      "Prioritize high-impact fixes and automation opportunities",
      "Implement changes with measurable checkpoints",
      "Review results and improve the next iteration",
    ],
    idealFor: [
      "Websites losing rankings due to technical issues",
      "Teams spending too much time on repetitive work",
      "Businesses wanting AI-powered lead or support flows",
      "Brands preparing for AI search and fast page experiences",
    ],
    faqs: [
      {
        question: "Can AI automation connect with existing tools?",
        answer:
          "Yes. The workflow can be planned around your current website, forms, CRM, spreadsheets, email tools, or internal process.",
      },
      {
        question: "Do you only provide an audit?",
        answer:
          "No. Kraviona can provide the audit, implementation, and follow-up measurement so improvements actually reach production.",
      },
    ],
  },
  "Branding & Marketing": {
    intro:
      "For businesses that need clearer positioning, stronger campaign execution, and marketing systems that turn attention into qualified leads.",
    deliverables: [
      "Marketing strategy and channel planning",
      "Landing page, content, and campaign direction",
      "Social, email, SEO, and paid campaign support",
      "Reporting on leads, engagement, traffic, and conversions",
    ],
    process: [
      "Brand, audience, and offer discovery",
      "Campaign and content roadmap",
      "Creative, copy, and tracking setup",
      "Performance review and campaign refinement",
    ],
    idealFor: [
      "Local service businesses",
      "New brands building market presence",
      "Companies needing consistent content systems",
      "Teams that want measurable campaign reporting",
    ],
    faqs: [
      {
        question: "Do you support both organic and paid marketing?",
        answer:
          "Yes. Kraviona can plan SEO, social content, email campaigns, landing pages, and paid campaigns depending on the growth goal.",
      },
      {
        question: "Will campaign performance be tracked?",
        answer:
          "Yes. Tracking and reporting can include leads, traffic, engagement, conversion events, and channel-level learnings.",
      },
    ],
  },
  "Marketplace & Seller": {
    intro:
      "Built for online sellers who need cleaner listings, stronger account operations, better advertising, and practical visibility into profitability.",
    deliverables: [
      "Marketplace account setup and optimization",
      "Catalog, listings, variations, and product content cleanup",
      "Advertising, pricing, reporting, and account health support",
      "Seller training and repeatable operating processes",
    ],
    process: [
      "Account, catalog, and performance review",
      "Issue list and growth opportunity mapping",
      "Implementation across listings, ads, and operations",
      "Weekly or monthly review with next actions",
    ],
    idealFor: [
      "New marketplace sellers",
      "Existing sellers with catalog or ad issues",
      "E-commerce brands expanding to marketplaces",
      "Teams needing training and operational clarity",
    ],
    faqs: [
      {
        question: "Can you help with catalog errors?",
        answer:
          "Yes. Kraviona can help clean listing data, variations, titles, descriptions, images, and marketplace-specific catalog issues.",
      },
      {
        question: "Do you provide seller training?",
        answer:
          "Yes. Training can cover account workflows, catalog handling, order processes, advertising basics, and reporting routines.",
      },
    ],
  },
};

export const SERVICE_PAGES = {
  // ── 1. MERN Stack Development ───────────────────────────────────────────
  "mern-stack-development": {
    name: "MERN Stack Development",
    shortName: "MERN Stack",
    category: "Web Development",
    description:
      "Enterprise-grade MongoDB, Express.js, React.js, and Node.js web applications engineered for sub-second speeds, modular scale, and cloud deployment.",
    seo: {
      metaTitle: "MERN Stack Development Services in Delhi NCR | Kraviona",
      metaDescription:
        "Hire expert MERN stack developers for scalable web applications, React frontends, Node APIs, and MongoDB architecture. Fast, secure, and production-ready.",
      keywords: [
        "MERN Stack Development",
        "MERN Stack Developers Delhi NCR",
        "Hire MERN Developer India",
        "React Node MongoDB Agency",
        "Full Stack JavaScript Development",
        "Custom MERN Web Applications",
      ],
    },
    hero: {
      eyebrow: "Full-Stack Web Engineering",
      title: "MERN Stack Development",
      highlight: "Services",
      description:
        "Enterprise-grade MongoDB, Express.js, React.js, and Node.js web applications engineered for sub-second speeds, modular scale, and robust cloud deployment.",
    },
    intro:
      "At Kraviona, our MERN stack development services unify MongoDB, Express.js, React.js, and Node.js into a cohesive, high-performance software ecosystem. We architect modern web applications with component-driven frontends, resilient RESTful and GraphQL APIs, and document-oriented databases capable of scaling from day-one MVP to millions of active requests without accumulated technical debt.",
    outcomes: [
      {
        title: "Production-ready MERN architecture",
        description:
          "We structure your codebase with strict domain-driven separation between controllers, services, database models, and reusable React components.",
      },
      {
        title: "Secure APIs & role-based authentication",
        description:
          "JWT tokens, HTTP-only cookies, OAuth2, and granular role-based permissions that protect sensitive business operations and customer data.",
      },
      {
        title: "Sub-second React & Next.js user experience",
        description:
          "Optimized component rendering, server-side caching, and code splitting that pass Core Web Vitals with flying colors.",
      },
      {
        title: "Continuous cloud deployment & monitoring",
        description:
          "Automated Docker containerization, AWS/Nginx reverse proxy configurations, health-check monitoring, and zero-downtime releases.",
      },
    ],
    deliverables: [
      "Complete MERN codebase with clean MVC / Clean Architecture structure",
      "Interactive React/Next.js frontend with responsive UI and state management",
      "Secure Node.js / Express.js RESTful or GraphQL API endpoints",
      "MongoDB database models with validation schemas and optimized indexing",
      "API documentation (Postman collection & OpenAPI/Swagger specifications)",
      "Production deployment configuration with Nginx, PM2, and SSL certificates",
    ],
    idealFor: [
      "Early-stage startups building their MVP on modern JavaScript",
      "Growing companies replacing legacy monolithic systems",
      "Businesses needing customer-facing portals with dynamic data",
      "Enterprises requiring scalable SaaS foundations and real-time dashboards",
    ],
    process: [
      {
        title: "Discovery & Architecture Planning",
        description:
          "We audit your business requirements, define data models, and design the API contract and frontend component hierarchy.",
      },
      {
        title: "Database Modeling & API Engineering",
        description:
          "We build secure Express/Node services with schema validation, auth flows, and automated unit and integration tests.",
      },
      {
        title: "React Frontend & State Integration",
        description:
          "We craft fast, responsive UI interfaces hooked up to your APIs with optimistic updates and error boundary handling.",
      },
      {
        title: "Security Hardening, Testing & Deployment",
        description:
          "We run performance audits, penetration checks, containerize the application, and launch onto production cloud servers.",
      },
    ],
    techStack: [
      "MongoDB",
      "Express.js",
      "React.js",
      "Node.js",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Redis",
      "Docker",
      "AWS",
    ],
    faqs: [
      {
        question: "Why choose MERN stack for our web application?",
        answer:
          "The MERN stack uses JavaScript and TypeScript across both frontend and backend, enabling unified code sharing, faster iteration cycles, lower hosting overhead, and massive developer community support.",
      },
      {
        question: "Can Kraviona migrate our existing application to MERN?",
        answer:
          "Yes. We specialize in zero-downtime migrations from legacy stacks (such as PHP, WordPress, or monolithic frameworks) to modern, decoupled MERN architectures.",
      },
      {
        question: "How does Kraviona ensure MongoDB scalability under load?",
        answer:
          "We implement targeted compound indexing, connection pooling, sharding strategies, schema validation, and Redis caching layers to prevent database bottlenecks.",
      },
      {
        question: "Do you build SEO-friendly MERN stack applications?",
        answer:
          "Yes. By integrating Next.js for server-side rendering (SSR) and static generation (SSG), your MERN application remains fully crawlable and indexable by search engines.",
      },
      {
        question: "What post-launch support is included?",
        answer:
          "Every Kraviona project includes a dedicated post-launch warranty period for bug fixes, performance monitoring, documentation handover, and optional ongoing SLA retainers.",
      },
    ],
  },

  // ── 2. Full-Stack Development ───────────────────────────────────────────
  "full-stack-development": {
    name: "Full-Stack Development",
    category: "Web Development",
    description:
      "End-to-end frontend, backend, database modeling, and DevOps deployment tailored for business-critical digital products.",
    seo: {
      metaTitle: "Full Stack Development Services in Delhi NCR | Kraviona",
      metaDescription:
        "Full stack development services for startups and modern businesses. We build responsive frontends, secure backends, database architecture, and cloud systems.",
      keywords: [
        "Full Stack Development Services",
        "Full Stack Developers Delhi NCR",
        "Hire Full Stack Developer India",
        "End to End Web Engineering",
        "Custom Software Development",
      ],
    },
    hero: {
      eyebrow: "End-to-End Engineering",
      title: "Full Stack Development",
      highlight: "Services",
      description:
        "Turn complex product visions into resilient digital platforms. We handle interactive client interfaces, secure microservices, performant databases, and automated cloud pipelines.",
    },
    intro:
      "Kraviona delivers full-stack web engineering that bridges the gap between intuitive user experiences and rock-solid server-side architecture. Our engineering team eliminates fragmentation by owning every layer of the software stack: semantic UI, state management, API design, business logic, authentication, database schemas, and CI/CD cloud deployment.",
    outcomes: [
      {
        title: "Complete product planning and delivery",
        description:
          "Single point of technical accountability from initial architectural discovery to live production deployment.",
      },
      {
        title: "Unified frontend & backend engineering",
        description:
          "Seamless end-to-end data flows with TypeScript typing across both client-side interfaces and server endpoints.",
      },
      {
        title: "Third-party payment & SaaS integrations",
        description:
          "Bulletproof connections to Stripe, Razorpay, ERP systems, CRMs, email services, and messaging gateways.",
      },
      {
        title: "Performance & SEO-ready foundations",
        description:
          "Built from the ground up for speed, mobile responsiveness, semantic markup, and optimal search engine indexation.",
      },
    ],
    deliverables: [
      "Fully functional, production-ready web application",
      "Interactive frontend built with React, Next.js, or modern frameworks",
      "Scalable backend architecture using Node.js, Express, or Python",
      "Relational (PostgreSQL) or document (MongoDB) database architecture",
      "Automated CI/CD pipeline and cloud infrastructure setup",
      "Comprehensive system documentation and technical handover",
    ],
    idealFor: [
      "Companies wanting a single engineering team to deliver their whole product",
      "Businesses launching new digital services or enterprise portals",
      "Startups needing rapid turnaround on scalable web architectures",
      "Organizations modernizing outdated legacy IT infrastructure",
    ],
    process: [
      {
        title: "System Discovery & Technical Specification",
        description:
          "We analyze user workflows, define technical boundaries, select the ideal technology stack, and map data architecture.",
      },
      {
        title: "Iterative Sprint Development",
        description:
          "We build frontend UI and backend endpoints in synchronized two-week sprints with transparent progress demos.",
      },
      {
        title: "Quality Assurance & Performance Auditing",
        description:
          "End-to-end testing, cross-browser compatibility checks, security vulnerability scanning, and load testing.",
      },
      {
        title: "Production Launch & Knowledge Transfer",
        description:
          "Zero-downtime server provisioning, DNS cutover, environment configuration, and internal team walkthroughs.",
      },
    ],
    techStack: [
      "React.js",
      "Next.js",
      "Node.js",
      "Express.js",
      "PostgreSQL",
      "MongoDB",
      "TypeScript",
      "Docker",
      "AWS",
      "Tailwind CSS",
    ],
    faqs: [
      {
        question: "What does Kraviona's full-stack development service include?",
        answer:
          "It covers the complete software lifecycle: architecture design, frontend UI development, backend API creation, database modeling, third-party integrations, testing, deployment, and ongoing technical support.",
      },
      {
        question: "Do you build with SQL or NoSQL databases?",
        answer:
          "We choose the optimal database based on your data structure: PostgreSQL or MySQL for complex relational and transactional workflows; MongoDB for flexible, high-speed document data.",
      },
      {
        question: "Can your team work with our existing codebase?",
        answer:
          "Yes. We can audit, refactor, and build on top of your existing codebase, applying modern standards without disrupting your ongoing business.",
      },
      {
        question: "How do you handle project management and communication?",
        answer:
          "You get direct access to our technical leads via weekly sprint reviews, shared task boards, and daily async updates on Slack or WhatsApp.",
      },
      {
        question: "Will we own 100% of the code and intellectual property?",
        answer:
          "Yes. You receive full ownership of all source code, design assets, database schemas, and deployment credentials upon project completion.",
      },
    ],
  },

  // ── 3. React.js Development ─────────────────────────────────────────────
  "react-development": {
    name: "React.js Development",
    category: "Web Development",
    description:
      "Interactive React and Next.js interfaces with reusable component architectures, atomic state handling, and fast page experiences.",
    seo: {
      metaTitle: "React.js Development Services in Delhi NCR | Kraviona",
      metaDescription:
        "Build fast, component-driven interfaces with expert React.js and Next.js development services. Interactive SPAs, dynamic dashboards, and clean state flows.",
      keywords: [
        "React.js Development Services",
        "React JS Developers Delhi NCR",
        "Hire React Developer India",
        "Next.js React Agency",
        "Custom React SPA Development",
      ],
    },
    hero: {
      eyebrow: "Modern Frontend Engineering",
      title: "React.js Development",
      highlight: "Services",
      description:
        "Interactive, accessible, and ultra-fast user interfaces built with React 19 and Next.js. Engineered for zero layout shifts, smooth state transitions, and high conversion.",
    },
    intro:
      "A slow or sluggish frontend directly damages user engagement and conversion rates. Kraviona builds cutting-edge React.js applications characterized by modular design systems, efficient virtual DOM hydration, atomic state management, and seamless Next.js server-side rendering for optimal Core Web Vitals.",
    outcomes: [
      {
        title: "Reusable component design systems",
        description:
          "Atomic components that make ongoing UI feature expansion fast, consistent, and maintainable across your team.",
      },
      {
        title: "Next.js routing & hybrid rendering",
        description:
          "Server-side rendering (SSR), static site generation (SSG), and incremental static regeneration (ISR) for instant loads.",
      },
      {
        title: "Dynamic dashboards & single-page apps",
        description:
          "Fluid, data-dense interfaces with optimistic UI updates, real-time WebSockets, and clean error handling.",
      },
      {
        title: "Responsive, accessible UI delivery",
        description:
          "Strict adherence to WCAG accessibility guidelines, keyboard navigation, and seamless rendering across all mobile screens.",
      },
    ],
    deliverables: [
      "Custom React 19 / Next.js application codebase",
      "Modular design system with reusable UI component library",
      "State management implementation (Zustand, Redux Toolkit, or React Context)",
      "Optimized assets with responsive image loading and web font optimization",
      "API integration layer with React Query / SWR caching",
      "Unit and end-to-end UI tests with Vitest and Cypress",
    ],
    idealFor: [
      "Businesses needing fast, dynamic single-page applications (SPAs)",
      "SaaS companies requiring data-intensive operational dashboards",
      "Brands wanting to upgrade slow, legacy frontend interfaces",
      "Teams demanding pixel-perfect, responsive design implementation",
    ],
    process: [
      {
        title: "UI/UX & Component Architecture",
        description:
          "We analyze Figma designs, identify reusable component patterns, and plan state boundaries.",
      },
      {
        title: "Component Development & Styling",
        description:
          "We write semantic JSX with Tailwind CSS, establishing a consistent design system and accessible controls.",
      },
      {
        title: "State Management & API Data Hooks",
        description:
          "We connect backend endpoints using custom hooks, query caching, and optimistic mutations.",
      },
      {
        title: "Performance Optimization & Bundle Splitting",
        description:
          "We eliminate unnecessary re-renders, analyze bundle sizes, and verify perfect Core Web Vitals scores.",
      },
    ],
    techStack: [
      "React 19",
      "Next.js",
      "Redux Toolkit",
      "Zustand",
      "Tailwind CSS",
      "TypeScript",
      "Framer Motion",
      "Vite",
    ],
    faqs: [
      {
        question: "Why should we use React.js for our project?",
        answer:
          "React's component architecture, massive ecosystem, and fast virtual DOM make it the global standard for building scalable, responsive web applications that can adapt as your product grows.",
      },
      {
        question: "How do you handle SEO with React.js?",
        answer:
          "We use Next.js alongside React to enable server-side rendering (SSR) and static generation (SSG). This guarantees that Googlebot receives fully rendered HTML with complete metadata on initial request.",
      },
      {
        question: "Can Kraviona refactor an existing slow React app?",
        answer:
          "Yes. We profile render cycles, eliminate memory leaks, implement memoization where beneficial, split massive bundles, and modernize legacy class components into clean functional hooks.",
      },
      {
        question: "Do you build mobile-responsive React interfaces?",
        answer:
          "Yes. Every interface we build is mobile-first, fluidly adapting across smartphones, tablets, laptops, and ultra-wide desktop monitors.",
      },
      {
        question: "What state management library do you recommend?",
        answer:
          "For modern React apps, we prefer lightweight solutions like Zustand or React Query for server state, and Redux Toolkit for complex enterprise applications requiring time-travel debugging.",
      },
    ],
  },

  // ── 4. Node.js Development ─────────────────────────────────────────────
  "nodejs-development": {
    name: "Node.js Development",
    category: "Web Development",
    description:
      "Scalable Node.js backends, Express APIs, real-time systems, and production-grade server infrastructure.",
    seo: {
      metaTitle: "Node.js Development Services in Delhi NCR | Kraviona",
      metaDescription:
        "High-performance Node.js backend engineering, Express REST APIs, real-time WebSocket systems, and microservices architecture built for scale and concurrency.",
      keywords: [
        "Node.js Development Services",
        "Node JS Developers Delhi",
        "Hire Node Developer India",
        "Express API Development",
        "Real-time Node Backend",
        "Microservices Node.js",
      ],
    },
    hero: {
      eyebrow: "Server-Side Engineering",
      title: "Node.js Development",
      highlight: "Services",
      description:
        "Asynchronous, non-blocking Node.js backend infrastructure designed to manage thousands of concurrent connections with minimal memory overhead and zero downtime.",
    },
    intro:
      "Modern web applications demand backends that process data rapidly without locking server threads. Kraviona leverages the asynchronous event loop of Node.js to engineer ultra-fast API gateways, background worker queues, microservices, and real-time streaming backends capable of powering intensive business operations.",
    outcomes: [
      {
        title: "REST & GraphQL API development",
        description:
          "Cleanly structured endpoints with input validation, sanitization, and automated OpenAPI documentation.",
      },
      {
        title: "Enterprise authentication & security",
        description:
          "Hardened security headers (Helmet), rate limiting, bcrypt password hashing, and OAuth2/JWT workflows.",
      },
      {
        title: "Real-time WebSocket event pipelines",
        description:
          "Bi-directional live communication for messaging, notifications, collaborative tools, and tracking dashboards.",
      },
      {
        title: "Cloud-ready backend deployment",
        description:
          "Containerized Docker services managed by PM2 clustering on Linux EC2 instances behind Nginx reverse proxies.",
      },
    ],
    deliverables: [
      "Production-grade Node.js / Express or NestJS backend codebase",
      "Comprehensive RESTful or GraphQL API endpoint suite",
      "Authentication and authorization subsystem with role permissions",
      "Database connection pooling and data migration scripts",
      "Background task worker system using Redis / BullMQ",
      "Automated unit and integration test suite with Jest / Supertest",
    ],
    idealFor: [
      "Applications requiring high concurrency and real-time updates",
      "Mobile apps needing rapid, low-latency API responses",
      "Microservice architectures replacing legacy monolithic backends",
      "Businesses building payment, booking, or e-commerce transactions",
    ],
    process: [
      {
        title: "API Design & Domain Modeling",
        description:
          "We define API contracts, payload schemas, HTTP status codes, and error responses before writing code.",
      },
      {
        title: "Service Implementation & Security Hardening",
        description:
          "We develop controllers, services, middleware, and authentication with strict input sanitization.",
      },
      {
        title: "Database Integration & Caching",
        description:
          "We wire up PostgreSQL or MongoDB with connection pooling and Redis caching for frequently accessed data.",
      },
      {
        title: "Benchmarking, Load Testing & Cloud Release",
        description:
          "We stress-test concurrency limits, optimize event-loop performance, and configure production PM2 clusters.",
      },
    ],
    techStack: [
      "Node.js",
      "Express.js",
      "NestJS",
      "Socket.io",
      "Redis",
      "MongoDB",
      "PostgreSQL",
      "JWT",
      "Docker",
      "AWS",
    ],
    faqs: [
      {
        question: "Why is Node.js ideal for modern web backends?",
        answer:
          "Its non-blocking I/O model allows a single Node.js process to handle thousands of concurrent client connections efficiently without the memory overhead of thread-per-request architectures.",
      },
      {
        question: "Can Node.js handle CPU-intensive computations?",
        answer:
          "Yes. For CPU-bound tasks, we implement Node.js worker threads, offload tasks to background message queues like Redis/BullMQ, or integrate microservices written in Python or Go.",
      },
      {
        question: "How does Kraviona secure Node.js APIs against attacks?",
        answer:
          "We implement CORS policies, Helmet security headers, express-rate-limit to stop DDoS/brute-force attacks, parameter sanitization against SQL/NoSQL injection, and strict JWT validation.",
      },
      {
        question: "Do you use Express or NestJS?",
        answer:
          "We use Express.js for lightweight, flexible microservices and APIs, and NestJS when an enterprise client requires strict TypeScript typing, dependency injection, and Angular-like architecture.",
      },
      {
        question: "How do you monitor Node.js applications in production?",
        answer:
          "We configure PM2 process managers with cluster mode, structured Winston/Pino logging, and external health-check monitors that alert us immediately upon server anomalies.",
      },
    ],
  },

  // ── 5. Backend Development ──────────────────────────────────────────────
  "backend-development": {
    name: "Backend Development",
    category: "Backend & Architecture",
    description:
      "Robust server-side systems, business logic, integrations, and API layers designed for maintainability.",
    seo: {
      metaTitle: "Backend Development Services in Delhi NCR | Kraviona",
      metaDescription:
        "Robust backend engineering for web and mobile platforms. We build secure business logic, microservices, caching layers, and database connectors that never fail.",
      keywords: [
        "Backend Development Services",
        "Backend Developers Delhi",
        "Server Side Architecture India",
        "Custom Backend Engineering",
        "Microservices Development",
        "Secure API Systems",
      ],
    },
    hero: {
      eyebrow: "Core Infrastructure & Logic",
      title: "Backend Development",
      highlight: "Services",
      description:
        "Rock-solid server-side systems engineered for fault tolerance, data consistency, sub-millisecond response times, and bulletproof security.",
    },
    intro:
      "The backbone of any reliable application is its backend. Kraviona designs resilient server-side infrastructures that handle complex business logic, strict role-based authorization, high-volume transactions, and reliable third-party integrations while maintaining zero downtime.",
    outcomes: [
      {
        title: "Secure backend architecture",
        description:
          "Modular code structure with domain-driven boundaries, automated validation, and clear error handling.",
      },
      {
        title: "Microservices & modular APIs",
        description:
          "Decoupled service modules that allow different parts of your platform to scale independently.",
      },
      {
        title: "Database & caching integration",
        description:
          "Optimized queries, connection pools, and Redis caching layers that eliminate server bottlenecks.",
      },
      {
        title: "Logging, testing & deployment support",
        description:
          "Structured telemetry, centralized logging, automated test suites, and production deployment scripts.",
      },
    ],
    deliverables: [
      "Complete server-side architecture and business logic codebase",
      "Secure authentication and session management system",
      "Optimized database layer with automated migration scripts",
      "Integration with payment gateways, SMS/email, and external APIs",
      "Automated unit and integration test coverage",
      "Production deployment documentation and infrastructure setup",
    ],
    idealFor: [
      "Companies scaling beyond simple monolithic websites",
      "Mobile app creators needing a dedicated, fast backend API",
      "Enterprises replacing manual spreadsheet workflows with automated software",
      "Products with strict security, audit, and compliance requirements",
    ],
    process: [
      {
        title: "System Discovery & Flow Mapping",
        description:
          "We analyze user transactions, edge cases, data persistence rules, and security compliance constraints.",
      },
      {
        title: "Schema & Architecture Planning",
        description:
          "We design relational tables or document collections, API endpoints, and caching strategies.",
      },
      {
        title: "Core Service Implementation",
        description:
          "We develop business logic, validation rules, third-party hooks, and asynchronous queues.",
      },
      {
        title: "Hardening & Cloud Release",
        description:
          "We conduct security reviews, stress-test under heavy load, and deploy onto production cloud servers.",
      },
    ],
    techStack: [
      "Node.js",
      "Express.js",
      "Python",
      "PostgreSQL",
      "MongoDB",
      "Redis",
      "Docker",
      "AWS",
      "Nginx",
      "Linux",
    ],
    faqs: [
      {
        question: "Can Kraviona fix or improve our existing backend?",
        answer:
          "Yes. We conduct thorough backend audits to identify slow database queries, security vulnerabilities, memory leaks, and architectural flaws, then provide a prioritized refactoring plan.",
      },
      {
        question: "How do you protect backend systems from data loss?",
        answer:
          "We implement database transaction rollbacks (ACID compliance), automated point-in-time snapshots, multi-region database backups, and strict input validation.",
      },
      {
        question: "Do you build microservices or monolithic backends?",
        answer:
          "We recommend modular monoliths for early-stage and medium products to avoid unnecessary distributed complexity, and transition to microservices when specific domains require independent scaling.",
      },
      {
        question: "What security standards do you follow?",
        answer:
          "We adhere to OWASP Top 10 security standards: parameterized queries to prevent SQL/NoSQL injection, robust CORS, CSRF protection, rate limiting, and encrypted data at rest and in transit.",
      },
      {
        question: "Can your backend connect with third-party ERP or CRM systems?",
        answer:
          "Yes. We frequently integrate custom backends with Salesforce, HubSpot, SAP, Zoho, Stripe, Razorpay, Shiprocket, and proprietary legacy systems.",
      },
    ],
  },

  // ── 6. API Development ──────────────────────────────────────────────────
  "api-development": {
    name: "API Development",
    category: "Backend & Architecture",
    description:
      "Custom RESTful and GraphQL APIs for web apps, mobile apps, admin panels, and third-party integrations.",
    seo: {
      metaTitle: "API Development & Integration Services | Kraviona",
      metaDescription:
        "Custom RESTful and GraphQL API development and third-party integration services. Secure authentication, OpenAPI documentation, webhooks, and rate limiting.",
      keywords: [
        "API Development Services",
        "REST API Development Delhi",
        "Custom API Developers India",
        "GraphQL Integration",
        "Webhook Architecture",
        "Third Party API Integration",
      ],
    },
    hero: {
      eyebrow: "Connected Systems & APIs",
      title: "API Development &",
      highlight: "Integration",
      description:
        "High-throughput, well-documented REST and GraphQL APIs that connect your web apps, mobile clients, internal databases, and external third-party services.",
    },
    intro:
      "APIs are the connective tissue of modern software. Kraviona designs and deploys secure, predictable, and versioned APIs with strict schema validation, OAuth2/JWT authentication, rate limiting, and automated OpenAPI documentation, ensuring seamless integration for developers and clients.",
    outcomes: [
      {
        title: "Versioned API architecture",
        description:
          "Semantic URL versioning (e.g., /api/v1/) that allows you to release new features without breaking existing clients.",
      },
      {
        title: "OpenAPI & Postman documentation",
        description:
          "Interactive documentation that allows frontend developers, mobile teams, and partners to integrate instantly.",
      },
      {
        title: "Rate limiting & validation middleware",
        description:
          "DDoS protection, throttling, and strict JSON schema validation that rejects malformed requests before processing.",
      },
      {
        title: "Payment, CRM & third-party integrations",
        description:
          "Reliable webhook handlers, idempotency keys, and retry queues for seamless external service integration.",
      },
    ],
    deliverables: [
      "Custom RESTful or GraphQL API server codebase",
      "Interactive Swagger/OpenAPI documentation portal",
      "Postman collection with environment variables and sample requests",
      "Authentication and API key management system",
      "Webhook processing infrastructure with retry logic and signature verification",
      "Automated test coverage for all endpoints and status codes",
    ],
    idealFor: [
      "Mobile app teams needing a fast, documented backend API",
      "SaaS companies providing public or partner developer APIs",
      "Businesses integrating multiple third-party tools into a unified portal",
      "Enterprises replacing brittle point-to-point connections with clean API contracts",
    ],
    process: [
      {
        title: "API Contract & Specification",
        description:
          "We define resource endpoints, query parameters, payload schemas, and response formats using OpenAPI 3.0.",
      },
      {
        title: "Endpoint Implementation & Auth",
        description:
          "We build controllers, business services, authentication middleware, and input sanitizers.",
      },
      {
        title: "Third-Party Integration & Webhooks",
        description:
          "We connect payment processors, communication gateways, and CRMs with idempotent webhook handlers.",
      },
      {
        title: "Documentation & Performance Tuning",
        description:
          "We generate interactive documentation, benchmark payload latency, and configure edge caching.",
      },
    ],
    techStack: [
      "Node.js",
      "Express.js",
      "GraphQL",
      "REST",
      "Swagger/OpenAPI",
      "Postman",
      "OAuth 2.0",
      "Stripe API",
      "Redis",
      "JWT",
    ],
    faqs: [
      {
        question: "Should we build a REST API or a GraphQL API?",
        answer:
          "REST is ideal for straightforward CRUD applications, caching, and public developer APIs. GraphQL is superior when mobile apps or complex frontends need precise data fetching to avoid over-fetching across nested resources.",
      },
      {
        question: "How do you secure public and private APIs?",
        answer:
          "We use JWT tokens with short expiry and refresh cycles for users, API keys with IP whitelisting and rate limiting for server-to-server calls, and HMAC signatures for inbound webhooks.",
      },
      {
        question: "What is idempotency and why does it matter for APIs?",
        answer:
          "Idempotency guarantees that repeating an API call (e.g., due to a network glitch during a payment charge) will not execute duplicate transactions on your server.",
      },
      {
        question: "Do you provide Postman collections for our team?",
        answer:
          "Yes. Every API project includes a complete, pre-configured Postman collection with test scripts and environment variables for staging and production.",
      },
      {
        question: "Can Kraviona integrate legacy enterprise SOAP or XML APIs?",
        answer:
          "Yes. We build modern RESTful API wrappers around legacy SOAP and XML services, translating archaic formats into clean, modern JSON.",
      },
    ],
  },

  // ── 7. Database Architecture ────────────────────────────────────────────
  "database-architecture": {
    name: "Database Architecture",
    category: "Backend & Architecture",
    description:
      "Optimized database design for reliability, reporting, scalability, and clean application development.",
    seo: {
      metaTitle: "Database Architecture & Optimization | Kraviona",
      metaDescription:
        "Expert database architecture, schema planning, indexing, and query optimization for MongoDB and SQL. Ensure lightning-fast queries, data integrity, and scale.",
      keywords: [
        "Database Architecture Services",
        "Database Design Company Delhi",
        "MongoDB Schema Optimization",
        "PostgreSQL Architecture",
        "Database Query Tuning",
        "Database Migration India",
      ],
    },
    hero: {
      eyebrow: "High-Scale Data Modeling",
      title: "Database Architecture &",
      highlight: "Optimization",
      description:
        "Relational and document database design optimized for query speed, data integrity, seamless sharding, and high-concurrency read/write operations.",
    },
    intro:
      "Poor database design is the number one cause of slow application response times and escalating server bills. Kraviona audits, models, and optimizes database schemas for both NoSQL (MongoDB) and relational (PostgreSQL/MySQL) architectures, implementing targeted indexes and caching layers that prevent database bottlenecks.",
    outcomes: [
      {
        title: "MongoDB & SQL schema planning",
        description:
          "Normalized relational models or embedded document patterns tailored to your exact application access patterns.",
      },
      {
        title: "Indexing & query optimization",
        description:
          "Compound indexes, partial filters, and query plan profiling (EXPLAIN ANALYZE) that drop query times from seconds to milliseconds.",
      },
      {
        title: "Zero-downtime data migration support",
        description:
          "Safe schema versioning, dual-write strategies, and phased data synchronization across environments.",
      },
      {
        title: "Backup, security & access strategy",
        description:
          "Automated snapshots, encryption at rest, least-privilege user roles, and high-availability replica sets.",
      },
    ],
    deliverables: [
      "Entity Relationship Diagrams (ERD) and document schema blueprints",
      "Production-ready migration scripts with rollback safeguards",
      "Index strategy blueprint and slow-query analysis report",
      "Redis caching layer configuration for read-heavy tables",
      "Automated database backup and point-in-time recovery routine",
      "Database security hardening and connection pool configuration",
    ],
    idealFor: [
      "Applications experiencing sluggish response times due to unindexed queries",
      "Growing platforms preparing for high-traffic product launches",
      "Teams needing to migrate data from legacy databases to modern cloud databases",
      "Companies requiring strict ACID compliance and financial data integrity",
    ],
    process: [
      {
        title: "Access Pattern & Workload Analysis",
        description:
          "We profile your read-to-write ratios, slow queries, execution plans, and data growth projections.",
      },
      {
        title: "Schema Design & Relationship Modeling",
        description:
          "We structure tables, foreign keys, or document structures to match real-world query paths.",
      },
      {
        title: "Index Engineering & Caching Setup",
        description:
          "We create targeted compound indexes and integrate Redis caching for frequent, repetitive queries.",
      },
      {
        title: "Stress Testing & Migration Execution",
        description:
          "We simulate peak traffic loads, run automated migrations, and verify zero data corruption.",
      },
    ],
    techStack: [
      "MongoDB",
      "PostgreSQL",
      "MySQL",
      "Redis",
      "Mongoose",
      "Prisma ORM",
      "Query Optimization",
      "AWS RDS",
    ],
    faqs: [
      {
        question: "When should we use MongoDB vs PostgreSQL?",
        answer:
          "PostgreSQL is superior for complex relations, strict ACID transactions, and structured financial data. MongoDB excels at rapid prototyping, dynamic product attributes, and high-volume document ingestion.",
      },
      {
        question: "How do you fix slow queries in production?",
        answer:
          "We run EXPLAIN ANALYZE to identify sequential table scans, add missing compound indexes, refactor costly JOINs, and introduce Redis caching for static data.",
      },
      {
        question: "Can Kraviona execute a live database migration without downtime?",
        answer:
          "Yes. We use phased dual-write strategies: sync old and new schemas simultaneously, backfill historical data in background chunks, and switch database reads with zero user interruption.",
      },
      {
        question: "What is connection pooling and do we need it?",
        answer:
          "Opening a new database connection for every request is expensive and can crash your server under traffic surges. Connection pooling keeps a warm pool of reusable connections, dramatically improving concurrency.",
      },
      {
        question: "How often should database backups be automated?",
        answer:
          "We configure daily automated snapshots with 30-day retention, continuous write-ahead log (WAL) archiving for point-in-time recovery, and weekly backup restoration testing.",
      },
    ],
  },

  // ── 8. SaaS Development ─────────────────────────────────────────────────
  "saas-development": {
    name: "SaaS Development",
    category: "Backend & Architecture",
    description:
      "Cloud-based SaaS platforms with multi-tenant logic, subscriptions, dashboards, and scalable product foundations.",
    seo: {
      metaTitle: "SaaS Application Development Services | Kraviona",
      metaDescription:
        "Scalable cloud-native SaaS development with multi-tenant architecture, Stripe billing, role dashboards, and automated onboarding. Launch your MVP fast.",
      keywords: [
        "SaaS Development Services",
        "SaaS Development Company Delhi",
        "Multi-Tenant SaaS Architecture",
        "B2B SaaS Application India",
        "Cloud Software Development",
        "SaaS MVP Development",
      ],
    },
    hero: {
      eyebrow: "Cloud Software Engineering",
      title: "SaaS Product",
      highlight: "Development",
      description:
        "End-to-end software-as-a-service architecture built for scale. Multi-tenant data models, automated recurring billing, self-service onboarding, and admin analytics.",
    },
    intro:
      "Building a successful SaaS product requires more than standard web features; it requires tenant isolation, automated subscription life-cycles, usage metering, and robust security. Kraviona engineers scalable B2B and B2C SaaS platforms from initial architectural discovery to production launch.",
    outcomes: [
      {
        title: "MVP & SaaS product architecture",
        description:
          "Clean modular foundations that allow rapid feature iteration without breaking existing customer workspaces.",
      },
      {
        title: "Subscription & recurring billing workflows",
        description:
          "Seamless Stripe and Razorpay integrations handling plans, upgrades, downgrades, trials, and invoices.",
      },
      {
        title: "Multi-tenant data isolation & security",
        description:
          "Strict workspace partitioning ensuring one tenant cannot accidentally access another tenant's data.",
      },
      {
        title: "Admin panels & usage analytics",
        description:
          "Super-admin controls, MRR tracking, user impersonation for support, and automated churn notifications.",
      },
    ],
    deliverables: [
      "Complete multi-tenant SaaS application codebase",
      "Stripe / Razorpay subscription billing and customer portal",
      "Self-service team onboarding and invite workflows",
      "Role-Based Access Control (RBAC) with owner, admin, and member tiers",
      "Super-admin control dashboard with analytics and management tools",
      "Production cloud infrastructure with automated backups and monitoring",
    ],
    idealFor: [
      "Founders turning a business concept into an operational SaaS MVP",
      "B2B software companies transitioning to modern cloud subscriptions",
      "Agencies packaging internal software tools into public SaaS products",
      "Enterprises needing custom subscription platforms for clients",
    ],
    process: [
      {
        title: "SaaS Modeling & Scope Definition",
        description:
          "We define subscription tiers, feature gates, tenant partitioning strategy, and core user workflows.",
      },
      {
        title: "Multi-Tenant Core Engineering",
        description:
          "We build workspace isolation, team invite logic, authentication, and database schemas.",
      },
      {
        title: "Billing & Feature Gating",
        description:
          "We integrate payment webhooks, trial handling, automated prorations, and tier-based feature switches.",
      },
      {
        title: "Testing, Admin Tools & Launch",
        description:
          "We stress-test tenant isolation, build customer support tools, and deploy onto high-availability cloud servers.",
      },
    ],
    techStack: [
      "Next.js",
      "Node.js",
      "PostgreSQL",
      "Stripe / Razorpay",
      "Redis",
      "AWS",
      "Docker",
      "Tailwind CSS",
      "TypeScript",
    ],
    faqs: [
      {
        question: "How do you handle multi-tenancy in SaaS applications?",
        answer:
          "Depending on compliance needs, we implement tenant-isolated schemas, row-level security (RLS) in PostgreSQL, or workspace foreign-key partitioning with automated middleware verification on every query.",
      },
      {
        question: "Can you integrate recurring payments with Stripe and Indian gateways?",
        answer:
          "Yes. We integrate Stripe for global cards and subscriptions, and Razorpay or Cashfree for Indian payment methods including UPI Autopay and recurring net banking.",
      },
      {
        question: "How long does it take to build an MVP SaaS?",
        answer:
          "A focused, production-grade SaaS MVP typically takes 6 to 10 weeks, covering authentication, team workspaces, core features, billing, and the super-admin console.",
      },
      {
        question: "How do you handle feature gating between different pricing tiers?",
        answer:
          "We build server-side permission checks tied to active subscription status, ensuring users cannot access higher-tier features without upgrading.",
      },
      {
        question: "Can we migrate existing customers into the new SaaS platform?",
        answer:
          "Yes. We write custom migration scripts to import user accounts, legacy billing plans, and historical data safely into the new platform.",
      },
    ],
  },

  // ── 9. Technical SEO ────────────────────────────────────────────────────
  "technical-seo": {
    name: "Technical SEO",
    category: "Performance & AI",
    description:
      "Core Web Vitals remediation, canonical auditing, structured data, indexation control, and crawl architecture that boosts organic search visibility.",
    seo: {
      metaTitle: "Technical SEO Services in Delhi NCR | Kraviona",
      metaDescription:
        "Solve crawl errors, canonical conflicts, Core Web Vitals, and indexation issues with expert technical SEO services. Turn technical health into Google rankings.",
      keywords: [
        "Technical SEO Services",
        "Technical SEO Company Delhi NCR",
        "Core Web Vitals Optimization",
        "Canonical Fixes SEO",
        "Schema Markup Services India",
        "Technical SEO Audit",
      ],
    },
    hero: {
      eyebrow: "Search Engine Architecture",
      title: "Technical SEO",
      highlight: "Services",
      description:
        "Eliminate crawl barriers, resolve duplicate content and canonical loops, optimize Core Web Vitals, and build structured data schemas that search engines trust.",
    },
    intro:
      "Even the finest content fails to rank if search engines encounter broken redirects, conflicting canonicals, slow server response times, or faulty JavaScript rendering. Kraviona conducts in-depth code-level technical SEO audits and delivers hands-on fixes directly within your Next.js and web applications.",
    outcomes: [
      {
        title: "Technical SEO audit & prioritized roadmap",
        description:
          "We inspect your crawl logs, search console reports, server response headers, and rendering pipeline.",
      },
      {
        title: "Schema markup & rich snippet validation",
        description:
          "Custom JSON-LD structured data for Organization, LocalBusiness, Breadcrumbs, FAQs, Services, and Articles.",
      },
      {
        title: "Crawl, indexation & canonical resolution",
        description:
          "Fix duplicate URL variations, trailing slash loops, www vs non-www redirects, and accidental noindex tags.",
      },
      {
        title: "Core Web Vitals (LCP, INP, CLS) remediation",
        description:
          "Code-level frontend and server tuning that passes Google's official Core Web Vitals assessment.",
      },
    ],
    deliverables: [
      "Comprehensive technical SEO audit report with prioritized fixes",
      "Direct code-level implementation of canonical tags and redirects in Next.js/Nginx",
      "Complete Schema.org JSON-LD structured data implementation",
      "XML sitemap and robots.txt overhaul ensuring 100% crawl efficiency",
      "Core Web Vitals performance remediation (LCP, INP, CLS)",
      "Google Search Console error resolution and re-indexing validation",
    ],
    idealFor: [
      "Websites struggling with 'Duplicate, Google chose different canonical than user'",
      "Next.js and React applications suffering from client-side rendering indexing issues",
      "Websites failing Google Core Web Vitals assessments",
      "E-commerce stores with faceted navigation generating duplicate indexable URLs",
    ],
    process: [
      {
        title: "Full-Site Crawl & Architecture Audit",
        description:
          "We crawl your entire website with Screaming Frog to identify status codes, canonicals, schema, and orphan pages.",
      },
      {
        title: "Log File & Search Console Analysis",
        description:
          "We review Google Search Console coverage reports and server logs to observe real Googlebot crawl behavior.",
      },
      {
        title: "Direct Code-Level Implementation",
        description:
          "Unlike agencies that only hand over PDFs, we modify the codebase directly, fixing metadata, headers, and templates.",
      },
      {
        title: "Validation & Re-indexing Verification",
        description:
          "We test all URLs with Google Rich Results Test, validate HTTP responses, and submit sitemaps for priority crawl.",
      },
    ],
    techStack: [
      "Google Search Console",
      "Screaming Frog",
      "Schema.org",
      "Next.js Metadata",
      "Lighthouse",
      "Vitals API",
      "Ahrefs / SEMrush",
      "Nginx",
    ],
    faqs: [
      {
        question: "What is the difference between technical SEO and regular SEO?",
        answer:
          "Regular SEO focuses primarily on keyword research, copywriting, and backlinks. Technical SEO ensures search engine crawlers can efficiently discover, render, understand, and index every page without server errors or duplicate signals.",
      },
      {
        question: "How do you fix 'Google chose different canonical than user'?",
        answer:
          "We enforce a single preferred domain origin (HTTPS + WWW), ensure absolute self-referencing canonical tags, clean internal link inconsistencies, remove redirected URLs from XML sitemaps, and return 301 permanent redirects for all variants.",
      },
      {
        question: "Do you implement the fixes yourself or just provide recommendations?",
        answer:
          "We are full-stack developers. We implement all technical SEO changes directly into your Next.js codebase, Nginx virtual hosts, and cloud servers, verifying the changes in production.",
      },
      {
        question: "Why does Core Web Vitals matter for SEO?",
        answer:
          "Core Web Vitals are official Google search ranking signals that measure Largest Contentful Paint (LCP), Interaction to Next Paint (INP), and Cumulative Layout Shift (CLS). Passing scores provide a direct competitive edge.",
      },
      {
        question: "Can JavaScript frameworks like Next.js cause SEO problems?",
        answer:
          "If misconfigured, client-rendered React apps can serve empty HTML shells to crawlers. Kraviona uses Next.js server-side rendering (SSR) and static generation (SSG) to ensure search bots receive full semantic HTML instantly.",
      },
    ],
  },

  // ── 10. Web Performance Optimization ────────────────────────────────────
  "web-performance-optimization": {
    name: "Web Performance Optimization",
    category: "Performance & AI",
    description:
      "Sub-second load times, Core Web Vitals (LCP, INP, CLS) optimization, asset minification, server caching, and frontend bundle reduction.",
    seo: {
      metaTitle: "Web Performance Optimization Services | Kraviona",
      metaDescription:
        "Boost page speed, pass Core Web Vitals (LCP, INP, CLS), and cut bounce rates. Frontend code splitting, image optimization, server caching, and bundle trimming.",
      keywords: [
        "Web Performance Optimization",
        "Core Web Vitals Services",
        "Website Speed Optimization Delhi",
        "Lighthouse 100 Score Agency",
        "Page Speed Optimization India",
        "Next.js Speed Optimization",
      ],
    },
    hero: {
      eyebrow: "Speed & Core Web Vitals",
      title: "Web Performance",
      highlight: "Optimization",
      description:
        "Transform slow, sluggish pages into lightning-fast experiences. Achieve green Core Web Vitals scores, boost Google rankings, and dramatically reduce user drop-offs.",
    },
    intro:
      "Every 100ms of latency costs conversions and degrades organic rankings. Kraviona diagnoses and resolves performance bottlenecks across every layer: oversized JavaScript bundles, uncompressed media, render-blocking scripts, unoptimized fonts, and missing edge-caching policies.",
    outcomes: [
      {
        title: "Lighthouse & Core Web Vitals mastery",
        description:
          "Achieve green scores (90+) on Google PageSpeed Insights across both mobile and desktop audits.",
      },
      {
        title: "Image, font & media optimization",
        description:
          "Next-gen WebP/AVIF formats, responsive srcset sizing, font preloading, and zero layout shift during loading.",
      },
      {
        title: "Bundle & render performance cleanup",
        description:
          "Tree-shaking unused libraries, dynamic imports, code splitting, and memoizing expensive computations.",
      },
      {
        title: "Server caching & CDN configuration",
        description:
          "Aggressive cache-control headers, Cloudflare edge caching, and Gzip/Brotli compression at the web server layer.",
      },
    ],
    deliverables: [
      "Before-and-after Core Web Vitals benchmark audit report",
      "Automated image conversion pipeline to WebP / AVIF with responsive dimensions",
      "JavaScript bundle trimming and dead-code elimination",
      "Web font optimization with font-display: swap and local hosting",
      "Nginx server-level Brotli compression and cache-control header rules",
      "Elimination of render-blocking CSS and JavaScript resources",
    ],
    idealFor: [
      "Websites failing Google Core Web Vitals benchmarks",
      "E-commerce stores losing sales due to slow mobile loading speeds",
      "SaaS dashboards suffering from sluggish user interactions and input delay",
      "Brands wanting sub-second page loads to outrank slower competitors",
    ],
    process: [
      {
        title: "Performance Profiling & Bottleneck Isolation",
        description:
          "We record Chrome DevTools traces, Lighthouse audits, and network waterfalls to isolate slow resources.",
      },
      {
        title: "Asset & Media Engineering",
        description:
          "We compress media, configure modern formats, inline critical CSS, and defer non-essential scripts.",
      },
      {
        title: "JavaScript Optimization & Code Splitting",
        description:
          "We analyze webpack/Turbopack bundles, replace bloated libraries, and implement dynamic lazy loading.",
      },
      {
        title: "Server Caching & Final Verification",
        description:
          "We tune Nginx/CDN caching, verify 90+ Lighthouse scores, and measure real user metrics (RUM).",
      },
    ],
    techStack: [
      "Chrome DevTools",
      "Google Lighthouse",
      "WebPageTest",
      "Next.js Bundle Analyzer",
      "Cloudflare CDN",
      "Redis Caching",
      "Nginx Brotli",
      "Sharp / ImageMagick",
    ],
    faqs: [
      {
        question: "How much does page speed impact conversion rates?",
        answer:
          "Studies by Google and Portent consistently show that pages loading in 1 second achieve up to 3x higher conversion rates than pages taking 5 seconds. Every second shaved directly increases revenue.",
      },
      {
        question: "What is Interaction to Next Paint (INP) and how do you fix it?",
        answer:
          "INP measures how quickly a page responds when a user clicks or taps. We fix poor INP by breaking long JavaScript tasks into smaller chunks, avoiding synchronous main-thread blocking, and optimizing event listeners.",
      },
      {
        question: "Can you optimize performance without breaking our website design?",
        answer:
          "Yes. Performance optimization improves how assets load under the hood; it does not require changing your visual design or removing necessary product features.",
      },
      {
        question: "Do third-party scripts like Google Analytics and tag managers slow sites down?",
        answer:
          "Yes. We optimize third-party tags using Next.js Script component strategies (lazyOnload, worker threads via Partytown) so tracking scripts do not block your main content rendering.",
      },
      {
        question: "Will our website stay fast after the optimization project finishes?",
        answer:
          "We provide performance budgeting guidelines, automated CI checks, and image optimization best practices so your team does not accidentally reintroduce performance debt in future updates.",
      },
    ],
  },

  // ── 11. AI Automation ───────────────────────────────────────────────────
  "ai-automation": {
    name: "AI Automation",
    category: "Performance & AI",
    description:
      "Custom LLM integrations, document intelligence, intelligent workflow automations, and operational AI assistants that save hundreds of human hours.",
    seo: {
      metaTitle: "AI Workflow Automation Services | Kraviona",
      metaDescription:
        "Automate repetitive manual workflows with custom LLMs, smart data extraction, and AI agents. Streamline operations, reduce manual hours, and scale efficiently.",
      keywords: [
        "AI Automation Services",
        "AI Workflow Automation Delhi",
        "LLM Integration Company India",
        "Business Process Automation AI",
        "Custom AI Solutions",
        "Enterprise AI Workflows",
      ],
    },
    hero: {
      eyebrow: "Intelligent Process Automation",
      title: "AI Workflow",
      highlight: "Automation",
      description:
        "Bridge manual workflows with autonomous AI pipelines. Integrate modern LLMs, automate structured data extraction, and empower your team with intelligent internal tools.",
    },
    intro:
      "Repetitive manual tasks deplete team productivity and create unnecessary overhead. Kraviona designs tailored AI automation pipelines utilizing state-of-the-art Large Language Models (LLMs) and custom APIs to automate document processing, customer triage, catalog enrichment, and CRM synchronization.",
    outcomes: [
      {
        title: "LLM & generative AI integrations",
        description:
          "Custom API pipelines leveraging OpenAI GPT-4, Anthropic Claude, or open-source models for business tasks.",
      },
      {
        title: "Autonomous workflow design",
        description:
          "Multi-step agent pipelines that execute research, summarize data, and trigger real actions in your databases.",
      },
      {
        title: "Smart data extraction & parsing",
        description:
          "Extract structured JSON data from messy PDF invoices, emails, physical documents, and customer tickets.",
      },
      {
        title: "Internal AI productivity tools",
        description:
          "Tailored internal portals and Slack/WhatsApp bots that answer employee queries based on company SOPs.",
      },
    ],
    deliverables: [
      "Custom AI automation architecture and backend pipeline",
      "API integrations connecting LLMs to your database and business apps",
      "Structured data extraction pipelines for invoices, emails, and forms",
      "Prompt engineering and system prompt guardrails preventing hallucinations",
      "Admin monitoring dashboard tracking token usage, costs, and execution logs",
      "Complete employee training and standard operating procedures (SOPs)",
    ],
    idealFor: [
      "Businesses spending excessive hours on manual data entry and spreadsheet processing",
      "Operations teams needing fast, automated document verification and summarization",
      "E-commerce brands needing bulk product title and description generation",
      "Companies wanting to introduce AI efficiencies without hiring a full in-house AI team",
    ],
    process: [
      {
        title: "Workflow Audit & Opportunity Mapping",
        description:
          "We analyze your daily repetitive business tasks to identify high-ROI automation opportunities.",
      },
      {
        title: "Prompt Design & Prototype Validation",
        description:
          "We engineer resilient prompts, test structured outputs, and establish guardrails with real sample data.",
      },
      {
        title: "Pipeline Integration & Database Hooks",
        description:
          "We connect the AI model to your website, CRM, webhooks, and cloud databases.",
      },
      {
        title: "Telemetry, Guardrails & Handover",
        description:
          "We set up rate limiting, token cost controls, human-in-the-loop review queues, and team training.",
      },
    ],
    techStack: [
      "OpenAI API",
      "Anthropic Claude",
      "LangChain",
      "Python",
      "Zapier / Make",
      "Node.js",
      "Webhooks",
      "PostgreSQL",
    ],
    faqs: [
      {
        question: "How can AI automation actually help our business?",
        answer:
          "AI automation replaces tedious manual work: categorizing inbound customer inquiries, parsing invoices, enriching product catalog data, generating personalized email drafts, and syncing records between disconnected tools.",
      },
      {
        question: "Is our proprietary business data safe when using AI models?",
        answer:
          "Yes. We use enterprise API endpoints where providers (such as OpenAI and Anthropic) explicitly contract that your data is never used to train public models. Sensitive credentials and PII are scrubbed prior to API transmission.",
      },
      {
        question: "How do you prevent AI hallucinations?",
        answer:
          "We use strict temperature settings, few-shot prompting, schema validation (JSON mode / Zod schemas), and Retrieval-Augmented Generation (RAG) so the AI can only respond using verified facts provided in the prompt context.",
      },
      {
        question: "What are the ongoing costs of running AI automations?",
        answer:
          "API usage is billed per token by LLM providers. For most small to mid-sized business automations, monthly token expenses typically range from $10 to $100, which is a fraction of the cost of manual labor.",
      },
      {
        question: "Can AI automations include a human review step?",
        answer:
          "Yes. We frequently implement human-in-the-loop workflows where the AI prepares the draft or extraction, and an internal team member approves it with one click before final processing.",
      },
    ],
  },

  // ── 12. AI Chatbot Development ──────────────────────────────────────────
  "ai-chatbot-development": {
    name: "AI Chatbot Development",
    category: "Performance & AI",
    description:
      "Intelligent conversational AI assistants and chatbots trained on your business data for 24/7 lead capture, support triage, and customer conversion.",
    seo: {
      metaTitle: "Custom AI Chatbot Development Services | Kraviona",
      metaDescription:
        "Deploy intelligent AI chatbots trained on your internal knowledge base. 24/7 lead capture, automated customer support, and seamless human agent handoffs.",
      keywords: [
        "AI Chatbot Development",
        "Custom AI Chatbots Delhi",
        "Conversational AI Company India",
        "Customer Support Chatbot",
        "GPT-4 Chatbot Development",
        "Website Chatbot Integration",
      ],
    },
    hero: {
      eyebrow: "Conversational AI & Support",
      title: "AI Chatbot",
      highlight: "Development",
      description:
        "Custom-trained AI chatbots that understand context, answer complex product queries instantly, qualify leads 24/7, and route urgent conversations to human agents.",
    },
    intro:
      "Traditional rule-based chatbots frustrate visitors with rigid scripts. Kraviona builds intelligent conversational agents powered by Retrieval-Augmented Generation (RAG) and vector embeddings, allowing them to answer queries accurately based strictly on your company's knowledge base and product documentation.",
    outcomes: [
      {
        title: "Custom website chatbot setup",
        description:
          "Branded, responsive chat widget matching your color palette, typography, and company tone of voice.",
      },
      {
        title: "Automated lead qualification flows",
        description:
          "Gently gathers visitor names, emails, project requirements, and budget details before pushing to your CRM.",
      },
      {
        title: "Knowledge base & FAQ RAG training",
        description:
          "Ingests company docs, product manuals, and pricing sheets to deliver grounded, factual answers.",
      },
      {
        title: "Seamless human agent handoff & analytics",
        description:
          "Instantly alerts human reps via email, Slack, or WhatsApp when a customer requests real-time personal support.",
      },
    ],
    deliverables: [
      "Custom conversational AI widget integrated into your website",
      "Vector database pipeline (Pinecone/Chroma) storing embedded company knowledge",
      "Lead capture automation synced directly to your email or CRM",
      "Live conversation dashboard with conversation history and sentiment tags",
      "Human takeover notification system via WhatsApp, Slack, or email",
      "Comprehensive prompt guardrail configuration to prevent off-topic replies",
    ],
    idealFor: [
      "Companies losing late-night website leads due to unavailable support staff",
      "Support teams overwhelmed by repetitive, basic customer questions",
      "SaaS and e-commerce brands wanting interactive pre-sales guidance",
      "Businesses wanting a modern, cutting-edge conversational customer experience",
    ],
    process: [
      {
        title: "Knowledge Audit & Corpus Collection",
        description:
          "We gather your FAQs, product specifications, policies, and pricing sheets to create the chatbot knowledge base.",
      },
      {
        title: "Vector Embedding & RAG Pipeline",
        description:
          "We chunk and index your content into vector databases so the AI retrieves exact context before replying.",
      },
      {
        title: "Widget Development & CRM Integration",
        description:
          "We style the responsive chat widget, connect backend endpoints, and integrate lead capture webhooks.",
      },
      {
        title: "Testing, Guardrail Validation & Launch",
        description:
          "We test adversarial prompts, verify strict guardrails, and deploy the chatbot onto your production website.",
      },
    ],
    techStack: [
      "OpenAI GPT-4",
      "Vector Databases (Pinecone/Chroma)",
      "Next.js",
      "Node.js",
      "WebSockets",
      "WhatsApp Business API",
      "Tailwind CSS",
      "LangChain",
    ],
    faqs: [
      {
        question: "Will the AI chatbot say incorrect things to our customers?",
        answer:
          "No. We use Retrieval-Augmented Generation (RAG) with strict guardrails: the chatbot is instructed to answer solely using your verified knowledge base. If it does not find the answer, it politely offers to connect the user with a human.",
      },
      {
        question: "Can the chatbot collect leads and send them to our email or CRM?",
        answer:
          "Yes. The chatbot naturally collects contact details (name, email, phone, requirements) and forwards them instantly to your CRM, Google Sheets, Slack, or email inbox.",
      },
      {
        question: "Can the chatbot operate on WhatsApp as well as our website?",
        answer:
          "Yes. We can deploy the same intelligent backend to your official WhatsApp Business API, allowing customers to chat on both your website and WhatsApp seamlessly.",
      },
      {
        question: "How do we update the chatbot when our prices or policies change?",
        answer:
          "We provide an intuitive admin interface or automated sync pipeline where updating your documents or FAQ sheet automatically updates the chatbot's knowledge base.",
      },
      {
        question: "Does the chatbot support multiple languages?",
        answer:
          "Yes. Our AI chatbots natively understand and reply in English, Hindi, Hinglish, Spanish, French, and over 50 other languages automatically.",
      },
    ],
  },

  // ── 13. Digital Marketing ───────────────────────────────────────────────
  "digital-marketing": {
    name: "Digital Marketing",
    category: "Branding & Marketing",
    description:
      "Data-driven digital marketing campaigns combining technical SEO, Google Search Ads, conversion rate optimization, and transparent growth analytics.",
    seo: {
      metaTitle: "Digital Marketing Services in Delhi NCR | Kraviona",
      metaDescription:
        "High-ROI digital marketing services: search engine optimization, Google Ads, funnel conversion optimization, and analytics tracking that drive revenue growth.",
      keywords: [
        "Digital Marketing Services",
        "Digital Marketing Agency Delhi NCR",
        "Performance Marketing India",
        "SEO and PPC Agency",
        "Lead Generation Company",
        "ROI Marketing Services",
      ],
    },
    hero: {
      eyebrow: "Performance Growth & Acquisition",
      title: "Digital Marketing",
      highlight: "Services",
      description:
        "Data-backed acquisition funnels engineered for measurable ROI. We connect organic search visibility, high-intent paid campaigns, and conversion-focused landing pages.",
    },
    intro:
      "Traffic without conversion is a wasted expense. Kraviona designs digital marketing strategies focused strictly on bottom-line business metrics: qualified inbound leads, acquisition cost reduction, and organic search dominance. We build integrated campaigns that turn searchers into long-term paying customers.",
    outcomes: [
      {
        title: "SEO & paid search campaign strategy",
        description:
          "High-intent keyword targeting across Google Search and Meta Ads that attracts users ready to buy.",
      },
      {
        title: "Landing page & funnel conversion optimization",
        description:
          "Persuasive copywriting and layout experiments that turn cold clicks into qualified inquiries.",
      },
      {
        title: "Analytics, event & conversion tracking",
        description:
          "Google Analytics 4 and Tag Manager setups tracking form submissions, calls, and purchases accurately.",
      },
      {
        title: "Transparent monthly growth reporting",
        description:
          "Clear executive summaries showing ad spend, cost per lead (CPL), organic traffic, and revenue generated.",
      },
    ],
    deliverables: [
      "Custom multi-channel digital marketing growth strategy",
      "High-intent Google Ads and Meta campaign architecture",
      "Conversion-optimized landing page recommendations",
      "End-to-end Google Analytics 4 (GA4) and Google Tag Manager (GTM) setup",
      "Monthly keyword ranking and organic traffic progression reports",
      "Continuous A/B testing of ad creatives, headlines, and calls to action",
    ],
    idealFor: [
      "B2B service companies needing consistent monthly qualified inbound leads",
      "Local businesses wanting to dominate search and map listings in Delhi NCR",
      "E-commerce brands needing lower customer acquisition costs (CAC)",
      "Founders tired of vanity marketing reports that fail to show real revenue",
    ],
    process: [
      {
        title: "Market Discovery & Competitor Intelligence",
        description:
          "We analyze competitor ads, audience intent, pricing models, and search volume to discover untapped opportunities.",
      },
      {
        title: "Campaign Architecture & Funnel Setup",
        description:
          "We build tightly themed ad groups, write high-converting copy, and set up conversion tracking tags.",
      },
      {
        title: "Launch & Real-Time Bid Optimization",
        description:
          "We monitor campaign performance daily, prune non-performing keywords, and allocate budget to top performers.",
      },
      {
        title: "Analysis, CRO & Iteration",
        description:
          "We review conversion data, run landing page A/B tests, and scale winning campaigns systematically.",
      },
    ],
    techStack: [
      "Google Ads",
      "Google Analytics 4",
      "Meta Ads Manager",
      "SEMrush",
      "Search Console",
      "Google Tag Manager",
      "Looker Studio",
    ],
    faqs: [
      {
        question: "How quickly can we expect results from digital marketing?",
        answer:
          "Paid search campaigns (Google Ads and Meta) generate qualified leads within the first week of launch. Organic SEO improvements compound over 3 to 6 months to deliver sustainable, long-term traffic.",
      },
      {
        question: "How do you track whether marketing leads are actually qualified?",
        answer:
          "We configure server-side conversion tracking and form qualification fields so only genuine inquiries with valid contact details and clear intent are counted as successful leads.",
      },
      {
        question: "What minimum ad budget do you recommend for Google Ads?",
        answer:
          "For local service campaigns in Delhi NCR, we recommend starting with ₹25,000 to ₹50,000 per month to gather sufficient statistical data and generate consistent leads.",
      },
      {
        question: "Do you lock clients into long-term retainers?",
        answer:
          "No. We believe our results should earn your continued business. We operate on flexible monthly retainers with clear deliverables and transparent performance reporting.",
      },
      {
        question: "Will you help improve our landing page conversion rates?",
        answer:
          "Yes. As full-stack developers and marketers, we directly optimize your landing page speed, mobile layout, and call-to-action placement to maximize the value of your ad spend.",
      },
    ],
  },

  // ── 14. Social Media Marketing ──────────────────────────────────────────
  "social-media-marketing": {
    name: "Social Media Marketing",
    category: "Branding & Marketing",
    description:
      "Brand positioning, high-impact content calendars, paid social ads, and community engagement strategies across LinkedIn, Instagram, and Facebook.",
    seo: {
      metaTitle: "Social Media Marketing Services in Delhi | Kraviona",
      metaDescription:
        "Capture qualified leads and build brand authority across LinkedIn, Instagram, and Facebook with creative content strategies, community growth, and paid ads.",
      keywords: [
        "Social Media Marketing Services",
        "SMM Agency Delhi NCR",
        "Social Media Marketing India",
        "B2B LinkedIn Marketing",
        "Instagram Ads Agency",
        "Social Media Management",
      ],
    },
    hero: {
      eyebrow: "Social Content & Paid Campaigns",
      title: "Social Media",
      highlight: "Marketing",
      description:
        "Elevate your brand presence across major social channels with audience-first storytelling, scroll-stopping creative assets, and targeted paid performance ads.",
    },
    intro:
      "Social media is the digital storefront of modern brands. Kraviona executes structured social media marketing campaigns combining organic thought-leadership content on LinkedIn with visually compelling creative campaigns on Instagram and Meta, driving genuine engagement and brand affinity.",
    outcomes: [
      {
        title: "Platform-specific content planning",
        description:
          "Tailored content formats: LinkedIn case studies, Instagram carousels and reels, and Facebook community posts.",
      },
      {
        title: "Creative direction & monthly calendar",
        description:
          "A structured monthly calendar planned 30 days in advance so your brand never goes silent.",
      },
      {
        title: "Targeted paid social ad campaigns",
        description:
          "Hyper-targeted Meta and LinkedIn ad campaigns designed to generate leads and direct product sales.",
      },
      {
        title: "Engagement & performance analytics",
        description:
          "Actionable monthly reports detailing reach, follower growth, engagement rates, and inbound message volume.",
      },
    ],
    deliverables: [
      "Comprehensive social media strategy and channel positioning guide",
      "Monthly editorial calendar with scheduled posts, captions, and hashtags",
      "High-resolution graphic assets, carousels, and short-form video concepts",
      "Paid social campaign management (Meta Ads and LinkedIn Campaign Manager)",
      "Community management protocol for answering comments and direct messages",
      "Monthly ROI and audience growth performance reports",
    ],
    idealFor: [
      "B2B firms wanting to establish executive authority on LinkedIn",
      "Consumer and lifestyle brands looking to build an engaged Instagram following",
      "Businesses launching new products needing multi-channel social buzz",
      "Companies wanting consistent, high-quality social output without hiring full-time staff",
    ],
    process: [
      {
        title: "Brand Voice & Audience Discovery",
        description:
          "We define your brand tone, visual identity, target demographics, and primary conversion objectives.",
      },
      {
        title: "Content Calendar & Asset Production",
        description:
          "We produce 30 days of graphics, copy, and video concepts for review and approval.",
      },
      {
        title: "Publishing & Community Engagement",
        description:
          "We schedule posts at peak engagement windows and actively monitor customer interactions.",
      },
      {
        title: "Paid Amplification & Performance Review",
        description:
          "We amplify top-performing organic posts with targeted paid budget to maximize reach and lead volume.",
      },
    ],
    techStack: [
      "Meta Business Suite",
      "LinkedIn Campaign Manager",
      "Canva Pro",
      "Buffer",
      "Google Analytics",
      "CapCut",
      "Figma",
    ],
    faqs: [
      {
        question: "Which social media platforms should my business focus on?",
        answer:
          "B2B service companies and tech startups should prioritize LinkedIn and Twitter/X for thought leadership. Consumer brands, e-commerce, and local businesses thrive on Instagram and Meta.",
      },
      {
        question: "Do you create the graphics and write the post captions?",
        answer:
          "Yes. We handle end-to-end production: concept ideation, copywriting, graphic design, hashtag research, scheduling, and community engagement.",
      },
      {
        question: "Can social media marketing actually generate sales leads?",
        answer:
          "Yes. By combining organic value content with targeted lead generation ads (using Meta Instant Forms or LinkedIn Lead Gen Forms), we direct engaged prospects into your sales pipeline.",
      },
      {
        question: "Do we get to review and approve posts before they go live?",
        answer:
          "Always. We present your complete monthly content calendar in advance for your review and feedback before scheduling anything live.",
      },
      {
        question: "How do you measure success in social media marketing?",
        answer:
          "We track metrics that connect to your business goals: profile visits, website click-throughs, inbound direct messages, lead form completions, and qualified inquiries.",
      },
    ],
  },

  // ── 15. Email Marketing ─────────────────────────────────────────────────
  "email-marketing": {
    name: "Email Marketing",
    category: "Branding & Marketing",
    description:
      "High-converting lifecycle email campaigns, automated customer onboarding drips, promotional broadcasts, and list segmentation for long-term retention.",
    seo: {
      metaTitle: "Email Marketing & Automation Services | Kraviona",
      metaDescription:
        "Increase customer retention and lifetime value with targeted email nurture sequences, automated onboarding drips, promotional broadcasts, and list hygiene.",
      keywords: [
        "Email Marketing Services",
        "Email Automation Agency Delhi",
        "Lifecycle Email Marketing",
        "Klaviyo Email Agency India",
        "B2B Newsletter Campaigns",
        "Drip Email Automation",
      ],
    },
    hero: {
      eyebrow: "Retention & Lifecycle Funnels",
      title: "Email Marketing &",
      highlight: "Automation",
      description:
        "Turn subscribers into loyal repeat buyers with personalized email workflows, automated onboarding sequences, and beautifully designed responsive newsletters.",
    },
    intro:
      "Email marketing remains the highest-ROI direct marketing channel available to online businesses. Kraviona designs automated customer journeys that nurture cold leads into active buyers and keep existing customers engaged through behavioral segmentation, personalized copy, and rigorous deliverability monitoring.",
    outcomes: [
      {
        title: "Automated welcome & nurture sequences",
        description:
          "Multi-day drip campaigns that educate new subscribers and guide them toward their first purchase.",
      },
      {
        title: "Newsletter campaign planning & design",
        description:
          "Value-driven weekly or monthly newsletters that keep your brand top-of-mind without being spammy.",
      },
      {
        title: "Behavioral segmentation & triggers",
        description:
          "Targeted messaging based on user activity: abandoned cart, page visits, past purchases, or inactivity.",
      },
      {
        title: "Deliverability, open & conversion tracking",
        description:
          "DKIM/SPF/DMARC authentication ensuring your emails land directly in the primary inbox, never spam.",
      },
    ],
    deliverables: [
      "Custom lifecycle email marketing strategy and segmentation plan",
      "Automated drip sequence setup (Welcome series, Abandoned Cart, Win-back)",
      "Mobile-responsive HTML email templates matching your brand guidelines",
      "Domain authentication setup (SPF, DKIM, DMARC, and Google Postmaster)",
      "Compelling subject line creation and A/B split-testing framework",
      "Monthly performance reports detailing open rates, CTRs, and attributed revenue",
    ],
    idealFor: [
      "E-commerce stores wanting to recover abandoned checkouts and boost repeat orders",
      "SaaS platforms needing to increase user activation and trial-to-paid conversion rates",
      "B2B agencies wanting to nurture leads throughout a long decision cycle",
      "Businesses with large subscriber lists that are currently under-monetized",
    ],
    process: [
      {
        title: "List Audit & Technical Deliverability Setup",
        description:
          "We clean invalid contacts, audit domain reputation, and configure SPF, DKIM, and DMARC DNS records.",
      },
      {
        title: "Customer Journey & Automation Mapping",
        description:
          "We define trigger events, delays, audience segments, and messaging objectives for each sequence.",
      },
      {
        title: "Copywriting & Responsive Design",
        description:
          "We craft persuasive, conversational email copy and design clean, dark-mode-compatible HTML templates.",
      },
      {
        title: "Testing, Launch & Continuous Optimization",
        description:
          "We run Litmus render tests across Gmail/Apple Mail, launch automations, and optimize open and click rates.",
      },
    ],
    techStack: [
      "Mailchimp",
      "Klaviyo",
      "Brevo",
      "SendGrid",
      "HTML Email Templates",
      "Zapier",
      "DKIM/SPF Setup",
      "Google Postmaster",
    ],
    faqs: [
      {
        question: "How do you ensure our emails do not land in the spam folder?",
        answer:
          "We implement proper DNS authentication (SPF, DKIM, DMARC), warm up your sending IP gradually, clean unengaged subscribers regularly, and write spam-trigger-free subject lines.",
      },
      {
        question: "Which email platform is best for our business?",
        answer:
          "We recommend Klaviyo for e-commerce brands due to its deep Shopify/WooCommerce integrations. For B2B companies and newsletters, we recommend Mailchimp, Brevo, or SendGrid.",
      },
      {
        question: "What is the typical ROI of email marketing?",
        answer:
          "According to industry benchmarks from the DMA, email marketing delivers an average return of $36 for every $1 spent, making it the most cost-effective retention channel available.",
      },
      {
        question: "Can you help write the content for our emails?",
        answer:
          "Yes. Our team writes all email copy, designs custom mobile-first templates, and creates compelling subject lines tailored to your target audience.",
      },
      {
        question: "How often should we send emails to our list?",
        answer:
          "For most B2B companies, a weekly or bi-weekly newsletter is ideal. For e-commerce brands, 1 to 2 targeted weekly campaigns combined with automated event-triggered emails yield the best results.",
      },
    ],
  },

  // ── 16. Brand Identity & Design ─────────────────────────────────────────
  "brand-identity": {
    name: "Brand Identity & Design",
    category: "Branding & Marketing",
    description:
      "Comprehensive brand identity development: distinctive logos, typographic hierarchies, color palettes, stationery assets, and brand design guidelines.",
    seo: {
      metaTitle: "Brand Identity & Design Services Delhi | Kraviona",
      metaDescription:
        "Establish a memorable visual brand. We create bespoke logos, typography systems, color palettes, stationery assets, and comprehensive brand guideline manuals.",
      keywords: [
        "Brand Identity Design Services",
        "Branding Agency Delhi NCR",
        "Logo Design Company India",
        "Corporate Identity Design",
        "Brand Guidelines Design",
        "Visual Identity Systems",
      ],
    },
    hero: {
      eyebrow: "Visual Systems & Brand Guidelines",
      title: "Brand Identity &",
      highlight: "Design",
      description:
        "Distinctive, coherent visual identities that command respect, build customer trust, and ensure visual consistency across all digital and print touchpoints.",
    },
    intro:
      "A company's brand identity is the foundation of customer trust. Kraviona crafts comprehensive corporate identities that reflect your unique value proposition: timeless logo marks, bespoke typography hierarchies, harmonious color palettes, and detailed brand manuals that keep your team consistent everywhere.",
    outcomes: [
      {
        title: "Logo direction & bespoke marks",
        description:
          "Scalable vector logo designs including primary marks, secondary badges, and favicons.",
      },
      {
        title: "Typography & cohesive color system",
        description:
          "Carefully curated font pairings and primary/secondary color palettes with accessibility contrast ratings.",
      },
      {
        title: "Social & website brand assets",
        description:
          "Social media banners, profile badges, favicon sets, and web design style kits ready for production.",
      },
      {
        title: "Brand guideline documentation",
        description:
          "A comprehensive brand book defining clear rules for logo clear space, sizing, color codes, and dos/don'ts.",
      },
    ],
    deliverables: [
      "Primary logo, secondary logo, and favicon in vector formats (SVG, EPS, PNG, PDF)",
      "Comprehensive Brand Style Guide PDF (40+ pages defining all visual rules)",
      "Curated color palette with HEX, RGB, CMYK, and Pantone specifications",
      "Typography system with web-safe and display font pairings",
      "Corporate stationery templates (Business cards, letterheads, invoice templates)",
      "Social media branding kit (profile images, covers, and post templates)",
    ],
    idealFor: [
      "New startups needing a professional visual identity before going to market",
      "Established businesses wanting to modernize an outdated visual image",
      "Companies launching new sub-brands or proprietary software products",
      "Organizations struggling with inconsistent visual design across different teams",
    ],
    process: [
      {
        title: "Discovery & Brand Strategy",
        description:
          "We analyze your market positioning, target audience expectations, and competitor visual landscapes.",
      },
      {
        title: "Concept Exploration & Moodboards",
        description:
          "We develop 3 distinct creative visual directions and moodboards for collaborative review.",
      },
      {
        title: "Design Refinement & System Creation",
        description:
          "We refine the selected logo mark, develop font hierarchies, and build the complete color palette.",
      },
      {
        title: "Asset Export & Brand Manual Delivery",
        description:
          "We export all production assets in all required formats and compile the comprehensive brand guideline book.",
      },
    ],
    techStack: [
      "Adobe Illustrator",
      "Figma",
      "Photoshop",
      "Brand Book Standards",
      "Vector Assets",
      "Typography Systems",
    ],
    faqs: [
      {
        question: "What is included in a complete brand identity project?",
        answer:
          "A complete identity project includes the core logo mark, alternative lockups, color palette, typography hierarchy, brand style guide book, corporate stationery, and social media asset templates.",
      },
      {
        question: "How many logo concepts do you provide?",
        answer:
          "We present 3 unique, thoughtfully researched creative directions. Once you pick the preferred direction, we refine it through revision rounds until it is perfect.",
      },
      {
        question: "Do we receive the original editable vector source files?",
        answer:
          "Yes. You receive 100% intellectual property ownership and full vector source files (AI, EPS, SVG, PDF, and high-res PNG/JPG).",
      },
      {
        question: "What is a brand style guide and why do we need one?",
        answer:
          "A brand style guide is an instruction manual for your visual identity. It ensures that external partners, web developers, printers, and new employees apply your logo, colors, and fonts consistently.",
      },
      {
        question: "How long does a brand identity design project take?",
        answer:
          "A comprehensive branding project typically takes 2 to 4 weeks from discovery to final asset delivery.",
      },
    ],
  },

  // ── 17. E-Commerce Development & Marketing ──────────────────────────────
  "ecommerce-development-marketing": {
    name: "E-Commerce Dev & Marketing",
    category: "Marketplace & Seller",
    description:
      "High-converting e-commerce web storefronts, frictionless checkout funnels, payment gateway integration, and ROI-driven product marketing campaigns.",
    seo: {
      metaTitle: "E-Commerce Development & Marketing | Kraviona",
      metaDescription:
        "Build and scale high-converting online stores. Custom storefront development, smooth checkout flows, conversion rate optimization, and performance ad campaigns.",
      keywords: [
        "E-Commerce Development Services",
        "Ecommerce Marketing Agency Delhi",
        "Custom Online Store India",
        "Shopify Next.js Store",
        "Ecommerce Conversion Optimization",
        "D2C Brand Marketing",
      ],
    },
    hero: {
      eyebrow: "Storefront Architecture & Sales",
      title: "E-Commerce Dev &",
      highlight: "Marketing",
      description:
        "Fast, modern e-commerce storefronts paired with data-driven acquisition marketing. Engineered for maximum checkout completion, zero lag, and growing repeat sales.",
    },
    intro:
      "A successful online store requires both an effortless shopping experience and aggressive customer acquisition. Kraviona combines cutting-edge headless e-commerce engineering (Next.js, Shopify, WooCommerce) with performance marketing campaigns that lower your customer acquisition cost (CAC) and increase average order value (AOV).",
    outcomes: [
      {
        title: "Fast, custom storefront development",
        description:
          "Mobile-first e-commerce platforms engineered for sub-second page loads and zero layout shifts.",
      },
      {
        title: "Frictionless checkout & payment flows",
        description:
          "Streamlined checkout funnels with UPI, credit cards, EMI, COD verification, and automated address completion.",
      },
      {
        title: "SEO & performance marketing integration",
        description:
          "Optimized product structured data, Google Shopping feed integration, and Meta dynamic catalog ads.",
      },
      {
        title: "Inventory, shipping & ERP sync",
        description:
          "Automated connections to Shiprocket, Delhivery, inventory warehouses, and ERP backends.",
      },
    ],
    deliverables: [
      "Custom e-commerce store built on Next.js Commerce, Shopify, or WooCommerce",
      "Payment gateway integration (Razorpay, Stripe, Cashfree, PayU)",
      "Automated logistics integration with real-time tracking (Shiprocket / Delhivery)",
      "Google Merchant Center and Meta Product Catalog feeds",
      "Abandoned checkout recovery automation via email and WhatsApp",
      "Conversion tracking setup for Google Ads, Meta Pixel, and GA4 eCommerce",
    ],
    idealFor: [
      "Direct-to-Consumer (D2C) brands launching their flagship online store",
      "Traditional retailers transitioning to online e-commerce sales",
      "Stores suffering from high cart abandonment rates and slow loading speeds",
      "Brands wanting custom product bundles, subscriptions, or bespoke checkout logic",
    ],
    process: [
      {
        title: "Storefront UX & Catalog Architecture",
        description:
          "We structure category hierarchies, product filters, search logic, and mobile checkout journeys.",
      },
      {
        title: "Development & Integration",
        description:
          "We build responsive product pages, shopping carts, payment gateways, and shipping APIs.",
      },
      {
        title: "Conversion Tracking & Testing",
        description:
          "We test test purchases across credit cards, UPI, and COD, verifying full GA4 eCommerce tracking.",
      },
      {
        title: "Performance Ad Campaign Launch",
        description:
          "We configure Google Shopping ads and Meta conversion campaigns to drive immediate purchasing traffic.",
      },
    ],
    techStack: [
      "Next.js Commerce",
      "Shopify",
      "WooCommerce",
      "Stripe",
      "Razorpay",
      "Google Shopping Ads",
      "Meta Ads",
      "Tailwind CSS",
    ],
    faqs: [
      {
        question: "Should we build our store on Shopify or custom Next.js?",
        answer:
          "Shopify is fantastic for fast setups with extensive app ecosystems. Headless Next.js Commerce is best for brands that require ultra-fast page speeds, complete design freedom, and custom business logic.",
      },
      {
        question: "How do you help reduce shopping cart abandonment?",
        answer:
          "We eliminate multi-step checkout friction with single-page checkouts, auto-fill address tools, clear upfront shipping costs, trust badges, and automated WhatsApp/email recovery drips.",
      },
      {
        question: "Can you integrate Indian payment gateways like Razorpay and Cashfree?",
        answer:
          "Yes. We configure seamless checkouts supporting all Indian payment methods: UPI (Google Pay, PhonePe, Paytm), credit/debit cards, net banking, and Cash on Delivery (COD) with OTP verification.",
      },
      {
        question: "How do you optimize an e-commerce website for Google SEO?",
        answer:
          "We implement rich Product and Review schema markup, optimize category URLs, avoid faceted navigation duplicate content, and ensure lightning-fast image delivery.",
      },
      {
        question: "Do you handle e-commerce ad campaigns after the store launches?",
        answer:
          "Yes. We manage end-to-end Google Shopping, Performance Max, and Meta dynamic catalog ads to drive profitable sales from day one.",
      },
    ],
  },

  // ── 18. Marketplace Account Management ──────────────────────────────────
  "account-management": {
    name: "Account Management",
    category: "Marketplace & Seller",
    description:
      "Complete marketplace account handling for Amazon, Flipkart, and Meesho sellers: health maintenance, listing hygiene, operations, and growth strategy.",
    seo: {
      metaTitle: "Marketplace Account Management Services | Kraviona",
      metaDescription:
        "Hands-on account management for Amazon, Flipkart, and Meesho sellers. Maintain account health, resolve listing suspensions, and scale daily marketplace sales.",
      keywords: [
        "Marketplace Account Management",
        "Amazon Account Management Delhi",
        "Flipkart Seller Management India",
        "Marketplace Operations Agency",
        "Amazon Seller Consultant",
        "Meesho Seller Services",
      ],
    },
    hero: {
      eyebrow: "Multi-Channel Seller Operations",
      title: "Marketplace Account",
      highlight: "Management",
      description:
        "End-to-end account operations for Amazon, Flipkart, and Meesho sellers. We resolve policy violations, protect account health, and systematically scale seller revenue.",
    },
    intro:
      "Marketplace seller policies change constantly, and a single metric violation can freeze your entire business. Kraviona acts as your dedicated marketplace operations team: managing daily account health, handling customer claims, resolving suppressed listings, and executing systematic growth routines.",
    outcomes: [
      {
        title: "Marketplace account setup & health hygiene",
        description:
          "Maintain Order Defect Rate (ODR), Late Dispatch Rate, and Voice of the Customer scores in safe green zones.",
      },
      {
        title: "Listing, pricing & promotion management",
        description:
          "Regular price optimization, deal submissions (Lightning Deals, Prime Days), and buy box monitoring.",
      },
      {
        title: "Issue handling & case log resolution",
        description:
          "Direct handling of seller support cases, stranded inventory, and brand authorization tickets.",
      },
      {
        title: "Monthly marketplace growth review",
        description:
          "Detailed sales breakdowns by SKU, return rate analysis, and growth action plans for upcoming sales events.",
      },
    ],
    deliverables: [
      "Daily marketplace account monitoring and health maintenance",
      "Resolution of suppressed listings, stranded inventory, and category approvals",
      "Buy Box monitoring and competitive pricing strategy",
      "Promotion and sale event submissions (Great Indian Festival, Big Billion Days)",
      "Customer message response handling within mandatory 24-hour windows",
      "Comprehensive weekly and monthly seller performance scorecards",
    ],
    idealFor: [
      "Brand owners who want to focus on manufacturing while experts run their seller accounts",
      "Sellers experiencing declining Buy Box share or account health warnings",
      "Businesses launching on Amazon, Flipkart, and Meesho simultaneously",
      "Established sellers wanting proactive management rather than reactive troubleshooting",
    ],
    process: [
      {
        title: "Account Health & Catalog Audit",
        description:
          "We inspect your seller dashboard, compliance warnings, suppressed listings, and feedback metrics.",
      },
      {
        title: "Listing Cleanup & Error Correction",
        description:
          "We fix stranded inventory, update missing attributes, and resolve brand authorization issues.",
      },
      {
        title: "Daily Operations & Buy Box Maintenance",
        description:
          "We handle daily price checks, customer inquiries, case logs, and inventory replenishment alerts.",
      },
      {
        title: "Growth Planning & Review",
        description:
          "We review sales performance, plan promotional deals, and optimize SKU-level profitability weekly.",
      },
    ],
    techStack: [
      "Amazon Seller Central",
      "Flipkart Seller Hub",
      "Meesho Supplier Panel",
      "Helium 10",
      "Excel Advanced",
      "Seller API",
    ],
    faqs: [
      {
        question: "Which marketplaces does Kraviona manage?",
        answer:
          "We specialize in Amazon.in, Flipkart, Meesho, and JioMart seller accounts, handling both merchant-fulfilled (FBM) and marketplace-fulfilled (FBA / F-Assured) models.",
      },
      {
        question: "How do you help resolve account suspensions or policy warnings?",
        answer:
          "We prepare formal Plans of Action (POA) addressing root causes, immediate corrective measures, and preventive systemic safeguards to appeal successfully to seller performance teams.",
      },
      {
        question: "Do you guarantee that we will win the Buy Box?",
        answer:
          "While no agency controls marketplace algorithms, we optimize every factor that influences the Buy Box: competitive pricing, fast fulfillment methods (FBA), high account health metrics, and zero stock-outs.",
      },
      {
        question: "Do we still have full access to our seller accounts?",
        answer:
          "Yes. We operate via secondary user permissions with granular access, ensuring you maintain full primary ownership and control of your account credentials at all times.",
      },
      {
        question: "How do you communicate daily updates with our team?",
        answer:
          "We communicate through a dedicated WhatsApp group and weekly scheduled calls, providing immediate alerts for urgent account notifications and clear weekly summaries.",
      },
    ],
  },

  // ── 19. Cataloging ──────────────────────────────────────────────────────
  cataloging: {
    name: "Cataloging",
    category: "Marketplace & Seller",
    description:
      "Marketplace product catalog creation, listing optimization, variation mapping, and content cleanup.",
    seo: {
      metaTitle: "Marketplace Product Cataloging Services | Kraviona",
      metaDescription:
        "Professional catalog creation and listing optimization for Amazon and Flipkart. Keyword-rich titles, bullet points, A+ content, and parent-child variations.",
      keywords: [
        "Marketplace Cataloging Services",
        "Amazon Listing Services Delhi",
        "Flipkart Cataloging India",
        "Product Listing Optimization",
        "A+ Content Design Amazon",
        "Ecommerce Catalog Management",
      ],
    },
    hero: {
      eyebrow: "Listing Optimization & Content",
      title: "Marketplace Product",
      highlight: "Cataloging",
      description:
        "High-converting product listings for Amazon and Flipkart. Rich keyword indexing, compelling bullet points, professional lifestyle imagery, and parent-child variations.",
    },
    intro:
      "Your product listing is your digital salesperson on Amazon and Flipkart. Kraviona creates and audits product catalogs using in-depth marketplace keyword research, compliant variation mapping, and persuasive copywriting that improves organic discoverability and turns casual searchers into buyers.",
    outcomes: [
      {
        title: "Product listing creation & bulk uploads",
        description:
          "Error-free catalog uploads using category flat files without stranded attributes or validation rejections.",
      },
      {
        title: "Keyword-rich title & bullet optimization",
        description:
          "Titles structured around high-volume search queries and customer benefits that pass marketplace character limits.",
      },
      {
        title: "Parent-child variation architecture",
        description:
          "Clean variation themes for size, color, pack, and style that combine reviews and preserve ranking authority.",
      },
      {
        title: "Catalog error cleanup & attribute fixes",
        description:
          "Resolve error 8572, error 5461, suppressed search results, and missing browse node classifications.",
      },
    ],
    deliverables: [
      "Optimized product listings with high-ranking titles, bullets, and backend search terms",
      "Parent-child variation mapping templates ensuring seamless shopper selection",
      "Amazon A+ Content (Enhanced Brand Content) copy and layout blueprints",
      "Category flat file creation and error-free bulk upload execution",
      "High-resolution image guidelines and infographic text overlays",
      "Browse node mapping ensuring your products appear in the correct category filters",
    ],
    idealFor: [
      "Brands launching new product ranges across Amazon and Flipkart",
      "Sellers struggling with catalog flat file errors and feed processing rejections",
      "Businesses with low conversion rates due to poorly written bullet points and blurry images",
      "Manufacturers needing bulk catalog digitization across hundreds of SKUs",
    ],
    process: [
      {
        title: "Marketplace Keyword Harvesting",
        description:
          "We analyze buyer search terms on Amazon and Flipkart using Helium 10 to find high-converting keywords.",
      },
      {
        title: "Copywriting & Benefit Structuring",
        description:
          "We write punchy bullet points, optimized titles, and compliant descriptions highlighting USPs.",
      },
      {
        title: "Flat File Preparation & Attribute Mapping",
        description:
          "We populate category-specific Excel templates, mapping variations, EAN/UPC barcodes, and mandatory fields.",
      },
      {
        title: "Upload, Verification & Live Indexing Check",
        description:
          "We submit the feed, resolve any upload errors, and confirm the listing is active and indexing in search.",
      },
    ],
    techStack: [
      "Amazon Brand Registry",
      "A+ Content Builder",
      "Helium 10",
      "Flat File Bulk Templates",
      "Photoshop",
      "Keyword Harvester",
      "Flipkart Smart Catalog",
    ],
    faqs: [
      {
        question: "Why are our Amazon listings not showing up in search results?",
        answer:
          "Listings are frequently suppressed by Amazon algorithms due to missing main images, title length violations, missing brand authorization, or empty mandatory attributes like material and browse nodes.",
      },
      {
        question: "What is A+ Content (EBC) and does it increase sales?",
        answer:
          "A+ Content replaces plain text descriptions with visual comparison charts, rich banners, and brand story modules. Amazon reports that adding A+ Content increases conversion rates by an average of 5% to 10%.",
      },
      {
        question: "Can you create parent-child variations for existing separate listings?",
        answer:
          "Yes. We merge separate standalone listings into a single parent-child variation family using inventory flat files, consolidating customer reviews and boosting ranking authority.",
      },
      {
        question: "Do you provide product photography?",
        answer:
          "We provide graphic design, infographic overlays, lifestyle mockup creation, and image retouching based on your raw product photos.",
      },
      {
        question: "How long does it take to catalog a 50-SKU collection?",
        answer:
          "A 50-SKU collection with keyword research, copy, variation mapping, and bulk upload is typically completed and live within 4 to 7 business days.",
      },
    ],
  },

  // ── 20. Accounting ──────────────────────────────────────────────────────
  accounting: {
    name: "Accounting",
    category: "Marketplace & Seller",
    description:
      "Seller-focused bookkeeping, reconciliation, payout tracking, and profitability visibility for online businesses.",
    seo: {
      metaTitle: "E-Commerce Seller Accounting & Payouts | Kraviona",
      metaDescription:
        "Gain complete financial clarity on marketplace sales. Payout reconciliation, return loss tracking, fee audits, and GST compliance for Amazon and Flipkart sellers.",
      keywords: [
        "Marketplace Accounting Services",
        "Amazon Payout Reconciliation Delhi",
        "Ecommerce Seller Bookkeeping",
        "Flipkart Settlement Audit",
        "Seller GST Compliance",
        "Marketplace Fee Recovery",
      ],
    },
    hero: {
      eyebrow: "Financial Clarity & Payout Reconciliation",
      title: "E-Commerce Seller",
      highlight: "Accounting",
      description:
        "Accurate marketplace payout reconciliation, commission fee auditing, inventory loss recovery, and GST reporting. Never lose track of your real net profit.",
    },
    intro:
      "Many online sellers generate strong top-line revenue but remain uncertain about their true net profit after marketplace commissions, return shipping fees, storage charges, and advertising spend. Kraviona provides specialized e-commerce bookkeeping and settlement reconciliation to ensure every rupee is accounted for.",
    outcomes: [
      {
        title: "Sales & payout settlement reconciliation",
        description:
          "Match every order, cancellation, and refund against actual bank disbursements from Amazon and Flipkart.",
      },
      {
        title: "Marketplace commission & fee auditing",
        description:
          "Detect incorrect weight-handling fees, overcharged referral rates, and unrefunded return commissions.",
      },
      {
        title: "SKU-level profitability & margin analysis",
        description:
          "Know exact net profit margins per product after deducting Cost of Goods Sold (COGS), shipping, and ads.",
      },
      {
        title: "E-commerce GST reporting & compliance",
        description:
          "Accurate reconciliation of TCS, TDS, GSTR-1, and GSTR-3B matching marketplace tax reports.",
      },
    ],
    deliverables: [
      "Order-level marketplace settlement reconciliation reports",
      "Audited list of fee overcharges and reimbursement claim files",
      "Monthly SKU-level profit and loss (P&L) statements",
      "Return loss analysis highlighting damaged, missing, and customer switch fraud",
      "GST reconciliation statements (TCS/TDS credit matching)",
      "Integration with Tally Prime, Busy, or cloud accounting software",
    ],
    idealFor: [
      "Marketplace sellers doing high order volume who cannot track exact net margins",
      "Businesses suspecting Amazon or Flipkart fee overcharges and missing payments",
      "Sellers needing clean books and GST compliance for business loans or investors",
      "Brands wanting to eliminate loss-making SKUs from their catalog",
    ],
    process: [
      {
        title: "Data Extraction & Settlement Audit",
        description:
          "We extract raw settlement files, fee schedules, return logs, and bank statements for the audit period.",
      },
      {
        title: "Order-Level Matching & Variance Flagging",
        description:
          "We run automated data reconciliation to match order values against net disbursements and deductions.",
      },
      {
        title: "Claim Submission & Reimbursement Recovery",
        description:
          "We file reimbursement claims for lost inventory, incorrect fee tiers, and missing return credits.",
      },
      {
        title: "Monthly P&L & Tax Deliverables",
        description:
          "We deliver clean financial statements, margin breakdowns, and GST reconciliation sheets.",
      },
    ],
    techStack: [
      "Tally Prime",
      "Busy Accounting",
      "Excel Power Query",
      "Amazon Settlement Reports",
      "GST Portal",
      "Flipkart Financial Reports",
    ],
    faqs: [
      {
        question: "Why do marketplace payouts differ from total sales value?",
        answer:
          "Marketplaces deduct referral fees, closing fees, shipping fees, pick-and-pack charges, storage fees, advertising spend, refund deductions, TCS (Tax Collected at Source), and TDS before disbursing funds to your bank.",
      },
      {
        question: "Can we recover money from Amazon and Flipkart for overcharged fees?",
        answer:
          "Yes. Marketplaces frequently misclassify product dimensions or weights, resulting in overcharged shipping fees. We file formal weight disputes and inventory reimbursement claims to recover owed funds.",
      },
      {
        question: "How do you handle customer returns and damaged inventory accounting?",
        answer:
          "We track return orders against warehouse physical receipts, verify whether items were returned in sellable condition, and file SAFE-T claims for customer fraud or transit damage.",
      },
      {
        question: "Do you integrate with our existing Tally or Busy software?",
        answer:
          "Yes. We prepare structured sales, purchase, and payment entry files that import directly into Tally Prime, Busy, or QuickBooks without manual voucher entry.",
      },
      {
        question: "How does e-commerce GST reconciliation work?",
        answer:
          "We match your marketplace GSTR-8 (TCS report) against your GSTR-1 and GSTR-3B filings, ensuring accurate tax credit claims and zero tax notices from authorities.",
      },
    ],
  },

  // ── 21. Advertising ─────────────────────────────────────────────────────
  advertising: {
    name: "Advertising",
    category: "Marketplace & Seller",
    description:
      "Performance PPC ad campaigns for search, social, and marketplace platforms with budget control and clear reporting.",
    seo: {
      metaTitle: "Marketplace PPC Advertising Services | Kraviona",
      metaDescription:
        "Lower your ACOS and boost organic ranking with structured Amazon and Flipkart PPC campaigns. Negative keyword harvesting, bid optimization, and weekly ROAS reports.",
      keywords: [
        "Marketplace Advertising Services",
        "Amazon PPC Management Delhi",
        "Flipkart Sponsored Ads India",
        "Marketplace PPC Agency",
        "Reduce Amazon ACOS",
        "Amazon Sponsored Products",
      ],
    },
    hero: {
      eyebrow: "Sponsored Ads & ROAS Optimization",
      title: "Marketplace PPC",
      highlight: "Advertising",
      description:
        "Scale marketplace sales profitably with tightly structured PPC ad campaigns. We eliminate wasted spend, harvest high-intent search terms, and protect your margins.",
    },
    intro:
      "Unmanaged marketplace PPC quickly bleeds cash. Kraviona structures and actively optimizes advertising accounts across Amazon Advertising and Flipkart Ads, deploying precision keyword harvesting, exact match bidding, negative keyword pruning, and dayparting to drive profitable sales while boosting organic ranking.",
    outcomes: [
      {
        title: "Campaign structure & keyword planning",
        description:
          "Segmented campaigns: Auto discovery, manual exact match, competitor ASIN targeting, and brand defense.",
      },
      {
        title: "Target ACOS & TACOS optimization",
        description:
          "Continuous bid adjustments aligned with product profit margins to ensure profitable ad spend.",
      },
      {
        title: "Negative keyword harvesting",
        description:
          "Weekly pruning of irrelevant, high-spend search terms that burn advertising budget with zero sales.",
      },
      {
        title: "Organic ranking flywheel growth",
        description:
          "Targeted ad velocity on primary keywords that pushes your product into organic page-one search positions.",
      },
    ],
    deliverables: [
      "Complete marketplace PPC account audit and restructuring",
      "Setup of Sponsored Products, Sponsored Brands, and Sponsored Display ads",
      "Weekly bid optimization, budget reallocation, and negative keyword harvesting",
      "Competitor ASIN conquesting and defensive brand targeting campaigns",
      "Comprehensive weekly ACOS, TACOS, and ROAS performance reports",
      "New product launch PPC velocity roadmap",
    ],
    idealFor: [
      "Sellers experiencing high ACOS (Advertising Cost of Sales) that eats away all profit",
      "Brands launching new products that have zero reviews and need initial sales velocity",
      "Established accounts wanting to scale ad spend profitably without losing control of costs",
      "Sellers whose competitors are aggressively bidding on their brand keywords",
    ],
    process: [
      {
        title: "PPC Audit & Margin Calculation",
        description:
          "We analyze historical search term reports, identify wasted ad spend, and establish target ACOS limits per SKU.",
      },
      {
        title: "Campaign Architecture Setup",
        description:
          "We build isolated auto, broad, phrase, and exact campaigns with negative targeting safeguards.",
      },
      {
        title: "Bid Management & Search Term Harvesting",
        description:
          "We harvest winning search queries into exact match campaigns and prune bleeding search terms weekly.",
      },
      {
        title: "Brand Defense & Scaling",
        description:
          "We launch Sponsored Brands and video ads to dominate category search results and grow total market share.",
      },
    ],
    techStack: [
      "Amazon Advertising Console",
      "Flipkart PLA & PCA",
      "Helium 10 Adtomic",
      "Google Analytics",
      "Excel Bid Automation",
    ],
    faqs: [
      {
        question: "What is a good ACOS on Amazon?",
        answer:
          "A good ACOS depends on your product's profit margin. If your gross margin is 35%, a target ACOS below 25% ensures your advertising remains directly profitable, while boosting organic sales.",
      },
      {
        question: "What is the difference between ACOS and TACOS?",
        answer:
          "ACOS measures ad spend divided by ad sales. TACOS (Total ACOS) measures ad spend divided by total sales (organic + ad). A healthy, declining TACOS proves that PPC is driving organic search ranking.",
      },
      {
        question: "How do you stop Amazon ads from wasting money on irrelevant keywords?",
        answer:
          "We implement strict negative exact and negative phrase match lists weekly, cutting off irrelevant clicks before they accumulate wasted spend.",
      },
      {
        question: "Should we run Sponsored Brand and Video ads?",
        answer:
          "Yes. Sponsored Brand Video ads appear prominently in mobile search results, achieving 2x to 3x higher click-through rates and significantly lower costs per click than standard sponsored products.",
      },
      {
        question: "How often do you adjust bids and review ad campaigns?",
        answer:
          "We monitor budgets daily and execute detailed bid adjustments, search term harvesting, and placement optimizations twice weekly.",
      },
    ],
  },

  // ── 22. Seller Training ─────────────────────────────────────────────────
  "seller-training": {
    name: "Seller Training",
    category: "Marketplace & Seller",
    description:
      "Practical marketplace training for sellers, teams, and operators who want to manage accounts with confidence.",
    seo: {
      metaTitle: "E-Commerce Seller Training & Coaching | Kraviona",
      metaDescription:
        "Practical, 1-on-1 marketplace training for business owners and operators. Master Amazon Seller Central, listing management, ad campaigns, and payout tracking.",
      keywords: [
        "Seller Training Services",
        "Amazon Seller Training Delhi",
        "Flipkart Seller Course India",
        "Marketplace Coaching for Founders",
        "Ecommerce Operations Training",
        "Seller Central Coaching",
      ],
    },
    hero: {
      eyebrow: "Practical Skill Building & Coaching",
      title: "Marketplace Seller",
      highlight: "Training",
      description:
        "Practical, 1-on-1 coaching that empowers your internal team to run Amazon and Flipkart operations independently with confidence, clarity, and proven operating processes.",
    },
    intro:
      "External agency dependencies can be costly. Kraviona conducts tailored, practical seller training workshops designed to build deep operational competence within your in-house team, covering everything from bulk catalog uploads and inventory replenishment to ad optimization and settlement analysis.",
    outcomes: [
      {
        title: "Marketplace onboarding & portal navigation",
        description:
          "Master Seller Central, Flipkart Seller Hub, and Meesho Supplier panels without getting overwhelmed.",
      },
      {
        title: "Catalog, variation & order workflows",
        description:
          "Hands-on training on flat file uploads, variation mapping, order dispatching, and return processing.",
      },
      {
        title: "PPC advertising & bid management basics",
        description:
          "Learn how to set up, monitor, and prune advertising campaigns to prevent wasted budgets.",
      },
      {
        title: "Standard operating procedures (SOPs) for teams",
        description:
          "Ready-to-use checklists and documentation for your daily, weekly, and monthly seller operations.",
      },
    ],
    deliverables: [
      "Custom 1-on-1 or team training curriculum tailored to your product category",
      "Screen-recorded video walkthroughs for your team's permanent reference",
      "Standard Operating Procedure (SOP) documentation for all daily workflows",
      "Inventory flat file templates and keyword research formula sheets",
      "PPC bid optimization checklist and search term harvesting guides",
      "30-day post-training email and WhatsApp Q&A support",
    ],
    idealFor: [
      "Founders and business owners who want to understand marketplace operations before delegating",
      "Companies wanting to train in-house staff to manage seller accounts internally",
      "Traditional manufacturers entering e-commerce without prior digital experience",
      "Operations teams needing refresher training on modern marketplace algorithms",
    ],
    process: [
      {
        title: "Skill Assessment & Custom Syllabus",
        description:
          "We evaluate your team's current knowledge and design a tailored curriculum focused on your products.",
      },
      {
        title: "Hands-on Live Training Sessions",
        description:
          "We conduct live, screen-share workshops directly inside your active seller portal with real examples.",
      },
      {
        title: "Practical Assignment & Review",
        description:
          "Your team executes real catalog uploads, ad setups, and order routines with our live feedback.",
      },
      {
        title: "SOP Handover & Post-Training Support",
        description:
          "We deliver written SOP checklists and provide 30 days of direct Q&A assistance for emerging challenges.",
      },
    ],
    techStack: [
      "Amazon Seller Central",
      "Flipkart Hub",
      "Standard Operating Procedures",
      "Live Dashboards",
      "Screen Walkthroughs",
      "Excel Flat Files",
    ],
    faqs: [
      {
        question: "Is this generic theoretical training or practical coaching?",
        answer:
          "It is 100% practical and conducted directly on your live seller account. We walk through your real catalog, your actual advertising campaigns, and your specific fulfillment workflows.",
      },
      {
        question: "Can multiple team members attend the training sessions?",
        answer:
          "Yes. Our training sessions can accommodate business owners, warehouse managers, catalog operators, and marketing staff simultaneously.",
      },
      {
        question: "How long does the training program take?",
        answer:
          "The complete practical curriculum is typically delivered over 4 to 8 focused sessions (1.5 hours each), scheduled flexibly around your team's working hours.",
      },
      {
        question: "Do you provide documentation we can reference later?",
        answer:
          "Yes. Every session includes session screen recordings, downloadable step-by-step SOP checklists, and Excel calculation templates.",
      },
      {
        question: "What happens if our team has questions after the training ends?",
        answer:
          "Every training package includes 30 days of follow-up support via WhatsApp and email to resolve any doubts or unexpected issues.",
      },
    ],
  },

  // ── 23. UI/UX Design ────────────────────────────────────────────────────
  "ui-ux-design": {
    name: "UI/UX Design",
    category: "Web Development",
    description:
      "Conversion-focused user interfaces, interactive wireframes, unified design systems, and responsive digital product experiences.",
    seo: {
      metaTitle: "UI/UX Design Services in Delhi NCR | Kraviona",
      metaDescription:
        "User-centric UI/UX design services that convert visitors into customers. Intuitive wireframes, interactive Figma prototypes, design systems, and clean UI.",
      keywords: [
        "UI UX Design Services",
        "UI UX Agency Delhi NCR",
        "Product Design India",
        "Figma Prototyping",
        "Design System Development",
        "User Interface Design",
      ],
    },
    hero: {
      eyebrow: "Product Design & Usability",
      title: "UI/UX Design",
      highlight: "Services",
      description:
        "Interfaces that balance aesthetics with frictionless usability. We turn complex user journeys into intuitive, high-converting digital products that users love.",
    },
    intro:
      "Great product design is not just visual polish; it is how easily a user reaches their objective. Kraviona crafts human-centered UI/UX designs grounded in behavioral psychology, user journey mapping, and conversion rate optimization (CRO) principles, ensuring every click feels intuitive and friction-free.",
    outcomes: [
      {
        title: "Interactive wireframes & user journeys",
        description:
          "Low-fidelity wireframes that clarify content hierarchy and eliminate friction points early.",
      },
      {
        title: "Responsive visual interface design",
        description:
          "High-fidelity UI mockups in Figma with modern typography, generous whitespace, and accessibility contrast.",
      },
      {
        title: "Comprehensive design system components",
        description:
          "Reusable buttons, inputs, modals, and navigation components that streamline frontend development.",
      },
      {
        title: "Usability testing & conversion improvements",
        description:
          "Heuristic evaluation and user testing that identify drop-off points before engineering begins.",
      },
    ],
    deliverables: [
      "Clickable interactive Figma prototype covering mobile and desktop viewports",
      "Complete design system with color styles, typography tokens, and component states",
      "User flow diagrams and information architecture blueprints",
      "Developer-ready design specs with CSS values, spacing tokens, and asset exports",
      "Accessibility audit verifying WCAG 2.1 AA color contrast compliance",
      "Full Figma source file ownership and design handover call",
    ],
    idealFor: [
      "Startups needing a validated, clickable prototype to pitch investors or test with users",
      "Web applications with high user drop-offs during onboarding or checkout",
      "Companies wanting to modernize clunky, outdated software interfaces",
      "Engineering teams needing precise design specifications before writing code",
    ],
    process: [
      {
        title: "User Research & Information Architecture",
        description:
          "We analyze user goals, map core user journeys, and establish the site or application structure.",
      },
      {
        title: "Low-Fidelity Wireframing",
        description:
          "We draft page layouts and content hierarchies to align on functionality before visual styling.",
      },
      {
        title: "High-Fidelity UI & Design System",
        description:
          "We apply brand styling, typography, and color tokens, building an interactive prototype in Figma.",
      },
      {
        title: "Prototype Testing & Developer Handover",
        description:
          "We run usability tests, refine micro-interactions, and provide detailed component specs to developers.",
      },
    ],
    techStack: [
      "Figma",
      "Adobe XD",
      "Design Systems",
      "Mobile-First Prototyping",
      "Usability Testing",
      "Tailwind CSS",
      "Framer Motion",
    ],
    faqs: [
      {
        question: "What is the difference between UI and UX design?",
        answer:
          "UX (User Experience) focuses on how an application functions, user flow logic, and how easily users achieve their goals. UI (User Interface) focuses on the visual look: colors, typography, buttons, spacing, and micro-interactions.",
      },
      {
        question: "Do you design for both mobile and desktop screens?",
        answer:
          "Yes. Every screen is designed with a mobile-first philosophy, ensuring responsive perfection across smartphones, tablets, laptops, and wide monitors.",
      },
      {
        question: "Can our developers easily build what you design in Figma?",
        answer:
          "Yes. Because Kraviona is also an engineering firm, our designers build Figma files using real CSS box models, auto-layout, and Tailwind token naming conventions, making developer handoff painless.",
      },
      {
        question: "Do you provide clickable prototypes for testing?",
        answer:
          "Yes. You receive a fully interactive, clickable Figma prototype that simulates real product navigation, modal popups, and button interactions.",
      },
      {
        question: "How long does a full UI/UX design project take?",
        answer:
          "A typical web application or website design project takes 3 to 6 weeks, covering research, wireframing, high-fidelity UI, and developer handover.",
      },
    ],
  },

  // ── 24. Web App Development ─────────────────────────────────────────────
  "web-app-development": {
    name: "Web App Development",
    category: "Web Development",
    description:
      "Custom, enterprise-grade web applications for modern businesses, client portals, internal ERPs, and workflow dashboards.",
    seo: {
      metaTitle: "Custom Web App Development Services | Kraviona",
      metaDescription:
        "Custom web application development for startups and modern businesses. We build scalable SaaS platforms, client portals, and workflow dashboards with Next.js.",
      keywords: [
        "Web App Development Services",
        "Custom Web Application Delhi",
        "Enterprise Web Apps India",
        "SaaS Web Application",
        "Business Portal Development",
        "Custom Software Engineering",
      ],
    },
    hero: {
      eyebrow: "Custom Application Engineering",
      title: "Custom Web App",
      highlight: "Development",
      description:
        "Purpose-built web applications that automate operations, delight users, and scale without friction. From customer-facing portals to data-dense operational dashboards.",
    },
    intro:
      "Off-the-shelf software rarely fits unique business models. Kraviona designs and develops bespoke web applications engineered around your exact workflows, compliance requirements, and user journeys. We build resilient applications that reduce human error and eliminate operational bottlenecks.",
    outcomes: [
      {
        title: "MVP & custom web app engineering",
        description:
          "Rapid delivery of core functional features built on modern, maintainable technology foundations.",
      },
      {
        title: "Admin panels & operational dashboards",
        description:
          "Data-dense interfaces with real-time filtering, charting, role permissions, and export capabilities.",
      },
      {
        title: "Authentication & granular user workflows",
        description:
          "Secure login, multi-factor authentication (MFA), passwordless magic links, and permission tiers.",
      },
      {
        title: "Cloud hosting, maintenance & support",
        description:
          "High-availability AWS hosting, automatic database backups, SSL security, and ongoing technical support.",
      },
    ],
    deliverables: [
      "Production-ready custom web application codebase",
      "Interactive, responsive frontend built with Next.js and Tailwind CSS",
      "Secure backend API layer with role-based access control (RBAC)",
      "Optimized relational (PostgreSQL) or document (MongoDB) database",
      "Automated third-party API integrations (payments, SMS, email, CRM)",
      "Continuous CI/CD deployment configuration with cloud server hosting",
    ],
    idealFor: [
      "Businesses outgrowing spreadsheets that need a centralized internal software portal",
      "Startups building custom digital products to disrupt their industry",
      "Companies wanting a branded client portal for seamless customer communication",
      "Enterprises replacing expensive, bloated third-party software with owned technology",
    ],
    process: [
      {
        title: "Requirement Mapping & Workflow Discovery",
        description:
          "We analyze user roles, business logic, data structures, and third-party integrations.",
      },
      {
        title: "Architecture & Interactive Prototyping",
        description:
          "We design database schemas, API contracts, and clickable UI wireframes for stakeholder approval.",
      },
      {
        title: "Agile Development & Milestone Reviews",
        description:
          "We build features in bi-weekly sprints with working demonstrations and continuous testing.",
      },
      {
        title: "Security Hardening, Cloud Launch & Training",
        description:
          "We run penetration tests, deploy to production cloud servers, and train your team on system administration.",
      },
    ],
    techStack: [
      "Next.js",
      "React.js",
      "Node.js",
      "PostgreSQL",
      "MongoDB",
      "AWS",
      "Tailwind CSS",
      "Redis",
      "TypeScript",
      "Docker",
    ],
    faqs: [
      {
        question: "How is a custom web app different from a regular website?",
        answer:
          "A regular website is primarily informational. A web application is an interactive software tool where users log in, perform complex tasks, submit transactions, manipulate data, and generate reports.",
      },
      {
        question: "Can our web app run on mobile phones like an app?",
        answer:
          "Yes. We build web applications with Progressive Web App (PWA) capabilities, allowing users to add the application to their mobile home screen with app-like speeds and offline caching.",
      },
      {
        question: "How do you protect sensitive company data in custom web apps?",
        answer:
          "We implement SSL/TLS encryption, JWT/session authentication, strict role-based access control (RBAC), bcrypt password hashing, parameterized database queries, and encrypted backups.",
      },
      {
        question: "Will we own the software code after project delivery?",
        answer:
          "Yes. You receive 100% intellectual property ownership of all source code, database structures, and assets upon project completion.",
      },
      {
        question: "What ongoing maintenance does a custom web application require?",
        answer:
          "Regular maintenance includes server OS security patches, package dependency updates, database index optimization, and performance monitoring. We offer ongoing maintenance retainers to handle this smoothly.",
      },
    ],
  },

  // ── 22. Next.js Development ───────────────────────────────────────────────
  "nextjs-development": {
    name: "Next.js Development",
    shortName: "Next.js",
    category: "Web Development",
    description:
      "Production-grade Next.js web applications built with React Server Components, App Router, SSR, and Core Web Vitals optimization.",
    seo: {
      metaTitle: "Next.js Development Company in India | Kraviona",
      metaDescription:
        "Custom Next.js development services for startups and enterprises in India. High-velocity App Router architecture, SSR, and Core Web Vitals optimization.",
      keywords: [
        "Next.js Development Company India",
        "Next.js Development Services",
        "Next.js Developers Delhi NCR",
        "Hire Next.js Developer India",
        "Next.js App Router Agency",
        "React Server Components India",
      ],
    },
    hero: {
      eyebrow: "Next.js Development Company India",
      title: "Next.js Development",
      highlight: "Services",
      description:
        "High-velocity Next.js applications engineered for sub-second speeds, App Router architecture, SSR, and top Google search rankings.",
    },
    intro:
      "At Kraviona, our Next.js development services combine React Server Components, hybrid SSR/SSG rendering, and edge computing to engineer websites and web applications that achieve 90+ PageSpeed scores and top search engine visibility. We build production systems for fast-growing startups and enterprises across India and global tech markets.",
    outcomes: [
      {
        title: "Sub-second PageSpeed & Core Web Vitals",
        description:
          "We leverage streaming SSR, automatic image optimization, and bundle trimming to ensure your website passes Google Core Web Vitals on mobile and desktop.",
      },
      {
        title: "App Router & React Server Components",
        description:
          "Modern Next.js 14/15 architecture with server-first data fetching, nested layouts, and minimal client-side JavaScript payloads.",
      },
      {
        title: "SEO-native architectural foundations",
        description:
          "Dynamic metadata, auto-generated sitemaps, Open Graph social cards, and structured JSON-LD schemas baked directly into every route.",
      },
      {
        title: "Cloud & edge deployment pipelines",
        description:
          "Automated CI/CD with Docker containerization, AWS EC2/Amplify or Vercel edge deployment, and zero-downtime release workflows.",
      },
    ],
    deliverables: [
      "Production Next.js application codebase with clean component hierarchy",
      "Dynamic App Router architecture with server components and edge middleware",
      "API route handlers and backend integrations with MongoDB or PostgreSQL",
      "Automated sitemap.xml, robots.txt, and Schema.org structured data",
      "Lighthouse 90+ performance optimization and Core Web Vitals compliance",
      "Full cloud deployment configuration with SSL, PM2/Docker, and reverse proxy",
    ],
    idealFor: [
      "Startups and SaaS companies requiring search visibility from day one",
      "E-commerce brands seeking lightning-fast custom storefronts",
      "Content platforms, directories, and portals needing rapid indexing",
      "Companies upgrading from Create React App, WordPress, or legacy PHP stacks",
    ],
    process: [
      {
        title: "Discovery & Rendering Strategy",
        description:
          "We evaluate whether SSR, SSG, ISR, or edge rendering best serves your application's data velocity and SEO goals.",
      },
      {
        title: "Component & App Router Architecture",
        description:
          "We scaffold clean domain boundaries, reusable UI components, and server-side data fetching layers.",
      },
      {
        title: "State, API & Database Integration",
        description:
          "We integrate RESTful or GraphQL APIs, authentication flows, and database connections with strict validation.",
      },
      {
        title: "Performance Tuning & Cloud Launch",
        description:
          "We run Core Web Vitals audits, configure caching headers, and deploy the application to your cloud infrastructure.",
      },
    ],
    techStack: [
      "Next.js 14/15",
      "React 18/19",
      "TypeScript",
      "Tailwind CSS",
      "Node.js",
      "Prisma ORM",
      "MongoDB",
      "PostgreSQL",
      "Docker",
      "AWS",
    ],
    faqs: [
      {
        question: "Why choose Next.js over plain React?",
        answer:
          "Next.js renders pages on the server before sending HTML to the browser, enabling instant search engine indexability, superior Core Web Vitals, and much faster initial page loads compared to client-only React SPAs.",
      },
      {
        question: "Can Kraviona migrate our existing React app to Next.js?",
        answer:
          "Yes. We specialize in zero-downtime migrations from Create React App, Vite, or legacy stacks to modern Next.js App Router architectures.",
      },
      {
        question: "How does Next.js improve Google search rankings?",
        answer:
          "Because Next.js pre-renders HTML on the server, Googlebot immediately discovers and indexes your complete text, headings, and schema markup without waiting for client-side JavaScript execution.",
      },
      {
        question: "Do you build with the Next.js App Router?",
        answer:
          "Yes. We build all modern projects on the Next.js App Router with React Server Components, server actions, and granular Suspense boundaries.",
      },
    ],
  },
};

export const SERVICE_LINKS = Object.entries(SERVICE_PAGES).map(
  ([slug, service]) => ({
    name: service.name,
    href: `/services/${slug}`,
    category: service.category,
  }),
);

// ── Service Category Hub Pages ────────────────────────────────────────────────
// Each entry maps a hub slug to its SEO + content metadata.
// These are rendered by /services/[category]/page.jsx when the category
// param matches one of these keys instead of an individual service slug.

export const SERVICE_CATEGORY_HUBS = {
  "web-development": {
    categoryLabel: "Web Development",
    slug: "web-development",
    h1: "Web Development Services — Fast, SEO-Ready Websites & Apps",
    metaTitle: "Web Development Services in Delhi NCR | Kraviona",
    metaDescription:
      "Kraviona builds high-performance websites and web apps using Next.js, React, Node.js, and MERN stack — SEO-ready, mobile-first, and built for long-term scale.",
    intro: [
      "Every Kraviona web project starts with one question: what does the business actually need the product to do? Whether that's acquiring leads, running a user portal, powering a marketplace, or replacing a legacy interface, the technical decisions follow from the goal — not the other way around.",
      "Our web development stack centres on Next.js, React, Node.js, and MongoDB. These aren't fashionable choices — they're practical ones. They give us server-side rendering for SEO, fast client navigation for usability, a clean API layer for integrations, and a scalable database that grows with the product without requiring schema migrations every quarter.",
      "Every project ships with responsive layouts, Core Web Vitals–compliant performance, semantic HTML for accessibility and search, and clear handover documentation so your team isn't dependent on us forever. Post-launch support is available, but the goal is always to deliver something your team can confidently own.",
    ],
    serviceKeys: [
      "mern-stack-development",
      "full-stack-development",
      "react-development",
      "nodejs-development",
      "web-app-development",
      "ui-ux-design",
    ],
  },
  "backend-architecture": {
    categoryLabel: "Backend & Architecture",
    slug: "backend-architecture",
    h1: "Backend Development & Architecture Services — APIs, Databases & Scalable Systems",
    metaTitle: "Backend Development & Architecture Services | Kraviona",
    metaDescription:
      "Custom backend systems, REST and GraphQL APIs, database architecture, and SaaS platforms built for reliability, security, and clean maintainability.",
    intro: [
      "A good frontend experience lives or dies by the backend behind it. Kraviona's backend work covers the complete server-side stack — RESTful and GraphQL APIs, authentication and authorisation flows, database schema design, third-party integrations, and the deployment and monitoring configuration that keeps everything stable in production.",
      "We design for maintainability. That means clear folder structure, consistent naming conventions, typed interfaces where the language supports them, documented endpoints, and error handling that produces useful logs rather than silent failures. A system that's easy to understand six months later is worth more than one that's elegant today and impenetrable next quarter.",
      "Whether you're building a new SaaS product from scratch, scaling an API that's showing strain under load, or migrating a legacy monolith toward a more modular architecture, Kraviona can handle the discovery, planning, and implementation — and hand it over with enough documentation that your internal team can take it further.",
    ],
    serviceKeys: [
      "backend-development",
      "api-development",
      "database-architecture",
      "saas-development",
    ],
  },
  "performance-ai": {
    categoryLabel: "Performance & AI",
    slug: "performance-ai",
    h1: "Performance Optimisation & AI Services — Speed, SEO & Intelligent Automation",
    metaTitle: "Web Performance & AI Automation Services | Kraviona",
    metaDescription:
      "Technical SEO, Core Web Vitals optimisation, LLM integrations, and AI workflow automation for businesses that want measurable speed and search improvements.",
    intro: [
      "Site speed and search visibility are not separate disciplines. A page that loads in four seconds on mobile loses both users and rankings simultaneously. Kraviona's performance work addresses both at once: Core Web Vitals improvements (Largest Contentful Paint, Cumulative Layout Shift, Interaction to Next Paint), image and asset optimisation, bundle analysis and code-splitting, caching strategy, and the technical SEO fixes — canonical tags, structured data, crawl architecture, indexation — that turn speed improvements into ranking improvements.",
      "The AI side of this category covers a different kind of efficiency: reducing the manual, repetitive work that keeps teams from doing higher-value things. We build custom LLM integrations, AI chat assistants trained on your product content, document automation pipelines, and internal tools that slot into the workflows you already have instead of demanding a full process change.",
      "Every project in this category comes with before-and-after measurement. Lighthouse scores, Google Search Console impressions, crawl coverage, automation time savings — we document the starting point and the result so you can see exactly what changed and decide what to improve next.",
    ],
    serviceKeys: [
      "technical-seo",
      "web-performance-optimization",
      "ai-automation",
      "ai-chatbot-development",
    ],
  },
  "branding-marketing": {
    categoryLabel: "Branding & Marketing",
    slug: "branding-marketing",
    h1: "Branding & Digital Marketing Services — Positioning, Campaigns & Measurable Growth",
    metaTitle: "Branding & Digital Marketing Services | Kraviona",
    metaDescription:
      "Brand identity, digital marketing strategy, social media, email campaigns, and conversion-focused funnels that turn traffic into qualified leads and revenue.",
    intro: [
      "A brand is not a logo — it's the consistent impression a business leaves across every touchpoint. Kraviona's branding and marketing work starts with understanding what makes a business worth choosing over its competitors, then builds the visual identity, messaging, and channel strategy that communicates that clearly and consistently.",
      "On the marketing side, our focus is on systems rather than one-off campaigns. A well-built email nurture sequence keeps working after setup. A properly structured Google Ads account improves with every cycle. An SEO content plan compounds over months. We prefer to build marketing infrastructure that gets more efficient over time rather than delivering campaigns that require full rebuilds for every promotion.",
      "Reporting is built into every engagement. We track the metrics that actually connect to business outcomes — leads generated, cost per acquisition, email open and click rates, organic traffic growth, conversion events — not vanity numbers that look good in a presentation but don't connect to revenue.",
    ],
    serviceKeys: [
      "digital-marketing",
      "social-media-marketing",
      "email-marketing",
      "brand-identity",
    ],
  },
  "marketplace-seller": {
    categoryLabel: "Marketplace & Seller",
    slug: "marketplace-seller",
    h1: "Marketplace & Seller Services — Account Management, Cataloging & Seller Growth",
    metaTitle: "Marketplace Seller Services & Growth | Kraviona",
    metaDescription:
      "End-to-end marketplace support for sellers: account management, cataloging, advertising, accounting, and practical seller training for sustainable growth.",
    intro: [
      "Selling on a marketplace platform — Amazon, Flipkart, Meesho, or any other — involves a level of operational complexity that most sellers underestimate until they're inside it. Catalog errors surface months after listing. Account health metrics shift without warning. Advertising spend goes up while return on ad spend quietly drops. Kraviona's marketplace services are built to catch and fix these problems before they compound.",
      "Our work spans the full seller operation: initial account setup and health checks, product catalog creation and optimisation (titles, bullet points, images, A+ content, variations), advertising campaign structure and bid management, order and inventory process reviews, and the bookkeeping and reconciliation that gives sellers a clear picture of actual profitability after fees and returns.",
      "We also run practical training sessions for seller teams and operations staff — not generic workshops, but focused walkthroughs of the specific platform, catalog, and reporting tools your team uses daily. The goal is always to build capability inside your operation, not to create a dependency on external management.",
    ],
    serviceKeys: [
      "ecommerce-development-marketing",
      "account-management",
      "cataloging",
      "accounting",
      "advertising",
      "seller-training",
    ],
  },
};

// Returns sibling services in the same category as the given service slug.
// Used for "Related Services" cross-links at the bottom of service pages.
export function getRelatedServicesInCategory(currentSlug, limit = 4) {
  const currentService = SERVICE_PAGES[currentSlug];
  if (!currentService) return [];

  const currentCategory = currentService.category;
  return Object.entries(SERVICE_PAGES)
    .filter(([slug, svc]) => svc.category === currentCategory && slug !== currentSlug)
    .slice(0, limit)
    .map(([slug, svc]) => ({
      name: svc.name,
      href: `/services/${slug}`,
      description: svc.description,
    }));
}

// Returns the hub slug for a given category label (e.g. "Web Development" → "web-development")
export function getCategoryHubSlug(categoryLabel) {
  return (
    Object.values(SERVICE_CATEGORY_HUBS).find(
      (hub) => hub.categoryLabel === categoryLabel,
    )?.slug || null
  );
}

// Fallback dynamic service page FAQs
export function getServiceFaqs(service) {
  const categoryFaqs = CATEGORY_DETAILS[service.category]?.faqs || [];
  const outcomeSummary = (service.outcomes || []).slice(0, 3).map(o => typeof o === 'string' ? o : o.title).join(", ").toLowerCase();

  return [
    {
      question: `What is included in Kraviona's ${service.name} service?`,
      answer: `The scope is shaped around your goals, current setup, and delivery priorities. A typical ${service.name} engagement can include ${outcomeSummary}. Before work begins, Kraviona confirms the practical deliverables, responsibilities, review points, and launch or handover plan in writing.`,
    },
    {
      question: `How do you scope a ${service.name} project?`,
      answer: `Kraviona starts with a discovery conversation, reviews the existing product or requirement, and identifies the highest-impact work. The team then turns that into a phased scope with assumptions, dependencies, milestones, and a realistic timeline, so the project stays focused instead of becoming an open-ended list of requests.`,
    },
    {
      question: `Can ${service.name} work with our existing tools and team?`,
      answer: `Yes. The work can be planned around the systems you already use, including your website, codebase, CMS, CRM, analytics, hosting, or internal workflows. Kraviona documents access needs early, works with your stakeholders, and recommends integration or migration steps that limit unnecessary disruption.`,
    },
    {
      question: `How is progress reported during ${service.name} work?`,
      answer: `You receive clear checkpoints rather than vague status updates. Depending on the scope, these can include a prioritized task plan, working demonstrations, before-and-after findings, implementation notes, and next actions. The reporting focuses on decisions, completed work, risks, and the measurable result the service is intended to improve.`,
    },
    {
      question: `What happens after the ${service.name} work is delivered?`,
      answer: `Kraviona explains what was completed, hands over relevant access or documentation, and outlines sensible next steps for your team. Projects include a practical review period for agreed fixes, while ongoing support can be arranged for monitoring, improvements, new features, or a longer-term growth roadmap.`,
    },
    ...categoryFaqs,
  ].slice(0, 7);
}
