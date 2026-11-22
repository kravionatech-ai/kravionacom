"use client";

import React, { useState, useEffect, useCallback } from "react";
import { RotateCw, ShieldCheck, AlertCircle } from "lucide-react";
import { apiUrl } from "./api";

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

      const res = await fetch(apiUrl(`captcha?t=${Date.now()}`));
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
      <div className="flex items-center justify-between text-xs font-semibold text-slate-300 tracking-wide uppercase">
        <span className="flex items-center gap-1.5 text-slate-200">
          <ShieldCheck className="w-4 h-4 text-[#e8622a]" />
          Security Verification (Anti-Bot)
        </span>
        <button
          type="button"
          onClick={fetchCaptcha}
          disabled={loading}
          className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
          title="Get a new security challenge"
        >
          <RotateCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Captcha Image / SVG Display */}
        <div className="relative flex items-center justify-center min-w-[170px] h-[48px] rounded-xl bg-slate-50 border border-slate-200 overflow-hidden shadow-inner">
          {loading ? (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <RotateCw className="w-4 h-4 animate-spin text-[#0f5960]" />
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
            <span className="text-xs font-mono font-bold text-slate-800">
              {captchaData?.question || "Solve equation"}
            </span>
          )}
        </div>

        {/* Captcha Input */}
        <div className="flex-1">
          <input
            type="text"
            inputMode="numeric"
            value={userAnswer}
            onChange={handleInputChange}
            placeholder="Enter answer"
            required
            className={`w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-800 outline-none transition-all placeholder:text-slate-400 placeholder:font-normal focus:border-[#0f5960] focus:ring-2 focus:ring-[#0f5960]/20 ${inputClassName}`}
          />
        </div>
      </div>
      <p className="text-[11px] text-slate-400">
        Solve the math puzzle above to verify your admin sign-in.
      </p>
    </div>
  );
}
