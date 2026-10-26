"use client";

import { useCallback, useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  Edit3,
  ExternalLink,
  Plus,
  Trash2,
  X,
  FileText,
  Layers,
  Settings,
  Sparkles,
  Eye,
  Globe,
  CheckCircle2,
  Code,
  Image as ImageIcon,
} from "lucide-react";
import Frame from "@/components/Frame/Frame";
import { apiRequest } from "@/components/api";
import { ContentLoader, EmptyState } from "@/components/AsyncState";
import TiptapEditor from "@/components/Blogs/AddBlog/TiptapEditor";

const EMPTY = {
  title: "",
  slug: "",
  category: "",
  client: "",
  duration: "",
  image: "",
  imageAlt: "",
  projectUrl: "",
  githubUrl: "",
  description: "",
  content: "",
  overview: "",
  challenge: "",
  solution: "",
  results: "",
  techStack: "",
  order: 0,
  isActive: true,
  isFeatured: true,
};

const inputClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-normal text-slate-800 outline-none transition focus:border-[#0f5960] focus:ring-4 focus:ring-[#0f5960]/10 placeholder:text-slate-400";

function ProjectForm({ project, saving, onClose, onSave }) {
  const [form, setForm] = useState(() => {
    if (!project) return EMPTY;
    return {
      ...project,
      results: Array.isArray(project.results)
        ? project.results.join("\n")
        : project.results || "",
      techStack: Array.isArray(project.techStack)
        ? project.techStack.join(", ")
        : project.techStack || "",
      content: project.content || "",
    };
  });

  const [activeTab, setActiveTab] = useState("story"); // 'story' | 'general' | 'highlights' | 'publish'

  const set = (key, value) =>
    setForm((current) => ({ ...current, [key]: value }));

  const handleTitleChange = (e) => {
    const val = e.target.value;
    set("title", val);
    // Auto-generate slug if it's a new project and slug is empty or matches previous title slug
    if (!project?._id && (!form.slug || form.slug === "")) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      set("slug", generated);
    }
  };

  const submit = (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Missing title",
        text: "Please provide a project title.",
      });
      return;
    }

    if (!form.description.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Missing short description",
        text: "Please provide a brief executive summary for cards and SEO.",
      });
      return;
    }

    const payload = {
      ...form,
      title: form.title.trim(),
      slug: form.slug.trim(),
      category: form.category.trim() || "Project",
      client: form.client.trim(),
      duration: form.duration.trim(),
      projectUrl: form.projectUrl.trim(),
      githubUrl: form.githubUrl.trim(),
      image: form.image.trim() || "/images/office/case-study-product.webp",
      imageAlt: form.imageAlt.trim() || `${form.title} case study`,
      description: form.description.trim(),
      content: form.content || "",
      overview: form.overview.trim(),
      challenge: form.challenge.trim(),
      solution: form.solution.trim(),
      results: form.results
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
      techStack: form.techStack
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      order: Number(form.order) || 0,
      isActive: Boolean(form.isActive),
      isFeatured: Boolean(form.isFeatured),
    };

    onSave(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-3 sm:p-5 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative my-4 flex h-[92vh] w-full max-w-5xl flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 bg-[#f7faf9] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0f5960]/10 text-[#0f5960]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#d85e3d]">
                  Case Study Studio
                </span>
                {form.slug && (
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-mono text-slate-600">
                    /case-studies/{form.slug}
                  </span>
                )}
              </div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">
                {project?._id ? `Edit: ${form.title || "Project"}` : "Create New Case Study"}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={submit}
              disabled={saving}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#0f5960] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:bg-[#0a454b] disabled:opacity-60 transition"
            >
              {saving ? "Saving…" : "Save Case Study"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 transition"
              aria-label="Close dialog"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex shrink-0 border-b border-slate-200 bg-white px-6">
          <button
            type="button"
            onClick={() => setActiveTab("story")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
              activeTab === "story"
                ? "border-[#0f5960] text-[#0f5960]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <FileText size={16} /> Rich Case Study Story
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("general")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
              activeTab === "general"
                ? "border-[#0f5960] text-[#0f5960]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Layers size={16} /> Details &amp; Links
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("highlights")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
              activeTab === "highlights"
                ? "border-[#0f5960] text-[#0f5960]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Code size={16} /> Tech &amp; Outcomes
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("publish")}
            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
              activeTab === "publish"
                ? "border-[#0f5960] text-[#0f5960]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Settings size={16} /> Publishing
          </button>
        </div>

        {/* Modal Body / Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          <form onSubmit={submit}>
            {/* TAB 1: RICH TEXT CASE STUDY STORY */}
            {activeTab === "story" && (
              <div className="space-y-6">
                <div className="rounded-xl border border-teal-100 bg-teal-50/60 p-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#0f5960] flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4" /> Explain Your Portfolio Project Thoroughly
                  </h4>
                  <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                    Use this rich text editor to write the full case study. You can include formatted headings, structured paragraphs, bullet points, client quotes, screenshots, and code snippets. This content will be beautifully rendered on the public website.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="mb-3 flex items-center justify-between">
                    <label className="text-sm font-bold text-slate-800">
                      Full Case Study Content (Rich Text)
                    </label>
                    <span className="text-xs text-slate-400">
                      Supports headings, bold/italic, lists, images, quotes &amp; links
                    </span>
                  </div>

                  <div className="min-h-[440px] rounded-xl border border-slate-200 bg-white p-2 focus-within:border-[#0f5960] focus-within:ring-4 focus-within:ring-[#0f5960]/10">
                    <TiptapEditor
                      value={form.content}
                      onChange={(html) => set("content", html)}
                    />
                  </div>
                </div>

                {/* Optional Classic Fallback Fields */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Structured Fallback Sections (Optional)
                  </h4>
                  <p className="text-xs text-slate-500">
                    If left empty, the rich text story above will be used as the primary case study layout.
                  </p>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-700">
                        Overview Summary
                      </label>
                      <textarea
                        className={`${inputClass} min-h-24 text-xs`}
                        value={form.overview}
                        onChange={(e) => set("overview", e.target.value)}
                        placeholder="Brief overview of what was built..."
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700">
                        The Challenge
                      </label>
                      <textarea
                        className={`${inputClass} min-h-24 text-xs`}
                        value={form.challenge}
                        onChange={(e) => set("challenge", e.target.value)}
                        placeholder="Key client obstacles and requirements..."
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700">
                        The Solution
                      </label>
                      <textarea
                        className={`${inputClass} min-h-24 text-xs`}
                        value={form.solution}
                        onChange={(e) => set("solution", e.target.value)}
                        placeholder="Engineering approach and delivery..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: GENERAL DETAILS & LINKS */}
            {activeTab === "general" && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                    <Layers size={16} className="text-[#0f5960]" /> Basic Information
                  </h3>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        Project Title <span className="text-rose-500">*</span>
                      </label>
                      <input
                        className={inputClass}
                        type="text"
                        value={form.title}
                        onChange={handleTitleChange}
                        placeholder="e.g. Alokworld.in – Community Directory Platform"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        URL Slug <span className="text-rose-500">*</span>
                      </label>
                      <input
                        className={inputClass}
                        type="text"
                        value={form.slug}
                        onChange={(e) => set("slug", e.target.value)}
                        placeholder="e.g. alokworld-community-directory"
                        required
                      />
                      <span className="mt-1 block text-[11px] text-slate-400">
                        Appears at: https://www.kraviona.com/case-studies/<b>{form.slug || "your-slug"}</b>
                      </span>
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        Category / Industry
                      </label>
                      <input
                        className={inputClass}
                        type="text"
                        value={form.category}
                        onChange={(e) => set("category", e.target.value)}
                        placeholder="e.g. Community Directory, Web Application, E-Commerce"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        Client Name / Organization
                      </label>
                      <input
                        className={inputClass}
                        type="text"
                        value={form.client}
                        onChange={(e) => set("client", e.target.value)}
                        placeholder="e.g. Akhil Bharatiya Alok Samiti"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        Project Timeline / Duration
                      </label>
                      <input
                        className={inputClass}
                        type="text"
                        value={form.duration}
                        onChange={(e) => set("duration", e.target.value)}
                        placeholder="e.g. 6 Weeks, 2026, Q1 2026"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        Display Order
                      </label>
                      <input
                        className={inputClass}
                        type="number"
                        value={form.order}
                        onChange={(e) => set("order", e.target.value)}
                        placeholder="0 (lower numbers appear first)"
                      />
                    </div>
                  </div>
                </div>

                {/* External Links */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                    <Globe size={16} className="text-[#0f5960]" /> Public Links
                  </h3>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        Live Project URL
                      </label>
                      <input
                        className={inputClass}
                        type="url"
                        value={form.projectUrl}
                        onChange={(e) => set("projectUrl", e.target.value)}
                        placeholder="https://www.alokworld.in"
                      />
                      <span className="mt-1 block text-[11px] text-slate-400">
                        Adds a direct &quot;Visit Live Website ↗&quot; button on the card and detail page.
                      </span>
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        GitHub / Source Repository URL (Optional)
                      </label>
                      <input
                        className={inputClass}
                        type="url"
                        value={form.githubUrl}
                        onChange={(e) => set("githubUrl", e.target.value)}
                        placeholder="https://github.com/..."
                      />
                    </div>
                  </div>
                </div>

                {/* Cover Image & Media */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                    <ImageIcon size={16} className="text-[#0f5960]" /> Featured Cover Image
                  </h3>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        Image URL / Cloudinary Path
                      </label>
                      <input
                        className={inputClass}
                        type="text"
                        value={form.image}
                        onChange={(e) => set("image", e.target.value)}
                        placeholder="https://res.cloudinary.com/... or /images/..."
                      />

                      <label className="mt-3 block text-xs font-bold uppercase tracking-wider text-slate-600">
                        Image Alt Text (SEO)
                      </label>
                      <input
                        className={inputClass}
                        type="text"
                        value={form.imageAlt}
                        onChange={(e) => set("imageAlt", e.target.value)}
                        placeholder="e.g. Alokworld.in website homepage showcase"
                      />
                    </div>

                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4">
                      {form.image ? (
                        <div className="relative w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xs">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={form.image}
                            alt="Cover Preview"
                            className="aspect-video w-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/images/office/case-study-product.webp";
                            }}
                          />
                          <span className="absolute bottom-2 right-2 rounded bg-slate-900/80 px-2 py-0.5 text-[10px] font-bold text-white">
                            Cover Preview
                          </span>
                        </div>
                      ) : (
                        <div className="text-center text-slate-400">
                          <ImageIcon className="mx-auto h-8 w-8 mb-2 opacity-50" />
                          <span className="text-xs font-medium">Enter an image URL to see live preview</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: HIGHLIGHTS, TECH & SPECS */}
            {activeTab === "highlights" && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                    <FileText size={16} className="text-[#0f5960]" /> Executive Summary
                  </h3>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      Short Description (Card Excerpt &amp; Search Engine Meta) <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      className={`${inputClass} min-h-24`}
                      value={form.description}
                      onChange={(e) => set("description", e.target.value)}
                      placeholder="A crisp 2-3 sentence summary of the project, problem solved, and value delivered..."
                      required
                    />
                    <span className="mt-1 block text-[11px] text-slate-400">
                      This is displayed in portfolio card grids, Google search previews, and the top hero of the case study.
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                    <Code size={16} className="text-[#0f5960]" /> Technologies Used
                  </h3>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      Tech Stack <span className="font-normal text-slate-400">(Comma Separated)</span>
                    </label>
                    <input
                      className={inputClass}
                      type="text"
                      value={form.techStack}
                      onChange={(e) => set("techStack", e.target.value)}
                      placeholder="e.g. Next.js, React.js, Node.js, Express, MongoDB, Tailwind CSS"
                    />

                    {form.techStack && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {form.techStack
                          .split(",")
                          .map((t) => t.trim())
                          .filter(Boolean)
                          .map((tag) => (
                            <span
                              key={tag}
                              className="rounded-lg bg-teal-50 px-2.5 py-1 text-xs font-semibold text-[#0f5960] border border-teal-200/60"
                            >
                              {tag}
                            </span>
                          ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-[#0f5960]" /> Key Results &amp; Measurable Deliverables
                  </h3>

                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      Key Outcomes <span className="font-normal text-slate-400">(One per line)</span>
                    </label>
                    <textarea
                      className={`${inputClass} min-h-32`}
                      value={form.results}
                      onChange={(e) => set("results", e.target.value)}
                      placeholder="Community information organized in one platform&#10;Hindi-language website experience&#10;Sub-second page response times with server-side rendering&#10;Dedicated directories and matrimonial services"
                    />
                    <span className="mt-1 block text-[11px] text-slate-400">
                      Displayed as verified checkmark highlight items on the case study page.
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: PUBLISH SETTINGS */}
            {activeTab === "publish" && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
                    <Settings size={16} className="text-[#0f5960]" /> Visibility &amp; Placement
                  </h3>

                  <div className="space-y-4">
                    <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-4 cursor-pointer hover:bg-slate-50 transition">
                      <input
                        type="checkbox"
                        checked={form.isActive}
                        onChange={(e) => set("isActive", e.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-[#0f5960] focus:ring-[#0f5960]"
                      />
                      <div>
                        <b className="text-sm font-bold text-slate-900">Show on Public Website (Active)</b>
                        <p className="text-xs text-slate-500 mt-0.5">
                          When checked, this case study appears on `/case-studies`, `/gallery`, and is accessible to search engines.
                        </p>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/50 p-4 cursor-pointer hover:bg-slate-50 transition">
                      <input
                        type="checkbox"
                        checked={form.isFeatured}
                        onChange={(e) => set("isFeatured", e.target.checked)}
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-[#0f5960] focus:ring-[#0f5960]"
                      />
                      <div>
                        <b className="text-sm font-bold text-slate-900">Feature on Homepage / Top of Portfolio</b>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Prioritizes this project in featured sections, showcases, and client consultation pitches.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Modal Footer */}
        <div className="flex shrink-0 items-center justify-between border-t border-slate-200 bg-white px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-slate-50 transition"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={submit}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0f5960] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-[#0a454b] disabled:opacity-60 transition"
          >
            {saving ? "Saving Changes…" : "Save Case Study"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PortfolioPage() {
  const [projects, setProjects] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await apiRequest("/admin/projects");
      setProjects(response.data || []);
    } catch (err) {
      setError(err.message || "Unable to load portfolio");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async (data) => {
    try {
      setSaving(true);
      const isUpdate = Boolean(editing?._id);
      await apiRequest(isUpdate ? `/admin/projects/${editing._id}` : "/admin/projects", {
        method: isUpdate ? "PATCH" : "POST",
        body: JSON.stringify(data),
      });
      setEditing(null);
      await load();
      await Swal.fire({
        icon: "success",
        title: "Case Study Saved",
        text: `The project was ${isUpdate ? "updated" : "added"} successfully.`,
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (err) {
      await Swal.fire({
        icon: "error",
        title: "Save Failed",
        text: err.message || "Unable to save project",
      });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (project) => {
    const confirmed = await Swal.fire({
      icon: "warning",
      title: "Delete Case Study?",
      text: `"${project.title}" will be permanently removed from the website.`,
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#dc2626",
    });
    if (!confirmed.isConfirmed) return;

    try {
      await apiRequest(`/admin/projects/${project._id}`, { method: "DELETE" });
      await load();
      await Swal.fire({
        icon: "success",
        title: "Project Deleted",
        timer: 1600,
        showConfirmButton: false,
      });
    } catch (err) {
      await Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: err.message || "Unable to delete project",
      });
    }
  };

  return (
    <Frame>
      <div className="min-h-full bg-[#edf5f4] p-5 sm:p-6 lg:p-8">
        {/* Banner */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#0f5960]/20 bg-white p-6 shadow-sm">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#d85e3d]">
              Portfolio Studio &amp; Case Studies
            </p>
            <h1 className="mt-1 text-2xl font-black text-slate-900 tracking-tight">
              Portfolio &amp; Client Case Studies
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Showcase your engineered products with rich text storytelling, tech stacks, live links, and measurable outcomes.
            </p>
          </div>
          <button
            onClick={() => setEditing(EMPTY)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0f5960] px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-[#0a454b] transition"
          >
            <Plus size={18} /> Add New Case Study
          </button>
        </div>

        {error ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {error}
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-[#0f5960]/20 bg-white shadow-sm">
            {loading ? (
              <ContentLoader label="Loading portfolio projects…" />
            ) : projects.length ? (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-[#e7f1f0] text-left text-xs font-bold uppercase tracking-wide text-[#0a454b]">
                    <tr>
                      <th className="p-4">Project</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Tech Stack</th>
                      <th className="p-4">Visibility</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {projects.map((project) => (
                      <tr key={project._id} className="hover:bg-[#f8fbfa] transition">
                        <td className="p-4">
                          <div className="flex items-center gap-3.5">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={project.image || "/images/office/case-study-product.webp"}
                              alt=""
                              className="h-12 w-16 rounded-lg object-cover border border-slate-200 shadow-2xs"
                              onError={(e) => {
                                e.currentTarget.src = "/images/office/case-study-product.webp";
                              }}
                            />
                            <div>
                              <b className="block text-sm font-bold text-slate-900">
                                {project.title}
                              </b>
                              <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-500">
                                <span className="font-mono text-slate-400">
                                  /case-studies/{project.slug}
                                </span>
                                {project.content && (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">
                                    <FileText size={10} /> Rich Story
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="rounded-full bg-[#e7f1f0] px-3 py-1 text-xs font-semibold text-[#0a454b]">
                            {project.category || "General"}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {(project.techStack || []).slice(0, 3).map((t) => (
                              <span
                                key={t}
                                className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600"
                              >
                                {t}
                              </span>
                            ))}
                            {(project.techStack || []).length > 3 && (
                              <span className="text-[10px] text-slate-400 font-bold self-center">
                                +{project.techStack.length - 3}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center gap-1 text-xs font-semibold ${
                              project.isActive ? "text-emerald-700" : "text-slate-400"
                            }`}
                          >
                            <span
                              className={`h-2 w-2 rounded-full ${
                                project.isActive ? "bg-emerald-500" : "bg-slate-300"
                              }`}
                            />
                            {project.isActive ? "Live" : "Draft"}
                            {project.isFeatured && " · Featured"}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex justify-end gap-1.5">
                            <a
                              href={`https://www.kraviona.com/case-studies/${project.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition"
                              title="Preview on live site"
                            >
                              <Eye size={16} />
                            </a>
                            <button
                              onClick={() => setEditing(project)}
                              className="rounded-lg border border-slate-200 p-2 text-[#0f5960] hover:bg-[#e7f1f0] transition"
                              title="Edit case study"
                            >
                              <Edit3 size={16} />
                            </button>
                            {project.projectUrl && (
                              <a
                                href={project.projectUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 transition"
                                title="Visit external live site"
                              >
                                <ExternalLink size={16} />
                              </a>
                            )}
                            <button
                              onClick={() => remove(project)}
                              className="rounded-lg border border-rose-100 bg-rose-50 p-2 text-rose-600 hover:bg-rose-100 transition"
                              title="Delete case study"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState
                title="No portfolio projects yet"
                message="Add your first case study to showcase your engineering excellence on the website."
              />
            )}
          </div>
        )}

        {editing && (
          <ProjectForm
            project={editing}
            saving={saving}
            onClose={() => setEditing(null)}
            onSave={save}
          />
        )}
      </div>
    </Frame>
  );
}
