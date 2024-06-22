"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { Button } from "ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "ui/shadcn-ui/alert-dialog";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "ui/shadcn-ui/form";
import { z } from "zod";
import { updateStandardTimeZone } from "./actions";
import TimeZoneSelector from "@/components/time-zone-selector";

type Props = {
  workspaceId: number;
  timeZone: string;
};

const formSchema = z.object({
  timeZone: z.string().min(1),
});

// TODO: restrict update to workspace owner and admin & explain when it's disabled
const StandardTimeZoneSettingsForm = ({ workspaceId, timeZone }: Props) => {
  const [isPending, startTransition] = useTransition();
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      timeZone,
    },
  });

  const timeZones = Intl.supportedValuesOf("timeZone")
    .map((timeZone) => {
      const offset = DateTime.local({ zone: timeZone }).toFormat("ZZ");
      return {
        label: `(GMT${offset}) ${timeZone.replace(/_/g, " ")}`,
        value: timeZone,
        offset,
      };
    })
    .toSorted((a, b) => a.offset.localeCompare(b.offset));

  const refs = useRef<{
    [key: string]: React.RefObject<HTMLDivElement>;
  }>({});

  const formTimeZoneValue = form.getValues("timeZone");

  useEffect(() => {
    if (open) {
      if (formTimeZoneValue) {
        setTimeout(() => {
          // I don't understand this, but it works.
          // TODO: find out why this works
          const ref = refs.current[formTimeZoneValue!];
          if (ref && ref.current) {
            ref.current.scrollIntoView({});
          }
        }, 0);
      }
    }
  }, [open, formTimeZoneValue]);

  return (
    <>
      <Form {...form}>
        <form className="space-y-6">
          <FormField
            control={form.control}
            name="timeZone"
            render={({ field }) => {
              return (
                <FormItem className="flex flex-col">
                  <FormControl>
                    <TimeZoneSelector
                      value={field.value}
                      onSelect={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <Button
            type="button"
            loading={false}
            disabled={!form.formState.isDirty}
            onClick={(event) => {
              setIsConfirmDialogOpen(true);
            }}
          >
            Update
          </Button>
        </form>
      </Form>
      <AlertDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update standard time zone</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to update the standard time zone?
              <br />
              This will affect how dates and times are displayed and interpreted
              throughout the workspace.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              loading={isPending}
              onClick={() => {
                form.handleSubmit((values) => {
                  startTransition(async () => {
                    const { error, data: workspaceSetting } =
                      await updateStandardTimeZone(
                        workspaceId,
                        values.timeZone
                      );

                    if (error) {
                      form.setError("timeZone", { message: error.message });
                      setIsConfirmDialogOpen(false);
                      return;
                    }

                    router.refresh();
                    setIsConfirmDialogOpen(false);
                    form.reset({
                      timeZone: workspaceSetting?.attribute_value,
                    });
                  });
                })();
              }}
            >
              Update
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default StandardTimeZoneSettingsForm;
