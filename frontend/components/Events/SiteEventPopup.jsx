"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Clock,
  Sparkles,
  X,
  ArrowRight,
  ExternalLink,
  Tag,
  CheckCircle2,
} from "lucide-react";
import { API_URL } from "@/utils/api";

export default function SiteEventPopup() {
  const pathname = usePathname();
  const [event, setEvent] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(true);
  const [timeLeft, setTimeLeft] = useState(null);

  // 1. Fetch active event from backend
  useEffect(() => {
    let isCancelled = false;

    async function checkActiveEvent() {
      try {
        const pageParam = pathname === "/" ? "home_only" : pathname?.startsWith("/services") ? "services_only" : pathname?.startsWith("/blog") || pathname?.startsWith("/news") ? "blog_only" : "all";
        const res = await fetch(`${API_URL}/events/active?page=${pageParam}`, {
          next: { revalidate: 60 },
          headers: { Accept: "application/json" },
        });

        if (!res.ok) return;
        const data = await res.json();
        const active = data?.event;

        if (!active || !active._id || isCancelled) return;

        // Target page filter check
        if (active.targetPages === "home_only" && pathname !== "/") return;
        if (active.targetPages === "services_only" && !pathname?.startsWith("/services")) return;
        if (active.targetPages === "blog_only" && !pathname?.startsWith("/blog") && !pathname?.startsWith("/news")) return;

        // Frequency & Dismissal check in localStorage
        const dismissedKey = `kraviona_event_dismissed_${active._id}`;
        const lastDismissed = localStorage.getItem(dismissedKey);

        if (lastDismissed) {
          const hoursPassed = (Date.now() - Number(lastDismissed)) / (1000 * 60 * 60);
          const limitHours = active.frequencyHours ?? 24;
          if (limitHours > 0 && hoursPassed < limitHours) {
            return; // Still in cooldown period
          }
        }

        setEvent(active);

        // Delay popup trigger
        const delayMs = (active.showDelaySeconds ?? 3) * 1000;
        const timer = setTimeout(() => {
          if (!isCancelled) {
            setIsOpen(true);
            // Record view impression
            fetch(`${API_URL}/events/${active._id}/view`, { method: "POST" }).catch(() => {});
          }
        }, Math.max(800, delayMs));

        return () => clearTimeout(timer);
      } catch (err) {
        // Non-blocking catch
      }
    }

    checkActiveEvent();

    return () => {
      isCancelled = true;
    };
  }, [pathname]);

  // 2. Live Countdown Timer calculation
  useEffect(() => {
    if (!event?.endDate) return;

    function updateCountdown() {
      const difference = new Date(event.endDate).getTime() - Date.now();
      if (difference <= 0) {
        setTimeLeft(null);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    }

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [event?.endDate]);

  // 3. Handle dismiss / close
  const handleClose = useCallback(() => {
    setIsOpen(false);
    if (event?._id) {
      const dismissedKey = `kraviona_event_dismissed_${event._id}`;
      localStorage.setItem(dismissedKey, String(Date.now()));
    }
  }, [event?._id]);

  // Close on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  // 4. Handle CTA click
  const handleCtaClick = () => {
    if (event?._id) {
      fetch(`${API_URL}/events/${event._id}/click`, { method: "POST" }).catch(() => {});
    }
    handleClose();
  };

  if (!event || !isOpen) return null;

  const isExternalCta = event.ctaLink?.startsWith("http");
  const displayType = event.displayType || "modal_popup";

  // ─── Format 1: Top Banner Bar ──────────────────────────────────────────────
  if (displayType === "top_banner") {
    return (
      <div className="fixed top-0 inset-x-0 z-[60] bg-gradient-to-r from-[#102629] via-[#173F43] to-[#0D1F21] text-white border-b border-[#00CBA9]/40 shadow-lg px-4 py-2.5 sm:py-3 animate-in slide-in-from-top-full duration-300">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex flex-wrap items-center gap-2.5">
            <span
              className="rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-xs"
              style={{ backgroundColor: event.badgeColor || "#F15A35" }}
            >
              {event.badge || "Offer"}
            </span>
            <span className="font-bold">{event.title}</span>
            {event.subtitle && <span className="text-[#00CBA9] font-medium hidden md:inline">• {event.subtitle}</span>}
          </div>

          <div className="flex items-center gap-3">
            {timeLeft && (
              <div className="hidden lg:flex items-center gap-1.5 font-mono text-xs text-[#00CBA9] bg-black/30 px-2 py-0.5 rounded-md border border-white/10">
                <Clock className="h-3.5 w-3.5" />
                <span>
                  {String(timeLeft.days).padStart(2, "0")}d : {String(timeLeft.hours).padStart(2, "0")}h : {String(timeLeft.minutes).padStart(2, "0")}m
                </span>
              </div>
            )}

            <Link
              href={event.ctaLink || "/contact"}
              target={isExternalCta ? "_blank" : undefined}
              rel={isExternalCta ? "noreferrer" : undefined}
              onClick={handleCtaClick}
              className="rounded-lg bg-[#F15A35] px-3.5 py-1.5 text-xs font-bold text-white shadow-md hover:bg-[#d94a28] transition-colors inline-flex items-center gap-1"
            >
              <span>{event.ctaText || "Claim Now"}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>

            <button
              onClick={handleClose}
              aria-label="Close notification"
              className="text-white/70 hover:text-white p-1 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Format 2: Floating Card (Bottom-Left to avoid AI bot on right) ──────────
  if (displayType === "floating_card") {
    return (
      <div className="fixed bottom-6 left-6 z-40 max-w-sm rounded-2xl border border-white/20 bg-gradient-to-b from-[#102629] via-[#173F43] to-[#0D1F21] p-5 text-white shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-5 duration-300">
        <button
          onClick={handleClose}
          aria-label="Close promotion"
          className="absolute right-3.5 top-3.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
        >
          <X className="h-3.5 w-3.5" />
        </button>

        <div
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-xs"
          style={{ backgroundColor: event.badgeColor || "#F15A35" }}
        >
          <Sparkles className="h-3 w-3" />
          <span>{event.badge || "Special Offer"}</span>
        </div>

        <h3 className="mt-2.5 text-base font-bold leading-tight">{event.title}</h3>
        {event.subtitle && <p className="mt-1 text-xs font-semibold text-[#00CBA9]">{event.subtitle}</p>}
        {event.description && <p className="mt-2 text-xs leading-relaxed text-white/80 line-clamp-3">{event.description}</p>}

        <div className="mt-4 flex items-center gap-2">
          <Link
            href={event.ctaLink || "/contact"}
            target={isExternalCta ? "_blank" : undefined}
            rel={isExternalCta ? "noreferrer" : undefined}
            onClick={handleCtaClick}
            className="flex-1 rounded-xl bg-[#F15A35] py-2 text-center text-xs font-bold text-white shadow-md hover:bg-[#d94a28] transition-colors"
          >
            {event.ctaText || "Claim Offer"}
          </Link>
        </div>
      </div>
    );
  }

  // ─── Format 3: Modal Popup (Default / Center Overlay) ───────────────────────
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="site-event-title"
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/65 p-4 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-[#00CBA9]/30 bg-gradient-to-b from-[#102629] via-[#173F43] to-[#0B1A1C] p-6 sm:p-8 text-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] animate-in zoom-in-95 duration-200">
        {/* Glowing Ambient Gradient behind card */}
        <div
          className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-[#00CBA9]/15 blur-3xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-[#F15A35]/15 blur-3xl"
          aria-hidden="true"
        />

        {/* Close Button */}
        <button
          onClick={handleClose}
          aria-label="Close event popup"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/70 transition-all hover:bg-white/20 hover:text-white hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#00CBA9]"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Banner Image (if provided) */}
        {event.bannerImage && (
          <div className="mb-4 overflow-hidden rounded-2xl border border-white/10 max-h-48 relative">
            <img
              src={event.bannerImage}
              alt={event.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        {/* Badge */}
        <div
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-xs"
          style={{ backgroundColor: event.badgeColor || "#F15A35" }}
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>{event.badge || "Special Offer"}</span>
        </div>

        {/* Title */}
        <h2 id="site-event-title" className="mt-3.5 text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">
          {event.title}
        </h2>

        {/* Subtitle */}
        {event.subtitle && (
          <p className="mt-1.5 text-xs sm:text-sm font-semibold text-[#00CBA9]">
            {event.subtitle}
          </p>
        )}

        {/* Description */}
        {event.description && (
          <p className="mt-3 text-xs sm:text-sm leading-relaxed text-white/80">
            {event.description}
          </p>
        )}

        {/* Countdown Timer (if scheduled with endDate) */}
        {timeLeft && (
          <div className="mt-4 rounded-xl border border-white/15 bg-black/40 p-3 text-center">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-white/60">
              Offer / Event Ends In
            </span>
            <div className="mt-1 flex items-center justify-center gap-2 font-mono text-sm sm:text-base font-bold text-[#00CBA9]">
              <div className="flex flex-col items-center">
                <span className="text-lg sm:text-xl">{String(timeLeft.days).padStart(2, "0")}</span>
                <span className="text-[9px] uppercase tracking-wider text-white/50">Days</span>
              </div>
              <span className="text-lg text-white/30">:</span>
              <div className="flex flex-col items-center">
                <span className="text-lg sm:text-xl">{String(timeLeft.hours).padStart(2, "0")}</span>
                <span className="text-[9px] uppercase tracking-wider text-white/50">Hours</span>
              </div>
              <span className="text-lg text-white/30">:</span>
              <div className="flex flex-col items-center">
                <span className="text-lg sm:text-xl">{String(timeLeft.minutes).padStart(2, "0")}</span>
                <span className="text-[9px] uppercase tracking-wider text-white/50">Mins</span>
              </div>
              <span className="text-lg text-white/30">:</span>
              <div className="flex flex-col items-center">
                <span className="text-lg sm:text-xl">{String(timeLeft.seconds).padStart(2, "0")}</span>
                <span className="text-[9px] uppercase tracking-wider text-white/50">Secs</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <Link
            href={event.ctaLink || "/contact"}
            target={isExternalCta ? "_blank" : undefined}
            rel={isExternalCta ? "noreferrer" : undefined}
            onClick={handleCtaClick}
            className="flex-1 rounded-xl bg-[#F15A35] py-3 px-6 text-center text-sm font-bold text-white shadow-lg shadow-[#F15A35]/30 hover:bg-[#d94a28] hover:shadow-[#F15A35]/50 transition-all inline-flex items-center justify-center gap-2"
          >
            <span>{event.ctaText || "Claim Offer"}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          {event.secondaryCtaText && (
            <Link
              href={event.secondaryCtaLink || "/contact"}
              onClick={handleClose}
              className="rounded-xl border border-white/20 bg-white/5 py-3 px-5 text-center text-sm font-semibold text-white/90 hover:bg-white/10 transition-colors"
            >
              {event.secondaryCtaText}
            </Link>
          )}
        </div>

        {/* Footer Dismiss Checkbox */}
        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-[11px] text-white/60">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="h-3.5 w-3.5 rounded-sm border-white/30 bg-white/10 text-[#00CBA9] focus:ring-0"
            />
            <span>Don&apos;t show again today</span>
          </label>

          <button
            onClick={handleClose}
            className="text-white/60 hover:text-white underline underline-offset-2"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
