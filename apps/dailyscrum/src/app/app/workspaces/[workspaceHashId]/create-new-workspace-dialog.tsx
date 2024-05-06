"use client";

import React, { useCallback, useEffect, useState, useTransition } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "ui/shadcn-ui/form";
import { Input } from "ui/shadcn-ui/input";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "ui/button";
import { createNewWorkspace } from "./actions";
import { useToast } from "ui/shadcn-ui/use-toast";
import { CheckCircleIcon } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1),
});

type Props = {};

const CreateNewWorkspaceDialog = (props: Props) => {
  const { toast } = useToast();

  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dialogParamValue = searchParams.get("dialog");

  useEffect(() => {
    setIsOpen(dialogParamValue === "create-new-workspace");
  }, [dialogParamValue]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      const params = new URLSearchParams(searchParams);
      params.delete("dialog");
      window.history.replaceState(null, "", `${pathname}?${params.toString()}`);
    }
  };

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [form, isOpen]);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      form.handleSubmit((values) => {
        startTransition(async () => {
          const { data, error } = await createNewWorkspace(values.name);

          if (error) {
            form.setError("name", { message: error.message });
            return;
          }

          router.push(`/app/workspaces/${data.hash_id}`);

          toast({
            description: (
              <div className="flex items-center gap-x-2">
                <CheckCircleIcon size={16} />
                <span>Successfully created new workspace</span>
              </div>
            ),
          });
        });
      })(event);
    },
    [form, router, toast]
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new workspace</DialogTitle>
          <DialogDescription>
            Enter the name of your workspace to start sharing and managing daily
            scrum updates.
          </DialogDescription>
        </DialogHeader>
        <form id="create-new-workspace-form" onSubmit={handleSubmit}>
          <Form {...form}>
            <FormField
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Workspace name" {...field} />
                    </FormControl>
                  </FormItem>
                );
              }}
              name="name"
            />
          </Form>
        </form>

        <DialogFooter>
          <Button
            type="submit"
            form="create-new-workspace-form"
            loading={isPending}
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNewWorkspaceDialog;
