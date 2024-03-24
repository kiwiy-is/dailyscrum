import { PresentationIcon, Settings2Icon } from "lucide-react";
import { Button } from "ui/button";

import AddUpdateButton from "./add-update-button";
import DatePickerLoader from "./date-picker-loader";
import DailyScrumUpdateListLoader from "./daily-scrum-update-list-loader";

export const dynamic = "force-dynamic"; // NOTE: One of the components in this page is using 'next-impl-getters/get-search-params' to get search params

export default async function Page() {
  return (
    <div className="flex flex-col space-y-8 max-w-screen-2xl">
      <div className="flex justify-between items-start">
        <div className="space-y-0.5">
          <h1 className="text-xl font-bold leading-8 ">Board</h1>
          {/* NOTE: A description text location */}
          {/* <p className="text-sm text-muted-foreground">
            See the organization's daily scrum updates.
          </p> */}
        </div>

        <div className="flex gap-x-2">
          <AddUpdateButton />
          <Button
            variant="outline"
            size="sm"
            className="justify-start gap-x-2 text-xs h-8"
            disabled
          >
            <PresentationIcon width={16} height={16} strokeWidth={2} />
            Start meeting
          </Button>
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        <div className="flex gap-x-2">
          <DatePickerLoader />

          <Button
            variant="outline"
            size="sm"
            className="gap-x-2 text-xs  h-8"
            disabled
          >
            <Settings2Icon width={14} height={14} strokeWidth={2} />
            <span>Settings</span>
          </Button>
        </div>
        <DailyScrumUpdateListLoader />
      </div>
    </div>
  );
}
