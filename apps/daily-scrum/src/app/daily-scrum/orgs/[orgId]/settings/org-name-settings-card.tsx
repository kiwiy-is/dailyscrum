import { Card, CardContent, CardHeader, CardTitle } from "ui/shadcn-ui/card";
import OrgNameSettingsForm from "./org-name-settings-form";

type Props = {};

const OrgNameSettingsCard = (props: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Organization name</CardTitle>
      </CardHeader>
      <CardContent>
        <OrgNameSettingsForm />
      </CardContent>
    </Card>
  );
};

export default OrgNameSettingsCard;
