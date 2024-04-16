import { buttonVariants } from "ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "ui/shadcn-ui/card";
import MemberList from "./member-list";
import Link from "next/link";
import { cn } from "ui";

type Props = {
  workspaceHashId: string;
};

// TODO: pass in data
// TODO: restrict updatd to workspace owner and admin
const MembersSettingsCard = ({ workspaceHashId }: Props) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-base">Members</CardTitle>

          <Link
            className={cn(
              buttonVariants({
                variant: "default",
                size: "sm",
              }),
              "ml-auto"
            )}
            href={`/app/workspaces/${workspaceHashId}/settings/add-member`}
            scroll={false}
            prefetch={true}
          >
            Add member
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <MemberList />
      </CardContent>
    </Card>
  );
};

export default MembersSettingsCard;
