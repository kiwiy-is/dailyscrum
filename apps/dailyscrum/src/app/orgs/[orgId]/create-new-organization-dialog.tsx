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
} from "ui/shadcn-ui/dialog";
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
import { createNewOrganization } from "./actions";

const formSchema = z.object({
  name: z.string().min(1),
});

type Props = {};

const CreateNewOrganizationDialog = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dialogParamValue = searchParams.get("dialog");

  useEffect(() => {
    setIsOpen(dialogParamValue === "create-new-organization");
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
        startTransition(() => {
          createNewOrganization(values.name);
        });
      })(event);
    },
    []
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new organization</DialogTitle>
          <DialogDescription>
            Enter the name of your organization to start sharing and managing
            daily scrum updates.
          </DialogDescription>
        </DialogHeader>
        <form id="create-new-organization-form" onSubmit={handleSubmit}>
          <Form {...form}>
            <FormField
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Organization name" {...field} />
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
            form="create-new-organization-form"
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

export default CreateNewOrganizationDialog;
