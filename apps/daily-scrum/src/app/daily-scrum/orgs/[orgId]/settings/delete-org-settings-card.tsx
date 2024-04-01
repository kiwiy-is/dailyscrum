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
// TODO: restrict update to org owner and admin & explain when it's disabled
const DeleteOrgSettingsCard = (props: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Delete organization</CardTitle>
        <CardDescription>
          Permanently delete your organization and all of its content from Kiwiy
          is Dailyscrum.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="destructive" size="sm">
          Delete organization
        </Button>
      </CardContent>
    </Card>
  );
};

export default DeleteOrgSettingsCard;
