import type { loader } from "./route";
import type { SerializeFrom } from "@remix-run/node";
import { Link, useLoaderData, useNavigate, useParams } from "@remix-run/react";
import type { MouseEvent } from "react";
import { useCallback, useMemo } from "react";
import ScrumUpdateCardUI from "~/components/scrum-update-card/scrum-update-card";

type ScrumUpdateCardProps = Pick<
  SerializeFrom<typeof loader>["dailyScrumUpdateEntries"][number],
  "id" | "submittedUser" | "answers"
>;

export default function ScrumUpdateCard({
  id,
  submittedUser,
  answers,
}: ScrumUpdateCardProps) {
  const { dailyScrumUpdateEntries, sessionUser } =
    useLoaderData<typeof loader>();

  const isSessionUserScrumUpdateEntry = submittedUser?.id === sessionUser?.id;

  const params = useParams();

  const navigate = useNavigate();

  const path = useMemo(
    () => `/${params.teamId}/dashboard/scrum-update/${id}`,
    [params.teamId, id]
  );

  const editPath = useMemo(
    () => `/${params.teamId}/dashboard/scrum-update/${id}/edit`,
    [params.teamId, id]
  );

  const name = useMemo(() => submittedUser?.displayName ?? "", [submittedUser]);

  const qaPairs = useMemo(() => {
    return answers.map(({ id, scrumUpdateQuestion, answer }) => ({
      id,
      question: scrumUpdateQuestion?.briefQuestion ?? "",
      answerHtml: answer,
    }));
  }, [answers]);

  const handleEditItemClick = useCallback(
    (event: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
      event.preventDefault();
      navigate(editPath);
    },
    [navigate, editPath]
  );

  return (
    <Link
      key={id}
      to={path}
      className="rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <ScrumUpdateCardUI
        name={name}
        qaPairs={qaPairs}
        dropdownMenuItems={[
          ...(!isSessionUserScrumUpdateEntry
            ? []
            : [
                <ScrumUpdateCardUI.DropdownMenuItem
                  key="edit"
                  onClick={handleEditItemClick}
                >
                  Edit
                </ScrumUpdateCardUI.DropdownMenuItem>,
              ]),

          <ScrumUpdateCardUI.DropdownMenuItem key="copyLink">
            Copy link
          </ScrumUpdateCardUI.DropdownMenuItem>,
          <ScrumUpdateCardUI.DropdownMenuItem key="copyText">
            Copy text
          </ScrumUpdateCardUI.DropdownMenuItem>,
        ]}
      />
    </Link>
  );
}
