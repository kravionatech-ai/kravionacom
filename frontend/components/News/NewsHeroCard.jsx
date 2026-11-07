"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock, Sparkles, Tag } from "lucide-react";
import { getImageUrl, getPostDate, getReadingTime } from "./NewsCard";

const stripHtml = (value = "") => value.replace(/<[^>]*>?/gm, "").trim();

export default function NewsHeroCard({ post }) {
  if (!post) return null;

  const imageUrl = getImageUrl(post);
  const category = post?.category?.name || "AI News";
  const date = getPostDate(post);
  const readingTime = getReadingTime(post);
  const excerpt = stripHtml(post?.excerpt || post?.content || "").substring(0, 220);

  const postHref = `/${post?.category?.slug || "news"}/${post.slug}`;

  return (
    <Link
      href={postHref}
      className="group relative flex flex-col lg:flex-row overflow-hidden rounded-2xl sm:rounded-3xl bg-white border border-[#E3E9E7] shadow-sm hover:shadow-xl hover:border-[#00CBA9]/40 transition-all duration-500"
    >
      {/* Content Side (55% width on desktop, stacked below on mobile) */}
      <div className="flex flex-col justify-between p-6 sm:p-8 lg:p-10 lg:w-[55%] z-10 order-2 lg:order-1">
        <div>
          {/* Eyebrow & Category Badges */}
          <div className="flex items-center gap-2.5 flex-wrap mb-4">
            <span className="inline-flex items-center gap-1.5 bg-[#F15A35]/10 text-[#F15A35] border border-[#F15A35]/25 text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F15A35] animate-pulse" />
              Featured Dispatch
            </span>
            <span className="inline-flex items-center gap-1 bg-[#102629] text-[#00CBA9] text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
              <Tag size={10} />
              {category}
            </span>
          </div>

          {/* Headline */}
          <h2 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#172426] leading-tight group-hover:text-[#173F43] transition-colors">
            {post.title}
          </h2>

          {/* Excerpt */}
          {excerpt && (
            <p className="text-[#697A7B] text-sm sm:text-base leading-relaxed mt-3.5 line-clamp-3 sm:line-clamp-4">
              {excerpt}
            </p>
          )}
        </div>

        {/* Footer Meta & CTA */}
        <div className="pt-6 mt-6 border-t border-[#E3E9E7] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs text-[#697A7B]">
            {date && (
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays size={13} className="text-[#173F43]" />
                {date}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5">
              <Clock size={13} className="text-[#173F43]" />
              {readingTime}
            </span>
          </div>

          <span className="inline-flex items-center gap-2 text-sm font-bold text-[#F15A35] group-hover:text-[#173F43] group-hover:gap-3 transition-all">
            <span>Read full story</span>
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>

      {/* Editorial Image Side (45% width on desktop, stacked top on mobile) */}
      <div className="relative w-full lg:w-[45%] min-h-[240px] sm:min-h-[300px] lg:min-h-[380px] bg-[#102629] overflow-hidden order-1 lg:order-2">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={post?.featuredImage?.altText || post?.title || ""}
            fill
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#102629] to-[#173F43] flex flex-col items-center justify-center p-8 text-center">
            <Sparkles size={40} className="text-[#00CBA9] mb-3 opacity-60" />
            <span className="text-white/40 text-xs font-bold uppercase tracking-widest">
              Kraviona Technology Dispatch
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent lg:hidden" />
      </div>
    </Link>
  );
}
