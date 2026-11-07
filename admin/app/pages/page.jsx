"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Code,
  Edit3,
  ExternalLink,
  Eye,
  FileText,
  Globe,
  Globe2,
  History,
  Layers,
  Layers3,
  Loader2,
  Plus,
  RefreshCw,
  Save,
  Search,
  SearchCheck,
  Send,
  ShieldAlert,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import Frame from "@/components/Frame/Frame";
import { apiRequest } from "@/components/api";
import Swal from "sweetalert2";
import { ContentLoader, EmptyState } from "@/components/AsyncState";

const PAGE_TYPES = ["standard", "home", "about", "contact", "legal", "custom"];
const SECTION_TYPES = ["richText", "hero", "features", "stats", "story", "values", "faqs", "cta", "testimonials"];

const freshPage = () => ({
  title: "",
  slug: "",
  pageType: "standard",
  status: "published",
  hero: {
    badge: "",
    eyebrow: "",
    title: "",
    highlight: "",
    description: "",
    ctaLabel: "",
    ctaHref: "",
    secondaryCtaLabel: "",
    secondaryCtaHref: "",
    bannerImage: "",
  },
  sections: [
    {
      sectionId: "section-1",
      sectionType: "richText",
      title: "",
      subtitle: "",
      content: "",
      items: [],
      order: 0,
      isVisible: true,
    },
  ],
  seo: {
    metaTitle: "",
    metaDescription: "",
    primaryKeyword: "",
    secondaryKeywords: [],
    searchIntent: "Commercial / Informational",
    h1: "",
    canonicalUrl: "",
    robotsMeta: "index, follow",
    noIndex: false,
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    twitterCard: "summary_large_image",
    twitterTitle: "",
    twitterDescription: "",
    schemaType: "WebPage",
    customSchema: "",
    faqSchema: [],
    breadcrumbSchema: [],
    internalLinks: [],
  },
  revisions: [],
});

const asArray = (val) => (Array.isArray(val) ? val : []);

function Field({ label, hint, children, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 flex items-center justify-between gap-3 text-xs font-black uppercase tracking-[0.09em] text-slate-500">
        <span>{label}</span>
        {hint && <span className="normal-case font-medium tracking-normal text-slate-400">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#0f5960] focus:ring-2 focus:ring-[#0f5960]/10";
const Input = (props) => <input {...props} className={`${inputClass} ${props.className || ""}`} />;
const Textarea = (props) => <textarea {...props} className={`${inputClass} resize-y ${props.className || ""}`} />;

export default function WebsitePagesCMS() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editing, setEditing] = useState(null);
  const [activeTab, setActiveTab] = useState("content");
  const [saving, setSaving] = useState(false);
  const [seeding, setSeeding] = useState(false);

  // Load pages from backend
  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (typeFilter !== "all") params.set("pageType", typeFilter);
      if (statusFilter !== "all") params.set("status", statusFilter);

      const res = await apiRequest(`/admin/pages${params.size ? `?${params.toString()}` : ""}`);
      setPages(res.data || []);
    } catch (err) {
      setError(err.message || "Failed to load pages");
    } finally {
      setLoading(false);
    }
  }, [search, typeFilter, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(load, 150);
    return () => clearTimeout(timer);
  }, [load]);

  const stats = useMemo(() => {
    return {
      total: pages.length,
      published: pages.filter((p) => p.status === "published").length,
      drafts: pages.filter((p) => p.status === "draft").length,
      noIndex: pages.filter((p) => p.seo?.noIndex).length,
    };
  }, [pages]);

  // Seed core pages
  const handleSeed = async () => {
    const confirmation = await Swal.fire({
      icon: "question",
      title: "Seed Standard Core Pages?",
      text: "This will import/sync Home, About, Contact, Privacy, and Terms with full content and SEO settings.",
      showCancelButton: true,
      confirmButtonText: "Seed Pages",
      confirmButtonColor: "#0f5960",
    });

    if (!confirmation.isConfirmed) return;

    try {
      setSeeding(true);
      const res = await apiRequest("/admin/pages/seed", { method: "POST" });
      await load();
      await Swal.fire({
        icon: "success",
        title: "Pages Synced Live",
        text: res.message || "All core pages are now stored in MongoDB and live in cache.",
        timer: 2500,
        showConfirmButton: false,
      });
    } catch (err) {
      await Swal.fire({
        icon: "error",
        title: "Seed Failed",
        text: err.message || "Unable to seed pages.",
      });
    } finally {
      setSeeding(false);
    }
  };

  // Save / Update page
  const save = async (data, submitStatus) => {
    if (!data.title) {
      await Swal.fire({ icon: "warning", title: "Missing title", text: "Please enter a page title." });
      return;
    }

    const payload = {
      ...data,
      status: submitStatus || data.status || "published",
    };

    try {
      setSaving(true);
      const endpoint = editing?._id ? `/admin/pages/${editing._id}` : "/admin/pages";
      const method = editing?._id ? "PATCH" : "POST";
      const res = await apiRequest(endpoint, { method, body: JSON.stringify(payload) });

      setEditing(null);
      await load();

      const actionText = payload.status === "published" ? "published and synced live" : "saved as draft";
      await Swal.fire({
        icon: "success",
        title: `Page ${actionText}!`,
        text: res.message || `Next.js cache was purged and the live URL is updated instantly.`,
        timer: 2200,
        showConfirmButton: false,
      });
    } catch (err) {
      await Swal.fire({
        icon: "error",
        title: "Save Failed",
        text: err.message || "Unable to save page.",
      });
    } finally {
      setSaving(false);
    }
  };

  // Delete page
  const remove = async (page) => {
    const confirmation = await Swal.fire({
      icon: "warning",
      title: `Delete '${page.title}'?`,
      text: "This page and all of its content will be permanently removed. The URL will return 404.",
      showCancelButton: true,
      confirmButtonText: "Delete Page",
      confirmButtonColor: "#dc2626",
    });

    if (!confirmation.isConfirmed) return;

    try {
      await apiRequest(`/admin/pages/${page._id}`, { method: "DELETE" });
      await load();
      await Swal.fire({ icon: "success", title: "Page deleted", timer: 1500, showConfirmButton: false });
    } catch (err) {
      await Swal.fire({ icon: "error", title: "Delete Failed", text: err.message });
    }
  };

  return (
    <Frame>
      <div className="space-y-6">
        {/* Header Banner */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-[#0f5960]/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-[#0f5960]">
                  Dynamic CMS & SEO
                </span>
                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Live Cache Sync Active
                </span>
              </div>
              <h1 className="mt-1 text-2xl font-bold text-slate-900">Website Pages Management</h1>
              <p className="mt-0.5 text-sm text-slate-500">
                Manage content, structured sections, and full SEO metadata for Home, About, Contact, and corporate pages.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleSeed}
                disabled={seeding}
                className="flex items-center gap-2 rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
              >
                {seeding ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                Seed Core Pages
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(freshPage());
                  setActiveTab("content");
                }}
                className="flex items-center gap-2 rounded-xl bg-[#0f5960] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#0c484e]"
              >
                <Plus size={16} />
                Create New Page
              </button>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3.5">
              <div className="text-xs font-semibold uppercase text-slate-500">Total Pages</div>
              <div className="mt-1 text-xl font-bold text-slate-900">{stats.total}</div>
            </div>
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3.5">
              <div className="text-xs font-semibold uppercase text-emerald-700">Live / Published</div>
              <div className="mt-1 text-xl font-bold text-emerald-800">{stats.published}</div>
            </div>
            <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-3.5">
              <div className="text-xs font-semibold uppercase text-amber-700">Drafts</div>
              <div className="mt-1 text-xl font-bold text-amber-800">{stats.drafts}</div>
            </div>
            <div className="rounded-xl border border-purple-100 bg-purple-50/50 p-3.5">
              <div className="text-xs font-semibold uppercase text-purple-700">NoIndex Pages</div>
              <div className="mt-1 text-xl font-bold text-purple-800">{stats.noIndex}</div>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
            <input
              type="text"
              placeholder="Search by title, slug, or focus keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 py-2 text-sm outline-none transition focus:border-[#0f5960] focus:bg-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:border-[#0f5960]"
            >
              <option value="all">All Page Types</option>
              {PAGE_TYPES.map((t) => (
                <option key={t} value={t} className="capitalize">
                  {t}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 outline-none focus:border-[#0f5960]"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {/* Pages Table */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <Loader2 className="mx-auto animate-spin text-[#0f5960]" size={32} />
              <p className="mt-2 text-sm text-slate-500">Loading website pages...</p>
            </div>
          ) : pages.length === 0 ? (
            <div className="p-12 text-center">
              <Globe2 className="mx-auto text-slate-300" size={48} />
              <h3 className="mt-3 text-base font-bold text-slate-800">No pages found</h3>
              <p className="mt-1 text-sm text-slate-500">Click &ldquo;Seed Core Pages&rdquo; to populate Home, About, Contact, etc.</p>
              <button
                type="button"
                onClick={handleSeed}
                className="mt-4 rounded-xl bg-[#0f5960] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0c484e]"
              >
                Seed Standard Pages
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase font-bold text-slate-500">
                  <tr>
                    <th className="px-5 py-3.5">Page Title & Slug</th>
                    <th className="px-5 py-3.5">Page Type</th>
                    <th className="px-5 py-3.5">Primary Focus Keyword</th>
                    <th className="px-5 py-3.5">SEO Health</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pages.map((p) => {
                    const targetUrl = p.slug === "home" ? "https://www.kraviona.com" : `https://www.kraviona.com/${p.slug}`;
                    const hasTitle = Boolean(p.seo?.metaTitle || p.title);
                    const hasDesc = Boolean(p.seo?.metaDescription);
                    const hasKeyword = Boolean(p.seo?.primaryKeyword);
                    const seoScore = [hasTitle, hasDesc, hasKeyword].filter(Boolean).length;

                    return (
                      <tr key={p._id || p.slug} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-5 py-4">
                          <div className="font-bold text-slate-900">{p.title}</div>
                          <div className="flex items-center gap-1.5 font-mono text-xs text-slate-400 mt-0.5">
                            <span>/{p.slug}</span>
                            <a
                              href={targetUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-slate-400 hover:text-[#0f5960]"
                              title="Open live URL"
                            >
                              <ExternalLink size={12} />
                            </a>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs font-semibold capitalize text-slate-700">
                            {p.pageType}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          {p.seo?.primaryKeyword ? (
                            <span className="font-semibold text-slate-800">{p.seo.primaryKeyword}</span>
                          ) : (
                            <span className="text-xs text-amber-600 font-medium flex items-center gap-1">
                              <AlertTriangle size={13} /> Missing focus keyword
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`h-2.5 w-2.5 rounded-full ${
                                seoScore === 3 ? "bg-emerald-500" : seoScore === 2 ? "bg-amber-500" : "bg-rose-500"
                              }`}
                            ></span>
                            <span className="text-xs font-semibold text-slate-600">
                              {seoScore === 3 ? "Complete" : seoScore === 2 ? "Needs Description" : "Incomplete"}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                              p.status === "published"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                p.status === "published" ? "bg-emerald-500" : "bg-amber-500"
                              }`}
                            ></span>
                            {p.status === "published" ? "Published" : "Draft"}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setEditing({ ...freshPage(), ...p });
                                setActiveTab("content");
                              }}
                              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                              title="Edit Page"
                            >
                              <Edit3 size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => remove(p)}
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                              title="Delete Page"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Page Editor Modal */}
        {editing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
            <div className="flex h-[90vh] w-full max-w-5xl flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {editing._id ? `Edit: ${editing.title}` : "Create New Page"}
                  </h2>
                  <p className="text-xs text-slate-500 font-mono">
                    URL: https://www.kraviona.com{editing.slug === "home" ? "" : `/${editing.slug || "new-page"}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditing(null)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Tabs Navigation */}
              <div className="flex border-b border-slate-200 bg-white px-6">
                <button
                  type="button"
                  onClick={() => setActiveTab("content")}
                  className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition-colors ${
                    activeTab === "content"
                      ? "border-[#0f5960] text-[#0f5960]"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <FileText size={16} />
                  General & Hero
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("sections")}
                  className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition-colors ${
                    activeTab === "sections"
                      ? "border-[#0f5960] text-[#0f5960]"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Layers size={16} />
                  Structured Sections ({editing.sections?.length || 0})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("seo")}
                  className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition-colors ${
                    activeTab === "seo"
                      ? "border-[#0f5960] text-[#0f5960]"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <SearchCheck size={16} />
                  Complete SEO Management
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("revisions")}
                  className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition-colors ${
                    activeTab === "revisions"
                      ? "border-[#0f5960] text-[#0f5960]"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <History size={16} />
                  Revisions & Sync Log
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* TAB 1: General & Hero */}
                {activeTab === "content" && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <Field label="Page Title" className="sm:col-span-2">
                        <Input
                          value={editing.title}
                          onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                          placeholder="e.g. About Kraviona | AI-First Technology & Software Company"
                        />
                      </Field>
                      <Field label="Slug (URL Path)">
                        <Input
                          value={editing.slug}
                          onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                          placeholder="e.g. about or home"
                        />
                      </Field>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Field label="Page Type">
                        <select
                          value={editing.pageType}
                          onChange={(e) => setEditing({ ...editing, pageType: e.target.value })}
                          className={inputClass}
                        >
                          {PAGE_TYPES.map((t) => (
                            <option key={t} value={t} className="capitalize">
                              {t}
                            </option>
                          ))}
                        </select>
                      </Field>
                      <Field label="Publish Status">
                        <select
                          value={editing.status}
                          onChange={(e) => setEditing({ ...editing, status: e.target.value })}
                          className={inputClass}
                        >
                          <option value="published">Published (Visible to public & live in cache)</option>
                          <option value="draft">Draft (Hidden from public users)</option>
                        </select>
                      </Field>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-4">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">Hero Section Content</h3>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Field label="Hero Eyebrow / Category Badge">
                          <Input
                            value={editing.hero?.eyebrow || ""}
                            onChange={(e) =>
                              setEditing({ ...editing, hero: { ...editing.hero, eyebrow: e.target.value } })
                            }
                            placeholder="e.g. Enterprise AI Engineering"
                          />
                        </Field>
                        <Field label="Highlight Phrase">
                          <Input
                            value={editing.hero?.highlight || ""}
                            onChange={(e) =>
                              setEditing({ ...editing, hero: { ...editing.hero, highlight: e.target.value } })
                            }
                            placeholder="e.g. That Drive Real Growth"
                          />
                        </Field>
                      </div>

                      <Field label="Hero Main Title">
                        <Input
                          value={editing.hero?.title || ""}
                          onChange={(e) =>
                            setEditing({ ...editing, hero: { ...editing.hero, title: e.target.value } })
                          }
                          placeholder="e.g. We Build AI Agents & Scalable SaaS Platforms"
                        />
                      </Field>

                      <Field label="Hero Description">
                        <Textarea
                          rows={3}
                          value={editing.hero?.description || ""}
                          onChange={(e) =>
                            setEditing({ ...editing, hero: { ...editing.hero, description: e.target.value } })
                          }
                          placeholder="Detailed value proposition..."
                        />
                      </Field>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Field label="Primary CTA Label">
                          <Input
                            value={editing.hero?.ctaLabel || ""}
                            onChange={(e) =>
                              setEditing({ ...editing, hero: { ...editing.hero, ctaLabel: e.target.value } })
                            }
                            placeholder="e.g. Discuss Your Project"
                          />
                        </Field>
                        <Field label="Primary CTA Link">
                          <Input
                            value={editing.hero?.ctaHref || ""}
                            onChange={(e) =>
                              setEditing({ ...editing, hero: { ...editing.hero, ctaHref: e.target.value } })
                            }
                            placeholder="e.g. /contact"
                          />
                        </Field>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: Structured Sections */}
                {activeTab === "sections" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-slate-500">
                        Add structured blocks (features, statistics, narrative story, core values, FAQs) to this page.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          const newSections = [
                            ...(editing.sections || []),
                            {
                              sectionId: `section-${(editing.sections?.length || 0) + 1}`,
                              sectionType: "features",
                              title: "New Section",
                              subtitle: "",
                              content: "",
                              items: [],
                              order: editing.sections?.length || 0,
                              isVisible: true,
                            },
                          ];
                          setEditing({ ...editing, sections: newSections });
                        }}
                        className="flex items-center gap-1.5 rounded-lg border border-[#0f5960] px-3 py-1.5 text-xs font-bold text-[#0f5960] hover:bg-[#0f5960]/5"
                      >
                        <Plus size={14} /> Add Section Block
                      </button>
                    </div>

                    {(editing.sections || []).map((sec, sIdx) => (
                      <div key={sec.sectionId || sIdx} className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="rounded bg-slate-200 px-2 py-0.5 text-xs font-mono font-bold text-slate-700">
                              #{sIdx + 1}
                            </span>
                            <span className="text-sm font-bold text-slate-800">{sec.title || "Untitled Block"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <select
                              value={sec.sectionType}
                              onChange={(e) => {
                                const next = [...editing.sections];
                                next[sIdx].sectionType = e.target.value;
                                setEditing({ ...editing, sections: next });
                              }}
                              className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 outline-none"
                            >
                              {SECTION_TYPES.map((st) => (
                                <option key={st} value={st}>
                                  {st}
                                </option>
                              ))}
                            </select>
                            <button
                              type="button"
                              onClick={() => {
                                const next = editing.sections.filter((_, idx) => idx !== sIdx);
                                setEditing({ ...editing, sections: next });
                              }}
                              className="text-slate-400 hover:text-rose-600 p-1"
                              title="Delete Block"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <Input
                            placeholder="Section Title"
                            value={sec.title || ""}
                            onChange={(e) => {
                              const next = [...editing.sections];
                              next[sIdx].title = e.target.value;
                              setEditing({ ...editing, sections: next });
                            }}
                          />
                          <Input
                            placeholder="Subtitle / Tagline"
                            value={sec.subtitle || ""}
                            onChange={(e) => {
                              const next = [...editing.sections];
                              next[sIdx].subtitle = e.target.value;
                              setEditing({ ...editing, sections: next });
                            }}
                          />
                        </div>

                        <Textarea
                          rows={3}
                          placeholder="Body content (HTML or plain text)..."
                          value={sec.content || ""}
                          onChange={(e) => {
                            const next = [...editing.sections];
                            next[sIdx].content = e.target.value;
                            setEditing({ ...editing, sections: next });
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* TAB 3: Complete SEO Management */}
                {activeTab === "seo" && (
                  <div className="space-y-6">
                    {/* SEO Titles & Descriptions */}
                    <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-sm">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                        <SearchCheck size={18} className="text-[#0f5960]" />
                        Search Engine Metadata & Target Keywords
                      </h3>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Field
                          label="Meta Title (Title Tag)"
                          hint={`${(editing.seo?.metaTitle || "").length} / 60 chars`}
                        >
                          <Input
                            value={editing.seo?.metaTitle || ""}
                            onChange={(e) =>
                              setEditing({ ...editing, seo: { ...editing.seo, metaTitle: e.target.value } })
                            }
                            placeholder="e.g. About Kraviona | AI-First Technology & Software Company"
                          />
                        </Field>
                        <Field label="On-Page H1 Heading">
                          <Input
                            value={editing.seo?.h1 || ""}
                            onChange={(e) =>
                              setEditing({ ...editing, seo: { ...editing.seo, h1: e.target.value } })
                            }
                            placeholder="e.g. Building Intelligent Software That Powers Sustainable Growth"
                          />
                        </Field>
                      </div>

                      <Field
                        label="Meta Description"
                        hint={`${(editing.seo?.metaDescription || "").length} / 160 chars`}
                      >
                        <Textarea
                          rows={3}
                          value={editing.seo?.metaDescription || ""}
                          onChange={(e) =>
                            setEditing({ ...editing, seo: { ...editing.seo, metaDescription: e.target.value } })
                          }
                          placeholder="High-converting summary displayed in Google SERPs..."
                        />
                      </Field>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <Field label="Primary Commercial Keyword">
                          <Input
                            value={editing.seo?.primaryKeyword || ""}
                            onChange={(e) =>
                              setEditing({ ...editing, seo: { ...editing.seo, primaryKeyword: e.target.value } })
                            }
                            placeholder="e.g. AI-First Technology Company"
                          />
                        </Field>
                        <Field label="Search Intent">
                          <select
                            value={editing.seo?.searchIntent || "Commercial / Informational"}
                            onChange={(e) =>
                              setEditing({ ...editing, seo: { ...editing.seo, searchIntent: e.target.value } })
                            }
                            className={inputClass}
                          >
                            <option value="Commercial">Commercial (Buyer evaluating agencies)</option>
                            <option value="Transactional">Transactional (Ready to inquire / hire)</option>
                            <option value="Informational">Informational (Educational learning)</option>
                            <option value="Navigational">Navigational (Brand search)</option>
                          </select>
                        </Field>
                        <Field label="Robots Directive">
                          <select
                            value={editing.seo?.noIndex ? "noindex" : "index"}
                            onChange={(e) =>
                              setEditing({
                                ...editing,
                                seo: {
                                  ...editing.seo,
                                  noIndex: e.target.value === "noindex",
                                  robotsMeta: e.target.value === "noindex" ? "noindex, nofollow" : "index, follow",
                                },
                              })
                            }
                            className={inputClass}
                          >
                            <option value="index">Index & Follow (Public in Google)</option>
                            <option value="noindex">NoIndex (Exclude from Google)</option>
                          </select>
                        </Field>
                      </div>

                      <Field label="Canonical URL Override" hint="Leave blank to use default self-canonical">
                        <Input
                          value={editing.seo?.canonicalUrl || ""}
                          onChange={(e) =>
                            setEditing({ ...editing, seo: { ...editing.seo, canonicalUrl: e.target.value } })
                          }
                          placeholder="e.g. https://www.kraviona.com/about"
                        />
                      </Field>
                    </div>

                    {/* Open Graph & Social Share Preview */}
                    <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-sm">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                        <Globe size={18} className="text-[#0f5960]" />
                        Open Graph & Social Share Metadata
                      </h3>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Field label="Open Graph Title">
                          <Input
                            value={editing.seo?.ogTitle || ""}
                            onChange={(e) =>
                              setEditing({ ...editing, seo: { ...editing.seo, ogTitle: e.target.value } })
                            }
                            placeholder="Title when shared on LinkedIn / Twitter"
                          />
                        </Field>
                        <Field label="Open Graph Image URL">
                          <Input
                            value={editing.seo?.ogImage || ""}
                            onChange={(e) =>
                              setEditing({ ...editing, seo: { ...editing.seo, ogImage: e.target.value } })
                            }
                            placeholder="e.g. /og-image.jpg or https://..."
                          />
                        </Field>
                      </div>
                      <Field label="Open Graph Description">
                        <Textarea
                          rows={2}
                          value={editing.seo?.ogDescription || ""}
                          onChange={(e) =>
                            setEditing({ ...editing, seo: { ...editing.seo, ogDescription: e.target.value } })
                          }
                          placeholder="Social share snippet..."
                        />
                      </Field>
                    </div>

                    {/* FAQ Schema Builder */}
                    <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-sm">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                          <Code size={18} className="text-[#0f5960]" />
                          FAQ Schema Builder (AEO & GEO Optimization)
                        </h3>
                        <button
                          type="button"
                          onClick={() => {
                            const newFaqs = [...(editing.seo?.faqSchema || []), { question: "", answer: "" }];
                            setEditing({ ...editing, seo: { ...editing.seo, faqSchema: newFaqs } });
                          }}
                          className="flex items-center gap-1 rounded-md border border-[#0f5960] px-2.5 py-1 text-xs font-bold text-[#0f5960] hover:bg-[#0f5960]/5"
                        >
                          <Plus size={13} /> Add FAQ
                        </button>
                      </div>

                      {(editing.seo?.faqSchema || []).map((faq, fIdx) => (
                        <div key={fIdx} className="rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-700">Question #{fIdx + 1}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const next = editing.seo.faqSchema.filter((_, idx) => idx !== fIdx);
                                setEditing({ ...editing, seo: { ...editing.seo, faqSchema: next } });
                              }}
                              className="text-slate-400 hover:text-rose-600"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <Input
                            placeholder="e.g. How does Kraviona protect enterprise AI data privacy?"
                            value={faq.question}
                            onChange={(e) => {
                              const next = [...editing.seo.faqSchema];
                              next[fIdx].question = e.target.value;
                              setEditing({ ...editing, seo: { ...editing.seo, faqSchema: next } });
                            }}
                          />
                          <Textarea
                            rows={2}
                            placeholder="Direct, factual answer cited by search engines..."
                            value={faq.answer}
                            onChange={(e) => {
                              const next = [...editing.seo.faqSchema];
                              next[fIdx].answer = e.target.value;
                              setEditing({ ...editing, seo: { ...editing.seo, faqSchema: next } });
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 4: Revisions & Sync Log */}
                {activeTab === "revisions" && (
                  <div className="space-y-4">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                        <History size={18} className="text-[#0f5960]" />
                        On-Demand Cache Revalidation Log
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        Every time you click &ldquo;Publish & Sync Live&rdquo;, Kraviona automatically dispatches an
                        on-demand revalidation webhook to Next.js, purging disk cache for route{" "}
                        <code className="text-[#0f5960]">/{editing.slug === "home" ? "" : editing.slug}</code>.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase text-slate-500">Saved Change History</h4>
                      {editing.revisions?.length ? (
                        <div className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
                          {editing.revisions.map((rev, rIdx) => (
                            <div key={rIdx} className="p-3 text-xs flex items-center justify-between">
                              <div>
                                <span className="font-semibold text-slate-800">{rev.note || "Content Update"}</span>
                                <div className="text-slate-400 font-mono mt-0.5">
                                  {new Date(rev.timestamp).toLocaleString()}
                                </div>
                              </div>
                              <span className="rounded bg-slate-100 px-2 py-0.5 text-slate-600 font-medium">
                                Revision #{editing.revisions.length - rIdx}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400 italic">No revisions recorded yet.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">
                    Status: <strong className="capitalize">{editing.status}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => save(editing, "draft")}
                    disabled={saving}
                    className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                  >
                    Save Draft
                  </button>
                  <button
                    type="button"
                    onClick={() => save(editing, "published")}
                    disabled={saving}
                    className="flex items-center gap-2 rounded-xl bg-[#0f5960] px-5 py-2 text-sm font-semibold text-white shadow hover:bg-[#0c484e] disabled:opacity-50"
                  >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    Publish & Sync Live
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Frame>
  );
}
