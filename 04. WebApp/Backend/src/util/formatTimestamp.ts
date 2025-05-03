import { DateTime } from "luxon";

export function formatTimestamp(isoString: string): string {
  const date = new Date(isoString);

  const formattedDate = date.toLocaleDateString("en-CA"); // YYYY-MM-DD
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone: "Asia/Colombo",
  });

  return `${formattedDate} at ${formattedTime}`;
}

export function getColomboTime(): DateTime {
  return DateTime.now().setZone("Asia/Colombo");
}

export function getColomboDateTime(): { date: string; time: string } {
  const now = DateTime.now().setZone("Asia/Colombo");

  const date = now.toISODate() ?? ""; // "2025-04-28"
  const time = now.toFormat("HH:mm:ss"); // "15:23:45"

  return { date, time };
}

export function getRelativeTime(date: Date | string): string {
  try {
    const zone = "Asia/Colombo";
    const created =
      typeof date === "string"
        ? DateTime.fromISO(date, { zone })
        : DateTime.fromJSDate(date, { zone });

    const now = DateTime.now().setZone(zone);

    if (!created.isValid) return "invalid date";

    return created.toRelative({ base: now }) ?? "just now";
  } catch (error) {
    console.error("Error in getRelativeTime:", error);
    return "unknown";
  }
}
