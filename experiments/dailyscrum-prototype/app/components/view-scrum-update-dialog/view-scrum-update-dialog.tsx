import { MoreHorizontalIcon } from "lucide-react";
import { useCallback } from "react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/lib/shadcn/ui";

interface ViewScrumUpdateDialogProps {
  userName: string;
  date: string;
  answers: {
    id: string;
    question: string;
    answer: string;
  }[];
  isOpen: boolean;
  isCurrentUserScrumUpdateEntry: boolean;
  onEditButtonClick: () => void;
  onClose: () => void;
}

export const ViewScrumUpdateDialog: React.FC<ViewScrumUpdateDialogProps> = ({
  userName,
  date,
  answers,
  isOpen,
  isCurrentUserScrumUpdateEntry,
  onEditButtonClick,
  onClose,
}) => {
  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (open) {
        return;
      }
      onClose();
    },
    [onClose]
  );

  const handleEditButtonClick = useCallback(() => {
    onEditButtonClick();
  }, [onEditButtonClick]);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>{userName}</DialogTitle>
          <DialogDescription>{date}</DialogDescription>
        </DialogHeader>

        <div className="space-y-8 mt-4">
          {/* <div className="flex flex-col gap-y-1">
            <div className="text-sm font-medium leading-none">Date</div>
            <div className="text-sm [&>ul]:ml-6 [&>ul]:list-disc">{date}</div>
          </div> */}
          {answers.map(({ id, question, answer }) => (
            <div className="flex flex-col gap-y-1" key={id}>
              <div className="text-sm font-medium leading-none">{question}</div>
              <div
                className="text-sm [&>ul]:ml-6 [&>ul]:list-disc"
                dangerouslySetInnerHTML={{ __html: answer }}
              />
            </div>
          ))}
        </div>

        <DialogFooter>
          {isCurrentUserScrumUpdateEntry && (
            <Button variant="default" onClick={handleEditButtonClick}>
              Edit
            </Button>
          )}
          <Button variant="outline" size="icon" onClick={() => {}}>
            <MoreHorizontalIcon size="16" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
