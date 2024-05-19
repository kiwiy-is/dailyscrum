import { Card, CardContent, CardHeader, CardTitle } from "ui/shadcn-ui/card";
import WorkspaceNameSettingsFormLoader from "./workspace-name-settings-form-loader";

type Props = {
  workspaceHashId: string;
};

const WorkspaceNameSettingsCard = ({ workspaceHashId }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Workspace name</CardTitle>
      </CardHeader>
      <CardContent>
        <WorkspaceNameSettingsFormLoader workspaceHashId={workspaceHashId} />
      </CardContent>
    </Card>
  );
};

export default WorkspaceNameSettingsCard;
