"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  Filter,
  Loader2,
  Newspaper,
  RefreshCw,
  Search,
  Sparkles,
  Zap,
  X,
} from "lucide-react";
import { API_URL } from "@/utils/api";
import NewsCard from "./NewsCard";
import NewsHeroCard from "./NewsHeroCard";

const POSTS_FETCH_LIMIT = 12;

const parsePosts = (json) =>
  Array.isArray(json?.posts)
    ? json.posts
    : Array.isArray(json?.data)
      ? json.data
      : Array.isArray(json)
        ? json
        : [];

async function fetchNewsPosts({ page = 1, limit = POSTS_FETCH_LIMIT, category = "", search = "" } = {}) {
  const params = new URLSearchParams({
    contentType: "news",
    page: String(page),
    limit: String(limit),
  });
  if (category) params.set("category", category);
  if (search) params.set("search", search);

  const res = await fetch(`${API_URL}/public/posts?${params.toString()}`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  return res.ok ? res.json() : {};
}

async function fetchNewsCategories() {
  try {
    const res = await fetch(`${API_URL}/categories?contentType=news`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    return res.ok ? res.json() : {};
  } catch {
    return {};
  }
}

// Fixed core categories to guarantee functional filters even before API returns
const DEFAULT_CATEGORIES = [
  { slug: "", name: "All News" },
  { slug: "ai-news", name: "AI News" },
  { slug: "ai-and-automation", name: "AI & Automation" },
  { slug: "blockchain", name: "Software & Tech" },
];

export default function NewsListingLayout({ initialPosts = [], initialPagination = {} }) {
  const [posts, setPosts] = useState(initialPosts);
  const [pagination, setPagination] = useState(initialPagination);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  // Debounce search by 350ms
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  // Load categories and merge with defaults
  useEffect(() => {
    fetchNewsCategories()
      .then((json) => {
        const remote = Array.isArray(json?.data) ? json.data : [];
        if (remote.length > 0) {
          const mergedMap = new Map();
          DEFAULT_CATEGORIES.forEach((c) => mergedMap.set(c.slug, c));
          remote.forEach((c) => {
            if (c.slug && !mergedMap.has(c.slug)) {
              mergedMap.set(c.slug, { slug: c.slug, name: c.name });
            }
          });
          setCategories(Array.from(mergedMap.values()));
        }
      })
      .catch(() => {});
  }, []);

  // Fetch posts on filter/search change
  const loadPosts = useCallback(
    async (opts = {}) => {
      const isLoadMore = opts.loadMore === true;
      const currentPage = isLoadMore ? page + 1 : 1;

      isLoadMore ? setLoadingMore(true) : setLoading(true);
      setError(null);

      try {
        const json = await fetchNewsPosts({
          page: currentPage,
          limit: POSTS_FETCH_LIMIT,
          category: selectedCategory,
          search: debouncedSearch,
        });
        const newPosts = parsePosts(json);

        if (isLoadMore) {
          setPosts((prev) => [...prev, ...newPosts]);
          setPage(currentPage);
        } else {
          setPosts(newPosts);
          setPage(1);
        }
        setPagination(json?.pagination || {});
      } catch {
        setError("Unable to load latest news. Please refresh or try again.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [selectedCategory, debouncedSearch, page]
  );

  // Trigger load on filter/search update
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (!mounted) {
      setMounted(true);
      return;
    }
    loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, debouncedSearch]);

  const hasMore = pagination?.hasNextPage || (pagination?.page < pagination?.totalPages);
  const isFiltered = Boolean(debouncedSearch || selectedCategory);
  const featuredPost = !isFiltered && posts.length > 0 ? posts[0] : null;
  const gridPosts = !isFiltered && posts.length > 0 ? posts.slice(1) : posts;

  return (
    <div className="min-h-screen bg-[#F5F7F6] text-[#172426]">
      {/* ── 1. NEWS HERO SECTION ────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#102629] via-[#143338] to-[#173F43] pt-24 pb-16 sm:pb-20 border-b border-[#173F43]">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#00CBA9]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-72 h-72 bg-[#F15A35]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb path */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-white/50 mb-6 font-medium">
            <Link href="/" className="hover:text-[#00CBA9] transition-colors">
              Home
            </Link>
            <ChevronRight size={12} className="text-white/30" />
            <span className="text-[#00CBA9] font-bold">Newsroom</span>
          </nav>

          {/* Eyebrow Label */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-[0.2em] bg-[#F15A35]/15 text-[#F15A35] border border-[#F15A35]/30 mb-5 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F15A35] animate-pulse" />
            KRAVIONA NEWS
          </div>

          {/* Main Title */}
          <h1 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15] max-w-4xl">
            Latest Technology & AI Insights
          </h1>

          {/* Editorial Description */}
          <p className="mt-4 text-base sm:text-lg text-white/75 max-w-2xl leading-relaxed">
            Authoritative reporting, architectural deep-dives, and market intelligence across artificial intelligence, autonomous agents, modern full-stack web systems, and digital growth.
          </p>

          {/* Key Topics Badges */}
          <div className="mt-8 flex flex-wrap items-center gap-2.5 pt-6 border-t border-white/10 text-xs text-white/60">
            <span className="font-bold text-white/80 mr-1 flex items-center gap-1.5">
              <Zap size={14} className="text-[#00CBA9]" /> Focus Areas:
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-white/80">
              Autonomous AI Agents
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-white/80">
              Compute & GPU Infrastructure
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-white/80">
              Vibe Coding & Next.js
            </span>
            <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-white/80">
              Enterprise Zero Trust
            </span>
          </div>
        </div>
      </section>

      {/* ── 2. STICKY SEARCH & CATEGORY FILTER BAR ───────────────────────────── */}
      <section className="bg-white border-b border-[#E3E9E7] sticky top-[64px] z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#697A7B] pointer-events-none" />
            <input
              type="text"
              placeholder="Search news, topics, keywords…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 text-sm bg-[#F5F7F6] border border-[#E3E9E7] rounded-xl text-[#172426] placeholder-[#697A7B] outline-none focus:border-[#00CBA9] focus:bg-white focus:ring-2 focus:ring-[#00CBA9]/20 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#697A7B] hover:text-[#172426] p-0.5 rounded-full hover:bg-gray-200 transition-colors"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 -mx-4 px-4 md:mx-0 md:px-0">
            <span className="hidden lg:flex items-center gap-1.5 text-xs font-bold text-[#697A7B] mr-1 shrink-0">
              <Filter size={13} />
              Filter by:
            </span>
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.slug || "all"}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 shrink-0 flex items-center gap-2 ${
                    isActive
                      ? "bg-[#102629] text-white border border-[#00CBA9]/40 shadow-xs"
                      : "bg-[#F5F7F6] text-[#697A7B] border border-[#E3E9E7] hover:bg-white hover:text-[#172426] hover:border-[#00CBA9]/40"
                  }`}
                >
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#00CBA9]" />}
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 3. MAIN CONTENT AREA ────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-14">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-28 text-center">
            <Loader2 size={40} className="animate-spin text-[#173F43] mb-4" />
            <p className="text-sm font-bold text-[#173F43]">Loading latest dispatches…</p>
          </div>
        ) : error ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-[#E3E9E7] p-8 max-w-lg mx-auto shadow-xs">
            <p className="text-base font-semibold text-[#172426] mb-2">{error}</p>
            <p className="text-xs text-[#697A7B] mb-5">Please check your internet connection or try again.</p>
            <button
              onClick={() => loadPosts()}
              className="inline-flex items-center gap-2 bg-[#F15A35] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#d94b28] transition-all shadow-xs"
            >
              <RefreshCw size={14} />
              Retry Now
            </button>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-[#E3E9E7] p-10 max-w-xl mx-auto shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-[#F5F7F6] border border-[#E3E9E7] flex items-center justify-center mx-auto mb-4 text-[#697A7B]">
              <Newspaper size={30} />
            </div>
            <h3 className="text-xl font-bold text-[#172426]">No news stories found</h3>
            <p className="text-sm text-[#697A7B] mt-2 mb-6">
              {search || selectedCategory
                ? "No articles matched your current query or category filter. Try clearing your search."
                : "Check back soon for latest tech updates."}
            </p>
            {(search || selectedCategory) && (
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("");
                }}
                className="inline-flex items-center gap-2 bg-[#102629] text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-[#173F43] transition-all"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* ── Featured Hero Card (When not searching / filtering) ────── */}
            {featuredPost && (
              <div className="mb-12">
                <NewsHeroCard post={featuredPost} />
              </div>
            )}

            {/* Section Heading & Result Counter */}
            <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#E3E9E7]">
              <div className="flex items-center gap-3">
                <h2 className="font-[family-name:var(--font-heading)] text-xl sm:text-2xl font-black text-[#172426]">
                  {isFiltered ? "Filtered Results" : "Latest Tech Dispatches"}
                </h2>
                {pagination?.total > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-[#102629]/10 text-[#173F43]">
                    {pagination.total} {pagination.total === 1 ? "article" : "articles"}
                  </span>
                )}
              </div>

              {isFiltered && (
                <button
                  onClick={() => {
                    setSearch("");
                    setSelectedCategory("");
                  }}
                  className="text-xs font-bold text-[#F15A35] hover:underline"
                >
                  Reset filters
                </button>
              )}
            </div>

            {/* ── News Card Grid (3 Columns on Large, 2 on Tablet, 1 on Mobile) ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {gridPosts.map((post) => (
                <NewsCard key={post._id || post.slug} post={post} />
              ))}
            </div>

            {/* ── Load More Button ──────────────────────────────────────── */}
            {hasMore && (
              <div className="mt-14 flex justify-center">
                <button
                  onClick={() => loadPosts({ loadMore: true })}
                  disabled={loadingMore}
                  className="inline-flex items-center gap-2.5 bg-[#F15A35] text-white px-8 py-3.5 rounded-xl text-sm font-extrabold hover:bg-[#d94b28] disabled:opacity-60 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Loading stories…
                    </>
                  ) : (
                    <>
                      Load more stories
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </div>
            )}

            {/* ── 4. KRAVIONA EDITORIAL ADVISORY BANNER ──────────────────── */}
            <section className="mt-16 sm:mt-20 rounded-3xl bg-gradient-to-br from-[#102629] to-[#173F43] p-8 sm:p-12 text-white relative overflow-hidden border border-white/10 shadow-lg">
              <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#00CBA9]/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#00CBA9] bg-white/5 border border-white/10 px-3 py-1 rounded-full mb-3">
                    <Sparkles size={12} />
                    Kraviona Engineering & Architecture
                  </div>
                  <h3 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-black text-white leading-tight">
                    Building Next-Generation AI & Software Systems?
                  </h3>
                  <p className="text-white/70 text-sm sm:text-base mt-2.5 leading-relaxed">
                    We architect scalable full-stack web platforms, deploy autonomous AI workflow agents, and optimize high-throughput database systems for forward-thinking enterprises.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 shrink-0">
                  <Link
                    href="/services"
                    className="inline-flex items-center justify-center gap-2 bg-[#F15A35] text-white px-6 py-3.5 rounded-xl text-sm font-bold hover:bg-[#d94b28] transition-all shadow-xs"
                  >
                    <span>Explore Our Services</span>
                    <ArrowRight size={15} />
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white border border-white/20 px-6 py-3.5 rounded-xl text-sm font-bold transition-all"
                  >
                    Contact Engineers
                  </Link>
                </div>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
