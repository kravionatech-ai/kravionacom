"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import RobotHead3D from "./RobotHead3D";
import AssistantChatPanel from "./AssistantChatPanel";
import { speechController } from "./AssistantSpeechController";
import {
  extractPageContext,
  getRouteAnnouncement,
  getSelectedText,
} from "./AssistantPageContext";
import { attachFormObserver } from "./AssistantFormGuide";
import { getFallbackChatResponse } from "@/components/Chatbot/fallbackKnowledge";
import { Volume2, Sparkles, X, BookOpen, MessageSquare, Radio } from "lucide-react";

const INITIAL_WELCOME = {
  id: "welcome-msg",
  sender: "bot",
  text: `Hello! 👋 I'm Kraviona's 3D AI Voice Assistant.

I can guide you through our **Web Development** and **Technical SEO** services, read pages aloud, summarize articles, or help you complete our inquiry forms. How can I assist you today?`,
  sources: [],
  timestamp: "Just now",
};

export default function KravionaAIAssistant() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [expression, setExpression] = useState("idle");
  const [speechBubble, setSpeechBubble] = useState(null);
  const [overrideGaze, setOverrideGaze] = useState(null);
  const [viseme, setViseme] = useState(0);

  // Voice playback state
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [voices, setVoices] = useState([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState(null);

  // Chat conversation state
  const [messages, setMessages] = useState([INITIAL_WELCOME]);
  const [isLoading, setIsLoading] = useState(false);

  // Form & Selection guidance state
  const [activeFormField, setActiveFormField] = useState(null);
  const [selectedText, setSelectedText] = useState("");
  const [hasInteracted, setHasInteracted] = useState(false);

  const bubbleTimeoutRef = useRef(null);
  const lastAnnouncedPathRef = useRef("");

  const showTemporaryBubble = useCallback((text, durationMs = 4500) => {
    setSpeechBubble(text);
    if (bubbleTimeoutRef.current) clearTimeout(bubbleTimeoutRef.current);
    bubbleTimeoutRef.current = setTimeout(() => {
      setSpeechBubble(null);
    }, durationMs);
  }, []);

  // Mount, local preference retrieval & speechController subscription
  useEffect(() => {
    setMounted(true);

    try {
      const savedAutoSpeak = localStorage.getItem("kraviona_auto_speak");
      if (savedAutoSpeak !== null) {
        setAutoSpeak(savedAutoSpeak === "true");
      } else {
        setAutoSpeak(true);
        localStorage.setItem("kraviona_auto_speak", "true");
      }
    } catch {}

    const unsubscribe = speechController.subscribe((state) => {
      setIsSpeaking(state.isSpeaking);
      setIsPaused(state.isPaused);
      setIsMuted(state.isMuted);
      setSpeed(state.speed);
      setSelectedVoiceURI(state.selectedVoiceURI);
      setVoices(state.availableVoices);

      if (state.isSpeaking && !state.isPaused) {
        setExpression("speaking");
      } else if (!state.isSpeaking) {
        setExpression("idle");
        setViseme(0);
      }
    });

    return () => {
      unsubscribe();
      speechController.stop();
    };
  }, []);

  // Modern browser autoplay unblocker: Prime audio & auto-read on first user interaction
  useEffect(() => {
    if (!mounted) return;

    let unlocked = false;
    const unlockAudioAndAnnounce = () => {
      if (unlocked) return;
      unlocked = true;
      setHasInteracted(true);
      speechController.prime();

      // If Auto Read & Voice are active, speak the current route announcement aloud!
      if (autoSpeak && voiceEnabled && !isMuted) {
        const currentPath = pathname || "/";
        if (lastAnnouncedPathRef.current !== currentPath) {
          lastAnnouncedPathRef.current = currentPath;
          const announcement = getRouteAnnouncement(currentPath);
          showTemporaryBubble(announcement, 5000);
          speechController.speak(announcement, {
            onStart: () => setExpression("speaking"),
            onEnd: () => setExpression("idle"),
            onViseme: (val) => setViseme(val),
          });
        }
      }
    };

    window.addEventListener("pointerdown", unlockAudioAndAnnounce, { once: true, passive: true });
    window.addEventListener("click", unlockAudioAndAnnounce, { once: true, passive: true });
    window.addEventListener("touchstart", unlockAudioAndAnnounce, { once: true, passive: true });
    window.addEventListener("keydown", unlockAudioAndAnnounce, { once: true, passive: true });
    window.addEventListener("scroll", unlockAudioAndAnnounce, { once: true, passive: true });

    return () => {
      window.removeEventListener("pointerdown", unlockAudioAndAnnounce);
      window.removeEventListener("click", unlockAudioAndAnnounce);
      window.removeEventListener("touchstart", unlockAudioAndAnnounce);
      window.removeEventListener("keydown", unlockAudioAndAnnounce);
      window.removeEventListener("scroll", unlockAudioAndAnnounce);
    };
  }, [mounted, pathname, autoSpeak, voiceEnabled, isMuted, showTemporaryBubble]);

  const handleToggleAutoSpeak = () => {
    setHasInteracted(true);
    const nextState = !autoSpeak;
    setAutoSpeak(nextState);
    try {
      localStorage.setItem("kraviona_auto_speak", String(nextState));
    } catch {}

    if (nextState) {
      speakText("Auto Read and Loud Speak enabled. I will guide you automatically.");
    } else {
      speechController.stop();
      showTemporaryBubble("Auto Speak disabled. Click Listen to hear speech.", 3000);
    }
  };

  // Form field observer integration
  useEffect(() => {
    if (!mounted) return;

    const cleanup = attachFormObserver({
      onFieldFocus: (meta, isNewField) => {
        setActiveFormField(meta);
        setExpression("curious");

        // Compute gaze toward field center
        if (typeof window !== "undefined") {
          const rx = (meta.fieldCenterX - window.innerWidth / 2) / (window.innerWidth / 2);
          const ry = (meta.fieldCenterY - window.innerHeight / 2) / (window.innerHeight / 2);
          setOverrideGaze({ x: rx, y: ry });
        }

        showTemporaryBubble(meta.guidance, 5000);

        // Speak guidance ONLY if Auto Speak & Voice are enabled
        if (autoSpeak && voiceEnabled && !isMuted && hasInteracted && isNewField) {
          speechController.speak(meta.guidance, {
            onStart: () => setExpression("speaking"),
            onEnd: () => setExpression("idle"),
            onViseme: (val) => setViseme(val),
          });
        }
      },
      onFieldBlur: () => {
        setActiveFormField(null);
        setOverrideGaze(null);
        setExpression("idle");
      },
      onValidationNotice: (msg) => {
        showTemporaryBubble(`Notice: ${msg}`, 4000);
      },
    });

    return () => cleanup();
  }, [mounted, voiceEnabled, autoSpeak, isMuted, hasInteracted, showTemporaryBubble]);

  // Text selection listener
  useEffect(() => {
    if (!mounted) return;

    const handleSelection = () => {
      const text = getSelectedText();
      if (text.length > 5 && text.length < 1000) {
        setSelectedText(text);
      } else {
        setSelectedText("");
      }
    };

    document.addEventListener("mouseup", handleSelection);
    document.addEventListener("selectionchange", handleSelection);

    return () => {
      document.removeEventListener("mouseup", handleSelection);
      document.removeEventListener("selectionchange", handleSelection);
    };
  }, [mounted]);

  // Route announcements on navigation
  useEffect(() => {
    if (!mounted || !pathname) return;

    // Do not announce on admin or auth routes
    if (pathname.startsWith("/admin") || pathname.startsWith("/login")) return;

    if (lastAnnouncedPathRef.current !== pathname) {
      lastAnnouncedPathRef.current = pathname;

      // Only announce if Auto Speak & Voice are active and user has interacted
      if (hasInteracted && autoSpeak && voiceEnabled && !isMuted) {
        const announcement = getRouteAnnouncement(pathname);
        showTemporaryBubble(announcement, 5000);
        speechController.speak(announcement, {
          onStart: () => setExpression("speaking"),
          onEnd: () => setExpression("idle"),
          onViseme: (val) => setViseme(val),
        });
      }
    }
  }, [pathname, mounted, hasInteracted, autoSpeak, voiceEnabled, isMuted, showTemporaryBubble]);

  // Explicit speech invoker
  const speakText = useCallback(
    (text) => {
      setHasInteracted(true);
      if (!voiceEnabled || isMuted) return;

      showTemporaryBubble(text.slice(0, 120) + (text.length > 120 ? "..." : ""), 4000);
      speechController.speak(text, {
        onStart: () => setExpression("speaking"),
        onEnd: () => setExpression("idle"),
        onViseme: (val) => setViseme(val),
      });
    },
    [voiceEnabled, isMuted, showTemporaryBubble]
  );

  // Send message to AI endpoint (with instant fallback)
  const handleSendMessage = async (textToSend) => {
    const query = String(textToSend).trim();
    if (!query || isLoading) return;

    setHasInteracted(true);

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setExpression("thinking");

    let replyText = null;
    let replySources = [];

    // 1. Try GET API route handler
    try {
      const res = await fetch(`/api/assistant/chat?message=${encodeURIComponent(query)}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data?.reply) {
          replyText = json.data.reply;
          replySources = json.data.sources || [];
        }
      }
    } catch (e) {
      // Proceed to fallback
    }

    // 2. Client-side verified knowledge fallback
    if (!replyText) {
      const fallback = getFallbackChatResponse(query);
      replyText = fallback.reply;
      replySources = fallback.sources || [];
    }

    const botMsg = {
      id: `bot-${Date.now()}`,
      sender: "bot",
      text: replyText,
      sources: replySources,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, botMsg]);
    setIsLoading(false);

    // If Auto Speak is enabled, automatically speak the AI reply aloud!
    if (autoSpeak) {
      speakText(replyText);
    }
  };

  // Action: Read Page
  const handleReadPage = () => {
    setHasInteracted(true);
    const context = extractPageContext();
    const contentToRead =
      context.h1 +
      ". " +
      (context.contentSnippet ? context.contentSnippet.slice(0, 600) : "This page details Kraviona's services and technical offerings.");

    speakText(contentToRead);
  };

  // Action: Summarize Page
  const handleSummarizePage = async () => {
    setHasInteracted(true);
    const context = extractPageContext();
    const summaryPrompt = `Please summarize the key offerings of this page: "${context.title} — ${context.h1}".`;
    handleSendMessage(summaryPrompt);
  };

  // Action: Read Selected Text
  const handleReadSelectedText = () => {
    if (!selectedText) return;
    setHasInteracted(true);
    speakText(selectedText);
    setSelectedText("");
  };

  // Voice toggle
  const handleToggleVoice = () => {
    setHasInteracted(true);
    const nextState = !voiceEnabled;
    setVoiceEnabled(nextState);
    if (!nextState) {
      speechController.stop();
    } else {
      speakText("Voice enabled. How can I help you?");
    }
  };

  if (!mounted) return null;

  // Prevent assistant from appearing on admin pages
  if (pathname && (pathname.startsWith("/admin") || pathname.startsWith("/login"))) {
    return null;
  }

  return (
    <>
      {/* Floating Action Pill for Selected Text */}
      {selectedText && (
        <div
          className="fixed bottom-36 right-6 z-50 flex items-center gap-1.5 p-2 rounded-2xl bg-[#0f5960] text-white shadow-2xl border border-teal-400/30 animate-in fade-in slide-in-from-bottom-3"
          role="region"
          aria-label="Read Selection Action"
        >
          <button
            onClick={handleReadSelectedText}
            className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
          >
            <Volume2 className="w-3.5 h-3.5 text-[#00F2FE]" />
            <span>Read Selection Aloud</span>
          </button>
          <button
            onClick={() => setSelectedText("")}
            className="p-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-white"
            aria-label="Dismiss selection action"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating 3D Robot Head Dock (Bottom-Right, 100% Code-Rendered 3D Head) */}
      <div className="fixed bottom-6 right-6 z-50 flex items-end select-none">
        {!isOpen && (
          <div className="flex flex-col items-end">
            <RobotHead3D
              expression={expression}
              isSpeaking={isSpeaking}
              viseme={viseme}
              speechBubble={speechBubble}
              overrideGaze={overrideGaze}
              size="md"
              onClick={() => {
                setHasInteracted(true);
                setIsOpen(true);
                if (autoSpeak && voiceEnabled && !isSpeaking && !isMuted) {
                  speakText("Hi! I'm your Kraviona AI Voice Guide. How can I assist you today?");
                }
              }}
            />
          </div>
        )}
      </div>

      {/* Expanded Interactive 3D AI Voice Assistant Window */}
      <AssistantChatPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        onClearChat={() => setMessages([INITIAL_WELCOME])}
        onReadPage={handleReadPage}
        onSummarizePage={handleSummarizePage}
        onSpeakMessage={speakText}
        // Voice & Auto Speak controller props
        voiceEnabled={voiceEnabled}
        onToggleVoice={handleToggleVoice}
        autoSpeak={autoSpeak}
        onToggleAutoSpeak={handleToggleAutoSpeak}
        isSpeaking={isSpeaking}
        isPaused={isPaused}
        isMuted={isMuted}
        onStop={() => speechController.stop()}
        onPause={() => speechController.pause()}
        onResume={() => speechController.resume()}
        onToggleMute={() => speechController.setMuted(!isMuted)}
        speed={speed}
        onChangeSpeed={(val) => speechController.setSpeed(val)}
        voices={voices}
        selectedVoiceURI={selectedVoiceURI}
        onSelectVoice={(val) => speechController.setVoice(val)}
        activeFormField={activeFormField}
      />
    </>
  );
}
