"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Edit3,
  ExternalLink,
  Eye,
  Megaphone,
  MousePointerClick,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Tag,
  Trash2,
  X,
  XCircle,
} from "lucide-react";
import Frame from "@/components/Frame/Frame";
import { apiRequest } from "@/components/api";
import Swal from "sweetalert2";
import { ContentLoader, EmptyState } from "@/components/AsyncState";

const EVENT_TYPES = [
  { id: "all", label: "All Types" },
  { id: "offer", label: "Offers & Discounts" },
  { id: "event", label: "Live Events" },
  { id: "webinar", label: "Webinars" },
  { id: "announcement", label: "Announcements" },
];

const DISPLAY_FORMATS = {
  modal_popup: "Modal Popup",
  top_banner: "Top Banner",
  floating_card: "Floating Card",
};

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [togglingId, setTogglingId] = useState(null);
  const [previewEvent, setPreviewEvent] = useState(null);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (typeFilter !== "all") params.append("type", typeFilter);
      if (statusFilter !== "all") params.append("status", statusFilter);

      const res = await apiRequest(`admin/events?${params.toString()}`);
      setEvents(res.events || []);
    } catch (err) {
      console.error("Failed to load events:", err);
      Swal.fire({
        icon: "error",
        title: "Failed to load events",
        text: err.message || "An unexpected error occurred",
        confirmButtonColor: "#173F43",
      });
    } finally {
      setLoading(false);
    }
  }, [search, typeFilter, statusFilter]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleToggle = async (event) => {
    try {
      setTogglingId(event._id);
      const res = await apiRequest(`admin/events/${event._id}/toggle`, {
        method: "PATCH",
      });

      setEvents((prev) =>
        prev.map((e) => (e._id === event._id ? { ...e, isActive: res.isActive } : e))
      );

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: `"${event.title}" is now ${res.isActive ? "ACTIVE on website" : "INACTIVE"}`,
        showConfirmButton: false,
        timer: 3000,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Toggle failed",
        text: err.message,
        confirmButtonColor: "#173F43",
      });
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (event) => {
    const result = await Swal.fire({
      title: "Delete Event & Offer?",
      text: `Are you sure you want to permanently delete "${event.title}"? This cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, Delete",
    });

    if (result.isConfirmed) {
      try {
        await apiRequest(`admin/events/${event._id}`, { method: "DELETE" });
        setEvents((prev) => prev.filter((e) => e._id !== event._id));
        Swal.fire({
          icon: "success",
          title: "Deleted!",
          text: "The event has been deleted.",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Delete Failed",
          text: err.message,
          confirmButtonColor: "#173F43",
        });
      }
    }
  };

  const activeCount = useMemo(() => events.filter((e) => e.isActive).length, [events]);
  const totalViews = useMemo(() => events.reduce((sum, e) => sum + (e.viewsCount || 0), 0), [events]);
  const totalClicks = useMemo(() => events.reduce((sum, e) => sum + (e.clicksCount || 0), 0), [events]);

  return (
    <Frame>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#00CBA9]">
              <Sparkles className="h-4 w-4" />
              <span>Marketing &amp; Growth Engine</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
              Events, Popups &amp; Promotional Offers
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage client-facing popups, seasonal discounts, webinar announcements, and event notifications.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchEvents}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>

            <Link
              href="/events/new"
              className="inline-flex items-center gap-2 rounded-lg bg-[#173F43] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#123337] transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Create Event / Offer</span>
            </Link>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium uppercase tracking-wider">Total Campaigns</span>
              <Megaphone className="h-4 w-4 text-[#173F43]" />
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">{events.length}</p>
          </div>

          <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/50 p-4 shadow-xs">
            <div className="flex items-center justify-between text-emerald-700">
              <span className="text-xs font-medium uppercase tracking-wider">Active on Site</span>
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <p className="mt-2 text-2xl font-bold text-emerald-800">{activeCount}</p>
          </div>

          <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium uppercase tracking-wider">Total Impressions</span>
              <Eye className="h-4 w-4 text-blue-600" />
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">{totalViews.toLocaleString()}</p>
          </div>

          <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-xs font-medium uppercase tracking-wider">CTA Clicks</span>
              <MousePointerClick className="h-4 w-4 text-[#F15A35]" />
            </div>
            <p className="mt-2 text-2xl font-bold text-[#F15A35]">{totalClicks.toLocaleString()}</p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col gap-3 rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by event title, badge, or subtitle..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-4 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#00CBA9] focus:outline-none focus:ring-1 focus:ring-[#00CBA9]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-[#00CBA9] focus:outline-none"
            >
              {EVENT_TYPES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 focus:border-[#00CBA9] focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>

        {/* Event List */}
        {loading ? (
          <ContentLoader message="Loading events & offers..." />
        ) : events.length === 0 ? (
          <EmptyState
            title="No events or offers found"
            description="Create your first promotional offer or event popup to showcase on kraviona.com."
            action={
              <Link
                href="/events/new"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#173F43] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#123337]"
              >
                <Plus className="h-4 w-4" />
                <span>Create New Event</span>
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {events.map((event) => {
              const isScheduled = event.startDate || event.endDate;
              const isPast = event.endDate && new Date(event.endDate) < new Date();

              return (
                <div
                  key={event._id}
                  className={`relative flex flex-col justify-between rounded-xl border bg-white p-5 shadow-xs transition-all ${
                    event.isActive
                      ? "border-[#00CBA9]/40 ring-1 ring-[#00CBA9]/20"
                      : "border-slate-200 opacity-80"
                  }`}
                >
                  <div>
                    {/* Top Tag Row */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white"
                          style={{ backgroundColor: event.badgeColor || "#F15A35" }}
                        >
                          <Tag className="h-3 w-3" />
                          <span>{event.badge || "Offer"}</span>
                        </span>

                        <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                          {DISPLAY_FORMATS[event.displayType] || "Modal Popup"}
                        </span>
                      </div>

                      {/* Active Status Switch */}
                      <button
                        type="button"
                        onClick={() => handleToggle(event)}
                        disabled={togglingId === event._id}
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-all ${
                          event.isActive
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {event.isActive ? (
                          <>
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Active (Live)</span>
                          </>
                        ) : (
                          <>
                            <span className="h-2 w-2 rounded-full bg-slate-400" />
                            <span>Inactive</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Title & Subtitle */}
                    <h3 className="mt-3 text-base font-bold text-slate-900 line-clamp-2">
                      {event.title}
                    </h3>

                    {event.subtitle && (
                      <p className="mt-1 text-xs font-medium text-[#173F43] line-clamp-1">
                        {event.subtitle}
                      </p>
                    )}

                    {event.description && (
                      <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {event.description}
                      </p>
                    )}

                    {/* Meta Info */}
                    <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-3 text-[11px] text-slate-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        <span>Delay: {event.showDelaySeconds || 3}s</span>
                      </div>

                      {isScheduled && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          <span>
                            {event.endDate
                              ? `Until ${new Date(event.endDate).toLocaleDateString()}`
                              : "Ongoing"}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-1">
                        <Eye className="h-3.5 w-3.5 text-slate-400" />
                        <span>{event.viewsCount || 0} views</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <MousePointerClick className="h-3.5 w-3.5 text-slate-400" />
                        <span>{event.clicksCount || 0} clicks</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                    <button
                      onClick={() => setPreviewEvent(event)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#173F43] hover:text-[#00CBA9] transition-colors"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Live Preview</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/events/${event._id}`}
                        className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                        <span>Edit</span>
                      </Link>

                      <button
                        onClick={() => handleDelete(event)}
                        className="inline-flex items-center gap-1 rounded-md border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700 hover:bg-rose-100 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal Popup Preview Simulator */}
        {previewEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-b from-[#102629] via-[#173F43] to-[#0D1F21] p-6 text-white shadow-2xl">
              {/* Close Button */}
              <button
                onClick={() => setPreviewEvent(null)}
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Badge */}
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider text-white"
                style={{ backgroundColor: previewEvent.badgeColor || "#F15A35" }}
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>{previewEvent.badge || "Special Offer"}</span>
              </div>

              {/* Title */}
              <h2 className="text-xl font-bold leading-tight sm:text-2xl">
                {previewEvent.title}
              </h2>

              {/* Subtitle */}
              {previewEvent.subtitle && (
                <p className="mt-1 text-xs font-semibold text-[#00CBA9]">
                  {previewEvent.subtitle}
                </p>
              )}

              {/* Description */}
              {previewEvent.description && (
                <p className="mt-3 text-sm leading-relaxed text-white/80">
                  {previewEvent.description}
                </p>
              )}

              {/* Action Buttons */}
              <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:items-center">
                <a
                  href={previewEvent.ctaLink || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 rounded-xl bg-[#F15A35] py-3 text-center text-sm font-bold text-white shadow-md hover:bg-[#d94a28] transition-colors"
                >
                  {previewEvent.ctaText || "Claim Offer"}
                </a>

                {previewEvent.secondaryCtaText && (
                  <a
                    href={previewEvent.secondaryCtaLink || "#"}
                    className="rounded-xl border border-white/20 bg-white/5 py-3 px-4 text-center text-sm font-semibold text-white/90 hover:bg-white/10 transition-colors"
                  >
                    {previewEvent.secondaryCtaText}
                  </a>
                )}
              </div>

              <div className="mt-4 text-center text-[11px] text-white/50">
                This is a live preview of how the popup renders on kraviona.com
              </div>
            </div>
          </div>
        )}
      </div>
    </Frame>
  );
}
