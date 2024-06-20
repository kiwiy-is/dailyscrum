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
