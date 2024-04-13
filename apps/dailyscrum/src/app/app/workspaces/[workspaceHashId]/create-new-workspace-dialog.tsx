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
import { usePathname, useSearchParams } from "next/navigation";
import { Button } from "ui/button";
import { createNewWorkspace } from "./actions";

const formSchema = z.object({
  name: z.string().min(1),
});

type Props = {};

const CreateNewWorkspaceDialog = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dialogParamValue = searchParams.get("dialog");

  useEffect(() => {
    setIsOpen(dialogParamValue === "create-new-workspace");
  }, [dialogParamValue]);

  useEffect(() => {
    if (!isOpen) {
      form.reset();
    }
  }, [isOpen]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  // TODO: remove usecallback
  const handleOpenChange = useCallback((open: boolean) => {
    if (!open) {
      const params = new URLSearchParams(searchParams);
      params.delete("dialog");
      window.history.replaceState(null, "", `${pathname}?${params.toString()}`);
    }
  }, []);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      form.handleSubmit((values) => {
        startTransition(async () => {
          // TODO: handle error
          const { error } = await createNewWorkspace(values.name);
        });
      })(event);
    },
    []
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
            size="sm"
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
