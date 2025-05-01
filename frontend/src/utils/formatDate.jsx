import { formatDistanceToNow, format } from "date-fns";

export function formatDateInfo(date) {
  if (!date) return { exactTime: "N/A", relativeTime: "N/A" };

  const exactTime = format(new Date(date), "MMM dd, yyyy 'at' hh:mm a");  
  const relativeTime = formatDistanceToNow(new Date(date), { addSuffix: true });

  return { exactTime, relativeTime };
}
