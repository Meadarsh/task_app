"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import api from "@/lib/api";

import {  priorities, statuses } from "../data/data"
import { Task } from "../data/schema"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"
import { Checkbox } from "@/components/ui/checkbox"
import { format } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { updateTask } from "./updateTask"
import { toast } from "@/components/ui/use-toast";
import useAuthStore from "@/app/store/user.state";
import { cn } from "@/lib/utils";

export function DataTable() {
  const [rowSelection, setRowSelection] = React.useState({});
  const [data, setData] = React.useState([]);
  const {user}=useAuthStore()
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);

 const GetTasks = async () => {
    try {
      const res = await api.get("/tasks/");
      setData(res.data)
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    GetTasks();
  }, []);


 const columns: ColumnDef<Task>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
      cell: ({ row }) => {
  
        return (
          <div className="flex space-x-2">
            <span className="max-w-[500px] truncate font-medium">
              {row.getValue("title")}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const [value, setValue] = useState(row.getValue("status")as string)
        const handleChange = async (newValue: string) => {
          try {
            await updateTask(row.original._id, { status: newValue })
            row.toggleSelected(false)
            toast({variant:"success",description:`Status updated successfully.  (${row.getValue("status")} -> ${newValue})`})
            GetTasks()
          } catch (error) {
            console.error("Failed to update status:", error)
            setValue(row.getValue("status")) 
          }
        }
  
        const status = statuses.find((status) => status.value === value)
  
        if (!status) return null
  
        return (
          <Select
            value={value}
            onValueChange={handleChange}
          >
            <SelectTrigger className="min-w-[80px]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  <div style={{color:status?.color}} className={cn("flex items-center")}>
                    {status.icon && (
                      <status.icon className="mr-2 h-4 w-4 text-inherit" />
                    )}
                    {status.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>)},
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: "priority",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Priority" />
      ),
      cell: ({ row }) => {
        const [value, setValue] = useState(row.getValue("priority")as string)
  
        const handleChange = async (newValue: string) => {
          try {
            await updateTask(row.original._id, { priority: newValue })
            row.toggleSelected(false)
            toast({variant:"success",description:`Priority updated successfully. (${row.getValue("priority")} -> ${newValue})`})
            GetTasks()
          } catch (error) {
            console.error("Failed to update priority:", error)
            setValue(row.getValue("priority")) 
          }
        }
  
        const priority = priorities.find((priority) => priority.value === value)
  
        if (!priority) return null
        if(user?.role=="standard"){
          return <span>{value}</span>
        }
        return (
          <Select
            value={value}
            onValueChange={handleChange}
          >
            <SelectTrigger className="min-w-[80px]">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              {priorities.map((priority) => (
                <SelectItem key={priority.value} value={priority.value}>
                  <div className="flex items-center">
                    {priority.icon && (
                      <priority.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    )}
                    {priority.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
      {
      accessorKey:`${user?.role=="admin"?"assignee":"createdBy"}`,
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={`${user?.role=="admin"?"Assigned to":"Created By"}`} />
      ),
      cell: ({ row }) =>{
        const creator:any=row.getValue(`${user?.role=="admin"?"assignee":"createdBy"}`)
        return(<div className="w-[80px]">{creator?.name}</div>)},
      enableSorting: false,
      enableHiding: false,
    },
      {
      accessorKey: "dueDate",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Due Date" />
      ),
      cell: ({ row }) =>{
        const dueDate:any=row.getValue("dueDate")
        const formattedDate = format(new Date(dueDate), 'MMM dd, yyyy');
        return(<div className="w-[80px]">{formattedDate}</div>)},
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: "actions",
      cell: ({ row }) => <DataTableRowActions row={row} />,
    },
  ]

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });



  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} />
      <div className="rounded-md  border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
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
                    <TableCell key={cell.id}>
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
