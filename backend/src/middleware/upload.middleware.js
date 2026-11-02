import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinary } from "../config/cloudinary.js";
import config from "../config/config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Local directories for disk storage fallback
const UPLOAD_ROOT = path.resolve(__dirname, "../../public/uploads");
const IMAGES_DIR = path.join(UPLOAD_ROOT, "images");
const MEDIA_DIR = path.join(UPLOAD_ROOT, "media");

try {
  if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR, { recursive: true });
  if (!fs.existsSync(MEDIA_DIR)) fs.mkdirSync(MEDIA_DIR, { recursive: true });
} catch (dirErr) {
  console.error("Failed to ensure upload directories:", dirErr.message);
}

// Check if real Cloudinary credentials are provided (not empty and not placeholders)
export const isCloudinaryConfigured = () => {
  const name = config.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME || "";
  const key = config.CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_KEY || "";
  const secret = config.CLOUDINARY_API_SECRET || process.env.CLOUDINARY_API_SECRET || "";

  if (!name || !key || !secret) return false;
  if (
    name.includes("your_cloudinary") ||
    key.includes("your_cloudinary") ||
    secret.includes("your_cloudinary")
  ) {
    return false;
  }
  return true;
};

// Disk Storage Implementation
const sanitizeFileName = (originalName) => {
  const ext = path.extname(originalName) || "";
  const base = path
    .basename(originalName, ext)
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 50);
  const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  return `${base || "file"}-${unique}${ext}`;
};

const diskStorage = multer.diskStorage({
  destination: (_req, file, cb) => {
    const isImage = file.mimetype.startsWith("image/");
    const targetDir = isImage ? IMAGES_DIR : MEDIA_DIR;
    cb(null, targetDir);
  },
  filename: (_req, file, cb) => {
    cb(null, sanitizeFileName(file.originalname));
  },
});

const imageParams = {
  folder: "kravionatech/images",
  format: "webp",
  transformation: [
    {
      width: 1920,
      height: 1920,
      crop: "limit",
      quality: "auto:good",
    },
  ],
};

let postImageStorage;
let mediaStorage;

if (isCloudinaryConfigured()) {
  try {
    postImageStorage = new CloudinaryStorage({
      cloudinary,
      params: imageParams,
    });

    mediaStorage = new CloudinaryStorage({
      cloudinary,
      params: async (_req, file) => ({
        folder: file.mimetype.startsWith("image/")
          ? "kravionatech/images"
          : "kravionatech/media",
        resource_type: file.mimetype.startsWith("video/")
          ? "video"
          : file.mimetype.startsWith("image/")
            ? "image"
            : "raw",
        ...(file.mimetype.startsWith("image/") ? imageParams : {}),
      }),
    });
  } catch (err) {
    console.warn("Failed to initialize Cloudinary storage, using diskStorage:", err.message);
    postImageStorage = diskStorage;
    mediaStorage = diskStorage;
  }
} else {
  postImageStorage = diskStorage;
  mediaStorage = diskStorage;
}

const allowedMediaTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "video/mp4",
  "video/mpeg",
  "video/quicktime",
  "video/x-matroska",
  "video/webm",
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain",
];

const mediaFileFilter = (_req, file, callback) => {
  if (file.mimetype.startsWith("image/") || allowedMediaTypes.includes(file.mimetype)) {
    callback(null, true);
    return;
  }
  callback(new Error(`Unsupported file type: ${file.mimetype}`), false);
};

const populatePublicUrl = (req, file) => {
  if (!file) return;
  if (!file.path || !file.path.startsWith("http")) {
    const proto = req.headers["x-forwarded-proto"] || req.protocol || "https";
    const host = req.get("host") || "api.kraviona.com";
    const folder = file.mimetype.startsWith("image/") ? "images" : "media";
    const publicUrl = `${proto}://${host}/uploads/${folder}/${file.filename}`;
    file.fileUrl = publicUrl;
    file.path = publicUrl;
  } else {
    file.fileUrl = file.path;
  }
};

// Middleware for featured image uploads in posts (multipart single file)
export const uploadMiddleware = (req, res, next) => {
  const activeStorage = isCloudinaryConfigured() ? postImageStorage : diskStorage;
  const multerInstance = multer({
    storage: activeStorage,
    fileFilter: (_req, file, callback) => {
      if (file.mimetype.startsWith("image/")) {
        callback(null, true);
        return;
      }
      callback(new Error("Only image files are supported"), false);
    },
    limits: { fileSize: 10 * 1024 * 1024 },
  }).single("featuredImage");

  multerInstance(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    if (req.file) {
      populatePublicUrl(req, req.file);
    }
    next();
  });
};

// Resilient media upload middleware for /media/upload
export const mediaUploadMiddleware = (req, res, next) => {
  const activeStorage = isCloudinaryConfigured() ? mediaStorage : diskStorage;
  const multerInstance = multer({
    storage: activeStorage,
    fileFilter: mediaFileFilter,
    limits: { fileSize: 100 * 1024 * 1024 },
  }).any(); // Accept any field name (file, files, image, etc.)

  multerInstance(req, res, (err) => {
    if (err) {
      console.error("Media upload multer error:", err);
      return res.status(400).json({
        success: false,
        message: err.message || "File upload failed",
      });
    }

    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        populatePublicUrl(req, file);
      }
    }

    next();
  });
};

// Backwards-compatible export of `upload`
export const upload = {
  array: () => mediaUploadMiddleware,
  any: () => mediaUploadMiddleware,
  single: () => mediaUploadMiddleware,
  fields: () => mediaUploadMiddleware,
};
