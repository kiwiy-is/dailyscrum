"use client";

import { useForm } from "react-hook-form";
import { Button } from "ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "ui/shadcn-ui/card";
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

const formSchema = z.object({
  email: z.string().email(),
});

type Props = {
  onSignIn: (email: string) => void;
  error?: string;
};

const SignInForm = ({ onSignIn, error }: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    if (error) {
      form.setError("email", { message: error });
    }
  }, [form.setError, error]);

  const [isPending, startTransition] = useTransition();

  const onSubmit = form.handleSubmit((values) => {
    startTransition(() => {
      onSignIn(values.email);
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-8">
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
                We'll send you a sign in link to this email address.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" loading={isPending}>
          Sign in
        </Button>
      </form>
    </Form>
  );
};

export default SignInForm;
