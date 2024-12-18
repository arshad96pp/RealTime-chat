import React from "react";

export function TimeConvertor() {
  const formatWhatsAppTimestamp = (timestamp) => {
    if (!timestamp) {
      return "Just now";
    }

    const date = new Date(timestamp);
    const now = new Date();

    const diffTime = Math.abs(now - date);
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffMinutes < 1) {
      return "Just now";
    } else if (diffMinutes < 60) {
      return `${diffMinutes} minutes ago`;
    } else if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString([], {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  };
  return { formatWhatsAppTimestamp };
}
