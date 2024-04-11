import { Card, CardContent, CardHeader, CardTitle } from "ui/shadcn-ui/card";
import WorkspaceNameSettingsForm from "./workspace-name-settings-form";

type Props = {};

const WorkspaceNameSettingsCard = (props: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Workspace name</CardTitle>
      </CardHeader>
      <CardContent>
        <WorkspaceNameSettingsForm />
      </CardContent>
    </Card>
  );
};

export default WorkspaceNameSettingsCard;
