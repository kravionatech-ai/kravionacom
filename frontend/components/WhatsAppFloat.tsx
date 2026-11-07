"use client";

import Link from "next/link";
import { SOCIAL_LINKS } from "@/lib/social";

export function WhatsAppFloat() {
  return (
    <Link
      href={SOCIAL_LINKS.whatsappCTA}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Kraviona on WhatsApp"
      className="group fixed bottom-[76px] sm:bottom-[80px] right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-[#1EBE5D] via-[#22C55E] to-[#25D366] text-white shadow-[0_8px_24px_rgba(37,211,102,0.45)] border border-white/20 transition-all duration-300 hover:scale-110 hover:shadow-[0_12px_28px_rgba(37,211,102,0.65)] active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
    >
      {/* Official Solid WhatsApp Silhouette SVG */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="white"
        className="h-6 w-6 drop-shadow-sm transition-transform duration-200 group-hover:scale-105"
        aria-hidden="true"
      >
        <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.101-.476-.15-.677.15-.2.3-.777.978-.952 1.178-.176.2-.351.226-.652.075-.301-.15-1.272-.469-2.424-1.496-.897-.799-1.503-1.786-1.68-2.086-.176-.3-.019-.462.132-.612.136-.135.301-.351.451-.527.151-.176.201-.301.301-.502.1-.2.05-.376-.025-.526-.075-.15-.677-1.631-.928-2.234-.244-.588-.493-.509-.677-.518-.175-.009-.376-.009-.577-.009s-.527.075-.802.376c-.276.301-1.053 1.029-1.053 2.509 0 1.48 1.078 2.909 1.229 3.11.15.201 2.122 3.24 5.141 4.544.718.31 1.279.495 1.716.634.721.229 1.378.197 1.897.12.579-.087 1.78-.727 2.031-1.43.251-.703.251-1.305.176-1.43-.075-.125-.276-.201-.577-.351zM12.04 2C6.51 2 2.02 6.49 2.02 12.02c0 1.98.58 3.82 1.58 5.37L2 22l4.78-1.54c1.5 1 3.28 1.58 5.26 1.58 5.53 0 10.02-4.49 10.02-10.02C22.06 6.49 17.57 2 12.04 2z" />
      </svg>

      {/* Interactive Tooltip (Desktop) */}
      <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-md border border-white/10 bg-[#1A3840] px-3 py-1.5 text-xs font-semibold text-white shadow-lg opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:inline-block">
        Chat on WhatsApp
      </span>
    </Link>
  );
}
