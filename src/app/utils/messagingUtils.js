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
 * Formats a timestamp to show relative time (e.g., "just now", "5m ago")
 * @param {*} timestamp - Timestamp in various formats
 * @returns {string} - Formatted relative time string
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
 * @param {*} timestamp - Timestamp in various formats
 * @returns {string} - Formatted time string
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
 * @param {*} timestamp - Timestamp in various formats
 * @returns {Date|string} - JavaScript Date object or error message
 */
export function formatDate(timestamp) {
  const date = parseTimestamp(timestamp);
  return date || "Invalid date";
}

// Helper function to format date for day separators
export function formatMessageDate(timestamp) {
  const date =
    typeof timestamp?.toDate === "function"
      ? timestamp.toDate()
      : new Date(timestamp);
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

export const DateSeparator = memo(({ date }) => (
  <div className="flex items-center justify-center my-4">
    <div className="bg-primary/60 px-3 py-1 rounded-full text-xs text-foreground">
      {date}
    </div>
  </div>
));
