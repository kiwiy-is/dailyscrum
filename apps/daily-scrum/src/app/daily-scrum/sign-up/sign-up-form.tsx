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
import { signUp } from "./actions";

const formSchema = z.object({
  email: z.string().email(),
});

const SignUpForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const [isPending, startTransition] = useTransition();

  const handleSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const { error } = await signUp(values.email);
      form.setError("email", { message: error.message });
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="name@example.com" {...field} />
              </FormControl>
              <FormDescription>
                We'll send you a sign up link to this email address.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" loading={isPending}>
          Sign up
        </Button>
      </form>
    </Form>
  );
};

export default SignUpForm;
