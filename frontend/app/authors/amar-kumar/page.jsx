import Image from "next/image";
import Link from "next/link";
import { Linkedin, Mail, ExternalLink, Code2, Layers, Search, Award, CheckCircle2 } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { API_URL } from "@/utils/api";
import { canonicalUrl, defaultRobots } from "@/app/seoConfig.js";

export const revalidate = 3600;

const authorSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://www.kraviona.com/authors/amar-kumar#person",
  name: "Amar Kumar",
  jobTitle: "Founder & Lead Technical Architect",
  worksFor: {
    "@type": "Organization",
    "@id": "https://www.kraviona.com/#org",
    name: "Kraviona Tech Solutions",
    url: "https://www.kraviona.com",
  },
  url: "https://www.kraviona.com/authors/amar-kumar",
  image: "https://www.kraviona.com/amar.jpeg",
  sameAs: ["https://www.linkedin.com/in/amarkumar96085/"],
  description:
    "Amar Kumar is the Founder and Lead Technical Architect at Kraviona. He specializes in AI-first systems engineering, autonomous agent architectures, Next.js App Router performance, and Generative Engine Optimization (GEO) for high-growth businesses.",
};

const authorBreadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.kraviona.com" },
    { "@type": "ListItem", position: 2, name: "Authors", item: "https://www.kraviona.com/authors" },
    { "@type": "ListItem", position: 3, name: "Amar Kumar", item: "https://www.kraviona.com/authors/amar-kumar" },
  ],
};

export const metadata = {
  title: {
    absolute: "Amar Kumar – Founder & Lead AI Systems Architect | Kraviona",
  },
  description:
    "Read technical articles, AI architectural blueprints, and engineering insights by Amar Kumar, Founder and Lead Technical Architect at Kraviona.",
  alternates: {
    canonical: canonicalUrl("/authors/amar-kumar"),
  },
  openGraph: {
    title: "Amar Kumar – Founder & Lead AI Systems Architect | Kraviona",
    description:
      "AI engineering insights, software blueprints, and Generative Engine Optimization strategies by Amar Kumar, founder of Kraviona.",
    url: canonicalUrl("/authors/amar-kumar"),
    type: "profile",
    images: [
      {
        url: "https://www.kraviona.com/amar.jpeg",
        width: 800,
        height: 800,
        alt: "Amar Kumar — Founder & Lead Technical Architect at Kraviona",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Amar Kumar – Founder & Lead AI Systems Architect | Kraviona",
    description:
      "AI engineering insights, software blueprints, and Generative Engine Optimization strategies by Amar Kumar.",
    images: ["https://www.kraviona.com/amar.jpeg"],
  },
  robots: defaultRobots,
};

async function getAuthorPosts() {
  try {
    const res = await fetch(`${API_URL}/public/posts?limit=12&page=1`, {
      next: { revalidate: 3600 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data?.data) ? data.data : [];
  } catch (err) {
    console.error("[AUTHOR_POSTS_FETCH_ERROR]", err?.message);
    return [];
  }
}

export default async function AmarKumarAuthorPage() {
  const posts = await getAuthorPosts();

  return (
    <>
      <JsonLd data={[authorSchema, authorBreadcrumbSchema]} />

      <main className="min-h-screen bg-[#FEFCF9] text-[#1A3840] pt-28 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Author Header Card */}
          <div className="rounded-3xl border border-[#E8E4DE] bg-white p-8 sm:p-12 shadow-sm mb-12">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
              
              {/* Photo */}
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden border-2 border-[#2D6E7A]/30 shadow-md shrink-0">
                <Image
                  src="/amar.jpeg"
                  alt="Amar Kumar — Founder & Lead Technical Architect at Kraviona Tech Solutions"
                  fill
                  priority
                  className="object-cover"
                />
              </div>

              {/* Bio & Details */}
              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#EAF3F5] border border-[#2D6E7A]/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#2D6E7A] mb-3">
                  <Award className="h-3.5 w-3.5 text-[#C85A3C]" />
                  Founder &amp; Engineering Lead
                </div>
                
                <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#1A3840] tracking-tight mb-2">
                  Amar Kumar
                </h1>
                
                <p className="text-sm sm:text-base font-semibold text-[#C85A3C] mb-4">
                  Lead Technical Architect at Kraviona Tech Solutions
                </p>

                {/* 100-150 word Bio */}
                <p className="text-sm sm:text-base leading-relaxed text-[#5A7A82] mb-6">
                  Amar Kumar is the Founder and Lead Technical Architect at Kraviona, headquartered in Delhi NCR. With more than five years of production software engineering experience, Amar leads the engineering of AI-first systems, autonomous agents, Next.js App Router platforms, scalable cloud backends, and Generative Engine Optimization (GEO) for ambitious startups and enterprises. His technical focus centers on eliminating operational bottlenecks with AI workflows, building sub-second web applications that pass Core Web Vitals, and architecting resilient software foundations designed for commercial scale.
                </p>

                {/* Credentials & Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                  <div className="rounded-xl border border-[#E8E4DE] bg-[#F7F5F1] p-3 text-center">
                    <p className="text-xl font-bold text-[#1A3840]">5+ Years</p>
                    <p className="text-[11px] text-[#5A7A82] uppercase tracking-wide">Engineering</p>
                  </div>
                  <div className="rounded-xl border border-[#E8E4DE] bg-[#F7F5F1] p-3 text-center">
                    <p className="text-xl font-bold text-[#2D6E7A]">20+ Builds</p>
                    <p className="text-[11px] text-[#5A7A82] uppercase tracking-wide">Production Apps</p>
                  </div>
                  <div className="rounded-xl border border-[#E8E4DE] bg-[#F7F5F1] p-3 text-center col-span-2 sm:col-span-1">
                    <p className="text-xl font-bold text-[#C85A3C]">Core Vitals</p>
                    <p className="text-[11px] text-[#5A7A82] uppercase tracking-wide">SEO Architect</p>
                  </div>
                </div>

                {/* Social Actions */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <a
                    href="https://www.linkedin.com/in/amarkumar96085/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#0077b5] hover:bg-[#006097] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all"
                  >
                    <Linkedin size={15} />
                    <span>Connect on LinkedIn</span>
                    <ExternalLink size={12} />
                  </a>

                  <a
                    href="mailto:hello@kraviona.com"
                    className="inline-flex items-center gap-2 rounded-xl border border-[#E8E4DE] bg-white hover:bg-[#F7F5F1] px-4 py-2.5 text-xs font-bold text-[#1A3840] transition-all"
                  >
                    <Mail size={15} className="text-[#2D6E7A]" />
                    <span>hello@kraviona.com</span>
                  </a>
                </div>

              </div>
            </div>
          </div>

          {/* Author Areas of Expertise */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="rounded-2xl border border-[#E8E4DE] bg-white p-6 shadow-2xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2D6E7A]/10 text-[#2D6E7A] mb-4">
                <Code2 size={20} />
              </div>
              <h3 className="font-bold text-base text-[#1A3840] mb-2">AI Systems &amp; Agents</h3>
              <p className="text-xs text-[#5A7A82] leading-relaxed">
                Autonomous cognitive agents, LangChain/n8n pipelines, RAG knowledge systems, and vector database embeddings (Pinecone, pgvector).
              </p>
            </div>

            <div className="rounded-2xl border border-[#E8E4DE] bg-white p-6 shadow-2xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C85A3C]/10 text-[#C85A3C] mb-4">
                <Search size={20} />
              </div>
              <h3 className="font-bold text-base text-[#1A3840] mb-2">Technical SEO, AEO &amp; GEO</h3>
              <p className="text-xs text-[#5A7A82] leading-relaxed">
                Generative Engine Optimization for ChatGPT and Perplexity, Schema.org entity graphs, Core Web Vitals remediation, and crawl architectures.
              </p>
            </div>

            <div className="rounded-2xl border border-[#E8E4DE] bg-white p-6 shadow-2xs">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2D6E7A]/10 text-[#2D6E7A] mb-4">
                <Layers size={20} />
              </div>
              <h3 className="font-bold text-base text-[#1A3840] mb-2">AI-Ready Web &amp; Next.js</h3>
              <p className="text-xs text-[#5A7A82] leading-relaxed">
                Full-stack JavaScript/TypeScript engineering, React Server Components, streaming AI responses, and high-concurrency Node.js microservices.
              </p>
            </div>
          </div>

          {/* Recent Articles Authored */}
          <div>
            <div className="flex items-center justify-between mb-8 border-b border-[#E8E4DE] pb-4">
              <div>
                <h2 className="font-heading text-2xl font-extrabold text-[#1A3840]">
                  Articles Authored by Amar Kumar
                </h2>
                <p className="text-xs text-[#5A7A82] mt-1">
                  Architectural guides, technical analyses, and search engineering insights.
                </p>
              </div>
              <Link
                href="/blog"
                className="text-xs font-bold text-[#2D6E7A] hover:text-[#C85A3C] transition-colors"
              >
                View all articles &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map((post) => {
                const cat = post.category?.slug || (post.contentType === "news" ? "news" : "blog");
                const href = `/${cat}/${post.slug}`;
                return (
                  <Link
                    key={post.slug}
                    href={href}
                    className="group rounded-2xl border border-[#E8E4DE] bg-white p-6 shadow-2xs hover:border-[#2D6E7A]/50 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-[#C85A3C] mb-2">
                      <span>{post.category?.name || "Engineering"}</span>
                      <span>•</span>
                      <span className="text-[#5A7A82]">Technical Guide</span>
                    </div>
                    <h3 className="font-bold text-base text-[#1A3840] group-hover:text-[#2D6E7A] transition-colors mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-xs text-[#5A7A82] leading-relaxed line-clamp-2 mb-4">
                      {post.excerpt || "In-depth technical breakdown and architectural implementation details."}
                    </p>
                    <div className="flex items-center justify-between text-[11px] font-medium text-[#5A7A82]">
                      <span>By Amar Kumar</span>
                      <span className="text-[#2D6E7A] font-semibold group-hover:underline">Read article &rarr;</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

        </div>
      </main>
    </>
  );
}
