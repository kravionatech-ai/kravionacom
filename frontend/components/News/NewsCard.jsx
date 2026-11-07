"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock, Sparkles } from "lucide-react";

const stripHtml = (value = "") => value.replace(/<[^>]*>?/gm, "").trim();

export function getReadingTime(post) {
  if (post?.readingTimeMinutes) return `${post.readingTimeMinutes} min read`;
  const text = stripHtml(`${post?.content || ""} ${post?.excerpt || ""}`);
  const words = text.split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 210) || 3)} min read`;
}

export function getPostDate(post) {
  const raw = post?.publishedAt || post?.createdAt || post?.updatedAt;
  if (!raw) return "";
  const d = typeof raw === "object" && raw.$date ? raw.$date : raw;
  try {
    return new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export function getImageUrl(post) {
  return post?.featuredImage?.url || post?.featuredImage || null;
}

export default function NewsCard({ post }) {
  if (!post) return null;

  const imageUrl = getImageUrl(post);
  const category = post?.category?.name || "AI News";
  const date = getPostDate(post);
  const readingTime = getReadingTime(post);
  const excerpt = stripHtml(post?.excerpt || post?.content || "").substring(0, 140);

  const postHref = `/${post?.category?.slug || "news"}/${post.slug}`;

  return (
    <Link
      href={postHref}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-[#E3E9E7] shadow-xs hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 h-full"
    >
      {/* Editorial Image with Category Overlay */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#102629] flex-shrink-0">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={post?.featuredImage?.altText || post?.title || ""}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#102629] to-[#173F43] flex items-center justify-center">
            <Sparkles size={28} className="text-[#00CBA9] opacity-40" />
          </div>
        )}

        {/* Category Pill Tag */}
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center gap-1.5 bg-[#102629]/90 backdrop-blur-md text-[#00CBA9] text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full border border-white/10 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00CBA9]" />
            {category}
          </span>
        </div>
      </div>

      {/* Card Content Area */}
      <div className="flex flex-col flex-1 p-5 sm:p-6 justify-between">
        <div>
          {/* Headline */}
          <h3 className="font-[family-name:var(--font-heading)] text-base sm:text-lg font-bold text-[#172426] leading-snug line-clamp-2 group-hover:text-[#173F43] transition-colors mb-2">
            {post.title}
          </h3>

          {/* Excerpt */}
          {excerpt && (
            <p className="text-xs sm:text-sm text-[#697A7B] leading-relaxed line-clamp-3 mb-4">
              {excerpt}
            </p>
          )}
        </div>

        {/* Footer Meta Row */}
        <div className="pt-3.5 mt-auto border-t border-[#E3E9E7] flex items-center justify-between text-[11px] sm:text-xs text-[#697A7B]">
          <div className="flex items-center gap-3">
            {date && (
              <span className="inline-flex items-center gap-1">
                <CalendarDays size={12} className="text-[#173F43]" />
                {date}
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <Clock size={12} className="text-[#173F43]" />
              {readingTime}
            </span>
          </div>

          <span className="inline-flex items-center gap-1 font-bold text-[#F15A35] group-hover:text-[#173F43] group-hover:translate-x-1 transition-all">
            <span>Read</span>
            <ArrowRight size={13} />
          </span>
        </div>
      </div>
    </Link>
  );
}
