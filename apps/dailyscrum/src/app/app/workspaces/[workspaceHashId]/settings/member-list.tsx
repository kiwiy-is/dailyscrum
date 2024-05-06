"use client";

import * as React from "react";
import {
  Cell,
  CellContext,
  ColumnDef,
  ColumnFiltersState,
  Row,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { CheckCircleIcon, MoreHorizontal } from "lucide-react";

import { Button } from "ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "ui/shadcn-ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "ui/shadcn-ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "ui/shadcn-ui/select";
import { useEffect, useState, useTransition } from "react";
import { removeMember, updateRole, updateStandardTimeZone } from "./actions";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "ui/shadcn-ui/alert-dialog";
import { useRouter } from "next/navigation";
import { useToast } from "ui/shadcn-ui/use-toast";

const RoleCell = ({
  row,
  cell,
}: {
  row: Row<Member>;
  cell: Cell<Member, unknown>;
}) => {
  const router = useRouter();
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const [isTransitioning, startTransition] = useTransition();

  const [selectedRole, setSelectedRole] = useState<string>(
    row.getValue(cell.column.id)
  );

  const { toast } = useToast();

  useEffect(() => {
    if (!isTransitioning) {
      setIsConfirmDialogOpen(false);
    }
  }, [isTransitioning]);

  return (
    <>
      {/* // TODO: Apply role change rules */}
      <Select
        value={row.getValue(cell.column.id)}
        onValueChange={(value) => {
          setSelectedRole(value);
          setIsConfirmDialogOpen(true);
        }}
      >
        <SelectTrigger className="h-10 w-[140px]">
          <SelectValue placeholder="Select a role" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="owner">Owner</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="member">Member</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <AlertDialog
        open={isConfirmDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedRole(row.getValue(cell.column.id));
          }
          setIsConfirmDialogOpen(open);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update member role</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to update the role of{" "}
              <span className="text-foreground font-medium">
                {row.original.name}
              </span>{" "}
              from{" "}
              <span className="text-foreground font-medium capitalize">
                {row.original.role}
              </span>{" "}
              to{" "}
              <span className="text-foreground font-medium capitalize">
                {selectedRole}
              </span>
              ?
              <br />
              <br />
              By changing the role of this member their permissions will change.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              loading={isTransitioning}
              onClick={async () => {
                startTransition(async () => {
                  await updateRole(
                    row.original.id,
                    selectedRole as "owner" | "admin" | "member"
                  );

                  router.refresh();

                  toast({
                    description: (
                      <div className="flex items-center gap-x-2">
                        <CheckCircleIcon size={16} />
                        <span>Successfully updated member role </span>
                      </div>
                    ),
                  });
                });
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

const ActionsCell = ({ row }: { row: Row<Member> }) => {
  const member = row.original;

  const router = useRouter();
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isTransitioning, startTransition] = useTransition();

  useEffect(() => {
    if (!isTransitioning) {
      setIsConfirmDialogOpen(false);
    }
  }, [isTransitioning]);

  return (
    <>
      {/* // TODO: apply remove rules */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => {
              setIsConfirmDialogOpen(true);
            }}
          >
            Remove member
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove member from workspace</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove{" "}
              <span className="text-foreground font-medium capitalize">
                {row.original.name}
              </span>{" "}
              from workspace? This is permanent.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              loading={isTransitioning}
              onClick={async () => {
                startTransition(async () => {
                  // await updateRole(
                  //   row.original.id,
                  //   selectedRole as "owner" | "admin" | "member"
                  // );
                  // router.refresh();
                  await removeMember(member.id);
                  router.refresh();
                });
              }}
            >
              Remove
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export type Member = {
  id: number;
  email: string;
  name: string;
  role: "owner" | "admin" | "member";
};

export const columns: ColumnDef<Member>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div>{row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row, cell }) => {
      return <RoleCell row={row} cell={cell} />;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];

type Props = {
  members: Member[];
};

// TODO: restrict updatd to workspace owner and admin
const MemberList = ({ members }: Props) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: members,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="h-11">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-2">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MemberList;
