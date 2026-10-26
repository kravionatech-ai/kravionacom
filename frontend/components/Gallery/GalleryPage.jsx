"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  ArrowRight,
  Sparkles,
  Search,
  Layers,
  CheckCircle2,
  Globe,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 80, damping: 18 },
  },
};

const GalleryPage = ({ initialProjects = [] }) => {
  const projects = Array.isArray(initialProjects) ? initialProjects : [];
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set();
    projects.forEach((p) => {
      const cat = p.category || p.type;
      if (cat && typeof cat === "string") set.add(cat.trim());
    });
    return ["All", ...Array.from(set)];
  }, [projects]);

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const cat = project.category || project.type || "";
      const matchesCat =
        selectedCategory === "All" ||
        cat.toLowerCase() === selectedCategory.toLowerCase();

      const query = searchQuery.toLowerCase().trim();
      if (!query) return matchesCat;

      const title = (project.title || project.name || "").toLowerCase();
      const desc = (project.description || "").toLowerCase();
      const tech = Array.isArray(project.techStack)
        ? project.techStack.join(" ").toLowerCase()
        : "";

      const matchesSearch =
        title.includes(query) ||
        desc.includes(query) ||
        tech.includes(query) ||
        cat.toLowerCase().includes(query);

      return matchesCat && matchesSearch;
    });
  }, [projects, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#F7F5F1] pb-28">
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden border-b border-gray-200/80 bg-white py-20 px-4 text-center sm:py-24">
        {/* Soft Background Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-b from-[#0f5960]/10 via-[#e8622a]/5 to-transparent rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e8622a]/10 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#e8622a] mb-5">
            <Sparkles className="w-3.5 h-3.5" /> Curated Engineering Portfolio
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.15]">
            Portfolio &amp; <span className="text-[#e8622a]">Client Projects</span>
          </h1>
          <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto font-normal">
            Explore our curated showcase of mission-critical web applications, high-performance community platforms, custom software, and technical SEO success stories.
          </p>

          {/* Search & Filter Bar */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-2xl mx-auto">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects or tech..."
                className="w-full rounded-full border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-[#0f5960] focus:ring-4 focus:ring-[#0f5960]/10 shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 w-full sm:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                    selectedCategory === cat
                      ? "bg-[#0f5960] text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Projects Grid Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-20 px-6 bg-white rounded-3xl border border-gray-200 shadow-sm max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-[#0f5960]/10 text-[#0f5960] flex items-center justify-center mx-auto mb-5">
              <Layers className="w-8 h-8 opacity-80" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">
              No matching projects found
            </h3>
            <p className="text-slate-500 mb-6 text-sm leading-relaxed">
              {searchQuery
                ? `No projects match "${searchQuery}". Try clearing your search or choosing another category.`
                : "We are curating more client case studies to showcase here. Get in touch to discuss your custom project."}
            </p>
            {searchQuery ? (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="inline-block px-6 py-3 bg-[#0f5960] text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#0a454b] transition"
              >
                Reset Filters
              </button>
            ) : (
              <Link
                href="/contact"
                className="inline-block px-7 py-3.5 bg-[#e8622a] text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#b84a1a] transition shadow-md"
              >
                Start a Project
              </Link>
            )}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project) => {
                const imageUrl =
                  project.image ||
                  project.thumbnail ||
                  project.coverImage ||
                  "/images/office/case-study-product.webp";

                const projectTitle =
                  project.title || project.name || "Kraviona Project";
                const projectCategory =
                  project.category || project.type || "Web Application";
                const projectSlug =
                  project.slug ||
                  projectTitle
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/(^-|-$)+/g, "");

                const liveLink = project.projectUrl || project.liveUrl || null;
                const detailHref = `/case-studies/${projectSlug}`;

                const projectAlt =
                  project.imageAlt ||
                  project.alt ||
                  `${projectTitle} — ${projectCategory} case study by Kraviona`;

                return (
                  <motion.div
                    key={project._id || projectSlug}
                    variants={cardVariants}
                    layout
                    className="group flex flex-col overflow-hidden rounded-2xl bg-white border border-slate-200/90 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5"
                  >
                    {/* Top Device / Browser Header */}
                    <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-2.5 text-xs text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
                        <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
                      </div>
                      <span className="font-mono text-[11px] text-slate-400 truncate max-w-[180px]">
                        {liveLink
                          ? liveLink.replace(/^https?:\/\//i, "").replace(/\/$/, "")
                          : `kraviona.com/case-studies/${projectSlug}`}
                      </span>
                      <span className="h-2.5 w-2.5" />
                    </div>

                    {/* Image / Thumbnail Container with Click Action */}
                    <Link
                      href={detailHref}
                      className="relative block aspect-[16/10] w-full overflow-hidden bg-slate-100"
                    >
                      <Image
                        src={imageUrl}
                        alt={projectAlt}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      />

                      {/* Hover Overlay with Action Buttons */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-5">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#e8622a] px-3 py-1.5 text-xs font-bold text-white shadow-md">
                            Read Case Study <ArrowRight className="w-3.5 h-3.5" />
                          </span>

                          {liveLink && (
                            <a
                              href={liveLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-white/90 backdrop-blur-xs px-3 py-1.5 text-xs font-bold text-slate-900 hover:bg-white shadow-md transition"
                            >
                              Live Site <ExternalLink className="w-3 h-3 text-[#0f5960]" />
                            </a>
                          )}
                        </div>
                      </div>
                    </Link>

                    {/* Card Content & Details */}
                    <div className="flex flex-1 flex-col p-6">
                      {/* Category Badge & Status */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#e8622a] bg-[#e8622a]/10 px-2.5 py-0.5 rounded-full">
                          {projectCategory}
                        </span>

                        {liveLink && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Live Platform
                          </span>
                        )}
                      </div>

                      {/* Project Title */}
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#0f5960] transition-colors leading-snug">
                        <Link href={detailHref} className="hover:underline">
                          {projectTitle}
                        </Link>
                      </h3>

                      {/* Short Description */}
                      <p className="mt-2.5 text-xs text-slate-600 line-clamp-3 leading-relaxed flex-1">
                        {project.description ||
                          project.overview ||
                          "A comprehensive digital engineering project by Kraviona Tech Solutions."}
                      </p>

                      {/* Tech Stack Tags */}
                      {Array.isArray(project.techStack) && project.techStack.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1.5 pt-3 border-t border-slate-100">
                          {project.techStack.slice(0, 3).map((tech) => (
                            <span
                              key={tech}
                              className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.techStack.length > 3 && (
                            <span className="text-[10px] text-slate-400 font-bold self-center">
                              +{project.techStack.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Footer Actions */}
                      <div className="mt-5 flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                        <Link
                          href={detailHref}
                          className="inline-flex items-center gap-1.5 font-bold text-[#0f5960] hover:text-[#e8622a] transition-colors"
                        >
                          View Full Details <ArrowRight className="w-3.5 h-3.5" />
                        </Link>

                        {liveLink && (
                          <a
                            href={liveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 transition-colors"
                            title="Visit live site in new tab"
                          >
                            <Globe className="w-3.5 h-3.5" />
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Bottom CTA Banner */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-24">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0f5960] via-[#0d454b] to-[#0a3539] p-8 sm:p-12 text-white shadow-xl">
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-[#e8622a] bg-white/10 px-3 py-1 rounded-full">
              Let&apos;s Build Together
            </span>
            <h2 className="mt-4 text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Have a Similar Project in Mind?
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
              Whether you need a community directory, high-scale web app, SaaS platform, or technical SEO overhaul — our engineering team delivers production-ready digital products.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-[#e8622a] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-[#b84a1a] transition"
              >
                Schedule Technical Consultation <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/20 transition backdrop-blur-xs"
              >
                Explore Services
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;
