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
import { useEffect, useTransition } from "react";
import { completeSignUp } from "./actions";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(1),
});

type Props = {
  returnPath: string | undefined;
  defaultValues?: z.infer<typeof formSchema>;
};

const CompleteSignUpForm = ({ returnPath, defaultValues }: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const handleSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const { error } = await completeSignUp(values.name, returnPath);

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
                <Input placeholder="Name" {...field} />
              </FormControl>

              <FormDescription>
                Choose a name that will be visible to others
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" loading={isPending}>
          Continue
        </Button>
      </form>
    </Form>
  );
};

export default CompleteSignUpForm;
