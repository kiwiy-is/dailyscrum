import { CalendarIcon, PresentationIcon, Settings2Icon } from "lucide-react";
import { Button } from "ui/button";

import { Card, CardContent, CardHeader } from "ui/shadcn-ui/card";
import AddUpdateButton from "./add-update-button";

export default async function Page({
  params: { orgId },
}: {
  params: { orgId: string };
}) {
  return (
    <div className="flex flex-col space-y-8">
      <div className="flex justify-between items-start">
        <div className="space-y-0.5">
          <h1 className="text-xl font-bold leading-8 ">Dashboard</h1>
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
          >
            <PresentationIcon width={16} height={16} strokeWidth={2} />
            Start meeting
          </Button>
        </div>
      </div>

      <div className="flex flex-col space-y-4">
        <div className="flex gap-x-2">
          <Button variant="outline" size="sm" className="gap-x-2 text-xs h-8">
            <CalendarIcon width={14} height={14} strokeWidth={2} />

            <span>March 12, 2024</span>
          </Button>

          <Button variant="outline" size="sm" className="gap-x-2 text-xs  h-8">
            <Settings2Icon width={14} height={14} strokeWidth={2} />
            <span>Settings</span>
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {/* NOTE: Masonry scafolding */}
          {Array.from({ length: 40 }).map((_, index) => (
            <Card key={index}>
              <CardHeader />
              <CardContent />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
