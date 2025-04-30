import { memo } from "react";

/**
 * Converts various timestamp formats to a JavaScript Date object
 * @param {*} timestamp - Timestamp in various formats
 * @returns {Date|null} - JavaScript Date object or null if invalid
 */
function parseTimestamp(timestamp) {
  try {
    if (!timestamp) return null;

    if (typeof timestamp.toDate === "function") {
      return timestamp.toDate();
    } else if (timestamp instanceof Date) {
      return timestamp;
    } else if (typeof timestamp === "string" || typeof timestamp === "number") {
      return new Date(timestamp);
    } else if (
      timestamp &&
      typeof timestamp.seconds === "number" &&
      typeof timestamp.nanoseconds === "number"
    ) {
      return new Date(
        timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
      );
    }
    return null;
  } catch (error) {
    console.error("Error parsing timestamp:", error);
    return null;
  }
}

/**
 * Formats a timestamp to show relative time
 */
export function formatDistanceToNow(timestamp) {
  const date = parseTimestamp(timestamp);
  if (!date) return "Invalid date";

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString();
}

/**
 * Formats a timestamp to show time in HH:MM format
 */
export function formatTime(timestamp) {
  const date = parseTimestamp(timestamp);
  if (!date) return "Invalid time";

  try {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch (error) {
    console.error("Error formatting time:", error);
    return "Invalid time";
  }
}

/**
 * Converts a timestamp to a JavaScript Date object
 */
export function formatDate(timestamp) {
  const date = parseTimestamp(timestamp);
  return date || "Invalid date";
}

/**
 * Helper function to format date for day separators
 */
export function formatMessageDate(timestamp) {
  const date = parseTimestamp(timestamp);
  if (!date) return "Unknown date";

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  } else if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  } else {
    return date.toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  }
}

/**
 * Component to display date separators in message lists
 */
export const DateSeparator = memo(({ date }) => (
  <div className="sticky top-0 z-10 flex items-center justify-center  bg-background">
    <div className="bg-primary/60 px-3 py-1 rounded-full text-xs text-foreground">
      {date}
    </div>
  </div>
));

/**
 * Determines the media type from a URL
 * @param {string} url - The URL to analyze
 * @returns {Object} Object containing media type information
 */
export const getMediaTypeFromUrl = (url) => {
  if (!url || typeof url !== "string") return { type: "unknown", url };

  if (url.startsWith("blob:")) return { type: "blob", url };

  try {
    const urlObj = new URL(url);
    const path = urlObj.pathname;
    const extension = path.split(".").pop()?.toLowerCase();
    const fileName = path.split("/").pop();

    // Image types
    if (
      ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"].includes(extension)
    ) {
      return { type: "image", url, extension };
    }

    // Video types
    if (
      ["mp4", "webm", "mov", "avi", "mkv", "flv", "wmv"].includes(extension)
    ) {
      return { type: "video", url, extension };
    }

    // Document types
    if (
      ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt"].includes(
        extension
      )
    ) {
      return { type: "document", url, extension, fileName };
    }

    // Special cases for popular services
    if (url.includes("imgur.com") || url.includes("i.imgur.com")) {
      return { type: "image", url, extension: "jpg" };
    }

    if (
      url.includes("youtube.com/watch") ||
      url.includes("youtu.be/") ||
      url.includes("vimeo.com")
    ) {
      return { type: "video", url, extension: "mp4" };
    }

    return { type: "link", url, fileName: urlObj.hostname };
  } catch (error) {
    console.error("Error parsing URL:", error);
    return { type: "unknown", url };
  }
};
