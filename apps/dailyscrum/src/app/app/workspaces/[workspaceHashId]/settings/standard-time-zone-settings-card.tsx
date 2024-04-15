import { Card, CardContent, CardHeader, CardTitle } from "ui/shadcn-ui/card";
import StandardTimeZoneSettingsFormLoader from "./standard-time-zone-settings-form-loader";

type Props = {
  workspaceHashId: string;
};

const StandardTimeZoneSettingsCard = ({ workspaceHashId }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Standard time zone</CardTitle>
      </CardHeader>
      <CardContent>
        <StandardTimeZoneSettingsFormLoader workspaceHashId={workspaceHashId} />
      </CardContent>
    </Card>
  );
};

export default StandardTimeZoneSettingsCard;
