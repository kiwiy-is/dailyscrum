import { Button } from "ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "ui/shadcn-ui/card";

type Props = {};

// TODO: pass in data
// TODO: restrict update to workspace owner and admin & explain when it's disabled
const DeleteWorkspaceSettingsCard = (props: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Delete workspace</CardTitle>
        <CardDescription>
          Permanently delete your workspace and all of its content from Kiwiy is
          Dailyscrum.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="destructive" size="sm">
          Delete workspace
        </Button>
      </CardContent>
    </Card>
  );
};

export default DeleteWorkspaceSettingsCard;
