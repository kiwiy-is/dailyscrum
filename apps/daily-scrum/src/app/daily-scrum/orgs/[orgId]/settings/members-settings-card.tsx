import { Button } from "ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "ui/shadcn-ui/card";
import MemberList from "./member-list";

type Props = {};

// TODO: pass in data
// TODO: restrict updatd to org owner and admin
const MembersSettingsCard = (props: Props) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-base">Members</CardTitle>

          <Button variant="default" className="ml-auto" size="sm">
            Invite member
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <MemberList />
      </CardContent>
    </Card>
  );
};

export default MembersSettingsCard;
