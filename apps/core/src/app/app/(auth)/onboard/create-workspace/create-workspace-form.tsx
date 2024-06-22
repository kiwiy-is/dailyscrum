"use client";

import { useForm } from "react-hook-form";
import { Button } from "ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "ui/shadcn-ui/form";
import { Input } from "ui/shadcn-ui/input";

import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";
import { useTransition } from "react";
import { completeCreateWorkspace } from "./actions";
import { useRouter } from "next/navigation";
import TimeZoneSelector from "@/components/time-zone-selector";

const formSchema = z.object({
  name: z.string().min(1),
  timeZone: z.string().min(1),
});

type Props = {
  returnPath: string | undefined;
};

const CreateWorkspaceForm = ({ returnPath }: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  });

  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const handleSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const { error } = await completeCreateWorkspace(
        values.name,
        values.timeZone
      );

      if (error) {
        form.setError("name", { message: error.message });
        return;
      }

      router.push(returnPath ? returnPath : "/app");
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="My workspace" {...field} />
              </FormControl>

              <FormDescription>
                Choose a name for your workspace
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="timeZone"
          render={({ field }) => {
            return (
              <FormItem className="flex flex-col">
                <FormLabel>Default time zone</FormLabel>
                <FormControl>
                  <TimeZoneSelector
                    value={field.value}
                    onSelect={field.onChange}
                  />
                </FormControl>

                <FormDescription>
                  All dates and times are considered to be in this time zone for
                  the workspace. You can change this in the workspace settings
                  later.
                </FormDescription>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        <Button type="submit" className="w-full" loading={isPending}>
          Continue
        </Button>
      </form>
    </Form>
  );
};

export default CreateWorkspaceForm;
