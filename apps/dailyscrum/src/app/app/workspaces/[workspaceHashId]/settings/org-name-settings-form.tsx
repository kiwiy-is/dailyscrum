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

type Props = {};

const formSchema = z.object({
  name: z.string().min(1),
});

// TODO: pass in data
// TODO: restrict update to org owner and admin & explain when it's disabled

const OrgNameSettingsForm = (props: Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={(event) => {
          form.handleSubmit((values) => {
            console.log("values", values);
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

        <Button type="submit" size="sm" loading={false}>
          Save
        </Button>
      </form>
    </Form>
  );
};

export default OrgNameSettingsForm;
