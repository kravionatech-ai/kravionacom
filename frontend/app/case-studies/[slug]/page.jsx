import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import parse from "html-react-parser";
import {
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  Globe,
  Calendar,
  User,
  Layers,
  Sparkles,
  Code2,
  ShieldCheck,
  ArrowRight,
  Laptop,
  Check,
} from "lucide-react";

import { API_URL } from "@/utils/api";
import {
  canonicalUrl,
  defaultRobots,
  SITE_NAME,
  DEFAULT_OG_IMAGE,
} from "@/app/seoConfig.js";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

export const revalidate = 300;

async function getProject(slug) {
  try {
    const response = await fetch(
      `${API_URL}/projects/${encodeURIComponent(slug)}`,
      { next: { revalidate: 300 } },
    );
    if (!response.ok) return null;
    const payload = await response.json();
    return payload?.data || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) {
    return {
      title: "Case Study Not Found | Kraviona",
      robots: { index: false, follow: false },
    };
  }

  const canonical = canonicalUrl(`/case-studies/${slug}`);
  const title = `${project.title} | Case Study | Kraviona`;
  const description =
    project.description ||
    `Read how Kraviona engineered real-world digital results for ${project.title}.`;

  const ogImage = project.image || DEFAULT_OG_IMAGE;

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "article",
      siteName: SITE_NAME,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: project.imageAlt || project.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: defaultRobots,
  };
}

// Clean and normalize HTML content from TipTap
const renderCaseStudyContent = (html = "") => {
  if (!html || typeof html !== "string") return null;

  return parse(html, {
    replace(node) {
      if (
        node.type === "tag" &&
        node.name === "img" &&
        node.attribs &&
        node.attribs.src
      ) {
        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={node.attribs.src}
            alt={node.attribs.alt || "Case study screenshot"}
            className="my-6 rounded-2xl border border-slate-200/80 shadow-md max-w-full h-auto"
            loading="lazy"
          />
        );
      }
    },
  });
};

export default async function ProjectDetailsPage({ params }) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const projectImage =
    project.image || "/images/office/case-study-product.webp";
  const liveUrl = project.projectUrl || project.liveUrl || null;
  const category = project.category || "Web Application";
  const clientName = project.client || "Client Project";
  const timeline = project.duration || "2026";
  const techList = Array.isArray(project.techStack) ? project.techStack : [];
  const resultsList = Array.isArray(project.results) ? project.results : [];
  const galleryImages = Array.isArray(project.gallery) ? project.gallery : [];

  const canonical = `https://www.kraviona.com/case-studies/${slug}`;

  return (
    <main className="min-h-screen bg-[#F7F5F1] pb-28 pt-8 sm:pt-12">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: "https://www.kraviona.com" },
          { name: "Case Studies", url: "https://www.kraviona.com/case-studies" },
          { name: project.title, url: canonical },
        ])}
      />

      <article className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Back Link & Breadcrumb Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-700 border border-slate-200/80 shadow-2xs hover:bg-[#0f5960] hover:text-white hover:border-[#0f5960] transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Case Studies
          </Link>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <Link href="/" className="hover:text-slate-800">
              Home
            </Link>
            <span>/</span>
            <Link href="/case-studies" className="hover:text-slate-800">
              Case Studies
            </Link>
            <span>/</span>
            <span className="font-semibold text-slate-900 truncate max-w-[200px]">
              {project.title}
            </span>
          </div>
        </div>

        {/* Hero Header Section */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-10 lg:p-12 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#0f5960]/5 via-[#e8622a]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-4xl">
            {/* Category Pill */}
            <div className="flex flex-wrap items-center gap-2.5 mb-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e8622a]/10 px-3.5 py-1 text-xs font-black uppercase tracking-[0.18em] text-[#e8622a]">
                <Sparkles className="w-3 h-3" /> {category}
              </span>

              {liveUrl && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200/60">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live Platform
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.18]">
              {project.title}
            </h1>

            {/* Executive Subtitle / Summary */}
            <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              {project.description}
            </p>

            {/* Quick Specs Grid */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-100 pt-6">
              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Client / Org
                </span>
                <span className="mt-1 block text-sm font-bold text-slate-800 truncate">
                  {clientName}
                </span>
              </div>

              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Timeline
                </span>
                <span className="mt-1 block text-sm font-bold text-slate-800">
                  {timeline}
                </span>
              </div>

              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Industry / Focus
                </span>
                <span className="mt-1 block text-sm font-bold text-slate-800 truncate">
                  {category}
                </span>
              </div>

              <div>
                <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Deployment
                </span>
                {liveUrl ? (
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-sm font-bold text-[#e8622a] hover:underline"
                  >
                    Live Website <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <span className="mt-1 block text-sm font-semibold text-slate-500">
                    Proprietary / Client
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Device Showcase Mockup Frame */}
        <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xl">
          {/* Browser Bar */}
          <div className="flex items-center justify-between border-b border-slate-200/80 bg-slate-100/90 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-400/90" />
              <span className="h-3 w-3 rounded-full bg-amber-400/90" />
              <span className="h-3 w-3 rounded-full bg-emerald-400/90" />
            </div>

            <div className="flex items-center gap-2 rounded-full bg-white px-4 py-1 text-xs font-mono text-slate-500 border border-slate-200/80 shadow-2xs max-w-sm truncate">
              <Globe className="w-3 h-3 text-[#0f5960]" />
              <span className="truncate">
                {liveUrl
                  ? liveUrl.replace(/^https?:\/\//i, "")
                  : `kraviona.com/case-studies/${slug}`}
              </span>
            </div>

            {liveUrl ? (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#0f5960] hover:text-[#e8622a] transition"
              >
                Open in New Tab <ExternalLink className="w-3.5 h-3.5" />
              </a>
            ) : (
              <span className="w-12" />
            )}
          </div>

          {/* High-Resolution Screenshot / Cover */}
          <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-slate-100 overflow-hidden">
            <Image
              src={projectImage}
              alt={project.imageAlt || project.title}
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover object-top"
            />
          </div>
        </div>

        {/* Verified Results Highlight Grid */}
        {resultsList.length > 0 && (
          <div className="mt-10 rounded-2xl border border-emerald-200/70 bg-gradient-to-r from-emerald-50/60 via-teal-50/40 to-white p-6 sm:p-8 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-900">
                Key Deliverables &amp; Verified Results
              </h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {resultsList.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-2.5 rounded-xl bg-white/90 border border-emerald-100 p-3.5 shadow-2xs"
                >
                  <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white">
                    <Check className="h-2.5 w-2.5 stroke-[3]" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-slate-800 leading-snug">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content & Sidebar Grid */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Rich Case Study Story & Deep Dive (8 Cols) */}
          <div className="lg:col-span-8 space-y-10">
            {/* 1. Rich Text Content (from TipTap) */}
            {project.content ? (
              <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-10 shadow-sm">
                <div className="mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
                  <Sparkles className="w-4 h-4 text-[#e8622a]" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Comprehensive Case Study
                  </span>
                </div>

                <div className="prose prose-slate prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tight prose-headings:text-slate-900 prose-p:text-slate-700 prose-p:leading-relaxed prose-a:text-[#e8622a] prose-a:font-bold prose-strong:text-slate-900 prose-img:rounded-2xl prose-img:border prose-img:border-slate-200 prose-img:shadow-md prose-ul:my-6 prose-li:my-1.5 prose-blockquote:border-l-4 prose-blockquote:border-[#e8622a] prose-blockquote:bg-amber-50/50 prose-blockquote:p-4 prose-blockquote:rounded-r-xl prose-blockquote:italic">
                  {renderCaseStudyContent(project.content)}
                </div>
              </div>
            ) : null}

            {/* 2. Structured Overview Section (if exists) */}
            {project.overview && (
              <section className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-10 shadow-sm">
                <div className="flex items-center gap-2.5 mb-4 text-[#0f5960]">
                  <Laptop className="w-5 h-5" />
                  <h2 className="text-xl font-bold text-slate-900">
                    Project Overview
                  </h2>
                </div>
                <p className="whitespace-pre-line text-base text-slate-700 leading-relaxed">
                  {project.overview}
                </p>
              </section>
            )}

            {/* 3. Challenge Section */}
            {project.challenge && (
              <section className="rounded-3xl border-l-4 border-l-[#e8622a] border border-slate-200/80 bg-white p-6 sm:p-10 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-[#e8622a]">
                  The Challenge
                </span>
                <h2 className="mt-1 text-xl sm:text-2xl font-black text-slate-900">
                  Client Obstacles &amp; Technical Requirements
                </h2>
                <p className="mt-4 whitespace-pre-line text-base text-slate-700 leading-relaxed">
                  {project.challenge}
                </p>
              </section>
            )}

            {/* 4. Solution Section */}
            {project.solution && (
              <section className="rounded-3xl border-l-4 border-l-[#0f5960] border border-slate-200/80 bg-white p-6 sm:p-10 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0f5960]">
                  The Engineered Solution
                </span>
                <h2 className="mt-1 text-xl sm:text-2xl font-black text-slate-900">
                  Architecture &amp; Strategic Implementation
                </h2>
                <p className="mt-4 whitespace-pre-line text-base text-slate-700 leading-relaxed">
                  {project.solution}
                </p>
              </section>
            )}

            {/* 5. Additional Screenshots Gallery (if provided) */}
            {galleryImages.length > 0 && (
              <section className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-10 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#0f5960]" /> Project Showcase &amp; Interface Views
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {galleryImages.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-50"
                    >
                      <Image
                        src={img}
                        alt={`${project.title} screenshot ${idx + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column: Sticky Project Specs & Consultation CTA (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="sticky top-28 space-y-6">
              {/* Project Snapshot Card */}
              <div className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
                  Project Snapshot
                </h3>

                <div className="mt-5 space-y-4 text-xs sm:text-sm">
                  {liveUrl && (
                    <a
                      href={liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#e8622a] py-3.5 px-4 font-bold uppercase tracking-wider text-white shadow-md hover:bg-[#b84a1a] transition"
                    >
                      Visit Live Website <ExternalLink className="w-4 h-4" />
                    </a>
                  )}

                  <div className="pt-2">
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Category
                    </span>
                    <span className="mt-1 block font-semibold text-slate-800">
                      {category}
                    </span>
                  </div>

                  <div>
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Client
                    </span>
                    <span className="mt-1 block font-semibold text-slate-800">
                      {clientName}
                    </span>
                  </div>

                  <div>
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Timeline
                    </span>
                    <span className="mt-1 block font-semibold text-slate-800">
                      {timeline}
                    </span>
                  </div>

                  {/* Tech Stack Pills */}
                  {techList.length > 0 && (
                    <div className="pt-3 border-t border-slate-100">
                      <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                        Tech Stack
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {techList.map((tech) => (
                          <span
                            key={tech}
                            className="rounded-lg bg-teal-50 px-2.5 py-1 text-xs font-semibold text-[#0f5960] border border-teal-200/50"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Consultation / Conversion Card */}
              <div className="rounded-3xl border border-[#0f5960]/20 bg-gradient-to-br from-[#0f5960] to-[#0a3539] p-6 sm:p-8 text-white shadow-lg">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#e8622a] bg-white/10 px-2.5 py-0.5 rounded-full">
                  Partner With Us
                </span>
                <h4 className="mt-3 text-lg sm:text-xl font-bold leading-snug">
                  Need a Similar High-Performance Platform?
                </h4>
                <p className="mt-2 text-xs text-slate-200 leading-relaxed">
                  We engineer scalable web platforms, custom directories, high-speed Next.js applications, and technical SEO architectures.
                </p>

                <Link
                  href="/contact"
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 px-4 text-xs font-bold uppercase tracking-wider text-[#0f5960] hover:bg-slate-100 shadow-sm transition"
                >
                  Discuss Your Project <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <div className="mt-4 pt-4 border-t border-white/10 text-center">
                  <span className="text-[11px] text-slate-300">
                    Direct inquiries:{" "}
                    <a
                      href="mailto:kravionatech@gmail.com"
                      className="font-bold text-white hover:underline"
                    >
                      kravionatech@gmail.com
                    </a>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Navigation & CTA Banner */}
        <div className="mt-24 pt-10 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              href="/case-studies"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#0f5960] hover:text-[#e8622a] transition"
            >
              <ArrowLeft className="w-4 h-4" /> View All Client Case Studies
            </Link>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-[#e8622a] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-[#b84a1a] transition"
            >
              Start Your Project With Kraviona <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </article>
    </main>
  );
}
