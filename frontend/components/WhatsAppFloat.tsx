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
      className="group fixed bottom-[74px] sm:bottom-[78px] right-6 z-40 flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-gradient-to-tr from-[#20ba5a] to-[#25D366] text-white shadow-[0_8px_20px_rgba(37,211,102,0.4)] transition-all duration-300 hover:scale-110 hover:shadow-[0_10px_28px_rgba(37,211,102,0.6)] active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2"
    >
      {/* Official WhatsApp SVG Vector (Solid White Silhouette) */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-6 w-6 sm:h-6.5 sm:w-6.5 drop-shadow-sm transition-transform duration-200 group-hover:scale-105"
        aria-hidden="true"
      >
        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.669-.699c.969.578 1.942.88 2.79.88h.005c3.18 0 5.767-2.586 5.768-5.766.001-3.18-2.585-5.766-5.772-5.766zm3.375 8.204c-.144.405-.837.774-1.17.824-.312.045-.634.053-1.854-.45-1.571-.648-2.574-2.25-2.653-2.355-.079-.105-.638-.849-.638-1.619 0-.77.404-1.15.548-1.306.144-.156.313-.195.418-.195.104 0 .209.001.299.006.096.005.225-.036.352.269.13.313.444 1.084.483 1.163.039.078.065.17.013.273-.052.105-.078.17-.156.261-.078.092-.165.204-.235.274-.078.078-.16.163-.069.319.091.157.405.669.869 1.082.597.533 1.101.698 1.258.776.157.078.248.065.34-.039.091-.105.391-.456.495-.613.104-.157.209-.13.352-.078.144.052.913.43 1.07.509.156.078.261.117.299.183.039.065.039.378-.105.783z" />
        <path d="M12.042 2c-5.523 0-10 4.477-10 10 0 1.764.457 3.424 1.255 4.873l-1.332 4.864 4.985-1.307c1.403.759 3.007 1.187 4.708 1.187h.007c5.523 0 10-4.477 10-10 0-5.523-4.477-10-10-10zm0 18.232h-.006c-1.554 0-3.078-.418-4.407-1.209l-.316-.188-2.969.779.792-2.894-.206-.328c-.868-1.381-1.326-2.983-1.326-4.631 0-4.654 3.787-8.441 8.444-8.441 2.256 0 4.377.879 5.972 2.475 1.595 1.595 2.473 3.717 2.473 5.973 0 4.654-3.787 8.441-8.447 8.441z" />
      </svg>

      {/* Interactive Tooltip (Desktop) */}
      <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-md border border-white/10 bg-[#1A3840] px-3 py-1.5 text-xs font-semibold text-white shadow-lg opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:inline-block">
        Chat on WhatsApp
      </span>
    </Link>
  );
}
