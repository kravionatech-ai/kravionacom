"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Cookie, ShieldCheck, Check, X, Sliders, ChevronDown, ChevronUp, Lock } from "lucide-react";

const STORAGE_KEY = "kraviona_cookie_consent_v1";

const DEFAULT_PREFERENCES = {
  necessary: true,
  analytics: true,
  functional: true,
  timestamp: null,
};

export default function CookieConsentBanner() {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);

  const applyConsent = useCallback((prefs) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
      document.cookie = `kraviona_cookie_consent=${prefs.analytics ? "all" : "essential"}; path=/; max-age=31536000; SameSite=Lax`;

      // Update Google Analytics Consent Mode if present
      if (typeof window !== "undefined" && typeof window.gtag === "function") {
        window.gtag("consent", "update", {
          analytics_storage: prefs.analytics ? "granted" : "denied",
          ad_storage: prefs.functional ? "granted" : "denied",
          functionality_storage: prefs.functional ? "granted" : "denied",
          security_storage: "granted",
        });
      }

      window.dispatchEvent(new CustomEvent("kraviona_consent_updated", { detail: prefs }));
    } catch {
      // Storage access might be restricted in private browsing mode
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      setMounted(true);
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setPreferences(parsed);
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
      } catch {
        setIsVisible(true);
      }
    }, 80);

    const handleOpenPreferences = () => {
      setIsVisible(true);
      setIsCustomizing(true);
    };

    window.addEventListener("open_cookie_preferences", handleOpenPreferences);
    return () => {
      clearTimeout(t);
      window.removeEventListener("open_cookie_preferences", handleOpenPreferences);
    };
  }, []);

  const handleAcceptAll = () => {
    const updated = {
      necessary: true,
      analytics: true,
      functional: true,
      timestamp: Date.now(),
    };
    setPreferences(updated);
    applyConsent(updated);
    setIsVisible(false);
    setIsCustomizing(false);
  };

  const handleRejectNonEssential = () => {
    const updated = {
      necessary: true,
      analytics: false,
      functional: false,
      timestamp: Date.now(),
    };
    setPreferences(updated);
    applyConsent(updated);
    setIsVisible(false);
    setIsCustomizing(false);
  };

  const handleSaveCustom = () => {
    const updated = {
      ...preferences,
      necessary: true,
      timestamp: Date.now(),
    };
    applyConsent(updated);
    setIsVisible(false);
    setIsCustomizing(false);
  };

  if (!mounted || !isVisible) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie Consent & Privacy Preferences"
      className="fixed bottom-4 left-4 right-4 z-[9999] max-w-2xl mx-auto sm:left-6 sm:bottom-6 sm:mx-0 shadow-2xl rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-md p-5 text-slate-800 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5"
    >
      <div className="flex items-start gap-4">
        <div className="hidden sm:flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0f5960]/10 text-[#0f5960]">
          <Cookie className="h-6 w-6" />
        </div>

        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="sm:hidden text-[#0f5960]">
                <Cookie className="h-5 w-5" />
              </span>
              We value your privacy &amp; cookie choices
            </h3>
            <button
              type="button"
              onClick={() => setIsVisible(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Close cookie banner"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Kraviona uses essential cookies to safeguard authentication and anti-bot verification (CAPTCHA). With your consent, we also use analytics and functional cookies to measure performance and improve your browsing experience. Read our{" "}
            <Link
              href="/privacy-policy#cookies"
              className="font-semibold text-[#0f5960] hover:text-[#e8622a] underline transition-colors"
            >
              Privacy Policy
            </Link>
            .
          </p>

          {/* Granular Preferences Drawer */}
          {isCustomizing && (
            <div className="mt-3 space-y-3 pt-3 border-t border-slate-100">
              {/* Essential */}
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 border border-slate-100">
                <div className="pr-3">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                    <Lock className="w-3.5 h-3.5 text-[#0f5960]" />
                    <span>Essential &amp; Security (Required)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Required for anti-bot CAPTCHA protection, CSRF prevention, and basic site navigation.
                  </p>
                </div>
                <span className="shrink-0 text-[10px] font-black uppercase tracking-wider text-slate-500 bg-slate-200/80 px-2 py-1 rounded">
                  Always Active
                </span>
              </div>

              {/* Analytics */}
              <label className="flex items-center justify-between rounded-xl bg-slate-50 p-3 border border-slate-100 cursor-pointer hover:bg-slate-100/70 transition-colors">
                <div className="pr-3">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#e8622a]" />
                    <span>Performance &amp; Analytics</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Helps us understand aggregated user traffic via Google Analytics 4.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) =>
                    setPreferences((prev) => ({ ...prev, analytics: e.target.checked }))
                  }
                  className="h-4 w-4 rounded text-[#0f5960] focus:ring-[#0f5960]"
                />
              </label>

              {/* Functional */}
              <label className="flex items-center justify-between rounded-xl bg-slate-50 p-3 border border-slate-100 cursor-pointer hover:bg-slate-100/70 transition-colors">
                <div className="pr-3">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                    <Sliders className="w-3.5 h-3.5 text-[#047857]" />
                    <span>Functional &amp; AI Assistant Memory</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Remembers your AI assistant chat window status, language, and form guidance state.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.functional}
                  onChange={(e) =>
                    setPreferences((prev) => ({ ...prev, functional: e.target.checked }))
                  }
                  className="h-4 w-4 rounded text-[#0f5960] focus:ring-[#0f5960]"
                />
              </label>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCustomizing((prev) => !prev)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#0f5960] transition-colors py-1.5 px-2 rounded-lg hover:bg-slate-100"
            >
              <Sliders className="w-3.5 h-3.5" />
              {isCustomizing ? "Hide Options" : "Customize"}
              {isCustomizing ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            <div className="flex flex-wrap items-center gap-2">
              {isCustomizing ? (
                <button
                  type="button"
                  onClick={handleSaveCustom}
                  className="rounded-xl bg-[#0f5960] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#0a454b] transition-all"
                >
                  Save Preferences
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleRejectNonEssential}
                    className="rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Only Essential
                  </button>
                  <button
                    type="button"
                    onClick={handleAcceptAll}
                    className="rounded-xl bg-[#0f5960] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#0a454b] transition-all"
                  >
                    Accept All
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
