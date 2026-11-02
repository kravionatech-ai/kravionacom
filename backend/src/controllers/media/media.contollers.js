import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { cloudinary } from "../../config/cloudinary.js";
import { isCloudinaryConfigured } from "../../middleware/upload.middleware.js";

import { mediaModel } from "../../models/media/media.model.js";
import { Auth } from "../../models/auth/auth.models.js";
import { recordActivity } from "../../utils/activityLogger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadMedia = async (req, res) => {
    try {
        const user = req.user;
        const files = req.files;
        if (user.role === "user") return res.status(403).json({
            message: "User not authorized"
        });

        if (!files || files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Choose at least one media file.",
            });
        }

        const isUser = await Auth.findById(user._id || user.id);

        if (!isUser) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        const uploadedFiles = [];

        for (const file of files) {
            const isImage = file.mimetype.startsWith("image/");
            
            // Determine public URL
            let publicUrl = file.fileUrl || file.path;
            if (!publicUrl || !publicUrl.startsWith("http")) {
                const proto = req.headers["x-forwarded-proto"] || req.protocol || "https";
                const host = req.get("host") || "api.kraviona.com";
                const folder = isImage ? "images" : "media";
                publicUrl = `${proto}://${host}/uploads/${folder}/${file.filename}`;
            }

            const media = await mediaModel.create({
                fileName: file.filename,
                originalName: file.originalname,

                fileUrl: publicUrl,
                publicId: isCloudinaryConfigured() ? file.filename : null,

                mimeType: isImage && file.path?.includes("cloudinary") ? "image/webp" : file.mimetype,
                extension: isImage && file.path?.includes("cloudinary") ? ".webp" : (path.extname(file.originalname) || ""),
                fileSize: file.size,

                mediaType: isImage
                    ? "image"
                    : file.mimetype.startsWith("video/")
                    ? "video"
                    : file.mimetype.startsWith("audio/")
                    ? "audio"
                    : "document",

                width: file.width || null,
                height: file.height || null,
                duration: file.duration || null,

                userID: isUser._id,
                uploadedBy: isUser._id,

                authorDetails: {
                    name: isUser.name,
                    email: isUser.email,
                    username: isUser.username,
                },

                altText: "",
                isDeleted: false,
            });

            uploadedFiles.push(media);
            await recordActivity(req, {
                userID: isUser._id,
                module: "media",
                action: "uploaded",
                resourceId: media._id,
                resourceName: media.originalName,
                after: { mediaType: media.mediaType, fileName: media.originalName },
            });
        }

        return res.status(201).json({
            success: true,
            message: "Media uploaded successfully.",
            count: uploadedFiles.length,
            data: uploadedFiles,
        });

    } catch (error) {
        console.error("uploadMedia error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
            data: null,
        });
    }
};

export const getMyMedias = async (req, res) => {
    try {
        const user = req.user;

        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(Math.max(parseInt(req.query.limit) || 24, 1), 48);
        const skip = (page - 1) * limit;

        const filter = {
            userID: user.id,
            isDeleted: false,
        };
        const search = String(req.query.search || "").trim();
        if (search) {
            const regex = { $regex: search, $options: "i" };
            filter.$or = [
                { originalName: regex },
                { fileName: regex },
                { mediaType: regex },
                { mimeType: regex },
            ];
        }

        const [media, total] = await Promise.all([
            mediaModel
                .find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),

            mediaModel.countDocuments(filter),
        ]);

        return res.status(200).json({
            success: true,
            message: "Media fetched successfully.",
            data: media,

            pagination: {
                totalItems: total,
                currentPage: page,
                perPage: limit,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page * limit < total,
                hasPreviousPage: page > 1,
            },
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            data: null,
        });
    }
};

export const deleteMedia = async (req, res) => {
    try {
        const user = req.user;
        const media = await mediaModel.findById(req.params.id);

        if (!media || media.isDeleted) {
            return res.status(404).json({
                success: false,
                message: "Media not found.",
            });
        }

        const isOwner = String(media.userID) === String(user.id || user._id);
        const canManageAll = user.role === "super_admin";

        if (!isOwner && !canManageAll) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to delete this media.",
            });
        }

        // Try destroying in Cloudinary if it has a Cloudinary publicId
        if (media.publicId && !media.publicId.startsWith("local:")) {
            try {
                await cloudinary.uploader.destroy(media.publicId, {
                    resource_type: media.mediaType === "video" ? "video" : "image",
                });
            } catch (cloudinaryError) {
                console.error("Cloudinary delete failed:", cloudinaryError.message);
            }
        }

        // Try deleting from local disk if it exists
        if (media.fileName) {
            try {
                const folder = media.mediaType === "image" ? "images" : "media";
                const localFilePath = path.resolve(__dirname, "../../public/uploads", folder, media.fileName);
                if (fs.existsSync(localFilePath)) {
                    fs.unlinkSync(localFilePath);
                }
            } catch (localDeleteError) {
                console.error("Local file delete failed:", localDeleteError.message);
            }
        }

        media.isDeleted = true;
        await media.save();
        await recordActivity(req, {
            userID: user.id || user._id,
            module: "media",
            action: "deleted",
            resourceId: media._id,
            resourceName: media.originalName,
            before: { mediaType: media.mediaType, fileName: media.originalName },
        });

        return res.status(200).json({
            success: true,
            message: "Media deleted successfully.",
            data: media,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
            data: null,
        });
    }
};
