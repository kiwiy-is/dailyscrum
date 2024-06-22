import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "ui/shadcn-ui/card";
import StandardTimeZoneSettingsFormLoader from "./standard-time-zone-settings-form-loader";

type Props = {
  workspaceHashId: string;
};

const StandardTimeZoneSettingsCard = ({ workspaceHashId }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Default time zone</CardTitle>
        <CardDescription>
          {" "}
          All dates and times are considered to be in this time zone for the
          workspace.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <StandardTimeZoneSettingsFormLoader workspaceHashId={workspaceHashId} />
      </CardContent>
    </Card>
  );
};

export default StandardTimeZoneSettingsCard;
