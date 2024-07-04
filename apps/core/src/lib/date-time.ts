import { DateTime } from "luxon";

/**
 * Expresses a Luxon DateTime object as a JavaScript Date object.
 *
 * This function takes a Luxon DateTime object and creates a JavaScript Date object
 * that represents the same exact date and time as the given DateTime object,
 * regardless of the system's local time settings.
 *
 * @param {DateTime} dateTime - The Luxon DateTime object to be expressed as a JavaScript Date.
 * @returns {Date} A JavaScript Date object representing the same exact date and time as the input DateTime object.
 */
export const expressInJsDate = (dateTime: DateTime): Date => {
  const year: number = dateTime.year;
  const month: number = dateTime.month - 1; // JavaScript months are zero-based
  const day: number = dateTime.day;
  const hour: number = dateTime.hour;
  const minute: number = dateTime.minute;
  const second: number = dateTime.second;
  const millisecond: number = dateTime.millisecond;

  // Create a new JavaScript Date object with the extracted components
  return new Date(year, month, day, hour, minute, second, millisecond);
};

/**
 * Get the GMT offset for a given time zone.
 *
 * @param {string} timeZone - The time zone identifier (e.g., "America/Los_Angeles").
 * @returns {string} The GMT offset in the format "GMT+H", "GMT-H", "GMT+H:MM" or "GMT-H:MM".
 */
export const getGmtOffset = (timeZone: string) => {
  const date = DateTime.now().setZone(timeZone);
  const offset = date.offset; // Offset in minutes
  const offsetHours = Math.floor(Math.abs(offset) / 60);
  const offsetMinutes = Math.abs(offset) % 60;
  const sign = offset >= 0 ? "+" : "-";

  return `GMT${sign}${offsetHours}${
    offsetMinutes > 0 ? ":" + String(offsetMinutes).padStart(2, "0") : ""
  }`;
};

/**
 * Formats a date with a given format string, automatically appending the year
 * if it differs from the current year.
 *
 * @param {DateTime} date - The DateTime object to format.
 * @param {DateTime} today - The current date for comparison.
 * @param {string} format - The format string to use (without year).
 * @returns {string} The formatted date string.
 */
export const formatDateAddYearIfDifferent = (
  date: DateTime,
  today: DateTime,
  format: string = "ccc, LLL d"
): string => {
  const baseFormatted = date.toFormat(format);
  return date.year === today.year
    ? baseFormatted
    : `${baseFormatted}, ${date.year}`;
};
