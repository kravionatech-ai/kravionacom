import mongoose, { Schema, model } from "mongoose";

const sectionItemSchema = new Schema(
  {
    title: { type: String, trim: true },
    description: { type: String, trim: true },
    icon: { type: String, trim: true },
    stat: { type: String, trim: true },
    label: { type: String, trim: true },
    link: { type: String, trim: true },
    image: { type: String, trim: true },
    badge: { type: String, trim: true },
  },
  { _id: false },
);

const sectionSchema = new Schema(
  {
    sectionId: { type: String, trim: true },
    sectionType: {
      type: String,
      trim: true,
      default: "richText",
    },
    title: { type: String, trim: true },
    subtitle: { type: String, trim: true },
    content: { type: String, trim: true },
    items: [sectionItemSchema],
    order: { type: Number, default: 0 },
    isVisible: { type: Boolean, default: true },
  },
  { _id: false },
);

const faqItemSchema = new Schema(
  {
    question: { type: String, trim: true },
    answer: { type: String, trim: true },
  },
  { _id: false },
);

const breadcrumbItemSchema = new Schema(
  {
    name: { type: String, trim: true },
    url: { type: String, trim: true },
  },
  { _id: false },
);

const internalLinkSchema = new Schema(
  {
    label: { type: String, trim: true },
    url: { type: String, trim: true },
    anchorText: { type: String, trim: true },
  },
  { _id: false },
);

const revisionSchema = new Schema(
  {
    timestamp: { type: Date, default: Date.now },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    note: { type: String, trim: true },
    snapshotTitle: { type: String, trim: true },
    snapshot: { type: Schema.Types.Mixed },
  },
  { _id: false },
);

const pageSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Page title is required"],
      trim: true,
      maxlength: 180,
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    pageType: {
      type: String,
      enum: ["standard", "home", "about", "contact", "legal", "custom"],
      default: "standard",
      index: true,
    },
    status: {
      type: String,
      enum: ["published", "draft", "archived"],
      default: "published",
      index: true,
    },
    hero: {
      badge: { type: String, trim: true, maxlength: 100 },
      eyebrow: { type: String, trim: true, maxlength: 100 },
      title: { type: String, trim: true, maxlength: 200 },
      highlight: { type: String, trim: true, maxlength: 120 },
      description: { type: String, trim: true, maxlength: 2000 },
      ctaLabel: { type: String, trim: true, maxlength: 80 },
      ctaHref: { type: String, trim: true, maxlength: 300 },
      secondaryCtaLabel: { type: String, trim: true, maxlength: 80 },
      secondaryCtaHref: { type: String, trim: true, maxlength: 300 },
      bannerImage: { type: String, trim: true, maxlength: 500 },
    },
    sections: [sectionSchema],
    seo: {
      metaTitle: { type: String, trim: true, maxlength: 180 },
      metaDescription: { type: String, trim: true, maxlength: 350 },
      primaryKeyword: { type: String, trim: true, maxlength: 120 },
      secondaryKeywords: [{ type: String, trim: true, maxlength: 100 }],
      searchIntent: { type: String, trim: true, default: "Commercial / Informational" },
      h1: { type: String, trim: true, maxlength: 220 },
      canonicalUrl: { type: String, trim: true, maxlength: 500 },
      robotsMeta: { type: String, trim: true, default: "index, follow" },
      noIndex: { type: Boolean, default: false },
      ogTitle: { type: String, trim: true, maxlength: 180 },
      ogDescription: { type: String, trim: true, maxlength: 350 },
      ogImage: { type: String, trim: true, maxlength: 500 },
      twitterCard: { type: String, trim: true, default: "summary_large_image" },
      twitterTitle: { type: String, trim: true, maxlength: 180 },
      twitterDescription: { type: String, trim: true, maxlength: 350 },
      schemaType: { type: String, trim: true, default: "WebPage" },
      customSchema: { type: String, trim: true },
      faqSchema: [faqItemSchema],
      breadcrumbSchema: [breadcrumbItemSchema],
      internalLinks: [internalLinkSchema],
    },
    revisions: [revisionSchema],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", index: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

pageSchema.index({ status: 1, slug: 1 });
pageSchema.index({ pageType: 1, status: 1 });

export const Page = mongoose.models.Page || model("Page", pageSchema);
