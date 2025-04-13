import { useEffect, useState } from "react";

interface DateInfo {
  date: string; // e.g., "2025 Apr 01"
  time12: string; // e.g., "11:29 AM"
  time24: string; // e.g., "11:29 Hrs"
  day: string; // e.g., "Sunday"
}

export const useDate = (): DateInfo => {
  const [dateInfo, setDateInfo] = useState<DateInfo>({
    date: "",
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

      setDateInfo({ date, time12, time24, day });
    };

    updateTime();

    const interval = setInterval(updateTime, 60 * 1000); // update every 1 minute
    return () => clearInterval(interval);
  }, []);

  return dateInfo;
};
