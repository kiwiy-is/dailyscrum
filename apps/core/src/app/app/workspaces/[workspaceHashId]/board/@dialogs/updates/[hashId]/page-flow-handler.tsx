import sqids from "@/lib/sqids";
import { getDailyScrumUpdateEntry } from "@/services/daily-scrum-update-entries";
import { getCurrentUser } from "@/services/users";
import { DateTime } from "luxon";
import { notFound } from "next/navigation";

type Props = {
  hashId: string;
};

const PageFlowHandler = async ({ hashId }: Props) => {
  const [id] = sqids.decode(hashId);

  if (!id) {
    return notFound();
  }

  const [{ data: updateEntry }, { data: currentUser }] = await Promise.all([
    getDailyScrumUpdateEntry(id),
    getCurrentUser(),
  ]);

  if (updateEntry?.user?.id !== currentUser?.id) {
    return notFound();
  }

  if (!updateEntry) {
    return notFound();
  }

  const today = DateTime.local({ zone: updateEntry.time_zone }).startOf("day");
  const tomorrow = today.plus({ days: 1 });

  const date = DateTime.fromISO(updateEntry.date).setZone(
    updateEntry.time_zone,
    {
      keepLocalTime: true,
    }
  );

  if (date < today || date > tomorrow) {
    return notFound();
  }

  return null;
};

export default PageFlowHandler;
