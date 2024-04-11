import { Card, CardContent, CardHeader, CardTitle } from "ui/shadcn-ui/card";
import StandardTimeZoneSettingsForm from "./standard-time-zone-settings-form";

type Props = {};

const StandardTimeZoneSettingsCard = (props: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Standard time zone</CardTitle>
      </CardHeader>
      <CardContent>
        <StandardTimeZoneSettingsForm />
      </CardContent>
    </Card>
  );
};

export default StandardTimeZoneSettingsCard;
