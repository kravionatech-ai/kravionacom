"use client";

import React, { useEffect, useState, useRef } from "react";
import RobotHead3D from "./RobotHead3D";

/**
 * RobotCursorFollower.jsx
 * Smooth Following Cursor AI Robot Companion.
 * 
 * Features:
 * - Completely removed from the website corner: smoothly follows the user's cursor across the entire page.
 * - Instantly visible on page load with zero offscreen lag.
 * - Fluid physics: spring-based linear interpolation (LERP: 0.13) for silky-smooth trailing.
 * - Reference Image Effect:
 *    - Concentric glowing cyan orbital halo ring & pulsing energy orbit dot.
 *    - Aerodynamic 3D banking (tilts dynamically based on mouse velocity).
 *    - Zero-G floating bobbing when cursor is stationary.
 *    - Interactive element hover reaction (expands cyan aura, looks curious).
 * - Safe UX:
 *    - Trailing offset (~26px right, ~22px down) leaves the cursor arrow 100% unblocked to click links/buttons.
 *    - Wrapper has pointer-events-none; robot head itself is clickable to open AI assistant.
 *    - Smoothly fades out when the chat panel is open.
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

  // Position & physics references
  const targetPosRef = useRef({ x: 300, y: 300 });
  const currentPosRef = useRef({ x: 300, y: 300 });
  const prevPosRef = useRef({ x: 300, y: 300 });
  const velocityRef = useRef({ vx: 0, vy: 0 });

  const [mounted, setMounted] = useState(false);
  const [isHoveredInteractive, setIsHoveredInteractive] = useState(false);
  const [bankingTilt, setBankingTilt] = useState({ rotateX: 0, rotateY: 0, rotateZ: 0 });

  const animFrameRef = useRef(null);

  // Mount & initialize starting position inside viewport
  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const initialX = Math.max(80, window.innerWidth - 130);
      const initialY = Math.max(80, window.innerHeight - 150);
      targetPosRef.current = { x: initialX, y: initialY };
      currentPosRef.current = { x: initialX, y: initialY };
      prevPosRef.current = { x: initialX, y: initialY };

      if (followerRef.current) {
        followerRef.current.style.transform = `translate3d(${initialX}px, ${initialY}px, 0px)`;
      }
    }
  }, []);

  // Global mouse & pointer tracking across all pages
  useEffect(() => {
    if (!mounted) return;

    const handlePointerMove = (e) => {
      const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX);
      const clientY = e.clientY ?? (e.touches && e.touches[0]?.clientY);
      if (clientX === undefined || clientY === undefined) return;

      targetPosRef.current = { x: clientX, y: clientY };
    };

    // Hover detection over interactive links, buttons, inputs
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
    window.addEventListener("touchmove", handlePointerMove, { passive: true });
    document.addEventListener("mouseover", handleMouseOver, { passive: true });
    document.addEventListener("mouseout", handleMouseOut, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("touchmove", handlePointerMove);
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
    };
  }, [mounted]);

  // High-performance 60fps / 120fps physics simulation loop
  useEffect(() => {
    if (!mounted) return;

    const lerp = (start, end, factor) => start + (end - start) * factor;

    const animate = () => {
      const cur = currentPosRef.current;
      const target = targetPosRef.current;
      const prev = prevPosRef.current;

      // Spring LERP lag interpolation factor
      cur.x = lerp(cur.x, target.x, 0.13);
      cur.y = lerp(cur.y, target.y, 0.13);

      // Compute velocity for aerodynamic tilt
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

      // Trailing offset: positions robot ~26px to the right and ~22px below cursor
      // Leaves cursor pointer arrow 100% visible and unblocked
      const renderX = cur.x + 26;
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
  }, [mounted]);

  // Hide follower when chat panel is open
  if (!mounted || isOpen) return null;

  return (
    <div
      ref={followerRef}
      className="fixed top-0 left-0 z-50 pointer-events-none select-none will-change-transform"
      style={{
        transform: "translate3d(calc(100vw - 120px), calc(100vh - 140px), 0px)",
      }}
      aria-label="Kraviona AI Assistant Cursor Companion"
    >
      <div className="relative flex items-center justify-center pointer-events-auto bg-transparent border-0 shadow-none">
        {/* 3D Aerodynamic Tilting Robot Head (Transparent, zero background/backdrop glow) */}
        <div
          className="transition-transform duration-75 ease-out bg-transparent"
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
