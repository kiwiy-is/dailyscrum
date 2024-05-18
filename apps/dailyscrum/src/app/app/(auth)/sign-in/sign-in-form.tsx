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
import { signIn } from "./actions";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().email(),
});

type Props = {
  returnPath: string | undefined;
};

const SignInForm = ({ returnPath }: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const handleSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const { error } = await signIn(values.email, returnPath);

      if (error) {
        form.setError("email", { message: error.message });
        return;
      }

      const searchParams = new URLSearchParams();
      searchParams.set("email", encodeURIComponent(values.email));
      if (returnPath) {
        searchParams.set("return-path", encodeURIComponent(returnPath));
      }

      router.push(`/app/sign-in/verify?${searchParams.toString()}`);
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
                We{`'`}ll send you a verification code to this email for a
                password-free sign in
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
