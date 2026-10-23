"use client";

import React, { useEffect, useState, useRef } from "react";
import RobotHead3D from "./RobotHead3D";

/**
 * RobotCursorFollower.jsx
 * Smooth Following Cursor AI Robot Companion.
 * 
 * Features:
 * - Removed from corner: smoothly drifts and trails the user's cursor across the entire website.
 * - Fluid physics: spring-based linear interpolation (LERP) with zero jitter and natural lag.
 * - Cool Effects (matching user reference image):
 *    - Concentric glowing cyan orbital halo ring & pulsing energy dot.
 *    - Aerodynamic 3D banking (tilts and leans into movement velocity).
 *    - Zero-G floating bobbing when stationary.
 *    - Interactive element hover reaction (expands aura, curious expression).
 * - Usability & Safety:
 *    - Offset slightly so the user's cursor tip remains 100% unobstructed for clicking links/buttons.
 *    - Container is pointer-events-none; robot head itself is clickable (opens AI Assistant).
 *    - Smoothly fades out when the chat panel is open.
 *    - Mobile/touch fallback: gracefully parks as a floating badge on touch devices.
 */
export default function RobotCursorFollower({
  expression = "idle",
  isSpeaking = false,
  viseme = 0,
  speechBubble = null,
  overrideGaze = null,
  onClick = () => {},
  isOpen = false,
}) {
  const followerRef = useRef(null);
  const ringRef = useRef(null);

  // Position & physics references
  const targetPosRef = useRef({ x: -200, y: -200 });
  const currentPosRef = useRef({ x: -200, y: -200 });
  const prevPosRef = useRef({ x: -200, y: -200 });
  const velocityRef = useRef({ vx: 0, vy: 0 });

  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isHoveredInteractive, setIsHoveredInteractive] = useState(false);
  const [bankingTilt, setBankingTilt] = useState({ rotateX: 0, rotateY: 0, rotateZ: 0 });

  const animFrameRef = useRef(null);
  const idleTimerRef = useRef(null);

  // Detect touch-only mobile devices (fallback to bottom-right corner badge)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isTouch =
        window.matchMedia("(pointer: coarse)").matches &&
        !window.matchMedia("(hover: hover)").matches;
      setIsTouchDevice(isTouch);
    }
  }, []);

  // Cursor movement tracking on window
  useEffect(() => {
    if (isTouchDevice) return;

    const handlePointerMove = (e) => {
      const clientX = e.clientX;
      const clientY = e.clientY;
      if (clientX === undefined || clientY === undefined) return;

      targetPosRef.current = { x: clientX, y: clientY };

      // Initialize on first move to prevent flying in from offscreen
      if (!isVisible) {
        currentPosRef.current = { x: clientX, y: clientY };
        prevPosRef.current = { x: clientX, y: clientY };
        setIsVisible(true);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    // Hover detection over clickable elements across the site
    const handleMouseOver = (e) => {
      const target = e.target;
      if (!target || !(target instanceof HTMLElement)) return;
      const interactive = target.closest("a, button, input, textarea, select, [role='button'], .card");
      setIsHoveredInteractive(Boolean(interactive));
    };

    const handleMouseOut = (e) => {
      const target = e.target;
      if (target && target.closest && target.closest("a, button, input, textarea, select, [role='button'], .card")) {
        setIsHoveredInteractive(false);
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("mousemove", handlePointerMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mouseout", handleMouseOut, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("mousemove", handlePointerMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, [isVisible, isTouchDevice]);

  // High-performance 60fps/120fps physics simulation loop
  useEffect(() => {
    if (isTouchDevice) return;

    const lerp = (start, end, factor) => start + (end - start) * factor;

    const animate = () => {
      const cur = currentPosRef.current;
      const target = targetPosRef.current;
      const prev = prevPosRef.current;

      // Spring-like smooth lag interpolation (factor: 0.12)
      cur.x = lerp(cur.x, target.x, 0.12);
      cur.y = lerp(cur.y, target.y, 0.12);

      // Compute velocity for aerodynamic banking
      const vx = cur.x - prev.x;
      const vy = cur.y - prev.y;
      prev.x = cur.x;
      prev.y = cur.y;
      velocityRef.current = { vx, vy };

      // Zero-G breathing floating bob when stationary
      const time = performance.now() * 0.0028;
      const isResting = Math.hypot(vx, vy) < 0.6;
      const bobY = isResting ? Math.sin(time) * 3.5 : 0;
      const bobTilt = isResting ? Math.sin(time * 0.8) * 1.5 : 0;

      // Aerodynamic banking tilt (leans in direction of movement)
      const rotZ = Math.max(-22, Math.min(22, vx * 1.4)) + bobTilt;
      const rotX = Math.max(-18, Math.min(18, -vy * 1.2));
      const rotY = Math.max(-24, Math.min(24, vx * 1.3));

      setBankingTilt({ rotateX: rotX, rotateY: rotY, rotateZ: rotZ });

      // Trailing offset: positions robot ~24px to the right and ~22px below cursor
      // This leaves the actual cursor arrow 100% visible and unblocked to click anywhere
      const renderX = cur.x + 24;
      const renderY = cur.y + 22 + bobY;

      if (followerRef.current) {
        followerRef.current.style.transform = `translate3d(${renderX}px, ${renderY}px, 0px)`;
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isTouchDevice]);

  // Touch device fallback: docked floating widget in bottom corner
  if (isTouchDevice) {
    if (isOpen) return null;
    return (
      <div className="fixed bottom-6 right-6 z-50 flex items-end select-none">
        <RobotHead3D
          expression={isHoveredInteractive ? "curious" : expression}
          isSpeaking={isSpeaking}
          viseme={viseme}
          speechBubble={speechBubble}
          overrideGaze={overrideGaze}
          size="md"
          onClick={onClick}
        />
      </div>
    );
  }

  // Hide follower when chat panel is open or cursor hasn't entered viewport
  if (!isVisible || isOpen) return null;

  return (
    <div
      ref={followerRef}
      className="fixed top-0 left-0 z-50 pointer-events-none select-none will-change-transform transition-opacity duration-300"
      style={{
        transform: "translate3d(-200px, -200px, 0px)",
      }}
      aria-hidden="true"
    >
      <div className="relative flex items-center justify-center pointer-events-auto">
        {/* Reference Image "Smooth Following Cursor" Concentric Orbital Halo & Glowing Dot */}
        <div
          ref={ringRef}
          className={`absolute -inset-2.5 rounded-full border pointer-events-none transition-all duration-300 ${
            isHoveredInteractive
              ? "scale-110 border-[#00F2FE] shadow-[0_0_24px_rgba(0,242,254,0.65)] bg-[#00F2FE]/5"
              : "border-[#00F2FE]/45 shadow-[0_0_16px_rgba(0,242,254,0.35)]"
          }`}
        >
          {/* Glowing Energy Orbit Dot (matches reference screenshot circle with dot) */}
          <span className="absolute -top-1 left-1/2 -translate-x-1/2 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F2FE] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00F2FE] shadow-[0_0_8px_#00F2FE]" />
          </span>
        </div>

        {/* 3D Aerodynamic Tilting Robot Head */}
        <div
          className="transition-transform duration-75 ease-out"
          style={{
            transform: `rotateY(${bankingTilt.rotateY}deg) rotateX(${bankingTilt.rotateX}deg) rotateZ(${bankingTilt.rotateZ}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          <RobotHead3D
            expression={isHoveredInteractive && expression === "idle" ? "curious" : expression}
            isSpeaking={isSpeaking}
            viseme={viseme}
            speechBubble={speechBubble}
            overrideGaze={overrideGaze}
            size="md"
            onClick={onClick}
          />
        </div>
      </div>
    </div>
  );
}
