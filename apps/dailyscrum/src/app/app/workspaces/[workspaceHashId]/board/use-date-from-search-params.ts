import { DateTime } from "luxon";
import { useSearchParams } from "next/navigation";

// TODO: rename, move to hooks directory
// useDateTimeFromSearchParams
// TODO:     const today = timeZone
// ? DateTime.local().setZone(timeZone).startOf("day")
// : null;
export function useDateFromSearchParams(timeZone?: string) {
  const searchParams = useSearchParams();
  const dateQuery = searchParams.get("date");
  const today = DateTime.local({ zone: timeZone }).startOf("day");
  const date =
    dateQuery && DateTime.fromISO(dateQuery).isValid
      ? DateTime.fromISO(dateQuery).setZone(timeZone, { keepLocalTime: true })
      : today;
  return date;
}
