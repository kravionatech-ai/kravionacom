"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  CheckCircle2,
  Facebook,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Sparkles,
  Twitter,
} from "lucide-react";
import { SOCIAL_LINKS } from "@/lib/social";

// 5 Core Business Verticals (Mandatory exact hierarchy)
const BUSINESS_VERTICALS = [
  { num: "01", label: "IT & Technology", slug: "web-development" },
  { num: "02", label: "AI & Automation", slug: "performance-ai", isPrimary: true },
  { num: "03", label: "SaaS & Software", slug: "backend-architecture" },
  { num: "04", label: "E-commerce Solutions", slug: "marketplace-seller" },
  { num: "05", label: "Digital Marketing", slug: "branding-marketing" },
];

const IT_SERVICES = [
  { name: "Custom Web Applications", path: "/services/web-app-development" },
  { name: "Next.js AI-Native Apps", path: "/services/nextjs-development" },
  { name: "MERN Stack Development", path: "/services/mern-stack-development" },
  { name: "Full-Stack Engineering", path: "/services/full-stack-development" },
  { name: "React.js Web Development", path: "/services/react-development" },
  { name: "Node.js Backend Systems", path: "/services/nodejs-development" },
  { name: "UI/UX Design Systems", path: "/services/ui-ux-design" },
];

const AI_SERVICES = [
  { name: "Autonomous AI Agents", path: "/services/ai-automation", isTag: "Moat" },
  { name: "AI Chatbots & RAG Systems", path: "/services/ai-chatbot-development" },
  { name: "AI Workflow Automation", path: "/services/ai-automation" },
  { name: "Core Web Vitals & Speed", path: "/services/web-performance-optimization" },
  { name: "Enterprise AI Solutions", path: "/solutions" },
];

const SAAS_ECOMMERCE = [
  { name: "SaaS MVP Development", path: "/services/saas-development" },
  { name: "Cloud Backend Architecture", path: "/services/backend-development" },
  { name: "Custom API & AI Gateways", path: "/services/api-development" },
  { name: "Database & Vector Stores", path: "/services/database-architecture" },
  { name: "AI E-Commerce Stores", path: "/services/ecommerce-development-marketing" },
  { name: "Marketplace Operations", path: "/services/account-management" },
  { name: "Cataloging & Flat Files", path: "/services/cataloging" },
  { name: "Payout Reconciliation", path: "/services/accounting" },
];

const GROWTH_COMPANY = [
  { name: "Technical SEO, AEO & GEO", path: "/services/technical-seo", isTag: "AEO" },
  { name: "Digital Marketing & Growth", path: "/services/digital-marketing" },
  { name: "About Kraviona", path: "/about" },
  { name: "Leadership & Engineers", path: "/team" },
  { name: "Case Studies & Results", path: "/case-studies" },
  { name: "Transparent Pricing", path: "/pricing" },
  { name: "Engineering Insights", path: "/blog" },
  { name: "Careers at Kraviona", path: "/careers" },
  { name: "Contact & Discovery", path: "/contact" },
];

const LEGAL_LINKS = [
  { name: "Privacy Policy", path: "/privacy-policy" },
  { name: "Terms of Service", path: "/terms" },
  { name: "Sitemap", path: "/sitemap.xml" },
  { name: "AI Index (llms.txt)", path: "/llms.txt" },
  { name: "Robots Directives", path: "/robots.txt" },
];

const SOCIALS = [
  {
    name: "LinkedIn",
    href: SOCIAL_LINKS.linkedin,
    icon: Linkedin,
  },
  {
    name: "Twitter",
    href: SOCIAL_LINKS.twitter || "https://x.com/KravionaTech",
    icon: Twitter,
  },
  {
    name: "Facebook",
    href: SOCIAL_LINKS.facebook,
    icon: Facebook,
  },
  {
    name: "WhatsApp",
    href: SOCIAL_LINKS.whatsappCTA || SOCIAL_LINKS.whatsapp,
    icon: MessageCircle,
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#1A3840] font-sans text-white">
      {/* Background ambient pattern */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] opacity-[0.035] [background-size:24px_24px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-6 pt-14 lg:px-8">
        {/* Top CTA Banner */}
        <div className="relative mb-12 overflow-hidden rounded-[16px] border border-white/15 bg-gradient-to-r from-white/[0.07] via-white/[0.03] to-white/[0.06] p-6 sm:p-8 lg:p-10 shadow-xl backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-3xl">
              <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-full border border-[#D4A550]/40 bg-[#D4A550]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#D4A550]">
                <Sparkles className="h-3 w-3" />
                <span>AI-First Technology &amp; Digital Solutions</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
                Building Intelligent Businesses Through AI, Technology &amp; Automation
              </h2>
              <p className="mt-3 text-sm sm:text-base leading-relaxed text-white/75">
                Kraviona engineers custom software, autonomous AI agents, SaaS products, and automated digital workflows designed for verifiable business impact.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 lg:flex-nowrap">
              <Link
                href="/contact"
                className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-[8px] bg-[#C85A3C] px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#B04D31] hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                <span>Start Your AI Project</span>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-[8px] border border-white/20 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-white/90 transition-all hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
              >
                <span>View Plans &amp; Pricing</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Business Verticals Navigation Ribbon */}
        <div className="mb-12 border-y border-white/10 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#D4A550]">
              5 Core Business Verticals
            </span>
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              {BUSINESS_VERTICALS.map((hub) => (
                <Link
                  key={hub.slug}
                  href={`/services/${hub.slug}`}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium transition-all ${
                    hub.isPrimary
                      ? "border-[#D4A550]/60 bg-[#D4A550]/15 text-[#D4A550] hover:bg-[#D4A550]/25"
                      : "border-white/10 bg-white/[0.03] text-white/80 hover:border-[#D4A550]/40 hover:text-white"
                  }`}
                >
                  <span className="text-[10px] font-bold opacity-75">{hub.num}</span>
                  <span>{hub.label}</span>
                  <ArrowUpRight className="h-3 w-3 opacity-60" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          {/* Brand & Direct Contact (Col 1: 4 columns on desktop) */}
          <div className="sm:col-span-2 lg:col-span-4 pr-0 lg:pr-6">
            {/* Kraviona Logo */}
            <div className="mb-4">
              <Link
                href="/"
                aria-label="Kraviona – Vision Innovative Development"
                className="group inline-flex items-center rounded-2xl border border-white/20 bg-white px-4 py-2.5 shadow-md transition-all duration-200 hover:bg-white/95 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00CBA9]"
              >
                <Image
                  src="/full-logo.webp"
                  alt="Kraviona – Vision Innovative Development"
                  width={190}
                  height={65}
                  priority
                  sizes="(max-width: 640px) 160px, 190px"
                  className="h-9 sm:h-10 md:h-11 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
                />
              </Link>
            </div>

            {/* Brand Tagline */}
            <div className="mb-3.5 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00CBA9]"></span>
              <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#00CBA9]">
                Vision Innovative Development
              </span>
            </div>

            {/* Company Description */}
            <p className="text-sm leading-relaxed text-white/80 max-w-sm">
              AI-First Technology &amp; Digital Solutions company engineering intelligent software, autonomous AI workflows, SaaS platforms, and search-ready digital foundations.
            </p>

            {/* Direct Contact List */}
            <div className="mt-6 space-y-2.5">
              <a
                href={`mailto:${SOCIAL_LINKS.email}`}
                className="group flex items-center gap-3 text-sm text-white/80 transition-colors hover:text-[#00CBA9]"
              >
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[6px] border border-white/10 bg-white/[0.04] text-[#00CBA9] transition-colors group-hover:border-[#00CBA9]/40 group-hover:bg-[#00CBA9]/10">
                  <Mail className="h-3.5 w-3.5" />
                </span>
                <span className="font-medium">{SOCIAL_LINKS.email}</span>
              </a>

              <a
                href={`tel:${SOCIAL_LINKS.phone}`}
                className="group flex items-center gap-3 text-sm text-white/80 transition-colors hover:text-[#00CBA9]"
              >
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[6px] border border-white/10 bg-white/[0.04] text-[#00CBA9] transition-colors group-hover:border-[#00CBA9]/40 group-hover:bg-[#00CBA9]/10">
                  <Phone className="h-3.5 w-3.5" />
                </span>
                <span className="font-medium">+91 96085 53167</span>
              </a>

              <div className="flex items-center gap-3 text-sm text-white/70">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[6px] border border-white/10 bg-white/[0.04] text-[#00CBA9]">
                  <MapPin className="h-3.5 w-3.5" />
                </span>
                <span>East Delhi, Delhi 110092, India</span>
              </div>
            </div>

            {/* Live Availability Badge */}
            <div className="mt-5 inline-flex items-center gap-2 rounded-[8px] border border-white/10 bg-white/[0.03] px-3 py-2 text-[12px] text-white/70">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              <span>Mon – Sat, 9 AM – 7 PM IST • Discovery Calls Open</span>
            </div>

            {/* Social Icons Strip */}
            <div className="mt-6 flex items-center gap-2">
              {SOCIALS.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={social.name}
                    className="flex h-9 w-9 items-center justify-center rounded-[6px] border border-white/10 bg-white/[0.04] text-white/70 transition-all hover:border-[#2D6E7A] hover:bg-[#2D6E7A] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Col 2: IT & Technology Services (lg:col-span-2) */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <span className="text-[10px] font-bold text-[#D4A550]">01</span>
              <p className="text-sm font-semibold tracking-wide text-white">
                IT &amp; Technology
              </p>
            </div>
            <ul className="space-y-2">
              {IT_SERVICES.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className="group inline-flex items-center gap-1.5 py-0.5 text-[13px] text-white/75 transition-colors hover:text-[#D4A550] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
                  >
                    <span>{item.name}</span>
                    <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100 text-[#D4A550]" />
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/services/web-development"
              className="mt-4 inline-flex items-center gap-1 text-[12px] font-semibold text-[#D4A550] hover:underline"
            >
              <span>Explore All IT Services</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Col 3: AI & Automation Solutions (lg:col-span-2) */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <span className="text-[10px] font-bold text-[#D4A550]">02</span>
              <p className="text-sm font-semibold tracking-wide text-white">
                AI &amp; Automation
              </p>
              <span className="rounded-full bg-[#D4A550]/20 px-1.5 py-0.2 text-[9px] font-bold text-[#D4A550]">
                CORE
              </span>
            </div>
            <ul className="space-y-2">
              {AI_SERVICES.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    className="group inline-flex items-center gap-1.5 py-0.5 text-[13px] text-white/75 transition-colors hover:text-[#D4A550] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
                  >
                    <span>{item.name}</span>
                    {item.isTag && (
                      <span className="rounded-[4px] bg-[#C85A3C]/20 px-1 py-0.2 text-[9px] font-semibold text-[#C85A3C]">
                        {item.isTag}
                      </span>
                    )}
                    <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100 text-[#D4A550]" />
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/services/performance-ai"
              className="mt-4 inline-flex items-center gap-1 text-[12px] font-semibold text-[#D4A550] hover:underline"
            >
              <span>Explore AI Solutions Hub</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Col 4: SaaS & E-commerce (lg:col-span-2) */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <span className="text-[10px] font-bold text-[#D4A550]">03/04</span>
              <p className="text-sm font-semibold tracking-wide text-white">
                SaaS &amp; E-commerce
              </p>
            </div>
            <ul className="space-y-2">
              {SAAS_ECOMMERCE.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    className="group inline-flex items-center gap-1.5 py-0.5 text-[13px] text-white/75 transition-colors hover:text-[#D4A550] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
                  >
                    <span>{item.name}</span>
                    <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100 text-[#D4A550]" />
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/services/backend-architecture"
              className="mt-4 inline-flex items-center gap-1 text-[12px] font-semibold text-[#D4A550] hover:underline"
            >
              <span>SaaS Architecture Hub</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Col 5: Growth & Company (lg:col-span-2) */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <span className="text-[10px] font-bold text-[#D4A550]">05</span>
              <p className="text-sm font-semibold tracking-wide text-white">
                Growth &amp; Company
              </p>
            </div>
            <ul className="space-y-2">
              {GROWTH_COMPANY.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    className="group inline-flex items-center gap-1.5 py-0.5 text-[13px] text-white/75 transition-colors hover:text-[#D4A550] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
                  >
                    <span>{item.name}</span>
                    {item.isTag && (
                      <span className="rounded-[4px] bg-[#2D6E7A]/40 px-1 py-0.2 text-[9px] font-semibold text-white/90">
                        {item.isTag}
                      </span>
                    )}
                    <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100 text-[#D4A550]" />
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/services/branding-marketing"
              className="mt-4 inline-flex items-center gap-1 text-[12px] font-semibold text-[#D4A550] hover:underline"
            >
              <span>Digital Growth Hub</span>
              <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Bottom Bar — Unified, Clean, Zero Duplication with clearance for floating controls */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-6 pb-24 sm:pb-20 lg:pb-10">
          <div className="text-center md:text-left">
            <p className="text-[12px] text-white/60">
              © {new Date().getFullYear()} Kraviona Tech Solutions. All rights reserved.
            </p>
            <p className="mt-0.5 text-[11px] text-[#D4A550]/80 italic">
              &quot;Intelligence Meets Innovation.&quot;
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[12px]">
            {LEGAL_LINKS.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className="text-white/60 transition-colors hover:text-[#D4A550] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-400/90">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Systems Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
