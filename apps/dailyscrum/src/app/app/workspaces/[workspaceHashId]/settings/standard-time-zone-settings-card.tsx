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
        <CardTitle className="text-base">Standard time zone</CardTitle>
        <CardDescription>
          {" "}
          The standard time zone for the workspace. All dates and times of are
          considered to be in this time zone.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <StandardTimeZoneSettingsFormLoader workspaceHashId={workspaceHashId} />
      </CardContent>
    </Card>
  );
};

export default StandardTimeZoneSettingsCard;
