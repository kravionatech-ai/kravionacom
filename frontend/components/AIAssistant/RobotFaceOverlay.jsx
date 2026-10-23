"use client";

import React, { useEffect, useState, useRef } from "react";

/**
 * RobotFaceOverlay.jsx
 * Precision interactive transparent SVG facial overlay aligned directly over the dark visor screen.
 * Implements:
 * - Idle, Happy, Curious, Thinking, Listening, Speaking, and Blinking states.
 * - Smooth eye gaze tracking toward cursor and active form fields.
 * - Dynamic mouth animation synced to speech viseme and immediate silence reset.
 */
export default function RobotFaceOverlay({
  expression = "idle",
  isSpeaking = false,
  viseme = 0,
  gaze = { x: 0, y: 0 }, // -1 to 1 normalized offset
}) {
  const [isBlinking, setIsBlinking] = useState(false);
  const blinkTimeoutRef = useRef(null);

  // Natural blinking interval every 3.5 to 6 seconds
  useEffect(() => {
    const triggerBlink = () => {
      setIsBlinking(true);
      setTimeout(() => {
        setIsBlinking(false);
        const nextInterval = 3500 + Math.random() * 2500;
        blinkTimeoutRef.current = setTimeout(triggerBlink, nextInterval);
      }, 140);
    };

    blinkTimeoutRef.current = setTimeout(triggerBlink, 3000);
    return () => {
      if (blinkTimeoutRef.current) clearTimeout(blinkTimeoutRef.current);
    };
  }, []);

  // Compute smooth eye pupil displacement based on gaze (-1 to +1 range)
  const gazeOffsetX = Math.max(-1, Math.min(1, gaze.x || 0)) * 4.5;
  const gazeOffsetY = Math.max(-1, Math.min(1, gaze.y || 0)) * 3.5;

  // Eye height scaling during blink
  const eyeScaleY = isBlinking ? 0.1 : 1;

  // Dynamic mouth path based on expression and speech viseme
  const renderMouth = () => {
    if (isSpeaking) {
      // Audio-driven mouth opening (viseme 0 to 1)
      const openHeight = 52 + (viseme || 0.4) * 8;
      const widthSpread = 42 - (viseme || 0.4) * 2;
      return (
        <path
          d={`M ${widthSpread} 52 Q 50 ${openHeight + 3} ${100 - widthSpread} 52 Q 50 ${openHeight - 2} ${widthSpread} 52 Z`}
          fill="#00F2FE"
          filter="url(#cyanGlow)"
          className="transition-all duration-75"
        />
      );
    }

    switch (expression) {
      case "happy":
        return (
          <path
            d="M 40 51 Q 50 62 60 51 Z"
            fill="#00F2FE"
            filter="url(#cyanGlow)"
          />
        );
      case "curious":
        return (
          <ellipse
            cx="50"
            cy="54"
            rx="4"
            ry="4.5"
            fill="none"
            stroke="#00F2FE"
            strokeWidth="2.5"
            strokeLinecap="round"
            filter="url(#cyanGlow)"
          />
        );
      case "thinking":
        return (
          <path
            d="M 44 54 Q 50 51 56 54"
            fill="none"
            stroke="#00F2FE"
            strokeWidth="2.8"
            strokeLinecap="round"
            filter="url(#cyanGlow)"
          />
        );
      case "listening":
        return (
          <ellipse
            cx="50"
            cy="53"
            rx="5"
            ry="2.5"
            fill="#00F2FE"
            filter="url(#cyanGlow)"
          />
        );
      case "idle":
      default:
        return (
          <path
            d="M 42 52 Q 50 58 58 52"
            fill="none"
            stroke="#00F2FE"
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#cyanGlow)"
          />
        );
    }
  };

  // Eye shape based on expression
  const renderEyes = () => {
    if (expression === "happy") {
      // Cheerful arched eyes (^ ^)
      return (
        <g
          transform={`translate(${gazeOffsetX}, ${gazeOffsetY}) scale(1, ${eyeScaleY})`}
          className="transition-transform duration-100 ease-out"
        >
          {/* Left Eye */}
          <path
            d="M 30 38 Q 38 27 46 38"
            fill="none"
            stroke="#00F2FE"
            strokeWidth="4"
            strokeLinecap="round"
            filter="url(#cyanGlow)"
          />
          {/* Right Eye */}
          <path
            d="M 54 38 Q 62 27 70 38"
            fill="none"
            stroke="#00F2FE"
            strokeWidth="4"
            strokeLinecap="round"
            filter="url(#cyanGlow)"
          />
        </g>
      );
    }

    if (expression === "thinking") {
      // Pupils look up and slightly tilt
      return (
        <g
          transform={`translate(${gazeOffsetX - 1}, ${gazeOffsetY - 3}) scale(1, ${eyeScaleY})`}
          className="transition-transform duration-150 ease-out"
        >
          <ellipse
            cx="38"
            cy="33"
            rx="6.5"
            ry="8.5"
            fill="#00F2FE"
            filter="url(#cyanGlow)"
          />
          <ellipse
            cx="62"
            cy="33"
            rx="6.5"
            ry="8.5"
            fill="#00F2FE"
            filter="url(#cyanGlow)"
          />
          {/* Subtle thinking ring indicator */}
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
            filter="url(#cyanGlow)"
          />
        </g>
      );
    }

    // Default & curious/listening/speaking: Glowing cyan pill eyes
    const rx = expression === "listening" || expression === "curious" ? 7.5 : 7;
    const ry = expression === "listening" ? 9.5 : 8.5;

    return (
      <g
        transform={`translate(${gazeOffsetX}, ${gazeOffsetY}) scale(1, ${eyeScaleY})`}
        style={{ transformOrigin: "50px 35px" }}
        className="transition-transform duration-100 ease-out"
      >
        {/* Left Eye */}
        <ellipse
          cx="38"
          cy="35"
          rx={rx}
          ry={ry}
          fill="#00F2FE"
          filter="url(#cyanGlow)"
        />
        {/* Left Eye Highlight */}
        <ellipse cx="36" cy="32" rx="2.5" ry="3.5" fill="#FFFFFF" opacity="0.8" />

        {/* Right Eye */}
        <ellipse
          cx="62"
          cy="35"
          rx={rx}
          ry={ry}
          fill="#00F2FE"
          filter="url(#cyanGlow)"
        />
        {/* Right Eye Highlight */}
        <ellipse cx="60" cy="32" rx="2.5" ry="3.5" fill="#FFFFFF" opacity="0.8" />
      </g>
    );
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      <svg
        viewBox="0 0 100 80"
        className="w-full h-full"
        style={{
          filter: "drop-shadow(0 0 4px rgba(0, 242, 254, 0.4))",
        }}
        aria-hidden="true"
      >
        <defs>
          <filter id="cyanGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="1.8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Face Screen Subtle Dark Glass Backing */}
        <ellipse
          cx="50"
          cy="40"
          rx="32"
          ry="24"
          fill="#0A1215"
          opacity="0.85"
        />

        {/* Eyes */}
        {renderEyes()}

        {/* Mouth */}
        {renderMouth()}
      </svg>
    </div>
  );
}
