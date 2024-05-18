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

import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";
import { useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { verify } from "./actions";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "ui/shadcn-ui/input-otp";

const formSchema = z.object({
  code: z.string().min(6, {
    message: "Your code must be 6 characters.",
  }),
});

type Props = {
  returnPath: string | undefined;
};

const VerificationForm = ({ returnPath }: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
    },
  });

  const searchParams = useSearchParams();

  const [isPending, startTransition] = useTransition();

  const emailQuery = searchParams.get("email");
  const email = emailQuery ? decodeURIComponent(emailQuery) : undefined;

  const handleSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const { error } = await verify(email ?? "", values.code, returnPath);

      if (error) {
        form.setError("code", { message: error.message });
        return;
      }
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup className="w-full">
                    <InputOTPSlot index={0} className="flex-1 h-10" />
                    <InputOTPSlot index={1} className="flex-1 h-10" />
                    <InputOTPSlot index={2} className="flex-1 h-10" />
                    <InputOTPSlot index={3} className="flex-1 h-10" />
                    <InputOTPSlot index={4} className="flex-1 h-10" />
                    <InputOTPSlot index={5} className="flex-1 h-10" />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
                A 6-digit code sent to your email
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

export default VerificationForm;
