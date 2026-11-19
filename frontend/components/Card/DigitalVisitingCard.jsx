"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { 
  Phone, 
  Mail, 
  Globe, 
  MapPin, 
  Download, 
  RotateCw, 
  Share2, 
  Check, 
  Cpu, 
  Layers, 
  Code2, 
  TrendingUp, 
  Columns3,
  Sun,
  Moon
} from "lucide-react";
import { SOCIAL_LINKS } from "@/lib/social";

export default function DigitalVisitingCard() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isDualView, setIsDualView] = useState(false);
  const [isDark, setIsDark] = useState(false); // Default: Light Theme
  const [toastMessage, setToastMessage] = useState("");
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [cardTilt, setCardTilt] = useState({ rotateX: 0, rotateY: 0 });

  const cardRef = useRef(null);
  const toastTimeoutRef = useRef(null);

  const showToast = (msg) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  const handleMouseMove = (e) => {
    if (!cardRef.current || isDualView) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;
    setMousePos({ x: percentX, y: percentY });

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotX = ((y - centerY) / centerY) * -6;
    const rotY = ((x - centerX) / centerX) * 6;
    setCardTilt({ rotateX: rotX, rotateY: rotY });
  };

  const handleMouseLeave = () => {
    setCardTilt({ rotateX: 0, rotateY: 0 });
    setMousePos({ x: 50, y: 50 });
  };

  const toggleFlip = (e) => {
    if (e) e.stopPropagation();
    if (isDualView) {
      setIsDualView(false);
      return;
    }
    setIsFlipped(!isFlipped);
  };

  const handleCardClick = (e) => {
    if (e.target.closest("a") || e.target.closest("button")) {
      return;
    }
    toggleFlip(e);
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    showToast(!isDark ? "Switched to Dark Mode" : "Switched to Light Mode");
  };

  const handleShare = () => {
    const shareData = {
      title: "Kraviona — Digital Business Card | Amar Kumar",
      text: "Kraviona: AI-First Technology & Digital Solutions. Scan QR or connect with Founder Amar Kumar.",
      url: "https://www.kraviona.com",
    };

    if (navigator?.share && navigator?.canShare && navigator.canShare(shareData)) {
      navigator.share(shareData).catch(() => {});
    } else {
      if (navigator?.clipboard) {
        navigator.clipboard.writeText("https://www.kraviona.com");
        showToast("Copied website link to clipboard!");
      } else {
        showToast("URL: https://www.kraviona.com");
      }
    }
  };

  const downloadVCard = () => {
    const vcardData = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      "N:Kumar;Amar;;;",
      "FN:Amar Kumar",
      "ORG:Kraviona Tech Solutions",
      "TITLE:Founder & CEO / Lead Technical Architect",
      "TEL;TYPE=CELL,VOICE,PREF:+919608553167",
      "EMAIL;TYPE=WORK,INTERNET:hello@kraviona.com",
      "URL:https://www.kraviona.com",
      "ADR;TYPE=WORK:;;East Delhi;Delhi;110092;India",
      "X-SOCIALPROFILE;type=linkedin:https://www.linkedin.com/company/kravionai",
      "X-SOCIALPROFILE;type=twitter:https://x.com/KravionaTech",
      "NOTE:Kraviona — AI-First Technology & Digital Solutions. Builds AI agents, SaaS, web apps & digital marketing. Tagline: Intelligence Meets Innovation.",
      "END:VCARD",
    ].join("\r\n");

    const blob = new Blob([vcardData], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Amar-Kumar-Kraviona.vcf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast("Contact file (Amar-Kumar-Kraviona.vcf) downloaded!");
  };

  return (
    <div className={`relative min-h-[85vh] flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden transition-colors duration-400 ${
      isDark ? "bg-[#030d0f] text-white" : "bg-[#f4fafb] text-[#11434a]"
    }`}>
      {/* Ambient Nebulas */}
      <div className={`pointer-events-none fixed top-[-10%] left-[10%] w-[550px] h-[550px] rounded-full blur-3xl -z-10 transition-opacity duration-500 ${
        isDark ? "bg-radial from-[#11434a]/60 to-transparent opacity-80" : "bg-radial from-[#4b878f]/20 to-transparent opacity-60"
      }`} />
      <div className={`pointer-events-none fixed bottom-[-10%] right-[10%] w-[500px] h-[500px] rounded-full blur-3xl -z-10 transition-opacity duration-500 ${
        isDark ? "bg-radial from-[#da724d]/30 to-transparent opacity-80" : "bg-radial from-[#da724d]/15 to-transparent opacity-50"
      }`} />

      {/* Header Badge */}
      <div className="text-center mb-6 z-10">
        <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-bold uppercase tracking-wider mb-2 backdrop-blur-md shadow-sm ${
          isDark 
            ? "bg-[#11434a]/60 border-[#da724d]/40 text-[#fde0b2]" 
            : "bg-white/80 border-[#da724d]/30 text-[#b94f26]"
        }`}>
          <span className="w-2 h-2 rounded-full bg-[#da724d] animate-ping" />
          <span>Official E-Visiting Card • {isDark ? "Dark Theme" : "Light Theme"}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-['Space_Grotesk',sans-serif]">
          Kraviona <span className="text-[#da724d]">Tech Solutions</span>
        </h1>
        <p className={`text-xs mt-1 ${isDark ? "text-slate-300" : "text-slate-500"}`}>
          Tap card to flip between Front Identity & Back QR Contact Card
        </p>
      </div>

      {/* 3D Perspective Card Scene */}
      <div 
        className={`w-full transition-all duration-500 ease-out z-10 ${
          isDualView ? "max-w-6xl" : "max-w-[630px]"
        }`}
        style={{ perspective: "1400px" }}
      >
        {!isDualView ? (
          <div
            ref={cardRef}
            onClick={handleCardClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            tabIndex={0}
            role="region"
            aria-label="Digital Business Card. Click or press Enter to flip."
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggleFlip(e);
              }
            }}
            className="w-full relative cursor-pointer select-none rounded-[26px] transition-transform duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] min-h-[365px]"
            style={{
              transformStyle: "preserve-3d",
              transform: isFlipped
                ? `rotateY(180deg) rotateX(${cardTilt.rotateX}deg) rotateY(${cardTilt.rotateY * -1}deg)`
                : `rotateX(${cardTilt.rotateX}deg) rotateY(${cardTilt.rotateY}deg)`,
            }}
          >
            {/* ================= FRONT FACE ================= */}
            <div
              className={`absolute inset-0 w-full h-full rounded-[26px] p-6 sm:p-7 flex flex-col justify-between overflow-hidden border backdrop-blur-xl transition-all duration-300 ${
                isDark
                  ? "border-[#4b878f]/30 bg-gradient-to-br from-[#0e2e33]/95 via-[#06171a]/98 to-[#030d0f]/99 shadow-[0_25px_60px_-12px_rgba(0,0,0,0.85)]"
                  : "border-[#11434a]/12 bg-gradient-to-br from-white via-[#f8fbfc] to-[#fffaf7] shadow-[0_25px_55px_-12px_rgba(17,67,74,0.12),0_8px_25px_-6px_rgba(218,114,77,0.08)]"
              }`}
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            >
              {/* Specular Shine Overlay */}
              <div
                className="pointer-events-none absolute -inset-full opacity-60 transition-opacity"
                style={{
                  background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(255,255,255,${isDark ? "0.14" : "0.35"}) 0%, transparent 60%)`,
                }}
              />

              {/* Corner Accents */}
              <div className="pointer-events-none absolute top-3 left-3 w-3.5 h-3.5 border-t-2 border-l-2 border-[#da724d] rounded-tl" />
              <div className="pointer-events-none absolute top-3 right-3 w-3.5 h-3.5 border-t-2 border-r-2 border-[#fcd091] rounded-tr" />
              <div className="pointer-events-none absolute bottom-3 left-3 w-3.5 h-3.5 border-b-2 border-l-2 border-[#4b878f] rounded-bl" />
              <div className="pointer-events-none absolute bottom-3 right-3 w-3.5 h-3.5 border-b-2 border-r-2 border-[#da724d] rounded-br" />

              {/* Top Bar: Logo */}
              <div className="flex items-center justify-between w-full">
                <div className={isDark ? "bg-white/95 rounded-xl px-3.5 py-1.5 shadow-md border border-white/80 inline-flex items-center" : "inline-flex items-center"}>
                  <Image
                    src="/kraviona-logo.png"
                    alt="Kraviona Logo"
                    width={160}
                    height={48}
                    priority
                    className="h-10 w-auto object-contain"
                  />
                </div>
                <span className={`text-[10px] uppercase tracking-widest font-extrabold px-3 py-1 rounded-full border flex items-center gap-1.5 shadow-sm ${
                  isDark ? "bg-[#da724d]/15 border-[#da724d]/40 text-[#fca782]" : "bg-[#da724d]/10 border-[#da724d]/30 text-[#b94f26]"
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#da724d] animate-pulse" />
                  AI-First
                </span>
              </div>

              {/* Middle Section: Identity */}
              <div className="my-auto py-2">
                <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-['Space_Grotesk',sans-serif] ${
                  isDark ? "bg-gradient-to-r from-white via-[#fde0b2] to-[#e77d54] bg-clip-text text-transparent" : "text-[#11434a]"
                }`}>
                  Amar Kumar
                </h2>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="text-sm sm:text-base font-bold text-[#da724d]">Founder & CEO</span>
                  <span className="text-[#da724d]/40">•</span>
                  <span className={`text-xs px-2.5 py-0.5 rounded-md border font-bold ${
                    isDark ? "bg-[#11434a]/80 border-[#4b878f]/40 text-slate-200" : "bg-[#11434a]/08 border-[#11434a]/20 text-[#11434a]"
                  }`}>
                    Lead AI Architect
                  </span>
                </div>

                <p className={`italic text-xs sm:text-sm mt-2 flex items-center gap-1 font-medium ${
                  isDark ? "text-slate-300" : "text-slate-600"
                }`}>
                  <span className="text-[#da724d] font-serif text-lg font-bold">“</span>
                  Intelligence Meets Innovation.
                  <span className="text-[#da724d] font-serif text-lg font-bold">”</span>
                </p>

                {/* Capability Chips */}
                <div className="flex flex-wrap gap-1.5 mt-3.5">
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1 ${
                    isDark ? "bg-[#da724d]/20 border-[#da724d]/40 text-[#fed7aa]" : "bg-[#da724d]/08 border-[#da724d]/30 text-[#b94f26]"
                  }`}>
                    <Cpu className="w-3.5 h-3.5 text-[#da724d]" /> AI Agents
                  </span>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1 ${
                    isDark ? "bg-[#11434a]/50 border-[#4b878f]/30 text-[#99f6e4]" : "bg-[#11434a]/06 border-[#11434a]/22 text-[#11434a]"
                  }`}>
                    <Layers className="w-3.5 h-3.5 text-[#11434a]" /> SaaS Platforms
                  </span>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1 ${
                    isDark ? "bg-[#4b878f]/25 border-[#4b878f]/40 text-slate-200" : "bg-[#4b878f]/08 border-[#4b878f]/25 text-[#1e5e67]"
                  }`}>
                    <Code2 className="w-3.5 h-3.5 text-[#1e5e67]" /> Next.js Web Apps
                  </span>
                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1 ${
                    isDark ? "bg-[#fcd091]/20 border-[#fcd091]/40 text-[#fef08a]" : "bg-[#fcd091]/25 border-[#da724d]/25 text-[#92400e]"
                  }`}>
                    <TrendingUp className="w-3.5 h-3.5 text-[#92400e]" /> Digital Growth & GEO
                  </span>
                </div>
              </div>

              {/* Bottom Bar: Coordinates & Flip Pill */}
              <div className={`flex items-center justify-between pt-2.5 border-t text-xs ${
                isDark ? "border-[#4b878f]/20 text-slate-300" : "border-[#11434a]/10 text-slate-500"
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`flex items-center gap-1 font-semibold ${isDark ? "text-slate-200" : "text-[#11434a]"}`}>
                    <MapPin className="w-3.5 h-3.5 text-[#da724d]" />
                    <span>Delhi 110092, India</span>
                  </div>
                  <span className="text-slate-300 hidden sm:inline">•</span>
                  <div className="hidden sm:flex items-center gap-1 text-[#da724d] font-bold">
                    <Globe className="w-3.5 h-3.5" />
                    <span>kraviona.com</span>
                  </div>
                </div>

                <div
                  onClick={toggleFlip}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold cursor-pointer transition-all shadow-sm group ${
                    isDark 
                      ? "bg-[#11434a]/65 hover:bg-[#da724d] text-[#fde0b2] hover:text-white border-[#da724d]/40" 
                      : "bg-[#11434a]/08 hover:bg-[#da724d] text-[#11434a] hover:text-white border-[#da724d]/30"
                  }`}
                  title="Click to view QR Code & contact details"
                >
                  <span>QR & Contacts</span>
                  <RotateCw className="w-3.5 h-3.5 transition-transform duration-500 group-hover:rotate-180" />
                </div>
              </div>
            </div>

            {/* ================= BACK FACE ================= */}
            <div
              className={`absolute inset-0 w-full h-full rounded-[26px] p-6 sm:p-7 flex flex-col justify-between overflow-hidden border backdrop-blur-xl transition-all duration-300 ${
                isDark
                  ? "border-[#da724d]/40 bg-gradient-to-br from-[#0c282c]/95 via-[#051315]/98 to-[#020a0c] shadow-[0_25px_60px_-12px_rgba(0,0,0,0.85)]"
                  : "border-[#11434a]/12 bg-gradient-to-br from-white via-[#f8fbfc] to-[#fffaf7] shadow-[0_25px_55px_-12px_rgba(17,67,74,0.12),0_8px_25px_-6px_rgba(218,114,77,0.08)]"
              }`}
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              {/* Corner Accents */}
              <div className="pointer-events-none absolute top-3 left-3 w-3.5 h-3.5 border-t-2 border-l-2 border-[#da724d] rounded-tl" />
              <div className="pointer-events-none absolute top-3 right-3 w-3.5 h-3.5 border-t-2 border-r-2 border-[#fcd091] rounded-tr" />
              <div className="pointer-events-none absolute bottom-3 left-3 w-3.5 h-3.5 border-b-2 border-l-2 border-[#4b878f] rounded-bl" />
              <div className="pointer-events-none absolute bottom-3 right-3 w-3.5 h-3.5 border-b-2 border-r-2 border-[#da724d] rounded-br" />

              {/* Back Header */}
              <div className={`flex items-center justify-between pb-2 border-b ${
                isDark ? "border-[#4b878f]/25" : "border-[#11434a]/10"
              }`}>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#da724d] flex items-center justify-center text-white shadow-sm font-extrabold text-xs">
                    K
                  </div>
                  <div>
                    <div className={`text-xs font-bold tracking-wider ${isDark ? "text-white" : "text-[#11434a]"}`}>KRAVIONA</div>
                    <div className="text-[10px] text-[#da724d] font-bold uppercase tracking-wider">Direct Reach & Scan</div>
                  </div>
                </div>

                <div
                  onClick={toggleFlip}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold cursor-pointer transition-all shadow-sm group ${
                    isDark 
                      ? "bg-[#11434a]/65 hover:bg-[#da724d] text-[#fde0b2] hover:text-white border-[#da724d]/40" 
                      : "bg-[#11434a]/08 hover:bg-[#da724d] text-[#11434a] hover:text-white border-[#da724d]/30"
                  }`}
                  title="Click to view front face"
                >
                  <span>Front Face</span>
                  <RotateCw className="w-3.5 h-3.5 transition-transform duration-500 group-hover:rotate-180" />
                </div>
              </div>

              {/* Back Main Body: Scannable QR Code Plaque + Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-[170px_1fr] gap-4 items-center my-auto">
                {/* Dedicated Scannable QR Code */}
                <div className="bg-white rounded-2xl p-2.5 flex flex-col items-center justify-center border-2 border-[#da724d] shadow-[0_8px_25px_rgba(17,67,74,0.12),0_2px_10px_rgba(218,114,77,0.15)]">
                  <div className="w-28 h-28 relative flex items-center justify-center">
                    <svg viewBox="0 0 27 27" className="w-full h-full" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges">
                      <rect width="27" height="27" fill="#ffffff" rx="1.5"/>
                      <path d="M1,1H2V2H1zM2,1H3V2H2zM3,1H4V2H3zM4,1H5V2H4zM5,1H6V2H5zM6,1H7V2H6zM7,1H8V2H7zM9,1H10V2H9zM11,1H12V2H11zM13,1H14V2H13zM14,1H15V2H14zM17,1H18V2H17zM19,1H20V2H19zM20,1H21V2H20zM21,1H22V2H21zM22,1H23V2H22zM23,1H24V2H23zM24,1H25V2H24zM25,1H26V2H25zM1,2H2V3H1zM7,2H8V3H7zM9,2H10V3H9zM10,2H11V3H10zM11,2H12V3H11zM12,2H13V3H12zM14,2H15V3H14zM17,2H18V3H17zM19,2H20V3H19zM25,2H26V3H25zM1,3H2V4H1zM3,3H4V4H3zM4,3H5V4H4zM5,3H6V4H5zM7,3H8V4H7zM11,3H12V4H11zM12,3H13V4H12zM13,3H14V4H13zM14,3H15V4H14zM15,3H16V4H15zM17,3H18V4H17zM19,3H20V4H19zM21,3H22V4H21zM22,3H23V4H22zM23,3H24V4H23zM25,3H26V4H25zM1,4H2V5H1zM3,4H4V5H3zM4,4H5V5H4zM5,4H6V5H5zM7,4H8V5H7zM9,4H10V5H9zM10,4H11V5H10zM11,4H12V5H11zM14,4H15V5H14zM15,4H16V5H15zM19,4H20V5H19zM21,4H22V5H21zM22,4H23V5H22zM23,4H24V5H23zM25,4H26V5H25zM1,5H2V6H1zM3,5H4V6H3zM4,5H5V6H4zM5,5H6V6H5zM7,5H8V6H7zM10,5H11V6H10zM13,5H14V6H13zM14,5H15V6H14zM15,5H16V6H15zM16,5H17V6H16zM17,5H18V6H17zM19,5H20V6H19zM21,5H22V6H21zM22,5H23V6H22zM23,5H24V6H23zM25,5H26V6H25zM1,6H2V7H1zM7,6H8V7H7zM10,6H11V7H10zM13,6H14V7H13zM15,6H16V7H15zM17,6H18V7H17zM19,6H20V7H19zM25,6H26V7H25zM1,7H2V8H1zM2,7H3V8H2zM3,7H4V8H3zM4,7H5V8H4zM5,7H6V8H5zM6,7H7V8H6zM7,7H8V8H7zM9,7H10V8H9zM11,7H12V8H11zM13,7H14V8H13zM15,7H16V8H15zM17,7H18V8H17zM19,7H20V8H19zM20,7H21V8H20zM21,7H22V8H21zM22,7H23V8H22zM23,7H24V8H23zM24,7H25V8H24zM25,7H26V8H25zM9,8H10V9H9zM13,8H14V9H13zM15,8H16V9H15zM16,8H17V9H16zM17,8H18V9H17zM1,9H2V10H1zM3,9H4V10H3zM4,9H5V10H4zM6,9H7V10H6zM7,9H8V10H7zM8,9H9V10H8zM10,9H11V10H10zM12,9H13V10H12zM13,9H14V10H13zM15,9H16V10H15zM19,9H20V10H19zM22,9H23V10H22zM24,9H25V10H24zM25,9H26V10H25zM3,10H4V11H3zM4,10H5V11H4zM11,10H12V11H11zM17,10H18V11H17zM18,10H19V11H18zM20,10H21V11H20zM24,10H25V11H24zM3,11H4V12H3zM5,11H6V12H5zM7,11H8V12H7zM9,11H10V12H9zM13,11H14V12H13zM15,11H16V12H15zM17,11H18V12H17zM20,11H21V12H20zM2,12H3V13H2zM3,12H4V13H3zM4,12H5V13H4zM5,12H6V13H5zM6,12H7V13H6zM8,12H9V13H8zM10,12H11V13H10zM13,12H14V13H13zM14,12H15V13H14zM15,12H16V13H15zM17,12H18V13H17zM18,12H19V13H18zM19,12H20V13H19zM22,12H23V13H22zM23,12H24V13H23zM2,13H3V14H2zM3,13H4V14H3zM4,13H5V14H4zM5,13H6V14H5zM6,13H7V14H6zM7,13H8V14H7zM10,13H11V14H10zM11,13H12V14H11zM12,13H13V14H12zM14,13H15V14H14zM16,13H17V14H16zM18,13H19V14H18zM19,13H20V14H19zM20,13H21V14H20zM21,13H22V14H21zM23,13H24V14H23zM24,13H25V14H24zM25,13H26V14H25zM4,14H5V15H4zM5,14H6V15H5zM9,14H10V15H9zM12,14H13V15H12zM14,14H15V15H14zM15,14H16V15H15zM16,14H17V15H16zM17,14H18V15H17zM19,14H20V15H19zM20,14H21V15H20zM21,14H22V15H21zM25,14H26V15H25zM2,15H3V16H2zM4,15H5V16H4zM6,15H7V16H6zM7,15H8V16H7zM8,15H9V16H8zM9,15H10V16H9zM11,15H12V16H11zM13,15H14V16H13zM15,15H16V16H15zM17,15H18V16H17zM18,15H19V16H18zM21,15H22V16H21zM23,15H24V16H23zM24,15H25V16H24zM1,16H2V17H1zM3,16H4V17H3zM6,16H7V17H6zM8,16H9V17H8zM11,16H12V17H11zM13,16H14V17H13zM18,16H19V17H18zM20,16H21V17H20zM21,16H22V17H21zM25,16H26V17H25zM4,17H5V18H4zM5,17H6V18H5zM6,17H7V18H6zM7,17H8V18H7zM8,17H9V18H8zM11,17H12V18H11zM12,17H13V18H12zM14,17H15V18H14zM17,17H18V18H17zM18,17H19V18H18zM19,17H20V18H19zM20,17H21V18H20zM21,17H22V18H21zM22,17H23V18H22zM23,17H24V18H23zM24,17H25V18H24zM25,17H26V18H25zM9,18H10V19H9zM10,18H11V19H10zM11,18H12V19H11zM13,18H14V19H13zM14,18H15V19H14zM16,18H17V19H16zM17,18H18V19H17zM21,18H22V19H21zM23,18H24V19H23zM25,18H26V19H25zM1,19H2V20H1zM2,19H3V20H2zM3,19H4V20H3zM4,19H5V20H4zM5,19H6V20H5zM6,19H7V20H6zM7,19H8V20H7zM9,19H10V20H9zM12,19H13V20H12zM13,19H14V20H13zM14,19H15V20H14zM17,19H18V20H17zM19,19H20V20H19zM21,19H22V20H21zM23,19H24V20H23zM24,19H25V20H24zM25,19H26V20H25zM1,20H2V21H1zM7,20H8V21H7zM9,20H10V21H9zM10,20H11V21H10zM11,20H12V21H11zM13,20H14V21H13zM16,20H17V21H16zM17,20H18V21H17zM21,20H22V21H21zM24,20H25V21H24zM1,21H2V22H1zM3,21H4V22H3zM4,21H5V22H4zM5,21H6V22H5zM7,21H8V22H7zM10,21H11V22H10zM12,21H13V22H12zM15,21H16V22H15zM17,21H18V22H17zM18,21H19V22H18zM19,21H20V22H19zM20,21H21V22H20zM21,21H22V22H21zM22,21H23V22H22zM25,21H26V22H25zM1,22H2V23H1zM3,22H4V23H3zM4,22H5V23H4zM5,22H6V23H5zM7,22H8V23H7zM9,22H10V23H9zM11,22H12V23H11zM13,22H14V23H13zM14,22H15V23H14zM17,22H18V23H17zM19,22H20V23H19zM21,22H22V23H21zM22,22H23V23H22zM23,22H24V23H23zM24,22H25V23H24zM25,22H26V23H25zM1,23H2V24H1zM3,23H4V24H3zM4,23H5V24H4zM5,23H6V24H5zM7,23H8V24H7zM9,23H10V24H9zM10,23H11V24H10zM11,23H12V24H11zM12,23H13V24H12zM13,23H14V24H13zM14,23H15V24H14zM17,23H18V24H17zM18,23H19V24H18zM19,23H20V24H19zM21,23H22V24H21zM23,23H24V24H23zM24,23H25V24H24zM1,24H2V25H1zM7,24H8V25H7zM10,24H11V25H10zM11,24H12V25H11zM13,24H14V25H13zM14,24H15V25H14zM15,24H16V25H15zM18,24H19V25H18zM19,24H20V25H19zM21,24H22V25H21zM23,24H24V25H23zM1,25H2V26H1zM2,25H3V26H2zM3,25H4V26H3zM4,25H5V26H4zM5,25H6V26H5zM6,25H7V26H6zM7,25H8V26H7zM9,25H10V26H9zM10,25H11V26H10zM12,25H13V26H12zM13,25H14V26H13zM14,25H15V26H14zM15,25H16V26H15zM20,25H21V26H20zM21,25H22V26H21zM22,25H23V26H22zM23,25H24V26H23zM24,25H25V26H24zM25,25H26V26H25z" fill="#11434a"/>
                    </svg>
                    <div className="absolute w-6 h-6 rounded bg-white border border-[#da724d] flex items-center justify-center shadow-sm">
                      <span className="text-[#da724d] font-bold text-[11px] leading-none">K</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold text-[#11434a] uppercase tracking-wider mt-1">SCAN TO VISIT</span>
                </div>

                {/* Contact Rows */}
                <div className="flex flex-col gap-2">
                  <a
                    href={`tel:${SOCIAL_LINKS.phone}`}
                    onClick={(e) => e.stopPropagation()}
                    className={`flex items-center gap-2.5 p-2 rounded-xl border transition-all group ${
                      isDark 
                        ? "bg-[#11434a]/35 hover:bg-[#11434a]/75 border-[#4b878f]/20 hover:border-[#da724d] text-slate-200" 
                        : "bg-[#f1f8f9] hover:bg-white border-[#4b878f]/20 hover:border-[#da724d] text-[#11434a] hover:shadow-sm"
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#da724d]/15 border border-[#da724d]/30 text-[#da724d] flex items-center justify-center group-hover:bg-[#da724d] group-hover:text-white transition-colors flex-shrink-0">
                      <Phone className="w-3.5 h-3.5" />
                    </div>
                    <div className="overflow-hidden">
                      <div className={`text-[9px] uppercase font-bold ${isDark ? "text-slate-400" : "text-slate-500"}`}>Call / Reach</div>
                      <div className="text-xs font-bold truncate">{SOCIAL_LINKS.phone}</div>
                    </div>
                  </a>

                  <a
                    href={`mailto:${SOCIAL_LINKS.email}`}
                    onClick={(e) => e.stopPropagation()}
                    className={`flex items-center gap-2.5 p-2 rounded-xl border transition-all group ${
                      isDark 
                        ? "bg-[#11434a]/35 hover:bg-[#11434a]/75 border-[#4b878f]/20 hover:border-[#da724d] text-slate-200" 
                        : "bg-[#f1f8f9] hover:bg-white border-[#4b878f]/20 hover:border-[#da724d] text-[#11434a] hover:shadow-sm"
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#da724d]/15 border border-[#da724d]/30 text-[#da724d] flex items-center justify-center group-hover:bg-[#da724d] group-hover:text-white transition-colors flex-shrink-0">
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <div className="overflow-hidden">
                      <div className={`text-[9px] uppercase font-bold ${isDark ? "text-slate-400" : "text-slate-500"}`}>Official Email</div>
                      <div className="text-xs font-bold truncate">{SOCIAL_LINKS.email}</div>
                    </div>
                  </a>

                  <a
                    href="https://www.kraviona.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className={`flex items-center gap-2.5 p-2 rounded-xl border transition-all group ${
                      isDark 
                        ? "bg-[#11434a]/35 hover:bg-[#11434a]/75 border-[#4b878f]/20 hover:border-[#da724d] text-slate-200" 
                        : "bg-[#f1f8f9] hover:bg-white border-[#4b878f]/20 hover:border-[#da724d] text-[#11434a] hover:shadow-sm"
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#da724d]/15 border border-[#da724d]/30 text-[#da724d] flex items-center justify-center group-hover:bg-[#da724d] group-hover:text-white transition-colors flex-shrink-0">
                      <Globe className="w-3.5 h-3.5" />
                    </div>
                    <div className="overflow-hidden">
                      <div className={`text-[9px] uppercase font-bold ${isDark ? "text-slate-400" : "text-slate-500"}`}>Portal</div>
                      <div className="text-xs font-bold truncate">www.kraviona.com</div>
                    </div>
                  </a>
                </div>
              </div>

              {/* Back Footer: Social Hub & Direct Action */}
              <div className={`flex items-center justify-between pt-2 border-t ${
                isDark ? "border-[#4b878f]/20" : "border-[#11434a]/10"
              }`}>
                <div className="flex items-center gap-2">
                  <a
                    href={SOCIAL_LINKS.whatsappCTA}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    title="WhatsApp"
                    className="w-8 h-8 rounded-lg bg-[#11434a]/08 border border-[#4b878f]/25 flex items-center justify-center text-[#11434a] hover:text-white hover:bg-[#25D366] hover:border-[#25D366] transition-all hover:-translate-y-0.5"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12.031 2a9.97 9.97 0 00-8.52 15.22L2 22l4.908-1.47a9.97 9.97 0 005.123 1.41h.004c5.514 0 10-4.486 10-10 0-2.67-1.04-5.18-2.93-7.07A9.92 9.92 0 0012.03 2zm0 18.25c-1.61 0-3.18-.43-4.56-1.25l-.33-.2-3.37 1.01 1.03-3.29-.22-.35a8.21 8.21 0 01-1.26-4.42c0-4.55 3.7-8.25 8.25-8.25 2.2 0 4.27.86 5.83 2.42a8.2 8.2 0 012.42 5.83c0 4.55-3.7 8.25-8.25 8.25zm4.53-6.17c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.24-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.47c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07s.89 2.4 1.01 2.57c.12.17 1.75 2.67 4.24 3.75.59.26 1.05.41 1.41.53.59.19 1.14.16 1.57.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.1-.23-.16-.48-.28z"/>
                    </svg>
                  </a>
                  <a
                    href={SOCIAL_LINKS.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    title="LinkedIn"
                    className="w-8 h-8 rounded-lg bg-[#11434a]/08 border border-[#4b878f]/25 flex items-center justify-center text-[#11434a] hover:text-white hover:bg-[#0077b5] hover:border-[#0077b5] transition-all hover:-translate-y-0.5"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76c-.97 0-1.75-.79-1.75-1.76s.78-1.75 1.75-1.75 1.75.78 1.75 1.75-.78 1.76-1.75 1.76m1.37 9.74v-8.37H5.09v8.37h2.74z"/>
                    </svg>
                  </a>
                  <a
                    href={SOCIAL_LINKS.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    title="Twitter / X"
                    className="w-8 h-8 rounded-lg bg-[#11434a]/08 border border-[#4b878f]/25 flex items-center justify-center text-[#11434a] hover:text-white hover:bg-black hover:border-black transition-all hover:-translate-y-0.5"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                </div>

                <span className="text-[11px] font-bold text-[#da724d]">East Delhi 110092</span>
              </div>
            </div>
          </div>
        ) : (
          /* Dual Side Showcase Mode */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {/* Front Card Clone */}
            <div className={`rounded-[26px] p-6 sm:p-7 flex flex-col justify-between overflow-hidden border min-h-[365px] ${
              isDark 
                ? "border-[#4b878f]/30 bg-gradient-to-br from-[#0e2e33]/95 via-[#06171a]/98 to-[#030d0f]/99 shadow-2xl" 
                : "border-[#11434a]/12 bg-white shadow-xl"
            }`}>
              <div className="flex items-center justify-between w-full">
                <Image src="/kraviona-logo.png" alt="Kraviona Logo" width={160} height={48} className="h-10 w-auto object-contain" />
                <span className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full border ${
                  isDark ? "bg-[#da724d]/15 border-[#da724d]/40 text-[#fca782]" : "bg-[#da724d]/10 border-[#da724d]/30 text-[#b94f26]"
                }`}>AI-First</span>
              </div>
              <div className="my-auto py-2">
                <h2 className={`text-2xl font-extrabold font-['Space_Grotesk'] ${isDark ? "text-white" : "text-[#11434a]"}`}>Amar Kumar</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-bold text-[#da724d]">Founder & CEO</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-md border font-semibold">Lead AI Architect</span>
                </div>
                <p className="italic text-xs mt-2 text-slate-500">“Intelligence Meets Innovation.”</p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#da724d]/10 text-[#b94f26]">AI Agents</span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#11434a]/08 text-[#11434a]">SaaS Platforms</span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#4b878f]/10 text-[#1e5e67]">Next.js Web Apps</span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#fcd091]/25 text-[#92400e]">Digital Growth & GEO</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs text-slate-500">
                <span>East Delhi, Delhi 110092</span>
                <span className="text-[#da724d] font-bold">kraviona.com</span>
              </div>
            </div>

            {/* Back Card Clone with QR Code */}
            <div className={`rounded-[26px] p-6 sm:p-7 flex flex-col justify-between overflow-hidden border min-h-[365px] ${
              isDark 
                ? "border-[#da724d]/40 bg-gradient-to-br from-[#0c282c]/95 via-[#051315]/98 to-[#020a0c] shadow-2xl" 
                : "border-[#11434a]/12 bg-white shadow-xl"
            }`}>
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <div className="text-xs font-bold text-[#11434a] tracking-wider">KRAVIONA DIRECT REACH</div>
                <span className="text-[10px] text-[#da724d] font-bold uppercase">Scan & Save</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-4 items-center my-auto">
                <div className="bg-white rounded-2xl p-2 flex flex-col items-center justify-center border-2 border-[#da724d]">
                  <div className="w-24 h-24 relative flex items-center justify-center">
                    <svg viewBox="0 0 27 27" className="w-full h-full" xmlns="http://www.w3.org/2000/svg" shapeRendering="crispEdges">
                      <rect width="27" height="27" fill="#ffffff" rx="1.5"/>
                      <path d="M1,1H2V2H1zM2,1H3V2H2zM3,1H4V2H3zM4,1H5V2H4zM5,1H6V2H5zM6,1H7V2H6zM7,1H8V2H7zM9,1H10V2H9zM11,1H12V2H11zM13,1H14V2H13zM14,1H15V2H14zM17,1H18V2H17zM19,1H20V2H19zM20,1H21V2H20zM21,1H22V2H21zM22,1H23V2H22zM23,1H24V2H23zM24,1H25V2H24zM25,1H26V2H25zM1,2H2V3H1zM7,2H8V3H7zM9,2H10V3H9zM10,2H11V3H10zM11,2H12V3H11zM12,2H13V3H12zM14,2H15V3H14zM17,2H18V3H17zM19,2H20V3H19zM25,2H26V3H25zM1,3H2V4H1zM3,3H4V4H3zM4,3H5V4H4zM5,3H6V4H5zM7,3H8V4H7zM11,3H12V4H11zM12,3H13V4H12zM13,3H14V4H13zM14,3H15V4H14zM15,3H16V4H15zM17,3H18V4H17zM19,3H20V4H19zM21,3H22V4H21zM22,3H23V4H22zM23,3H24V4H23zM25,3H26V4H25zM1,4H2V5H1zM3,4H4V5H3zM4,4H5V5H4zM5,4H6V5H5zM7,4H8V5H7zM9,4H10V5H9zM10,4H11V5H10zM11,4H12V5H11zM14,4H15V5H14zM15,4H16V5H15zM19,4H20V5H19zM21,4H22V5H21zM22,4H23V5H22zM23,4H24V5H23zM25,4H26V5H25zM1,5H2V6H1zM3,5H4V6H3zM4,5H5V6H4zM5,5H6V6H5zM7,5H8V6H7zM10,5H11V6H10zM13,5H14V6H13zM14,5H15V6H14zM15,5H16V6H15zM16,5H17V6H16zM17,5H18V6H17zM19,5H20V6H19zM21,5H22V6H21zM22,5H23V6H22zM23,5H24V6H23zM25,5H26V6H25zM1,6H2V7H1zM7,6H8V7H7zM10,6H11V7H10zM13,6H14V7H13zM15,6H16V7H15zM17,6H18V7H17zM19,6H20V7H19zM25,6H26V7H25zM1,7H2V8H1zM2,7H3V8H2zM3,7H4V8H3zM4,7H5V8H4zM5,7H6V8H5zM6,7H7V8H6zM7,7H8V8H7zM9,7H10V8H9zM11,7H12V8H11zM13,7H14V8H13zM15,7H16V8H15zM17,7H18V8H17zM19,7H20V8H19zM20,7H21V8H20zM21,7H22V8H21zM22,7H23V8H22zM23,7H24V8H23zM24,7H25V8H24zM25,7H26V8H25zM9,8H10V9H9zM13,8H14V9H13zM15,8H16V9H15zM16,8H17V9H16zM17,8H18V9H17zM1,9H2V10H1zM3,9H4V10H3zM4,9H5V10H4zM6,9H7V10H6zM7,9H8V10H7zM8,9H9V10H8zM10,9H11V10H10zM12,9H13V10H12zM13,9H14V10H13zM15,9H16V10H15zM19,9H20V10H19zM22,9H23V10H22zM24,9H25V10H24zM25,9H26V10H25zM3,10H4V11H3zM4,10H5V11H4zM11,10H12V11H11zM17,10H18V11H17zM18,10H19V11H18zM20,10H21V11H20zM24,10H25V11H24zM3,11H4V12H3zM5,11H6V12H5zM7,11H8V12H7zM9,11H10V12H9zM13,11H14V12H13zM15,11H16V12H15zM17,11H18V12H17zM20,11H21V12H20zM2,12H3V13H2zM3,12H4V13H3zM4,12H5V13H4zM5,12H6V13H5zM6,12H7V13H6zM8,12H9V13H8zM10,12H11V13H10zM13,12H14V13H13zM14,12H15V13H14zM15,12H16V13H15zM17,12H18V13H17zM18,12H19V13H18zM19,12H20V13H19zM22,12H23V13H22zM23,12H24V13H23zM2,13H3V14H2zM3,13H4V14H3zM4,13H5V14H4zM5,13H6V14H5zM6,13H7V14H6zM7,13H8V14H7zM10,13H11V14H10zM11,13H12V14H11zM12,13H13V14H12zM14,13H15V14H14zM16,13H17V14H16zM18,13H19V14H18zM19,13H20V14H19zM20,13H21V14H20zM21,13H22V14H21zM23,13H24V14H23zM24,13H25V14H24zM25,13H26V14H25zM4,14H5V15H4zM5,14H6V15H5zM9,14H10V15H9zM12,14H13V15H12zM14,14H15V15H14zM15,14H16V15H15zM16,14H17V15H16zM17,14H18V15H17zM19,14H20V15H19zM20,14H21V15H20zM21,14H22V15H21zM25,14H26V15H25zM2,15H3V16H2zM4,15H5V16H4zM6,15H7V16H6zM7,15H8V16H7zM8,15H9V16H8zM9,15H10V16H9zM11,15H12V16H11zM13,15H14V16H13zM15,15H16V16H15zM17,15H18V16H17zM18,15H19V16H18zM21,15H22V16H21zM23,15H24V16H23zM24,15H25V16H24zM1,16H2V17H1zM3,16H4V17H3zM6,16H7V17H6zM8,16H9V17H8zM11,16H12V17H11zM13,16H14V17H13zM18,16H19V17H18zM20,16H21V17H20zM21,16H22V17H21zM25,16H26V17H25zM4,17H5V18H4zM5,17H6V18H5zM6,17H7V18H6zM7,17H8V18H7zM8,17H9V18H8zM11,17H12V18H11zM12,17H13V18H12zM14,17H15V18H14zM17,17H18V18H17zM18,17H19V18H18zM19,17H20V18H19zM20,17H21V18H20zM21,17H22V18H21zM22,17H23V18H22zM23,17H24V18H23zM24,17H25V18H24zM25,17H26V18H25zM9,18H10V19H9zM10,18H11V19H10zM11,18H12V19H11zM13,18H14V19H13zM14,18H15V19H14zM16,18H17V19H16zM17,18H18V19H17zM21,18H22V19H21zM23,18H24V19H23zM25,18H26V19H25zM1,19H2V20H1zM2,19H3V20H2zM3,19H4V20H3zM4,19H5V20H4zM5,19H6V20H5zM6,19H7V20H6zM7,19H8V20H7zM9,19H10V20H9zM12,19H13V20H12zM13,19H14V20H13zM14,19H15V20H14zM17,19H18V20H17zM19,19H20V20H19zM21,19H22V20H21zM23,19H24V20H23zM24,19H25V20H24zM25,19H26V20H25zM1,20H2V21H1zM7,20H8V21H7zM9,20H10V21H9zM10,20H11V21H10zM11,20H12V21H11zM13,20H14V21H13zM16,20H17V21H16zM17,20H18V21H17zM21,20H22V21H21zM24,20H25V21H24zM1,21H2V22H1zM3,21H4V22H3zM4,21H5V22H4zM5,21H6V22H5zM7,21H8V22H7zM10,21H11V22H10zM12,21H13V22H12zM15,21H16V22H15zM17,21H18V22H17zM18,21H19V22H18zM19,21H20V22H19zM20,21H21V22H20zM21,21H22V22H21zM22,21H23V22H22zM25,21H26V22H25zM1,22H2V23H1zM3,22H4V23H3zM4,22H5V23H4zM5,22H6V23H5zM7,22H8V23H7zM9,22H10V23H9zM11,22H12V23H11zM13,22H14V23H13zM14,22H15V23H14zM17,22H18V23H17zM19,22H20V23H19zM21,22H22V23H21zM22,22H23V23H22zM23,22H24V23H23zM24,22H25V23H24zM25,22H26V23H25zM1,23H2V24H1zM3,23H4V24H3zM4,23H5V24H4zM5,23H6V24H5zM7,23H8V24H7zM9,23H10V24H9zM10,23H11V24H10zM11,23H12V24H11zM12,23H13V24H12zM13,23H14V24H13zM14,23H15V24H14zM17,23H18V24H17zM18,23H19V24H18zM19,23H20V24H19zM21,23H22V24H21zM23,23H24V24H23zM24,23H25V24H24zM1,24H2V25H1zM7,24H8V25H7zM10,24H11V25H10zM11,24H12V25H11zM13,24H14V25H13zM14,24H15V25H14zM15,24H16V25H15zM18,24H19V25H18zM19,24H20V25H19zM21,24H22V25H21zM23,24H24V25H23zM1,25H2V26H1zM2,25H3V26H2zM3,25H4V26H3zM4,25H5V26H4zM5,25H6V26H5zM6,25H7V26H6zM7,25H8V26H7zM9,25H10V26H9zM10,25H11V26H10zM12,25H13V26H12zM13,25H14V26H13zM14,25H15V26H14zM15,25H16V26H15zM20,25H21V26H20zM21,25H22V26H21zM22,25H23V26H22zM23,25H24V26H23zM24,25H25V26H24zM25,25H26V26H25z" fill="#11434a"/>
                    </svg>
                  </div>
                  <span className="text-[9px] font-bold text-[#11434a]">SCAN TO VISIT</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="text-xs font-bold text-[#11434a]">{SOCIAL_LINKS.phone}</div>
                  <div className="text-xs font-bold text-[#11434a]">{SOCIAL_LINKS.email}</div>
                  <div className="text-xs font-bold text-[#11434a]">www.kraviona.com</div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                <span>East Delhi 110092</span>
                <span className="text-[#da724d] font-bold">KRAVIONA.COM</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Controls Deck */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-7 z-20 max-w-[630px] w-full">
        {/* Save Contact */}
        <button
          onClick={downloadVCard}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#da724d] via-[#e77d54] to-[#c95e37] hover:from-[#e77d54] hover:to-[#f69774] text-white text-xs sm:text-sm font-bold border border-white/20 shadow-[0_8px_20px_rgba(218,114,77,0.35)] transition-all hover:-translate-y-0.5 cursor-pointer"
          title="Download vCard contact file"
        >
          <Download className="w-4 h-4" />
          <span>Save Contact</span>
        </button>

        {/* Flip Card Button */}
        <button
          onClick={toggleFlip}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold border backdrop-blur-md transition-all hover:-translate-y-0.5 cursor-pointer ${
            isDark 
              ? "bg-[#11434a]/50 hover:bg-[#11434a]/80 text-[#fde0b2] border-[#4b878f]/35" 
              : "bg-white hover:bg-slate-50 text-[#11434a] border-[#11434a]/15 shadow-sm"
          }`}
          title="Flip between front and back"
        >
          <RotateCw className="w-4 h-4" />
          <span>{isFlipped ? "Flip to Identity" : "Flip to QR & Contacts"}</span>
        </button>

        {/* Theme Toggle (Light / Dark) */}
        <button
          onClick={toggleTheme}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold border backdrop-blur-md transition-all hover:-translate-y-0.5 cursor-pointer ${
            isDark 
              ? "bg-[#11434a]/50 hover:bg-[#11434a]/80 text-amber-300 border-[#4b878f]/35" 
              : "bg-white hover:bg-slate-50 text-[#11434a] border-[#11434a]/15 shadow-sm"
          }`}
          title="Switch between Light and Dark mode"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-[#11434a]" />}
          <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
        </button>

        {/* WhatsApp Direct */}
        <a
          href={SOCIAL_LINKS.whatsappCTA}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold border backdrop-blur-md transition-all hover:-translate-y-0.5 ${
            isDark 
              ? "bg-[#11434a]/50 hover:bg-[#11434a]/80 text-[#4ade80] border-[#4b878f]/35" 
              : "bg-white hover:bg-slate-50 text-[#16a34a] border-[#11434a]/15 shadow-sm"
          }`}
          title="Chat on WhatsApp"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12.031 2a9.97 9.97 0 00-8.52 15.22L2 22l4.908-1.47a9.97 9.97 0 005.123 1.41h.004c5.514 0 10-4.486 10-10 0-2.67-1.04-5.18-2.93-7.07A9.92 9.92 0 0012.03 2zm0 18.25c-1.61 0-3.18-.43-4.56-1.25l-.33-.2-3.37 1.01 1.03-3.29-.22-.35a8.21 8.21 0 01-1.26-4.42c0-4.55 3.7-8.25 8.25-8.25 2.2 0 4.27.86 5.83 2.42a8.2 8.2 0 012.42 5.83c0 4.55-3.7 8.25-8.25 8.25zm4.53-6.17c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.24-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.47c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07s.89 2.4 1.01 2.57c.12.17 1.75 2.67 4.24 3.75.59.26 1.05.41 1.41.53.59.19 1.14.16 1.57.1.47-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.14-1.18-.06-.1-.23-.16-.48-.28z"/>
          </svg>
          <span>WhatsApp</span>
        </a>

        {/* Dual View Toggle */}
        <button
          onClick={() => {
            setIsDualView(!isDualView);
            showToast(isDualView ? "3D Interactive Flip Mode activated" : "Dual Showcase Mode: Showing Front & Back together");
          }}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold border backdrop-blur-md transition-all hover:-translate-y-0.5 cursor-pointer ${
            isDark 
              ? "bg-[#11434a]/50 hover:bg-[#11434a]/80 text-[#fde0b2] border-[#4b878f]/35" 
              : "bg-white hover:bg-slate-50 text-[#11434a] border-[#11434a]/15 shadow-sm"
          }`}
          title="Toggle Front/Back side-by-side or 3D flip"
        >
          <Columns3 className="w-4 h-4" />
          <span>{isDualView ? "3D Flip View" : "Show Both Sides"}</span>
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold border backdrop-blur-md transition-all hover:-translate-y-0.5 cursor-pointer ${
            isDark 
              ? "bg-[#11434a]/50 hover:bg-[#11434a]/80 text-[#fde0b2] border-[#4b878f]/35" 
              : "bg-white hover:bg-slate-50 text-[#11434a] border-[#11434a]/15 shadow-sm"
          }`}
          title="Share card link"
        >
          <Share2 className="w-4 h-4" />
          <span>Share</span>
        </button>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#11434a] text-white border border-[#da724d] shadow-[0_10px_30px_rgba(17,67,74,0.3)] text-xs sm:text-sm font-bold animate-in slide-in-from-bottom-4 duration-300">
          <Check className="w-4 h-4 text-[#da724d]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
