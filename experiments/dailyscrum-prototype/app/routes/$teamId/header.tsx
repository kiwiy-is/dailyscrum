import { Link, useFetcher, useLoaderData } from "@remix-run/react";
import { UserIcon } from "lucide-react";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  badgeVariants,
} from "~/lib/shadcn/ui";
import * as zod from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { loader } from "./route";
import { useEffect } from "react";
import { ACTIONS, UI } from "./constants";
import { useToast } from "~/lib/shadcn/ui/use-toast";
import { Logo } from "~/components/logo/logo";

const formSchema = zod.object({
  currentUserId: zod.string(),
});

export default function Header() {
  const { toast } = useToast();

  const { dataControl } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  const form = useForm<zod.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: {
      currentUserId: dataControl.sessionUser.id,
    },
  });

  const data = form.watch();

  useEffect(() => {
    if (form.formState.isValid && !form.formState.isValidating) {
      console.log(data);
    }
  }, [form.formState, data, form.formState.isValidating]);

  return (
    <header className="border-b col-span-2 row-span-1">
      <div className="h-14 px-4 flex justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" reloadDocument>
            <Logo />
          </Link>

          <Popover>
            <PopoverTrigger asChild>
              <button
                className={badgeVariants({
                  variant: "secondary",
                  className: "py-[1px] pl-2 pr-2",
                })}
              >
                demo
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <p className="text-sm">
                📣 Currently, our app is in demo mode, showcasing sample data
                and accounts. The official launch is coming up soon!
              </p>

              <Separator className="my-4 -mx-4 w-auto" />
              <div className="text-base font-semibold leading-none">
                Data controller
              </div>
              <p className="text-sm text-muted-foreground mt-1.5">
                Modify sample data to explore its functionality.
              </p>

              <Form {...form}>
                <form
                  onSubmit={(event) => {
                    form.handleSubmit((values) => {
                      console.log({ values });
                    })(event);
                  }}
                  className="mt-4"
                >
                  <FormField
                    control={form.control}
                    name="currentUserId"
                    render={({ field }) => {
                      console.log({ field });
                      return (
                        <FormItem>
                          <FormLabel>Current user</FormLabel>

                          <Select
                            value={field.value}
                            onValueChange={(value) => {
                              // FETCH HERE
                              fetcher.submit(
                                {
                                  _action:
                                    ACTIONS[UI.DATA_CONTROL]
                                      .SELECT_CURRENT_USER,
                                  userId: value,
                                },
                                {
                                  method: "POST",
                                }
                              );
                            }}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a user" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {dataControl.users.map((user) => (
                                <SelectItem key={user.id} value={user.id}>
                                  {user.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Switch to a different user account without the need
                            to log out and back in.
                          </FormDescription>
                        </FormItem>
                      );
                    }}
                  />
                </form>
              </Form>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex gap-x-2 items-center">
          {/* <Button size="icon-sm" variant="outline">
            <SettingsIcon size="16" />
          </Button> */}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon-sm" variant="ghost">
                <UserIcon size="16" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {dataControl.sessionUser.name}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {/* <DropdownMenuItem
                  onClick={() => {
                    toast({
                      title: "Not implemented!",
                      description:
                        "Sorry, the function is not implemented yet.",
                    });
                  }}
                >
                  Profile
                </DropdownMenuItem> */}
                <DropdownMenuItem
                  onClick={() => {
                    fetcher.submit(
                      {
                        _action: ACTIONS[UI.USER_PROFILE].LOG_OUT,
                      },
                      {
                        method: "POST",
                      }
                    );
                  }}
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
