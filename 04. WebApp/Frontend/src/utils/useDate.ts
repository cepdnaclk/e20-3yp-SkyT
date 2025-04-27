import { useEffect, useState } from "react";

interface DateInfo {
  date: string; // e.g., "2025 Apr 01"
  dateISO: string; // e.g., "2025-04-01"
  time12: string; // e.g., "11:29 AM"
  time24: string; // e.g., "11:29 Hrs"
  day: string; // e.g., "Sunday"
}

export const useDate = (): DateInfo => {
  const [dateInfo, setDateInfo] = useState<DateInfo>({
    date: "",
    dateISO: "",
    time12: "",
    time24: "",
    day: "",
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();

      const options = { timeZone: "Asia/Colombo" };

      const date = now.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        ...options,
      });

      const dateISO = now.toISOString().slice(0, 10);

      const time12 = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        ...options,
      });

      const time24 =
        now.toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          ...options,
        }) + " Hrs";

      const day = now.toLocaleDateString("en-US", {
        weekday: "long",
        ...options,
      });

      setDateInfo({ date, dateISO, time12, time24, day });
    };

    updateTime();

    const interval = setInterval(updateTime, 60 * 1000); // update every 1 minute
    return () => clearInterval(interval);
  }, []);

  return dateInfo;
};

export function addDaysToDate(date: string, days: number): string {
  if (!date) throw new Error("Invalid date input");

  const baseDate = new Date(date);
  if (isNaN(baseDate.getTime())) throw new Error("Invalid date format");

  baseDate.setDate(baseDate.getDate() + days);

  // Format to YYYY-MM-DD
  const year = baseDate.getFullYear();
  const month = String(baseDate.getMonth() + 1).padStart(2, "0");
  const day = String(baseDate.getDate()).padStart(2, "0");

  const dateISO = `${year}-${month}-${day}`;

  return dateISO;
}

export function changeDateFormat(date: string): string {
  if (!date) throw new Error("Invalid date input");

  const baseDate = new Date(date);
  if (isNaN(baseDate.getTime())) throw new Error("Invalid date format");

  // Define options for the locale format
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "2-digit",
  };

  const newDate = baseDate.toLocaleDateString("en-US", options);

  return newDate;
}

export function changeTimeFormat(time: string): string {
  if (!time) throw new Error("Invalid time input");

  // Split the input time string into hours and minutes
  const [hours, minutes] = time.split(":").map(Number);

  // Ensure that hours and minutes are valid numbers
  if (isNaN(hours) || isNaN(minutes)) throw new Error("Invalid time format");

  // Convert to 12-hour format
  const period = hours >= 12 ? "PM" : "AM";
  const hour12 = hours % 12 || 12; // Convert to 12-hour format, handling 0 hours as 12
  const formattedTime = `${hour12}:${
    minutes < 10 ? "0" : ""
  }${minutes} ${period}`;

  return formattedTime;
}
