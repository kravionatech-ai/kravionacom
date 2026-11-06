import DeferredHomeSections from "@/components/Home/DeferredHomeSections";
import { API_URL } from "@/utils/api";
import HeroSection from "@/components/Home/HeroSection";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import {
  SITE_URL,
  SITE_NAME,
  SITE_TWITTER,
  DEFAULT_OG_IMAGE,
  defaultRobots,
} from "./seoConfig.js";

export const revalidate = 3600;

// JSON-LD: FAQ Schema (AEO/GEO Optimisation)
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What does it mean that Kraviona is an AI-first technology company?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "It means artificial intelligence isn't an afterthought or a marketing gimmick for us. From day one, we design our software architectures, web platforms, and operational tools with AI integration in mind—whether that is embedding autonomous agents, automating multi-step data pipelines, or connecting private company knowledge to LLMs.",
      },
    },
    {
      "@type": "Question",
      name: "What AI and automation solutions does Kraviona develop?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We develop custom AI agents, enterprise chatbots, workflow automation pipelines (using LangChain, LlamaIndex, n8n), RAG-based knowledge retrieval systems, intelligent document processing, and predictive business intelligence tools.",
      },
    },
    {
      "@type": "Question",
      name: "Can Kraviona integrate AI into our existing web applications or CRM?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. We specialize in enterprise AI integration. We embed LLM capabilities, vector search, automated data pipelines, and intelligent assistant interfaces directly into existing codebases and cloud infrastructure.",
      },
    },
    {
      "@type": "Question",
      name: "What is Generative Engine Optimization (GEO) and Answer Engine Optimization (AEO)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AEO and GEO optimize your digital brand to appear as cited answers and authoritative recommendations inside AI search engines such as Perplexity, ChatGPT, Google Gemini, and Claude, backed by technical SEO and structured Schema graphs.",
      },
    },
    {
      "@type": "Question",
      name: "Can you build AI-powered SaaS MVPs for startups?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. We build full-lifecycle SaaS MVPs in 4 to 8 weeks, complete with secure authentication, multi-tenancy, Stripe billing, LLM model integration, and scalable database architecture.",
      },
    },
    {
      "@type": "Question",
      name: "How do you protect business data privacy when implementing AI solutions?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "We implement private enterprise AI models and secure vector databases with strict access boundaries, ensuring your proprietary customer data is never leaked or used to train public foundation models.",
      },
    },
    {
      "@type": "Question",
      name: "How does Kraviona's founder-led engineering approach benefit clients?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Clients work directly with lead engineers without junior layers or account manager telephone games. You get transparent communication, production-grade code, weekly milestone demos, and reliable post-launch support.",
      },
    },
    {
      "@type": "Question",
      name: "What technologies and frameworks do you use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our stack spans Next.js, React, Node.js, Python, PyTorch, MongoDB, PostgreSQL, AWS, Docker, LangChain, OpenAI, and Anthropic APIs.",
      },
    },
  ],
};

// JSON-LD: WebPage Schema
const homePageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://www.kraviona.com/#webpage",
  url: "https://www.kraviona.com",
  name: "Kraviona — AI-First Technology & Digital Solutions Company",
  isPartOf: { "@id": "https://www.kraviona.com/#website" },
  about: { "@id": "https://www.kraviona.com/#organization" },
  description:
    "Kraviona builds intelligent software, custom AI agents, SaaS products, and automated digital systems that help businesses innovate and scale.",
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.kraviona.com",
      },
    ],
  },
};

// JSON-LD: Service schema for homepage
const serviceListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Kraviona AI-First Technology & Software Services",
  description:
    "AI agents, workflow automation, custom software, SaaS development, and technical SEO by Kraviona.",
  url: "https://www.kraviona.com/services",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "Service",
        name: "AI & Automation Solutions",
        description:
          "Autonomous cognitive AI agents, multi-step LLM workflows, process automation, and intelligent RAG knowledge assistants.",
        provider: { "@id": "https://www.kraviona.com/#organization" },
        url: "https://www.kraviona.com/services/ai-automation",
        areaServed: "IN",
      },
    },
    {
      "@type": "ListItem",
      position: 2,
      item: {
        "@type": "Service",
        name: "AI-Ready Web & Custom Software Development",
        description:
          "Full-stack web applications and custom software built with Next.js, React, Node.js, and Python with AI readiness from day one.",
        provider: { "@id": "https://www.kraviona.com/#organization" },
        url: "https://www.kraviona.com/services/mern-stack-development",
        areaServed: "IN",
      },
    },
    {
      "@type": "ListItem",
      position: 3,
      item: {
        "@type": "Service",
        name: "SaaS & Intelligent Software Products",
        description:
          "Cloud-native SaaS products, AI SaaS MVPs, multi-tenant architectures, and scalable subscription systems.",
        provider: { "@id": "https://www.kraviona.com/#organization" },
        url: "https://www.kraviona.com/services/saas-development",
        areaServed: "IN",
      },
    },
    {
      "@type": "ListItem",
      position: 4,
      item: {
        "@type": "Service",
        name: "Technical SEO, AEO & Generative Engine Optimization",
        description:
          "Advanced optimization for Google, Perplexity, and ChatGPT search with structured data, Core Web Vitals, and AI crawlability.",
        provider: { "@id": "https://www.kraviona.com/#organization" },
        url: "https://www.kraviona.com/services/technical-seo",
        areaServed: "IN",
      },
    },
  ],
};

const testimonials = [
  {
    name: "Rahul Sharma",
    company: "E-Commerce Startup, Noida",
    role: "Founder",
    text: "Kraviona built our full marketplace platform in just 6 weeks. The MERN stack implementation was clean, scalable, and the team was always available on WhatsApp. Highly recommended for any startup.",
    rating: 5,
    initials: "RS",
  },
  {
    name: "Priya Mehta",
    company: "D2C Brand, Delhi",
    role: "Marketing Head",
    text: "Our organic traffic increased by 3x in 4 months after Kraviona's Technical SEO audit. They identified Core Web Vitals issues we didn't even know existed and fixed everything within 2 weeks.",
    rating: 5,
    initials: "PM",
  },
  {
    name: "Vikash Gupta",
    company: "SaaS Company, Gurugram",
    role: "CTO",
    text: "The Node.js API they built handles 10,000+ daily requests without any issues. Code quality is excellent - properly documented, tested, and handed over with a detailed technical guide.",
    rating: 5,
    initials: "VG",
  },
];

// ─── Homepage Metadata ────────────────────────────────────────────────────────
export const metadata = {
  title: {
    absolute:
      "Kraviona — AI-First Technology & Digital Solutions Company",
  },
  description:
    "Building Intelligent Businesses Through AI, Technology & Automation. Kraviona develops custom AI agents, intelligent software, SaaS products, and enterprise automation.",
  authors: [{ name: "Kraviona", url: SITE_URL }],
  creator: "Kraviona",
  publisher: "Kraviona",
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    title: "Kraviona — AI-First Technology & Digital Solutions Company",
    description:
      "Building Intelligent Businesses Through AI, Technology & Automation. Custom AI agents, intelligent software development, SaaS products, and enterprise automation.",
    siteName: "Kraviona",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Kraviona — AI-First Technology & Digital Solutions Company",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: SITE_TWITTER,
    creator: SITE_TWITTER,
    title: "Kraviona — AI-First Technology & Digital Solutions Company",
    description:
      "Building Intelligent Businesses Through AI, Technology & Automation. Custom AI agents, intelligent software, and enterprise automation.",
    images: [DEFAULT_OG_IMAGE],
  },
  robots: defaultRobots,
};

async function getLatestPosts() {
  try {
    const response = await fetch(`${API_URL}/public/posts?page=1&limit=3`, {
      next: { revalidate: 3600 },
      headers: { Accept: "application/json" },
    });
    if (!response.ok) return [];
    const json = await response.json();
    const posts = Array.isArray(json?.data) ? json.data : [];
    return posts.filter((post) => post?.slug).slice(0, 3);
  } catch {
    return [];
  }
}

const Home = async () => {
  const latestPosts = await getLatestPosts();
  const latestPostsSchema = latestPosts.length
    ? {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "Latest Kraviona articles",
        itemListElement: latestPosts.map((post, index) => {
          const cat = post.category?.slug || (post.contentType === "news" ? "news" : "blog");
          return {
            "@type": "ListItem",
            position: index + 1,
            url: `https://www.kraviona.com/${cat}/${post.slug}`,
            name: post.title,
          };
        }),
      }
    : null;

  return (
    <>
      {/* Structured Data */}
      <JsonLd
        data={[homePageSchema, serviceListSchema, faqSchema, latestPostsSchema].filter(Boolean)}
      />

      {/* Page Sections */}
      <HeroSection />

      {/* ── SEO Content Block ── */}
      <section className="py-20 bg-[#FEFCF9]" aria-label="About our services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <span className="w-10 h-[2px] bg-[#C85A3C]" />
                <span className="text-[#C85A3C] font-bold uppercase tracking-[0.18em] text-xs">
                  Who We Are
                </span>
              </div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-[#1A3840] leading-tight mb-5">
                Engineering Intelligent Businesses Through{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2D6E7A] to-[#C85A3C]">
                  AI, Software &amp; Automation
                </span>
              </h2>
              <p className="text-[#5A7A82] leading-relaxed mb-5 text-base md:text-lg">
                Kraviona is an <strong className="text-[#1A3840]">AI-first technology company</strong> helping ambitious businesses build intelligent software, develop AI-powered solutions, and automate complex workflows. We combine modern artificial intelligence with full-stack software engineering and data-driven growth.
              </p>
              <p className="text-[#5A7A82] leading-relaxed mb-6 text-base md:text-lg">
                From <strong className="text-[#1A3840]">autonomous AI agents and conversational assistants</strong> to <strong className="text-[#1A3840]">AI-ready web applications, cloud SaaS engineering, and Generative Engine Optimization (GEO)</strong>, we build digital solutions that work smarter, rank higher, and drive measurable ROI.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { value: "AI-First", label: "Engineering Focus" },
                  { value: "50+", label: "Systems Delivered" },
                  { value: "AEO & SEO", label: "Built Into Delivery" },
                  { value: "100%", label: "Founder-Led Delivery" },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-[#FEFCF9] border border-[#E8E4DE] rounded-[12px] p-4 shadow-sm text-center"
                  >
                    <p className="text-2xl font-black text-[#C85A3C]">
                      {stat.value}
                    </p>
                    <p className="text-xs text-[#5A7A82] font-semibold uppercase tracking-wide mt-1">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
              <section className="mb-8" aria-label="Client testimonials">
                <div className="mb-5">
                  <span className="text-[#C85A3C] font-bold uppercase tracking-[0.18em] text-xs">
                    Client Results
                  </span>
                  <h3 className="font-heading mt-2 text-2xl font-bold text-[#1A3840]">
                    Built for founders and growth teams
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {testimonials.map((testimonial) => (
                    <article
                      key={testimonial.name}
                      className="rounded-[12px] border border-[#E8E4DE] bg-[#FEFCF9] p-5 shadow-sm"
                    >
                      <div className="mb-3 text-sm tracking-[0.15em] text-[#D4A550]">
                        {"★".repeat(testimonial.rating)}
                      </div>
                      <p className="text-sm leading-relaxed text-[#5A7A82]">
                        “{testimonial.text}”
                      </p>
                      <div className="mt-4 flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EAF3F5] text-sm font-black text-[#2D6E7A]">
                          {testimonial.initials}
                        </span>
                        <div>
                          <p className="font-bold text-[#1A3840]">
                            {testimonial.name}
                          </p>
                          <p className="text-xs font-semibold text-[#5A7A82]">
                            {testimonial.role}, {testimonial.company}
                          </p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#C85A3C] text-white font-bold rounded-[6px] hover:bg-[#B04D31] transition-all duration-300 text-sm shadow-sm"
              >
                Learn About Kraviona
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </Link>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-5">
                <span className="w-10 h-[2px] bg-[#2D6E7A]" />
                <span className="text-[#2D6E7A] font-bold uppercase tracking-[0.18em] text-xs">
                  Core Business Pillars
                </span>
              </div>
              {[
                {
                  title: "01. IT & Technology Services",
                  desc: "AI-ready web development, custom software engineering, mobile apps, enterprise applications, and cloud backend systems.",
                  href: "/services/web-development",
                },
                {
                  title: "02. AI & Automation Solutions",
                  desc: "Autonomous AI agents, conversational chatbots, generative AI integrations, workflow automation, and RAG knowledge assistants.",
                  href: "/services/ai-automation",
                },
                {
                  title: "03. SaaS & Software Products",
                  desc: "Full-lifecycle SaaS development, AI SaaS MVPs, cloud-based software architectures, multi-tenant systems, and subscription platforms.",
                  href: "/services/saas-development",
                },
                {
                  title: "04. E-commerce Solutions",
                  desc: "AI-powered e-commerce development, intelligent product recommendations, store automation, payment integrations, and marketplace growth.",
                  href: "/services/ecommerce-development-marketing",
                },
                {
                  title: "05. Digital Marketing Services",
                  desc: "Answer Engine Optimization (AEO), Generative Engine Optimization (GEO), technical SEO, schema graphs, and data-driven performance growth.",
                  href: "/services/technical-seo",
                },
                {
                  title: "Enterprise API & System Integration",
                  desc: "RESTful and GraphQL APIs, cognitive AI model endpoints, secure cloud infrastructure, and microservices connecting enterprise workflows.",
                  href: "/services/api-development",
                },
              ].map((service, i) => (
                <Link
                  key={i}
                  href={service.href}
                  className="group flex gap-4 p-5 bg-[#FEFCF9] border border-[#E8E4DE] rounded-[12px] hover:border-[#2D6E7A]/40 hover:shadow-[0_4px_20px_rgba(45,110,122,0.08)] transition-all duration-300"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-[8px] bg-[#EAF3F5] flex items-center justify-center mt-0.5">
                    <span className="text-[#2D6E7A] font-bold text-sm">
                      0{i + 1}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-[#1A3840] mb-1 group-hover:text-[#C85A3C] transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-[#5A7A82] text-sm leading-relaxed">
                      {service.desc}
                    </p>
                  </div>
                </Link>
              ))}
              <Link
                href="/services"
                className="inline-flex items-center gap-2 text-[#2D6E7A] font-bold hover:text-[#C85A3C] transition-colors text-sm"
              >
                View All Services →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <DeferredHomeSections initialPosts={latestPosts} />
    </>
  );
};

export default Home;
