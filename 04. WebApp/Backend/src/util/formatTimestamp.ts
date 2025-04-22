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
