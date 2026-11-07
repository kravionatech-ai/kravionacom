import slugify from "slugify";
import { Page } from "../../models/pages/page.model.js";
import { recordActivity } from "../../utils/activityLogger.js";
import { seedPagesData } from "../../data/seedPagesData.js";
import { revalidateFrontend } from "../../utils/revalidateFrontend.js";
import { parseBoolean } from "../../utils/requestValues.js";

const canManagePages = (user) => ["super_admin", "admin", "editor"].includes(user?.role);
const canManageAllPages = (user) => ["super_admin", "admin"].includes(user?.role);

const cleanText = (val) => String(val || "").trim();
const getList = (items) => (Array.isArray(items) ? items.map(cleanText).filter(Boolean) : []);
const safeLink = (value, fallback = "") => {
  const link = cleanText(value);
  if (!link) return fallback;
  return /^(https?:\/\/|mailto:|tel:|\/|#)/i.test(link) ? link : fallback;
};

const normalizePage = (body) => {
  const slug = slugify(cleanText(body.slug || body.title), { lower: true, strict: true });
  return {
    title: cleanText(body.title),
    slug,
    pageType: cleanText(body.pageType) || "standard",
    status: cleanText(body.status) === "draft" ? "draft" : "published",
    hero: {
      badge: cleanText(body.hero?.badge),
      eyebrow: cleanText(body.hero?.eyebrow),
      title: cleanText(body.hero?.title) || cleanText(body.title),
      highlight: cleanText(body.hero?.highlight),
      description: cleanText(body.hero?.description),
      ctaLabel: cleanText(body.hero?.ctaLabel),
      ctaHref: safeLink(body.hero?.ctaHref),
      secondaryCtaLabel: cleanText(body.hero?.secondaryCtaLabel),
      secondaryCtaHref: safeLink(body.hero?.secondaryCtaHref),
      bannerImage: safeLink(body.hero?.bannerImage),
    },
    sections: Array.isArray(body.sections)
      ? body.sections.map((sec, idx) => ({
          sectionId: cleanText(sec.sectionId) || `section-${idx + 1}`,
          sectionType: cleanText(sec.sectionType) || "richText",
          title: cleanText(sec.title),
          subtitle: cleanText(sec.subtitle),
          content: cleanText(sec.content),
          items: Array.isArray(sec.items)
            ? sec.items.map((it) => ({
                title: cleanText(it.title),
                description: cleanText(it.description),
                icon: cleanText(it.icon),
                stat: cleanText(it.stat),
                label: cleanText(it.label),
                link: safeLink(it.link),
                image: safeLink(it.image),
                badge: cleanText(it.badge),
              }))
            : [],
          order: Number(sec.order) || idx,
          isVisible: sec.isVisible !== undefined ? parseBoolean(sec.isVisible, true) : true,
        }))
      : [],
    seo: {
      metaTitle: cleanText(body.seo?.metaTitle) || cleanText(body.title),
      metaDescription: cleanText(body.seo?.metaDescription),
      primaryKeyword: cleanText(body.seo?.primaryKeyword),
      secondaryKeywords: getList(body.seo?.secondaryKeywords),
      searchIntent: cleanText(body.seo?.searchIntent) || "Commercial / Informational",
      h1: cleanText(body.seo?.h1) || cleanText(body.hero?.title) || cleanText(body.title),
      canonicalUrl: safeLink(body.seo?.canonicalUrl),
      robotsMeta: cleanText(body.seo?.robotsMeta) || "index, follow",
      noIndex: parseBoolean(body.seo?.noIndex, false),
      ogTitle: cleanText(body.seo?.ogTitle) || cleanText(body.seo?.metaTitle) || cleanText(body.title),
      ogDescription: cleanText(body.seo?.ogDescription) || cleanText(body.seo?.metaDescription),
      ogImage: safeLink(body.seo?.ogImage) || safeLink(body.hero?.bannerImage),
      twitterCard: cleanText(body.seo?.twitterCard) || "summary_large_image",
      twitterTitle: cleanText(body.seo?.twitterTitle) || cleanText(body.seo?.ogTitle),
      twitterDescription: cleanText(body.seo?.twitterDescription) || cleanText(body.seo?.ogDescription),
      schemaType: cleanText(body.seo?.schemaType) || "WebPage",
      customSchema: cleanText(body.seo?.customSchema),
      faqSchema: Array.isArray(body.seo?.faqSchema)
        ? body.seo.faqSchema.map((f) => ({ question: cleanText(f.question), answer: cleanText(f.answer) })).filter((f) => f.question && f.answer)
        : [],
      breadcrumbSchema: Array.isArray(body.seo?.breadcrumbSchema)
        ? body.seo.breadcrumbSchema.map((b) => ({ name: cleanText(b.name), url: safeLink(b.url) })).filter((b) => b.name)
        : [],
      internalLinks: Array.isArray(body.seo?.internalLinks)
        ? body.seo.internalLinks.map((il) => ({ label: cleanText(il.label), url: safeLink(il.url), anchorText: cleanText(il.anchorText) })).filter((il) => il.url)
        : [],
    },
  };
};

/**
 * Public: Get published page by slug
 */
export const getPublicPageBySlug = async (req, res) => {
  try {
    const slug = slugify(cleanText(req.params.slug), { lower: true, strict: true });
    const page = await Page.findOne({ slug, status: "published" }).lean();
    if (!page) {
      return res.status(404).json({ success: false, message: "Page not found or is in draft status" });
    }
    return res.status(200).json({ success: true, data: page });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Failed to fetch page" });
  }
};

/**
 * Public: Get all published pages (for sitemap / footer)
 */
export const getAllPublicPages = async (_req, res) => {
  try {
    const pages = await Page.find({ status: "published", "seo.noIndex": { $ne: true } })
      .select("title slug pageType seo.metaTitle seo.canonicalUrl updatedAt")
      .sort({ slug: 1 })
      .lean();
    return res.status(200).json({ success: true, count: pages.length, data: pages });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Failed to fetch public pages" });
  }
};

/**
 * Admin: Get all pages with search, filters, pagination
 */
export const getAdminPages = async (req, res) => {
  try {
    if (!canManagePages(req.user)) return res.status(403).json({ success: false, message: "Forbidden" });

    const search = cleanText(req.query.search);
    const pageType = cleanText(req.query.pageType);
    const status = cleanText(req.query.status);

    const filter = {};
    if (search) {
      const searchRegex = { $regex: search, $options: "i" };
      filter.$or = [{ title: searchRegex }, { slug: searchRegex }, { "seo.primaryKeyword": searchRegex }];
    }
    if (pageType) filter.pageType = pageType;
    if (status) filter.status = status;

    const [data, totalPublished, totalDrafts] = await Promise.all([
      Page.find(filter).sort({ updatedAt: -1 }).lean(),
      Page.countDocuments({ status: "published" }),
      Page.countDocuments({ status: "draft" }),
    ]);

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
      stats: { total: data.length, published: totalPublished, drafts: totalDrafts },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Failed to load pages" });
  }
};

/**
 * Admin: Get single page by ID or Slug
 */
export const getAdminPageByIdOrSlug = async (req, res) => {
  try {
    if (!canManagePages(req.user)) return res.status(403).json({ success: false, message: "Forbidden" });
    const { id } = req.params;
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    const filter = isObjectId ? { _id: id } : { slug: cleanText(id).toLowerCase() };

    const page = await Page.findOne(filter).lean();
    if (!page) return res.status(404).json({ success: false, message: "Page not found" });

    return res.status(200).json({ success: true, data: page });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Failed to load page" });
  }
};

/**
 * Admin: Create new page
 */
export const createPage = async (req, res) => {
  try {
    if (!canManagePages(req.user)) return res.status(403).json({ success: false, message: "Forbidden" });

    const normalized = normalizePage(req.body);
    if (!normalized.title) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }

    const existing = await Page.findOne({ slug: normalized.slug });
    if (existing) {
      return res.status(409).json({ success: false, message: `A page with slug '${normalized.slug}' already exists.` });
    }

    const page = await Page.create({
      ...normalized,
      createdBy: req.user.id,
      updatedBy: req.user.id,
    });

    await recordActivity(req, {
      userID: req.user.id,
      module: "pages",
      action: "created",
      resourceId: page._id,
      resourceName: page.title,
      after: { title: page.title, slug: page.slug, status: page.status },
    });

    // Revalidate frontend route if published
    const routePath = page.slug === "home" ? "/" : `/${page.slug}`;
    await revalidateFrontend({
      paths: [routePath],
      tags: ["pages", `page-${page.slug}`],
    });

    return res.status(201).json({ success: true, message: "Page created and synced live", data: page });
  } catch (error) {
    return res.status(error.code === 11000 ? 409 : 500).json({
      success: false,
      message: error.code === 11000 ? "A page with this slug already exists" : error.message,
    });
  }
};

/**
 * Admin: Update page with Revision History & Live Revalidation
 */
export const updatePage = async (req, res) => {
  try {
    if (!canManagePages(req.user)) return res.status(403).json({ success: false, message: "Forbidden" });
    const { id } = req.params;
    const page = await Page.findById(id);
    if (!page) return res.status(404).json({ success: false, message: "Page not found" });

    const before = {
      title: page.title,
      slug: page.slug,
      status: page.status,
      hero: page.hero,
      sections: page.sections,
      seo: page.seo,
    };

    const normalized = normalizePage(req.body);

    // Track revision
    if (!page.revisions) page.revisions = [];
    page.revisions.push({
      timestamp: new Date(),
      updatedBy: req.user.id,
      note: req.body.revisionNote || "Page updated via Admin CMS",
      snapshotTitle: before.title,
      snapshot: before,
    });

    // Keep last 25 revisions max
    if (page.revisions.length > 25) {
      page.revisions = page.revisions.slice(-25);
    }

    Object.assign(page, normalized);
    page.updatedBy = req.user.id;
    await page.save();

    await recordActivity(req, {
      userID: req.user.id,
      module: "pages",
      action: "updated",
      resourceId: page._id,
      resourceName: page.title,
      before: { title: before.title, slug: before.slug, status: before.status },
      after: { title: page.title, slug: page.slug, status: page.status },
    });

    // Live Data Synchronization
    const pathsToRevalidate = [page.slug === "home" ? "/" : `/${page.slug}`];
    if (before.slug && before.slug !== page.slug) {
      pathsToRevalidate.push(before.slug === "home" ? "/" : `/${before.slug}`);
    }

    await revalidateFrontend({
      paths: pathsToRevalidate,
      tags: ["pages", `page-${page.slug}`],
    });

    return res.status(200).json({
      success: true,
      message: page.status === "published" ? "Page published and synced live!" : "Draft saved successfully.",
      data: page,
    });
  } catch (error) {
    return res.status(error.code === 11000 ? 409 : 500).json({
      success: false,
      message: error.code === 11000 ? "A page with this slug already exists" : error.message,
    });
  }
};

/**
 * Admin: Delete page
 */
export const deletePage = async (req, res) => {
  try {
    if (!canManageAllPages(req.user)) return res.status(403).json({ success: false, message: "Forbidden" });
    const { id } = req.params;
    const page = await Page.findByIdAndDelete(id);
    if (!page) return res.status(404).json({ success: false, message: "Page not found" });

    await recordActivity(req, {
      userID: req.user.id,
      module: "pages",
      action: "deleted",
      resourceId: page._id,
      resourceName: page.title,
      before: { title: page.title, slug: page.slug },
    });

    const routePath = page.slug === "home" ? "/" : `/${page.slug}`;
    await revalidateFrontend({
      paths: [routePath],
      tags: ["pages", `page-${page.slug}`],
    });

    return res.status(200).json({ success: true, message: "Page deleted and cache cleared" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Failed to delete page" });
  }
};

/**
 * Admin: Seed initial core pages (Home, About, Contact, Privacy, Terms)
 */
export const seedInitialPages = async (req, res) => {
  try {
    if (!canManagePages(req.user)) return res.status(403).json({ success: false, message: "Forbidden" });

    let inserted = 0;
    let updated = 0;

    for (const item of seedPagesData) {
      const existing = await Page.findOne({ slug: item.slug });
      await Page.findOneAndUpdate(
        { slug: item.slug },
        { $set: { ...item, createdBy: req.user.id, updatedBy: req.user.id } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      if (existing) updated++;
      else inserted++;
    }

    await recordActivity(req, {
      userID: req.user.id,
      module: "pages",
      action: "seeded",
      resourceName: "Standard Core Pages Seed",
      after: { inserted, updated, total: seedPagesData.length },
    });

    const pathsToRevalidate = ["/", "/about", "/contact", "/privacy-policy", "/terms"];
    await revalidateFrontend({
      paths: pathsToRevalidate,
      tags: ["pages", ...seedPagesData.map((p) => `page-${p.slug}`)],
    });

    const total = await Page.countDocuments();
    return res.status(200).json({
      success: true,
      message: `Successfully seeded core pages. ${inserted} created, ${updated} updated.`,
      stats: { inserted, updated, total },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Unable to seed pages" });
  }
};
