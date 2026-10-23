"use client";

import React, { useEffect, useState, useRef } from "react";

/**
 * RobotHead3D.jsx
 * Compact, Cute, Premium White AI Robot Head (Zero Image Files).
 * Features:
 * - Desktop size: ~72px | Mobile size: ~60px
 * - Smooth, jitter-free cursor tracking using lerp interpolation in requestAnimationFrame
 * - 3–5 degree subtle 3D rotational head tilt (pitch, yaw, roll)
 * - Subtle parallax eye gaze tracking inside black rounded-rectangular face screen
 * - Reacts gracefully to hovered links, buttons, and form inputs across all pages
 * - Smoothly returns to neutral idle position when cursor is inactive
 * - Natural blinking, happy, thinking, listening, speaking, curious, and error expressions
 * - Elegant status indicator dot and greeting tooltip on first visit
 */
export default function RobotHead3D({
  expression = "idle",
  isSpeaking = false,
  viseme = 0,
  speechBubble = null,
  onClick = () => {},
  size = "md", // "sm" (60px) | "md" (72px) | "lg" (84px)
  overrideGaze = null,
}) {
  const containerRef = useRef(null);

  // Smooth interpolated coordinates for zero jitter
  const targetGazeRef = useRef({ x: 0, y: 0 });
  const currentGazeRef = useRef({ x: 0, y: 0 });
  const [renderGaze, setRenderGaze] = useState({ x: 0, y: 0 });
  const [renderTilt, setRenderTilt] = useState({ rotateX: 0, rotateY: 0, rotateZ: 0 });
  const [renderOffset, setRenderOffset] = useState({ x: 0, y: 0 });

  const [isBlinking, setIsBlinking] = useState(false);
  const [isHoveredInteractive, setIsHoveredInteractive] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);

  const idleTimerRef = useRef(null);
  const blinkTimerRef = useRef(null);
  const animFrameRef = useRef(null);

  // First visit greeting tooltip (auto dismisses after 5s or on interaction)
  useEffect(() => {
    try {
      const greeted = sessionStorage.getItem("kraviona_robot_greeted");
      if (!greeted) {
        setShowGreeting(true);
        sessionStorage.setItem("kraviona_robot_greeted", "true");
        const timer = setTimeout(() => setShowGreeting(false), 5500);
        return () => clearTimeout(timer);
      }
    } catch {}
  }, []);

  // Natural eyelid blinking loop
  useEffect(() => {
    const triggerBlink = () => {
      setIsBlinking(true);
      setTimeout(() => {
        setIsBlinking(false);
        const nextInterval = 3200 + Math.random() * 2600;
        blinkTimerRef.current = setTimeout(triggerBlink, nextInterval);
      }, 140);
    };

    blinkTimerRef.current = setTimeout(triggerBlink, 2800);
    return () => {
      if (blinkTimerRef.current) clearTimeout(blinkTimerRef.current);
    };
  }, []);

  // 60fps / 120fps Smooth Spring / Lerp Animation Loop with Zero-G Floating Bob
  useEffect(() => {
    // Respect prefers-reduced-motion
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const lerp = (start, end, factor) => start + (end - start) * factor;

    const animate = () => {
      const target = overrideGaze || targetGazeRef.current;
      const cur = currentGazeRef.current;

      // Gentle fluid spring interpolation factor (0.085) for smooth, non-jittery tracking
      cur.x = lerp(cur.x, target.x, 0.085);
      cur.y = lerp(cur.y, target.y, 0.085);

      setRenderGaze({ x: cur.x, y: cur.y });

      // Natural zero-gravity floating bobbing
      const time = performance.now() * 0.0024;
      const idleBobY = Math.sin(time) * 3.2;
      const idleBobTilt = Math.sin(time * 0.8) * 1.2;

      // Physical floating displacement towards cursor + floating bob
      setRenderOffset({
        x: cur.x * 12,
        y: cur.y * 10 + idleBobY,
      });

      // Responsive 3D head tilt: turns face up to 16 degrees toward cursor!
      setRenderTilt({
        rotateY: cur.x * 16,
        rotateX: -cur.y * 14,
        rotateZ: cur.x * 3.5 + idleBobTilt,
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [overrideGaze]);

  // Global Pointer & Interactive Element Hover Tracking Across All Pages
  useEffect(() => {
    const resetToNeutral = () => {
      targetGazeRef.current = { x: 0, y: 0 };
      setIsHoveredInteractive(false);
    };

    const handlePointerMove = (e) => {
      if (!containerRef.current) return;

      const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX);
      const clientY = e.clientY ?? (e.touches && e.touches[0]?.clientY);
      if (clientX === undefined || clientY === undefined) return;

      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = clientX - centerX;
      const deltaY = clientY - centerY;
      const distance = Math.hypot(deltaX, deltaY) || 1;

      // Viewport reach calculation
      const maxDistance = Math.max(window.innerWidth, window.innerHeight) * 0.85;
      const intensity = Math.min(1, Math.max(0.12, distance / maxDistance));
      const nx = (deltaX / distance) * intensity;
      const ny = (deltaY / distance) * intensity;

      targetGazeRef.current = { x: nx, y: ny };

      // Idle return: smooth glide back to neutral after 3.2s of no pointer movement
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(resetToNeutral, 3200);
    };

    // Detect hovered interactive links, buttons, and inputs for gentle focused look
    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target || !(target instanceof HTMLElement)) return;

      const interactive = target.closest("a, button, input, textarea, select, [role='button'], .card");
      if (interactive && containerRef.current) {
        setIsHoveredInteractive(true);
        const iRect = interactive.getBoundingClientRect();
        const cRect = containerRef.current.getBoundingClientRect();

        const deltaX = (iRect.left + iRect.width / 2) - (cRect.left + cRect.width / 2);
        const deltaY = (iRect.top + iRect.height / 2) - (cRect.top + cRect.height / 2);
        const dist = Math.hypot(deltaX, deltaY) || 1;

        targetGazeRef.current = {
          x: Math.max(-1, Math.min(1, deltaX / Math.min(dist, 700))),
          y: Math.max(-1, Math.min(1, deltaY / Math.min(dist, 700))),
        };
      }
    };

    const handleMouseOut = (e) => {
      const target = e.target;
      if (target && target.closest && target.closest("a, button, input, textarea, select, [role='button'], .card")) {
        setIsHoveredInteractive(false);
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    window.addEventListener("touchmove", handlePointerMove, { passive: true });
    document.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mouseout", handleMouseOut, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("touchmove", handlePointerMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, []);

  // Desktop: ~54px (compact, non-intrusive) | Mobile: ~46px
  const sizeClasses = {
    sm: "w-9 h-9 sm:w-10 sm:h-10",
    md: "w-[46px] h-[46px] sm:w-[54px] sm:h-[54px]",
    lg: "w-14 h-14 sm:w-16 sm:h-16",
  }[size] || "w-[46px] h-[46px] sm:w-[54px] sm:h-[54px]";

  // Fluid Parallax Eye Shift inside Visor
  const eyeShiftX = renderGaze.x * 5.2;
  const eyeShiftY = renderGaze.y * 3.8;
  const eyeScaleY = isBlinking ? 0.08 : 1;

  // Active expression (combines props and interactive hover state)
  const activeExpression = isHoveredInteractive && expression === "idle" ? "curious" : expression;

  // Render Mouth inside dark visor
  const renderMouth = () => {
    if (isSpeaking) {
      // Audio viseme mouth opening and waveform dynamics
      const openAmount = 52 + (viseme || 0.4) * 8;
      const width = 42 - (viseme || 0.4) * 3;
      return (
        <path
          d={`M ${width} 52 Q 50 ${openAmount + 2} ${100 - width} 52 Q 50 ${openAmount - 2} ${width} 52 Z`}
          fill="#00F2FE"
          filter="url(#robotHeadCyanGlow)"
          className="transition-all duration-75"
        />
      );
    }

    if (activeExpression === "happy") {
      return (
        <path
          d="M 40 51 Q 50 63 60 51 Z"
          fill="#00F2FE"
          filter="url(#robotHeadCyanGlow)"
        />
      );
    }

    if (activeExpression === "curious") {
      return (
        <ellipse
          cx="50"
          cy="54"
          rx="4"
          ry="3.5"
          fill="none"
          stroke="#00F2FE"
          strokeWidth="2.5"
          filter="url(#robotHeadCyanGlow)"
        />
      );
    }

    if (activeExpression === "error") {
      return (
        <path
          d="M 43 55 Q 50 51 57 55"
          fill="none"
          stroke="#00F2FE"
          strokeWidth="2.5"
          strokeLinecap="round"
          filter="url(#robotHeadCyanGlow)"
        />
      );
    }

    // Idle neutral curved smile
    return (
      <path
        d="M 43 52 Q 50 57 57 52"
        fill="none"
        stroke="#00F2FE"
        strokeWidth="2.8"
        strokeLinecap="round"
        filter="url(#robotHeadCyanGlow)"
      />
    );
  };

  // Render Eyes inside dark visor
  const renderEyes = () => {
    if (activeExpression === "happy") {
      return (
        <g
          transform={`translate(${eyeShiftX}, ${eyeShiftY}) scale(1, ${eyeScaleY})`}
          style={{ transformOrigin: "50px 36px" }}
        >
          <path
            d="M 31 38 Q 38 28 45 38"
            fill="none"
            stroke="#00F2FE"
            strokeWidth="3.6"
            strokeLinecap="round"
            filter="url(#robotHeadCyanGlow)"
          />
          <path
            d="M 55 38 Q 62 28 69 38"
            fill="none"
            stroke="#00F2FE"
            strokeWidth="3.6"
            strokeLinecap="round"
            filter="url(#robotHeadCyanGlow)"
          />
        </g>
      );
    }

    if (activeExpression === "thinking") {
      return (
        <g
          transform={`translate(${eyeShiftX - 1}, ${eyeShiftY - 2.5}) scale(1, ${eyeScaleY})`}
          style={{ transformOrigin: "50px 34px" }}
        >
          <ellipse cx="38" cy="34" rx="6.5" ry="8.5" fill="#00F2FE" filter="url(#robotHeadCyanGlow)" />
          <ellipse cx="62" cy="34" rx="6.5" ry="8.5" fill="#00F2FE" filter="url(#robotHeadCyanGlow)" />
          {/* Subtle thinking ring indicator */}
          <circle
            cx="50"
            cy="17"
            r="4"
            fill="none"
            stroke="#00F2FE"
            strokeWidth="1.6"
            strokeDasharray="4 3"
            className="animate-spin"
            style={{ transformOrigin: "50px 17px", animationDuration: "1.6s" }}
            filter="url(#robotHeadCyanGlow)"
          />
        </g>
      );
    }

    if (activeExpression === "listening") {
      return (
        <g
          transform={`translate(${eyeShiftX}, ${eyeShiftY}) scale(1, ${eyeScaleY})`}
          style={{ transformOrigin: "50px 36px" }}
          className="animate-pulse"
        >
          <ellipse cx="38" cy="36" rx="7.5" ry="9.5" fill="#00F2FE" filter="url(#robotHeadCyanGlow)" />
          <ellipse cx="36" cy="33" rx="2.2" ry="3.2" fill="#FFFFFF" opacity="0.9" />
          <ellipse cx="62" cy="36" rx="7.5" ry="9.5" fill="#00F2FE" filter="url(#robotHeadCyanGlow)" />
          <ellipse cx="60" cy="33" rx="2.2" ry="3.2" fill="#FFFFFF" opacity="0.9" />
        </g>
      );
    }

    // Default & curious: Glowing cyan pill eyes
    const rx = activeExpression === "curious" ? 7.2 : 6.8;
    const ry = activeExpression === "curious" ? 9.2 : 8.6;

    return (
      <g
        transform={`translate(${eyeShiftX}, ${eyeShiftY}) scale(1, ${eyeScaleY})`}
        style={{ transformOrigin: "50px 36px" }}
      >
        {/* Left Eye */}
        <ellipse cx="38" cy="36" rx={rx} ry={ry} fill="#00F2FE" filter="url(#robotHeadCyanGlow)" />
        <ellipse cx="36" cy="33" rx="2.2" ry="3.2" fill="#FFFFFF" opacity="0.85" />

        {/* Right Eye */}
        <ellipse cx="62" cy="36" rx={rx} ry={ry} fill="#00F2FE" filter="url(#robotHeadCyanGlow)" />
        <ellipse cx="60" cy="33" rx="2.2" ry="3.2" fill="#FFFFFF" opacity="0.85" />
      </g>
    );
  };

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      className={`relative cursor-pointer select-none transition-transform duration-200 hover:scale-105 active:scale-95 bg-transparent border-0 shadow-none ${sizeClasses}`}
      style={{ perspective: "600px" }}
      role="button"
      tabIndex={0}
      aria-label="Kraviona AI Assistant"
    >
      {/* Small Subtle Cyan Accent Status Indicator Dot */}
      <span className="absolute -top-0.5 -right-0.5 z-20 flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F2FE] opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00F2FE] shadow-[0_0_6px_#00F2FE]" />
      </span>

      {/* 3D Floating Bobbing Head Assembly */}
      <div
        className="relative w-full h-full will-change-transform bg-transparent"
        style={{
          transform: `translate3d(${renderOffset.x}px, ${renderOffset.y}px, 0px) rotateY(${renderTilt.rotateY}deg) rotateX(${renderTilt.rotateX}deg) rotateZ(${renderTilt.rotateZ}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Left Ear Audio Module with Glowing Cyan Ring */}
        <div
          className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-2.5 h-4.5 sm:w-3 sm:h-5 rounded-l-full bg-gradient-to-r from-slate-200 to-white shadow-sm flex items-center justify-center border-l border-y border-slate-300"
          style={{ transform: "translateZ(-3px)" }}
        >
          <div className="w-0.5 sm:w-1 h-3 rounded-full bg-[#00F2FE] shadow-[0_0_5px_#00F2FE]" />
        </div>

        {/* Right Ear Audio Module with Glowing Cyan Ring */}
        <div
          className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-2.5 h-4.5 sm:w-3 sm:h-5 rounded-r-full bg-gradient-to-l from-slate-200 to-white shadow-sm flex items-center justify-center border-r border-y border-slate-300"
          style={{ transform: "translateZ(-3px)" }}
        >
          <div className="w-0.5 sm:w-1 h-3 rounded-full bg-[#00F2FE] shadow-[0_0_5px_#00F2FE]" />
        </div>

        {/* Main Glossy Pearlescent White Ceramic Head Shell */}
        <div
          className="relative w-full h-full rounded-[44%_44%_46%_46%] bg-gradient-to-b from-white via-[#F4F7F9] to-[#DCE4E9] shadow-[0_6px_16px_rgba(15,89,96,0.2),inset_0_2px_5px_rgba(255,255,255,0.9),inset_0_-3px_6px_rgba(160,180,195,0.3)] border border-white flex items-center justify-center overflow-hidden"
          style={{ transform: "translateZ(0px)" }}
        >
          {/* Top Ceramic Glare Specular Highlight */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-4/5 h-4 sm:h-5 rounded-full bg-gradient-to-b from-white/95 to-transparent blur-[0.5px] pointer-events-none" />

          {/* Black, Rounded-Rectangular Face Screen */}
          <div
            className="relative w-[77%] h-[63%] rounded-[36%_36%_42%_42%] bg-gradient-to-b from-[#0A1114] via-[#050B0D] to-[#0D181D] shadow-[inset_0_3px_8px_rgba(0,0,0,0.85),0_1.5px_3px_rgba(255,255,255,0.7)] border border-slate-700/60 overflow-hidden flex items-center justify-center"
            style={{ transform: "translateZ(5px)" }}
          >
            {/* Glass Glare Diagonal Reflection with Subtle Opposite Parallax */}
            <div
              className="absolute -top-8 -left-8 w-20 h-28 bg-gradient-to-r from-transparent via-white/14 to-transparent pointer-events-none will-change-transform"
              style={{
                transform: `translate3d(${-renderOffset.x * 0.35}px, ${-renderOffset.y * 0.25}px, 0px) rotate(35deg)`,
              }}
            />

            {/* Glowing Cyan Face Optics (Eyes & Mouth SVG) */}
            <svg
              viewBox="0 0 100 80"
              className="w-full h-full relative z-10"
              aria-hidden="true"
            >
              <defs>
                <filter id="robotHeadCyanGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="1.8" result="blur" />
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
        </div>

        {/* Ambient Halo Pulse when Speaking */}
        {isSpeaking && (
          <div className="absolute inset-0 rounded-[44%] bg-[#00F2FE]/25 filter blur-lg pointer-events-none animate-pulse" />
        )}
      </div>

      {/* Ground Shadow below floating widget */}
      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3/4 h-2 rounded-full bg-[#0f5960]/20 blur-[2px] pointer-events-none" />
    </div>
  );
}
