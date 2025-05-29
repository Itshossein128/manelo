/**
 * Formats a date string or Date object into a human-readable format.
 *
 * @param date - The date to format (can be a string in ISO format or a Date object).
 * @param locale - The locale to use for formatting (default: "en-US").
 * @param options - Custom formatting options for Intl.DateTimeFormat.
 * @returns The formatted date string.
 */
export function FormatDate(
  date: string | Date,
  locale: string = "en-US",
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short",
  }
): string {
  // Parse the input date if it's a string
  const parsedDate = typeof date === "string" ? new Date(date) : date;
  
  if (isNaN(parsedDate?.getTime())) {
    throw new Error("Invalid date");
  }

  // Format the date using Intl.DateTimeFormat
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(parsedDate);
}
