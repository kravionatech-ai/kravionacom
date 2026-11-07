import slugify from "slugify";
import Event from "../../models/events/event.model.js";
import { revalidateFrontend } from "../../utils/revalidateFrontend.js";

/**
 * Public: Get the currently active event or offer
 * Returns the highest priority active event matching current date and target page
 */
export async function getPublicActiveEvent(req, res) {
  try {
    const now = new Date();
    const { page = "all" } = req.query;

    const query = {
      isActive: true,
      $and: [
        {
          $or: [
            { startDate: null },
            { startDate: { $lte: now } },
          ],
        },
        {
          $or: [
            { endDate: null },
            { endDate: { $gte: now } },
          ],
        },
      ],
    };

    if (page && page !== "all") {
      query.$or = [
        { targetPages: "all" },
        { targetPages: page },
      ];
    }

    const event = await Event.findOne(query)
      .sort({ priority: -1, updatedAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      event: event || null,
    });
  } catch (error) {
    console.error("[getPublicActiveEvent Error]:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch active event",
      error: error.message,
    });
  }
}

/**
 * Public: Record an event view (impressions)
 */
export async function recordEventView(req, res) {
  try {
    const { id } = req.params;
    await Event.findByIdAndUpdate(id, { $inc: { viewsCount: 1 } });
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * Public: Record an event CTA click
 */
export async function recordEventClick(req, res) {
  try {
    const { id } = req.params;
    await Event.findByIdAndUpdate(id, { $inc: { clicksCount: 1 } });
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}

/**
 * Admin: Get all events (with search & filtering)
 */
export async function getAdminEvents(req, res) {
  try {
    const { search = "", type = "", status = "", page = 1, limit = 50 } = req.query;
    const query = {};

    if (search.trim()) {
      query.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { subtitle: { $regex: search.trim(), $options: "i" } },
        { badge: { $regex: search.trim(), $options: "i" } },
      ];
    }

    if (type) {
      query.eventType = type;
    }

    if (status === "active") {
      query.isActive = true;
    } else if (status === "inactive") {
      query.isActive = false;
    }

    const skip = (Math.max(1, Number(page)) - 1) * Number(limit);
    const [events, total] = await Promise.all([
      Event.find(query)
        .sort({ priority: -1, createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean(),
      Event.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      events,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    console.error("[getAdminEvents Error]:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch events",
      error: error.message,
    });
  }
}

/**
 * Admin: Get single event by ID
 */
export async function getAdminEventById(req, res) {
  try {
    const { id } = req.params;
    const event = await Event.findById(id).lean();

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    return res.status(200).json({
      success: true,
      event,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch event",
      error: error.message,
    });
  }
}

/**
 * Admin: Create a new event or offer
 */
export async function createEvent(req, res) {
  try {
    const {
      title,
      subtitle = "",
      badge = "Special Offer",
      badgeColor = "#F15A35",
      description = "",
      eventType = "offer",
      displayType = "modal_popup",
      ctaText = "Claim Offer",
      ctaLink = "/contact",
      secondaryCtaText = "",
      secondaryCtaLink = "",
      bannerImage = "",
      startDate = null,
      endDate = null,
      isActive = true,
      priority = 1,
      showDelaySeconds = 3,
      frequencyHours = 24,
      targetPages = "all",
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Event title is required",
      });
    }

    const baseSlug = slugify(title, { lower: true, strict: true }) || "event";
    const uniqueSlug = `${baseSlug}-${Date.now().toString(36)}`;

    const event = await Event.create({
      title: title.trim(),
      slug: uniqueSlug,
      subtitle: subtitle.trim(),
      badge: badge.trim(),
      badgeColor: badgeColor.trim() || "#F15A35",
      description: description.trim(),
      eventType,
      displayType,
      ctaText: ctaText.trim() || "Claim Offer",
      ctaLink: ctaLink.trim() || "/contact",
      secondaryCtaText: secondaryCtaText.trim(),
      secondaryCtaLink: secondaryCtaLink.trim(),
      bannerImage: bannerImage.trim(),
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      isActive: Boolean(isActive),
      priority: Number(priority) || 1,
      showDelaySeconds: Number(showDelaySeconds) || 3,
      frequencyHours: Number(frequencyHours) ?? 24,
      targetPages,
      createdBy: req.user?._id || null,
    });

    // Revalidate frontend homepage and main routes
    revalidateFrontend({ paths: ["/", "/contact", "/services", "/blog", "/news"] }).catch(() => {});

    return res.status(201).json({
      success: true,
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    console.error("[createEvent Error]:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create event",
      error: error.message,
    });
  }
}

/**
 * Admin: Update existing event
 */
export async function updateEvent(req, res) {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    if (updates.startDate !== undefined) {
      updates.startDate = updates.startDate ? new Date(updates.startDate) : null;
    }
    if (updates.endDate !== undefined) {
      updates.endDate = updates.endDate ? new Date(updates.endDate) : null;
    }
    if (updates.priority !== undefined) {
      updates.priority = Number(updates.priority) || 0;
    }
    if (updates.showDelaySeconds !== undefined) {
      updates.showDelaySeconds = Number(updates.showDelaySeconds) || 3;
    }
    if (updates.frequencyHours !== undefined) {
      updates.frequencyHours = Number(updates.frequencyHours) ?? 24;
    }

    const event = await Event.findByIdAndUpdate(id, updates, { new: true });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    revalidateFrontend({ paths: ["/", "/contact", "/services", "/blog", "/news"] }).catch(() => {});

    return res.status(200).json({
      success: true,
      message: "Event updated successfully",
      event,
    });
  } catch (error) {
    console.error("[updateEvent Error]:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update event",
      error: error.message,
    });
  }
}

/**
 * Admin: Delete event
 */
export async function deleteEvent(req, res) {
  try {
    const { id } = req.params;
    const event = await Event.findByIdAndDelete(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    revalidateFrontend({ paths: ["/", "/contact", "/services", "/blog", "/news"] }).catch(() => {});

    return res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete event",
      error: error.message,
    });
  }
}

/**
 * Admin: Toggle active status
 */
export async function toggleEventStatus(req, res) {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    event.isActive = !event.isActive;
    await event.save();

    revalidateFrontend({ paths: ["/", "/contact", "/services", "/blog", "/news"] }).catch(() => {});

    return res.status(200).json({
      success: true,
      message: `Event is now ${event.isActive ? "active" : "inactive"}`,
      isActive: event.isActive,
      event,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to toggle event status",
      error: error.message,
    });
  }
}
