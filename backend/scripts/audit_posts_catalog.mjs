import fs from "fs";

const rawData = fs.readFileSync("C:/Users/pc/Desktop/kraviona.posts.json", "utf8");
const posts = JSON.parse(rawData);

console.log(`Loaded ${posts.length} records from kraviona.posts.json`);

// Backlink data from kraviona_backlinks.csv if available
let knownBacklinks = {};
try {
  const blContent = fs.readFileSync("C:/Users/pc/Downloads/kraviona_backlinks.csv", "utf8");
  // CSV analysis
  const lines = blContent.split("\n").filter(Boolean);
  lines.slice(1).forEach(line => {
    const parts = line.split(",");
    if (parts[2]) {
      const target = parts[2].replace(/"/g, "").trim();
      knownBacklinks[target] = (knownBacklinks[target] || 0) + 1;
    }
  });
} catch (e) {
  console.log("No backlink CSV found or error reading:", e.message);
}

// Classification Logic per the Prompt's Strict Guidelines:
// - KEEP: High-relevance, unique, directly aligned with 5 pillars (AI, Next.js, MERN, SEO), evergreen, high word count.
// - UPDATE: Good foundational content that needs refreshing (dates, humanized copy, internal service CTAs, FAQ schema).
// - MERGE: Content targeting identical search intent/cannibalizing keywords (e.g. redundant MERN roadmaps or duplicate AI news).
// - REDIRECT: Outdated or cannibalizing URL redirected to the authoritative consolidated URL.
// - REMOVE: Thin, obsolete, zero-value content with no search demand and no replacement page.
// - HOLD FOR MORE DATA: Ambiguous or potentially high-impression URLs where GSC query/click confirmation is required before modifying.

const auditItems = posts.map((p, index) => {
  const id = p._id?.$oid || (typeof p._id === "object" ? JSON.stringify(p._id) : String(p._id)) || `post-${index + 1}`;
  const title = p.title || "Untitled";
  const slug = p.slug || "";
  const catSlug = p.category?.slug || (typeof p.category === "string" ? p.category.toLowerCase().replace(/\s+/g, "-") : "blog");
  const catName = p.category?.name || (typeof p.category === "string" ? p.category : "General");
  const type = p.contentType || "blog";
  const views = typeof p.views === "number" ? p.views : 0;
  const wordCount = p.wordCount || (p.content ? p.content.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length : 0);
  const status = p.status || "published";
  const canonicalUrl = p.canonicalUrl || `https://www.kraviona.com/${catSlug}/${slug}`;
  const url = canonicalUrl;
  const focusKeywords = Array.isArray(p.focusKeywords) ? p.focusKeywords : (p.focusKeywords ? [p.focusKeywords] : []);
  const secondaryKeywords = Array.isArray(p.keywords) ? p.keywords : [];
  const publishedAt = p.publishedAt || p.createdAt || "";
  const updatedAt = p.updatedAt || "";
  const authorName = p.author?.name || "Amar Kumar";

  const content = p.content || "";
  const internalLinkMatches = content.match(/href=["'](https?:\/\/(www\.)?kraviona\.com\/[^"']*|\/[^"']*)["']/gi) || [];
  const externalLinkMatches = content.match(/href=["']https?:\/\/(?!www\.kraviona\.com)[^"']*["']/gi) || [];
  const internalLinksCount = internalLinkMatches.length;
  const externalLinksCount = externalLinkMatches.length;

  const backlinksCount = knownBacklinks[url] || 0;

  return {
    index: index + 1,
    id,
    title,
    slug,
    url,
    canonicalUrl,
    catSlug,
    catName,
    type,
    views, // Clearly documented as internal post views
    wordCount,
    status,
    focusKeywords,
    secondaryKeywords,
    publishedAt,
    updatedAt,
    authorName,
    internalLinksCount,
    externalLinksCount,
    backlinksCount,
    schemaType: p.schemaType || "Article",
    isNoIndex: Boolean(p.isNoIndex),
    isNoFollow: Boolean(p.isNoFollow),
    previousSlugs: p.previousSlugs || []
  };
});

// Write to JSON for inspection
fs.writeFileSync("backend/scripts/posts_inventory.json", JSON.stringify(auditItems, null, 2), "utf8");
console.log("Saved posts_inventory.json with", auditItems.length, "items.");
