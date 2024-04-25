"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "ui/shadcn-ui/form";
import { Input } from "ui/shadcn-ui/input";
import { z } from "zod";
import { updateWorkspaceName } from "./actions";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

type Props = {
  workspaceId: number;
  name: string;
};

const formSchema = z.object({
  name: z.string().min(1),
});

// TODO: restrict update to workspace owner and admin & explain when it's disabled

const WorkspaceNameSettingsForm = ({ workspaceId, name }: Props) => {
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name,
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={(event) => {
          form.handleSubmit((values) => {
            // TODO: Find out difference from https://github.com/vercel/next.js/discussions/49345#discussioncomment-6608243
            startTransition(async () => {
              const { error, data: workspace } = await updateWorkspaceName(
                workspaceId,
                values.name
              );

              if (!error) {
                router.refresh();
                form.reset({
                  name: workspace.name,
                });
                return;
              }

              form.setError("name", { message: error.message });
            });
          })(event);
        }}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Sun Microsystems" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          loading={isPending}
          disabled={!form.formState.isDirty}
        >
          Update
        </Button>
      </form>
    </Form>
  );
};

export default WorkspaceNameSettingsForm;
