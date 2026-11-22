"use client";

import React, { useState, useEffect, useCallback } from "react";
import { RotateCw, ShieldCheck, AlertCircle } from "lucide-react";
import { API_URL } from "@/utils/api";

export default function CaptchaBox({
  onCaptchaChange,
  refreshTrigger = 0,
  className = "",
  inputClassName = "",
}) {
  const [captchaData, setCaptchaData] = useState(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  const fetchCaptcha = useCallback(async () => {
    try {
      setLoading(true);
      setFetchError(false);
      setUserAnswer("");
      if (onCaptchaChange) {
        onCaptchaChange({ token: "", answer: "" });
      }

      const res = await fetch(`${API_URL}/captcha?t=${Date.now()}`);
      const json = await res.json();

      if (json.success && json.data) {
        setCaptchaData(json.data);
      } else {
        setFetchError(true);
      }
    } catch {
      setFetchError(true);
    } finally {
      setLoading(false);
    }
  }, [onCaptchaChange]);

  useEffect(() => {
    fetchCaptcha();
  }, [fetchCaptcha, refreshTrigger]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setUserAnswer(val);
    if (onCaptchaChange && captchaData?.token) {
      onCaptchaChange({
        token: captchaData.token,
        answer: val.trim(),
      });
    }
  };

  return (
    <div className={`space-y-2 select-none ${className}`}>
      <div className="flex items-center justify-between text-xs font-semibold text-gray-700 tracking-wide uppercase">
        <span className="flex items-center gap-1.5 text-primary">
          <ShieldCheck className="w-4 h-4 text-accent" />
          Security Verification (Anti-Bot)
        </span>
        <button
          type="button"
          onClick={fetchCaptcha}
          disabled={loading}
          className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-500 hover:text-primary transition-colors cursor-pointer disabled:opacity-50"
          title="Get a new security challenge"
        >
          <RotateCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Captcha Image / SVG Display */}
        <div className="relative flex items-center justify-center min-w-[196px] h-[52px] rounded-xl bg-slate-50 border border-slate-300 overflow-hidden shadow-inner">
          {loading ? (
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <RotateCw className="w-4 h-4 animate-spin text-primary" />
              <span>Generating...</span>
            </div>
          ) : fetchError ? (
            <button
              type="button"
              onClick={fetchCaptcha}
              className="flex items-center gap-1.5 text-xs text-rose-500 font-medium hover:underline p-1"
            >
              <AlertCircle className="w-4 h-4" />
              Retry Challenge
            </button>
          ) : captchaData?.svg ? (
            <div
              className="w-full h-full flex items-center justify-center pointer-events-none"
              dangerouslySetInnerHTML={{ __html: captchaData.svg }}
            />
          ) : (
            <span className="text-xs font-mono font-bold text-primary">
              {captchaData?.question || "Security Challenge"}
            </span>
          )}
        </div>

        {/* Captcha Input */}
        <div className="flex-1">
          <input
            type="text"
            inputMode="text"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck="false"
            autoComplete="off"
            value={userAnswer}
            onChange={handleInputChange}
            placeholder="Enter 6-character code"
            required
            maxLength={10}
            className={`w-full rounded-xl border border-primary/20 bg-white px-4 py-3 font-mono font-bold tracking-widest text-primary outline-none transition-all placeholder:text-gray-400 placeholder:font-sans placeholder:tracking-normal placeholder:font-normal focus:border-primary focus:ring-2 focus:ring-primary/20 ${inputClassName}`}
          />
        </div>
      </div>
      <p className="text-[11px] text-gray-500">
        Type the 6 distorted anti-bot characters shown above (case-insensitive).
      </p>
    </div>
  );
}
