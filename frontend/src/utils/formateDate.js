import dayjs from "dayjs";

export function formatDate(timestamp) {
  const date = dayjs(timestamp);
  const now = dayjs();

  // Check if the message was sent in the same minute
  if (now.diff(date, "minute") === 0) {
    return "Just now";
  }

  const isCurrentYear = date.isSame(now, "year"); // Check if the message is from the current year
  const formattedDate = date.calendar(null, {
    sameDay: "h:mm A", // today: 3:45 PM
    nextDay: "[Tomorrow at] h:mm A", // optional
    nextWeek: "dddd [at] h:mm A", // optional
    lastDay: "[Yesterday at] h:mm A", // yesterday: Yesterday at 3:45 PM
    lastWeek: "dddd [at] h:mm A", // last week: Monday at 3:45 PM
    sameElse: isCurrentYear ? "MMM D [at] h:mm A" : "MMM D, YYYY [at] h:mm A", // If the year is different, show it
  });

  return formattedDate;
}
