import { DateTime } from "luxon";
import { useSearchParams } from "next/navigation";

export function useDateFromSearchParams(timeZone?: string) {
  const searchParams = useSearchParams();
  const dateQuery = searchParams.get("date");
  const today = DateTime.local().setZone(timeZone).startOf("day");
  const date =
    dateQuery && DateTime.fromISO(dateQuery).isValid
      ? DateTime.fromISO(dateQuery)
      : today;
  return date;
}
