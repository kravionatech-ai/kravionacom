"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  Layers,
  Megaphone,
  Palette,
  Plus,
  Save,
  Sparkles,
  Tag,
  X,
} from "lucide-react";
import Frame from "@/components/Frame/Frame";
import { apiRequest } from "@/components/api";
import Swal from "sweetalert2";

const BADGE_COLORS = [
  { label: "Brand Orange", value: "#F15A35" },
  { label: "Brand Teal", value: "#00CBA9" },
  { label: "Electric Blue", value: "#2563EB" },
  { label: "Gold Accent", value: "#D97706" },
  { label: "Emerald Green", value: "#059669" },
  { label: "Deep Violet", value: "#7C3AED" },
];

export default function NewEventPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    badge: "Special Offer",
    badgeColor: "#F15A35",
    description: "",
    eventType: "offer",
    displayType: "modal_popup",
    ctaText: "Claim Offer",
    ctaLink: "/contact",
    secondaryCtaText: "",
    secondaryCtaLink: "",
    bannerImage: "",
    startDate: "",
    endDate: "",
    isActive: true,
    priority: 1,
    showDelaySeconds: 3,
    frequencyHours: 24,
    targetPages: "all",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Title Required",
        text: "Please provide a title for the event or offer.",
        confirmButtonColor: "#173F43",
      });
      return;
    }

    try {
      setSubmitting(true);
      await apiRequest("admin/events", {
        method: "POST",
        body: JSON.stringify(form),
      });

      await Swal.fire({
        icon: "success",
        title: "Event Created Successfully!",
        text: form.isActive
          ? "The event is now active and ready to pop up on kraviona.com."
          : "The event has been saved as inactive.",
        timer: 2500,
        showConfirmButton: false,
      });

      router.push("/events");
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: err.message || "Failed to create event",
        confirmButtonColor: "#173F43",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Frame>
      <div className="space-y-6">
        {/* Top Navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/events"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Create New Event or Offer</h1>
              <p className="text-xs text-slate-500">Configure promotional campaigns, webinars, or discounts for the website.</p>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-lg bg-[#173F43] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#123337] disabled:opacity-50 transition-colors"
          >
            <Save className="h-4 w-4" />
            <span>{submitting ? "Saving..." : "Save & Publish"}</span>
          </button>
        </div>

        {/* Two-Column Form & Live Preview */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Form Column (7 Cols) */}
          <form onSubmit={handleSubmit} className="space-y-6 lg:col-span-7">
            {/* Card 1: Core Information */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Megaphone className="h-4 w-4 text-[#173F43]" />
                <span>1. Core Event &amp; Offer Details</span>
              </h2>

              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Event / Offer Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. Special Launch Offer: 30% Off Next.js & AI Web Builds"
                  value={form.title}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#00CBA9] focus:outline-none focus:ring-1 focus:ring-[#00CBA9]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Tagline / Subtitle
                </label>
                <input
                  type="text"
                  name="subtitle"
                  placeholder="e.g. Limited to First 5 Enterprise Clients This Month"
                  value={form.subtitle}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#00CBA9] focus:outline-none focus:ring-1 focus:ring-[#00CBA9]"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Badge Label
                  </label>
                  <input
                    type="text"
                    name="badge"
                    placeholder="e.g. Special Offer, Webinar, Limited Slot"
                    value={form.badge}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-[#00CBA9] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Badge Color
                  </label>
                  <div className="mt-1 flex items-center gap-2">
                    {BADGE_COLORS.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setForm((p) => ({ ...p, badgeColor: c.value }))}
                        className={`h-7 w-7 rounded-full border-2 transition-transform ${
                          form.badgeColor === c.value
                            ? "scale-110 border-slate-900 ring-2 ring-[#00CBA9]"
                            : "border-transparent hover:scale-105"
                        }`}
                        style={{ backgroundColor: c.value }}
                        title={c.label}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Event Type
                  </label>
                  <select
                    name="eventType"
                    value={form.eventType}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-[#00CBA9] focus:outline-none"
                  >
                    <option value="offer">Offer / Promotional Discount</option>
                    <option value="event">Live Event / Meetup</option>
                    <option value="webinar">Online Webinar</option>
                    <option value="announcement">Company Announcement</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Display Format
                  </label>
                  <select
                    name="displayType"
                    value={form.displayType}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-[#00CBA9] focus:outline-none"
                  >
                    <option value="modal_popup">Modal Popup (Center Overlay)</option>
                    <option value="top_banner">Top Banner Notification Bar</option>
                    <option value="floating_card">Floating Bottom Card</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Full Description &amp; Offer Details
                </label>
                <textarea
                  name="description"
                  rows={4}
                  placeholder="Explain the offer, benefits, eligibility, and what clients receive when they claim this event..."
                  value={form.description}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#00CBA9] focus:outline-none focus:ring-1 focus:ring-[#00CBA9]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700">
                  Banner Image URL (Optional)
                </label>
                <input
                  type="text"
                  name="bannerImage"
                  placeholder="https://res.cloudinary.com/... or /og-image.jpg"
                  value={form.bannerImage}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#00CBA9] focus:outline-none"
                />
              </div>
            </div>

            {/* Card 2: CTA Buttons */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Sparkles className="h-4 w-4 text-[#F15A35]" />
                <span>2. Call to Action (Buttons &amp; Links)</span>
              </h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Primary CTA Button Text
                  </label>
                  <input
                    type="text"
                    name="ctaText"
                    placeholder="e.g. Claim 30% Off, Register Now"
                    value={form.ctaText}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-[#00CBA9] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Primary CTA Link
                  </label>
                  <input
                    type="text"
                    name="ctaLink"
                    placeholder="e.g. /contact, /services/nextjs-development"
                    value={form.ctaLink}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-[#00CBA9] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Secondary CTA Text (Optional)
                  </label>
                  <input
                    type="text"
                    name="secondaryCtaText"
                    placeholder="e.g. View Case Studies"
                    value={form.secondaryCtaText}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-[#00CBA9] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Secondary CTA Link
                  </label>
                  <input
                    type="text"
                    name="secondaryCtaLink"
                    placeholder="e.g. /case-studies"
                    value={form.secondaryCtaLink}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-[#00CBA9] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Card 3: Display Timing & Scheduling */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Clock className="h-4 w-4 text-[#00CBA9]" />
                <span>3. Timing, Frequency &amp; Target Pages</span>
              </h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Popup Delay (Seconds)
                  </label>
                  <input
                    type="number"
                    name="showDelaySeconds"
                    min={0}
                    max={60}
                    value={form.showDelaySeconds}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-[#00CBA9] focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400">Seconds before popup shows</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Frequency (Hours)
                  </label>
                  <input
                    type="number"
                    name="frequencyHours"
                    min={0}
                    value={form.frequencyHours}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-[#00CBA9] focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400">Hours before showing again if dismissed</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Priority Score
                  </label>
                  <input
                    type="number"
                    name="priority"
                    min={0}
                    value={form.priority}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-[#00CBA9] focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400">Higher = takes precedence</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Target Pages
                  </label>
                  <select
                    name="targetPages"
                    value={form.targetPages}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:border-[#00CBA9] focus:outline-none"
                  >
                    <option value="all">All Website Pages</option>
                    <option value="home_only">Homepage Only</option>
                    <option value="services_only">Services Pages Only</option>
                    <option value="blog_only">Blog &amp; News Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700">
                    Expiration / End Date (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    name="endDate"
                    value={form.endDate}
                    onChange={handleChange}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 focus:border-[#00CBA9] focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400">Enables live countdown timer</span>
                </div>
              </div>

              {/* Active Toggle Switch */}
              <div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 p-3">
                <div>
                  <span className="text-xs font-bold text-slate-900">Activate on Live Site Immediately</span>
                  <p className="text-[11px] text-slate-500">When enabled, visitors to kraviona.com will see this event.</p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={form.isActive}
                    onChange={handleChange}
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-slate-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#00CBA9] peer-checked:after:translate-x-full peer-focus:outline-none" />
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Link
                href="/events"
                className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-lg bg-[#173F43] px-5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#123337] disabled:opacity-50 transition-colors"
              >
                <Save className="h-4 w-4" />
                <span>{submitting ? "Saving..." : "Save & Publish Event"}</span>
              </button>
            </div>
          </form>

          {/* Live Preview Column (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="sticky top-20 rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#173F43]">
                  <Eye className="h-4 w-4 text-[#00CBA9]" />
                  <span>Real-Time Website Preview</span>
                </span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                  Interactive
                </span>
              </div>

              {/* Render Preview according to displayType */}
              <div className="mt-4 overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-b from-[#102629] via-[#173F43] to-[#0D1F21] p-5 text-white shadow-xl relative">
                {/* Close Button Mockup */}
                <span className="absolute right-3.5 top-3.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/70">
                  <X className="h-3.5 w-3.5" />
                </span>

                {/* Badge */}
                <div
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-xs"
                  style={{ backgroundColor: form.badgeColor || "#F15A35" }}
                >
                  <Sparkles className="h-3 w-3" />
                  <span>{form.badge || "Special Offer"}</span>
                </div>

                {/* Title */}
                <h3 className="mt-3 text-lg font-bold leading-tight">
                  {form.title || "Your Event / Promotional Offer Title Goes Here"}
                </h3>

                {/* Subtitle */}
                {form.subtitle && (
                  <p className="mt-1 text-xs font-semibold text-[#00CBA9]">
                    {form.subtitle}
                  </p>
                )}

                {/* Description */}
                <p className="mt-2.5 text-xs leading-relaxed text-white/80 line-clamp-3">
                  {form.description ||
                    "Enter a clear and compelling summary of the discount, upcoming webinar, or exclusive business opportunity."}
                </p>

                {/* Countdown Mockup if End Date is set */}
                {form.endDate && (
                  <div className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-black/30 p-2 text-center text-xs font-mono text-[#00CBA9] border border-white/10">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Live Countdown Timer Active</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-4 flex flex-col gap-2">
                  <button
                    type="button"
                    className="w-full rounded-xl bg-[#F15A35] py-2.5 text-center text-xs font-bold text-white shadow-md hover:bg-[#d94a28] transition-colors"
                  >
                    {form.ctaText || "Claim Offer"}
                  </button>

                  {form.secondaryCtaText && (
                    <button
                      type="button"
                      className="w-full rounded-xl border border-white/20 bg-white/5 py-2 text-center text-xs font-semibold text-white/80"
                    >
                      {form.secondaryCtaText}
                    </button>
                  )}
                </div>
              </div>

              <p className="mt-3 text-center text-[11px] text-slate-400">
                Matches the brand palette: Primary Dark Teal `#102629`, Brand Teal `#00CBA9`, and Burnt Orange `#F15A35`.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Frame>
  );
}
