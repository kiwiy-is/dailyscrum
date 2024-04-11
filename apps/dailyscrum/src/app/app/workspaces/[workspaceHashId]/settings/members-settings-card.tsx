import { buttonVariants } from "ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "ui/shadcn-ui/card";
import MemberList from "./member-list";
import Link from "next/link";
import { getParams } from "next-impl-getters/get-params";
import { cn } from "ui";

type Props = {};

// TODO: pass in data
// TODO: restrict updatd to org owner and admin
const MembersSettingsCard = (props: Props) => {
  const params = getParams() as { workspaceHashId: string };
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
            href={`/app/workspaces/${params.workspaceHashId}/settings/add-member`}
            scroll={false}
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
