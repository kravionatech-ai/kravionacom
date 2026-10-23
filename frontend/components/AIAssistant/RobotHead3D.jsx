"use client";

import React, { useEffect, useState, useRef } from "react";

/**
 * RobotHead3D.jsx
 * 100% Code-Rendered 3D Robot Head Model (ZERO images used).
 * Built with pure CSS 3D transforms, SVG vector optics, and ambient lighting.
 * Features:
 * - 3D head pitch & yaw orientation tracking the visitor's cursor
 * - Glossy white ceramic head shell with metallic ear pods and glowing cyan LED rings
 * - Dark curved visor screen with glass glare reflection
 * - Glowing cyan eyes with natural blinking and pupil gaze direction
 * - Dynamic mouth viseme synced to speech
 * - Floating hover physics and soft ground shadow
 */
export default function RobotHead3D({
  expression = "idle",
  isSpeaking = false,
  viseme = 0,
  speechBubble = null,
  onClick = () => {},
  size = "md", // "sm" | "md" | "lg"
  overrideGaze = null,
}) {
  const headRef = useRef(null);
  const [gaze, setGaze] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, rotateZ: 0 });
  const [isBlinking, setIsBlinking] = useState(false);
  const blinkTimeoutRef = useRef(null);

  // Natural eyelid blinking loop
  useEffect(() => {
    const triggerBlink = () => {
      setIsBlinking(true);
      setTimeout(() => {
        setIsBlinking(false);
        const next = 3200 + Math.random() * 2600;
        blinkTimeoutRef.current = setTimeout(triggerBlink, next);
      }, 130);
    };

    blinkTimeoutRef.current = setTimeout(triggerBlink, 2500);
    return () => {
      if (blinkTimeoutRef.current) clearTimeout(blinkTimeoutRef.current);
    };
  }, []);

  // Global cursor tracking to rotate head in 3D space
  useEffect(() => {
    if (overrideGaze) {
      setGaze(overrideGaze);
      setTilt({
        rotateY: overrideGaze.x * 16,
        rotateX: -overrideGaze.y * 12,
        rotateZ: overrideGaze.x * 3,
      });
      return;
    }

    const handlePointerMove = (e) => {
      if (!headRef.current) return;
      const rect = headRef.current.getBoundingClientRect();
      const headCenterX = rect.left + rect.width / 2;
      const headCenterY = rect.top + rect.height / 2;

      const deltaX = e.clientX - headCenterX;
      const deltaY = e.clientY - headCenterY;
      const distance = Math.hypot(deltaX, deltaY) || 1;

      const maxDist = 700;
      const intensity = Math.min(1, distance / maxDist);
      const nx = (deltaX / distance) * intensity;
      const ny = (deltaY / distance) * intensity;

      setGaze({ x: nx, y: ny });

      // 3D head pitch (X), yaw (Y), roll (Z)
      setTilt({
        rotateY: nx * 18,
        rotateX: -ny * 14,
        rotateZ: nx * 4,
      });
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [overrideGaze]);

  // Dimensions configuration
  const scaleClass = {
    sm: "w-20 h-20 sm:w-24 sm:h-24",
    md: "w-28 h-28 sm:w-32 sm:h-32",
    lg: "w-36 h-36 sm:w-44 sm:h-44",
  }[size] || "w-28 h-28 sm:w-32 sm:h-32";

  // Eye gaze offsets in pixels
  const eyeShiftX = Math.max(-1, Math.min(1, gaze.x)) * 5.5;
  const eyeShiftY = Math.max(-1, Math.min(1, gaze.y)) * 4;
  const eyeScaleY = isBlinking ? 0.08 : 1;

  // Mouth rendering inside dark visor
  const renderMouth = () => {
    if (isSpeaking) {
      // Audio viseme mouth opening and waveform dynamics
      const openAmount = 52 + (viseme || 0.4) * 9;
      const width = 42 - (viseme || 0.4) * 3;
      return (
        <path
          d={`M ${width} 52 Q 50 ${openAmount + 2} ${100 - width} 52 Q 50 ${openAmount - 2} ${width} 52 Z`}
          fill="#00F2FE"
          filter="url(#robotCyanGlow)"
          className="transition-all duration-75"
        />
      );
    }

    if (expression === "happy") {
      return (
        <path
          d="M 40 51 Q 50 63 60 51 Z"
          fill="#00F2FE"
          filter="url(#robotCyanGlow)"
        />
      );
    }

    if (expression === "curious") {
      return (
        <ellipse
          cx="50"
          cy="54"
          rx="4.5"
          ry="4"
          fill="none"
          stroke="#00F2FE"
          strokeWidth="2.5"
          filter="url(#robotCyanGlow)"
        />
      );
    }

    // Idle relaxed curved smile
    return (
      <path
        d="M 42 52 Q 50 58 58 52"
        fill="none"
        stroke="#00F2FE"
        strokeWidth="3"
        strokeLinecap="round"
        filter="url(#robotCyanGlow)"
      />
    );
  };

  // Eyes rendering inside dark visor
  const renderEyes = () => {
    if (expression === "happy") {
      return (
        <g
          transform={`translate(${eyeShiftX}, ${eyeShiftY}) scale(1, ${eyeScaleY})`}
          style={{ transformOrigin: "50px 36px" }}
          className="transition-transform duration-100 ease-out"
        >
          <path
            d="M 30 38 Q 38 27 46 38"
            fill="none"
            stroke="#00F2FE"
            strokeWidth="4"
            strokeLinecap="round"
            filter="url(#robotCyanGlow)"
          />
          <path
            d="M 54 38 Q 62 27 70 38"
            fill="none"
            stroke="#00F2FE"
            strokeWidth="4"
            strokeLinecap="round"
            filter="url(#robotCyanGlow)"
          />
        </g>
      );
    }

    if (expression === "thinking") {
      return (
        <g
          transform={`translate(${eyeShiftX - 1}, ${eyeShiftY - 3}) scale(1, ${eyeScaleY})`}
          style={{ transformOrigin: "50px 34px" }}
          className="transition-transform duration-150 ease-out"
        >
          <ellipse cx="38" cy="33" rx="7" ry="9" fill="#00F2FE" filter="url(#robotCyanGlow)" />
          <ellipse cx="62" cy="33" rx="7" ry="9" fill="#00F2FE" filter="url(#robotCyanGlow)" />
          <circle
            cx="50"
            cy="16"
            r="4.5"
            fill="none"
            stroke="#00F2FE"
            strokeWidth="1.8"
            strokeDasharray="4 3"
            className="animate-spin"
            style={{ transformOrigin: "50px 16px", animationDuration: "1.8s" }}
            filter="url(#robotCyanGlow)"
          />
        </g>
      );
    }

    // Default glowing cyan eyes
    return (
      <g
        transform={`translate(${eyeShiftX}, ${eyeShiftY}) scale(1, ${eyeScaleY})`}
        style={{ transformOrigin: "50px 36px" }}
        className="transition-transform duration-100 ease-out"
      >
        {/* Left Eye */}
        <ellipse cx="38" cy="36" rx="7.5" ry="9" fill="#00F2FE" filter="url(#robotCyanGlow)" />
        <ellipse cx="36" cy="33" rx="2.5" ry="3.5" fill="#FFFFFF" opacity="0.85" />

        {/* Right Eye */}
        <ellipse cx="62" cy="36" rx="7.5" ry="9" fill="#00F2FE" filter="url(#robotCyanGlow)" />
        <ellipse cx="60" cy="33" rx="2.5" ry="3.5" fill="#FFFFFF" opacity="0.85" />
      </g>
    );
  };

  return (
    <div
      ref={headRef}
      onClick={onClick}
      className={`relative cursor-pointer select-none ${scaleClass}`}
      style={{ perspective: "1000px" }}
      role="button"
      tabIndex={0}
      aria-label="Kraviona 3D AI Voice Assistant"
    >
      {/* Dynamic Speech Bubble */}
      {speechBubble && (
        <div
          className="absolute -top-16 -left-32 sm:-left-44 w-52 sm:w-60 p-2.5 rounded-2xl bg-white/95 backdrop-blur-md border border-teal-900/15 shadow-xl text-[11px] sm:text-xs text-slate-800 pointer-events-none z-30 animate-in fade-in slide-in-from-bottom-2"
          style={{ transformOrigin: "bottom right" }}
        >
          <div className="flex items-center gap-1.5 mb-1 text-[9.5px] font-bold uppercase tracking-wider text-[#0f5960]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#00F2FE] animate-pulse" />
            Kraviona Voice
          </div>
          <p className="line-clamp-3 leading-snug font-medium text-slate-700">
            {speechBubble}
          </p>
          <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white border-b border-r border-teal-900/15 transform rotate-45" />
        </div>
      )}

      {/* 3D Floating Bobbing Head Assembly */}
      <div
        className="relative w-full h-full transition-transform duration-150 ease-out"
        style={{
          transform: `rotateY(${tilt.rotateY}deg) rotateX(${tilt.rotateX}deg) rotateZ(${tilt.rotateZ}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Left Ear Audio Sensor Module */}
        <div
          className="absolute top-1/2 -left-2 sm:-left-2.5 -translate-y-1/2 w-4 h-9 sm:w-5 sm:h-11 rounded-l-full bg-gradient-to-r from-slate-300 via-slate-100 to-white shadow-md flex items-center justify-center border-l border-y border-slate-300/80"
          style={{ transform: "translateZ(-8px)" }}
        >
          <div className="w-1.5 h-6 sm:w-2 sm:h-7 rounded-full bg-[#00F2FE] shadow-[0_0_8px_#00F2FE] opacity-90 animate-pulse" />
        </div>

        {/* Right Ear Audio Sensor Module */}
        <div
          className="absolute top-1/2 -right-2 sm:-right-2.5 -translate-y-1/2 w-4 h-9 sm:w-5 sm:h-11 rounded-r-full bg-gradient-to-l from-slate-300 via-slate-100 to-white shadow-md flex items-center justify-center border-r border-y border-slate-300/80"
          style={{ transform: "translateZ(-8px)" }}
        >
          <div className="w-1.5 h-6 sm:w-2 sm:h-7 rounded-full bg-[#00F2FE] shadow-[0_0_8px_#00F2FE] opacity-90 animate-pulse" />
        </div>

        {/* Main Glossy Pearlescent White Ceramic Head Dome */}
        <div
          className="relative w-full h-full rounded-[44%_44%_46%_46%] bg-gradient-to-b from-[#FFFFFF] via-[#F1F5F8] to-[#D5DFE6] shadow-[0_12px_28px_rgba(15,89,96,0.22),inset_0_4px_8px_rgba(255,255,255,0.9),inset_0_-6px_12px_rgba(160,180,195,0.4)] border border-white flex items-center justify-center overflow-hidden"
          style={{ transform: "translateZ(0px)" }}
        >
          {/* Top Ceramic Specular Glare Highlight */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3/4 h-8 rounded-full bg-gradient-to-b from-white/95 to-transparent blur-[1px] pointer-events-none" />

          {/* Ambient Lighting Accent on Head Brow */}
          <div className="absolute top-3 w-16 h-1 rounded-full bg-slate-300/40" />

          {/* Recessed Dark Visor Face Screen */}
          <div
            className="relative w-[78%] h-[64%] rounded-[38%_38%_44%_44%] bg-gradient-to-b from-[#0A1114] via-[#050B0D] to-[#0D181D] shadow-[inset_0_4px_10px_rgba(0,0,0,0.85),0_2px_4px_rgba(255,255,255,0.7)] border border-slate-700/60 overflow-hidden flex items-center justify-center"
            style={{ transform: "translateZ(8px)" }}
          >
            {/* Visor Diagonal Glass Glare Reflection */}
            <div className="absolute -top-10 -left-10 w-28 h-40 bg-gradient-to-r from-transparent via-white/12 to-transparent transform rotate-35 pointer-events-none" />

            {/* Glowing Cyan Face Optics (Eyes & Mouth SVG) */}
            <svg
              viewBox="0 0 100 80"
              className="w-full h-full relative z-10"
              aria-hidden="true"
            >
              <defs>
                <filter id="robotCyanGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="2.2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Eyes */}
              {renderEyes()}

              {/* Mouth */}
              {renderMouth()}
            </svg>
          </div>

          {/* Bottom Chin Subtle Bevel */}
          <div className="absolute bottom-1.5 w-10 h-1 rounded-full bg-slate-300/60" />
        </div>

        {/* Ambient Halo Pulse when Speaking */}
        {isSpeaking && (
          <div className="absolute inset-0 rounded-[44%] bg-[#00F2FE]/20 filter blur-xl pointer-events-none animate-pulse" />
        )}
      </div>

      {/* Soft Ground Shadow Below Floating Head */}
      <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-3/4 h-3 rounded-full bg-[#0f5960]/20 blur-[3px] pointer-events-none transform scale-95 transition-all duration-300" />
    </div>
  );
}
