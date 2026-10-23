"use client";

import React, { useState } from "react";
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Square,
  Settings2,
  ChevronDown,
  Gauge,
  Sparkles,
} from "lucide-react";

/**
 * AssistantVoiceControls.jsx
 * Comprehensive voice control toolbar providing:
 * - Voice Enable / Disable toggle
 * - Stop Speaking, Pause, Resume, and Mute
 * - Speech Speed selector (0.8x, 1.0x, 1.2x, 1.5x)
 * - Voice selector for natural female voices
 */
export default function AssistantVoiceControls({
  voiceEnabled = true,
  onToggleVoice = () => {},
  isSpeaking = false,
  isPaused = false,
  isMuted = false,
  onStop = () => {},
  onPause = () => {},
  onResume = () => {},
  onToggleMute = () => {},
  speed = 1.0,
  onChangeSpeed = () => {},
  voices = [],
  selectedVoiceURI = null,
  onSelectVoice = () => {},
}) {
  const [showSettings, setShowSettings] = useState(false);

  // Filter female / english / natural voices for a clean dropdown
  const femaleFriendlyVoices = voices.filter(
    (v) =>
      /natural|online|female|samantha|ava|jenny|swara|karen|victoria|google/i.test(v.name) ||
      v.lang.startsWith("en") ||
      v.lang.startsWith("hi")
  );

  return (
    <div className="bg-slate-50 border-t border-slate-200/90 px-3 py-2 text-slate-700">
      <div className="flex items-center justify-between gap-2">
        {/* Playback Action Buttons */}
        <div className="flex items-center gap-1">
          {/* Main Voice Toggle */}
          <button
            onClick={onToggleVoice}
            title={voiceEnabled ? "Voice Enabled" : "Voice Disabled"}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
              voiceEnabled
                ? "bg-teal-50 text-[#0f5960] border border-teal-200 hover:bg-teal-100"
                : "bg-slate-200/70 text-slate-500 hover:bg-slate-300/80"
            }`}
            aria-label="Toggle AI Voice"
          >
            {voiceEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#0f5960]" />
                <span className="text-[10px] hidden sm:inline">Voice On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[10px] hidden sm:inline">Muted</span>
              </>
            )}
          </button>

          {/* Stop Button */}
          {isSpeaking && (
            <button
              onClick={onStop}
              title="Stop Speaking"
              className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-colors"
              aria-label="Stop Speaking"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
            </button>
          )}

          {/* Pause / Resume Button */}
          {isSpeaking && (
            <button
              onClick={isPaused ? onResume : onPause}
              title={isPaused ? "Resume Speaking" : "Pause Speaking"}
              className="p-1.5 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 transition-colors"
              aria-label={isPaused ? "Resume Speaking" : "Pause Speaking"}
            >
              {isPaused ? <Play className="w-3.5 h-3.5 fill-current" /> : <Pause className="w-3.5 h-3.5 fill-current" />}
            </button>
          )}
        </div>

        {/* Live Audio Status Waveform */}
        <div className="flex-1 flex items-center justify-center">
          {isSpeaking ? (
            <div className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-[#0f5960] text-[9.5px] font-semibold animate-pulse">
              <span className="w-1 h-2 bg-[#0f5960] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1 h-3.5 bg-[#00F2FE] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1 h-2 bg-[#0f5960] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              <span className="ml-1 text-[9px] font-bold">Speaking</span>
            </div>
          ) : (
            <span className="text-[9.5px] text-slate-400 font-medium">Female AI Voice</span>
          )}
        </div>

        {/* Settings Dropdown Button */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowSettings(!showSettings)}
            title="Voice Speed & Settings"
            className={`p-1.5 rounded-lg transition-colors flex items-center gap-0.5 text-slate-600 ${
              showSettings ? "bg-slate-200 text-[#0f5960]" : "hover:bg-slate-200/80"
            }`}
            aria-label="Voice settings"
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span className="text-[10px] font-medium">{speed}x</span>
            <ChevronDown className={`w-3 h-3 transition-transform ${showSettings ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>

      {/* Expanded Voice Settings Panel */}
      {showSettings && (
        <div className="mt-2 pt-2 border-t border-slate-200 space-y-2 animate-in fade-in slide-in-from-top-1 text-xs">
          {/* Speed Selector */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
              <Gauge className="w-3 h-3" /> Pacing Speed
            </span>
            <div className="flex items-center gap-1">
              {[0.8, 1.0, 1.2, 1.5].map((rate) => (
                <button
                  key={rate}
                  onClick={() => onChangeSpeed(rate)}
                  className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all ${
                    speed === rate
                      ? "bg-[#0f5960] text-white shadow-xs font-bold"
                      : "bg-slate-200/70 text-slate-600 hover:bg-slate-300/80"
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>

          {/* Voice Dropdown */}
          {femaleFriendlyVoices.length > 0 && (
            <div>
              <label className="block text-[10px] font-semibold text-slate-500 mb-1">
                Preferred Voice Model
              </label>
              <select
                value={selectedVoiceURI || ""}
                onChange={(e) => onSelectVoice(e.target.value)}
                className="w-full text-[10px] bg-white border border-slate-200 rounded-lg p-1.5 text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0f5960]"
              >
                {femaleFriendlyVoices.map((v) => (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
