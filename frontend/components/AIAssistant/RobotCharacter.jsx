"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import RobotFaceOverlay from "./RobotFaceOverlay";

/**
 * RobotCharacter.jsx
 * The primary visual character of the Kraviona AI Assistant.
 * Handles:
 * - High-resolution render of the white robot body.
 * - Interactive head tilt and eye gaze tracking toward visitor cursor.
 * - Precision positioning of the facial expression overlay.
 * - Guidance speech bubble and floating shadow.
 */
export default function RobotCharacter({
  expression = "idle",
  isSpeaking = false,
  viseme = 0,
  speechBubble = null,
  onClick = () => {},
  size = "md", // "sm" | "md" | "lg"
  overrideGaze = null, // External gaze target (e.g. from active form field)
}) {
  const containerRef = useRef(null);
  const [gaze, setGaze] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  // Global mouse pointer tracking for realistic eye contact
  useEffect(() => {
    if (overrideGaze) {
      setGaze(overrideGaze);
      return;
    }

    const handlePointerMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const robotCenterX = rect.left + rect.width / 2;
      const robotCenterY = rect.top + rect.height * 0.3; // Eye level

      const deltaX = e.clientX - robotCenterX;
      const deltaY = e.clientY - robotCenterY;
      const distance = Math.hypot(deltaX, deltaY) || 1;

      // Normalized gaze offset clamped to [-1, 1]
      const maxDistance = 600;
      const intensity = Math.min(1, distance / maxDistance);
      const nx = (deltaX / distance) * intensity;
      const ny = (deltaY / distance) * intensity;

      setGaze({ x: nx, y: ny });

      // Subtle 3D tilt orientation for head and body (max 8 degrees)
      setTilt({
        rotateY: nx * 9,
        rotateX: -ny * 7,
      });
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [overrideGaze]);

  // Size configurations
  const dimensions = {
    sm: "w-20 h-20 sm:w-24 sm:h-24",
    md: "w-28 h-28 sm:w-32 sm:h-32",
    lg: "w-40 h-40 sm:w-48 sm:h-48",
  }[size] || "w-28 h-28 sm:w-32 sm:h-32";

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      className={`relative cursor-pointer select-none transition-transform duration-300 ease-out hover:scale-105 ${dimensions}`}
      style={{
        perspective: "800px",
      }}
      role="button"
      tabIndex={0}
      aria-label="Kraviona AI Voice Assistant"
    >
      {/* Dynamic Guidance / Spoken Speech Bubble */}
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
          {/* Bubble tail */}
          <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white border-b border-r border-teal-900/15 transform rotate-45" />
        </div>
      )}

      {/* Floating 3D Character Container */}
      <div
        className="relative w-full h-full transition-transform duration-150 ease-out"
        style={{
          transform: `rotateY(${tilt.rotateY}deg) rotateX(${tilt.rotateX}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Robot Base Image */}
        <Image
          src="/images/ai-assistant-robot.png"
          alt="Kraviona AI Voice Assistant Robot"
          width={256}
          height={256}
          priority
          className="w-full h-full object-contain drop-shadow-xl"
        />

        {/* Precision Facial Expression Overlay on Visor Screen */}
        <div
          className="absolute z-10"
          style={{
            top: "18.5%",
            left: "40%",
            width: "23.5%",
            height: "17.5%",
          }}
        >
          <RobotFaceOverlay
            expression={expression}
            isSpeaking={isSpeaking}
            viseme={viseme}
            gaze={gaze}
          />
        </div>

        {/* Ambient Cyan Aura when Speaking or Active */}
        {(isSpeaking || expression === "listening") && (
          <div className="absolute inset-0 rounded-full bg-[#00F2FE]/15 filter blur-xl pointer-events-none animate-pulse" />
        )}
      </div>

      {/* Floating Soft Shadow underneath */}
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-2.5 rounded-full bg-slate-900/10 blur-xs pointer-events-none" />
    </div>
  );
}
