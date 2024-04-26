"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { Button } from "ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "ui/shadcn-ui/card";
import { Form, FormField, FormItem, FormControl } from "ui/shadcn-ui/form";
import { Input } from "ui/shadcn-ui/input";
import { z } from "zod";
import { updateName } from "./actions";

const formSchema = z.object({
  name: z.string().min(1),
});

const emailFormSchema = z.object({
  email: z.string().email().min(1),
});

type Props = {
  name: string;
  email: string;
};

const AccountSettingsDialog = ({ name, email }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  // TODO: Separate each setting into components
  const [isNameFormPending, startNameFormTransition] = useTransition();
  const [isEmailFormPending, startEmailFormTransition] = useTransition();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dialogParamValue = searchParams.get("dialog");

  useEffect(() => {
    setIsOpen(dialogParamValue === "account-settings");
  }, [dialogParamValue]);

  useEffect(() => {
    if (!isOpen) {
      nameForm.reset();
      emailForm.reset();
    }
  }, [isOpen]);

  const nameForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name,
    },
  });

  const emailForm = useForm<z.infer<typeof emailFormSchema>>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email,
    },
  });

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      const params = new URLSearchParams(searchParams);
      params.delete("dialog");
      window.history.replaceState(null, "", `${pathname}?${params.toString()}`);
    }
  };

  const handleNameFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    nameForm.handleSubmit((values) => {
      startNameFormTransition(async () => {
        const { error } = await updateName(values.name);
        if (error) {
          nameForm.setError("name", { message: error.message });
          return;
        }
        router.refresh();
        nameForm.reset({
          name: values.name,
        });
      });
    })(event);
  };

  const handleEmailFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    emailForm.handleSubmit((values) => {
      startEmailFormTransition(async () => {
        // TODO: work on email update
      });
    })(event);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="gap-y-8">
        <DialogHeader>
          <DialogTitle>Account settings</DialogTitle>
          <DialogDescription>Manage your account settings.</DialogDescription>
        </DialogHeader>

        <div className="space-y-8 max-w-4xl mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Name</CardTitle>
              <CardDescription>
                A name that will be visible to others
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...nameForm}>
                <form onSubmit={handleNameFormSubmit} className="space-y-6">
                  <FormField
                    control={nameForm.control}
                    name="name"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="John Sturgis" {...field} />
                          </FormControl>
                        </FormItem>
                      );
                    }}
                  />

                  <Button
                    type="submit"
                    loading={isNameFormPending}
                    disabled={!nameForm.formState.isDirty}
                  >
                    Update
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Email</CardTitle>
              <CardDescription>
                Email address for your account. (Temporarily unavailable to
                update)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...emailForm}>
                <form onSubmit={handleEmailFormSubmit} className="space-y-6">
                  <FormField
                    control={emailForm.control}
                    name="email"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="John Sturgis"
                              disabled
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      );
                    }}
                  />

                  <Button
                    type="submit"
                    loading={isEmailFormPending}
                    disabled={!emailForm.formState.isDirty}
                  >
                    Update
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AccountSettingsDialog;
