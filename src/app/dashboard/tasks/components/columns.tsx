// "use client"


// export const columns: ColumnDef<Task>[] = [
//   {
//     id: "select",
//     header: ({ table }) => (
//       <Checkbox
//         checked={
//           table.getIsAllPageRowsSelected() ||
//           (table.getIsSomePageRowsSelected() && "indeterminate")
//         }
//         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//         aria-label="Select all"
//         className="translate-y-[2px]"
//       />
//     ),
//     cell: ({ row }) => (
//       <Checkbox
//         checked={row.getIsSelected()}
//         onCheckedChange={(value) => row.toggleSelected(!!value)}
//         aria-label="Select row"
//         className="translate-y-[2px]"
//       />
//     ),
//     enableSorting: false,
//     enableHiding: false,
//   },
//   {
//     accessorKey: "title",
//     header: ({ column }) => (
//       <DataTableColumnHeader column={column} title="Title" />
//     ),
//     cell: ({ row }) => {

//       return (
//         <div className="flex space-x-2">
//           <span className="max-w-[500px] truncate font-medium">
//             {row.getValue("title")}
//           </span>
//         </div>
//       )
//     },
//   },
//   {
//     accessorKey: "status",
//     header: ({ column }) => (
//       <DataTableColumnHeader column={column} title="Status" />
//     ),
//     cell: ({ row }) => {
//       const [value, setValue] = useState(row.getValue("status"))
//       const handleChange = async (newValue: string) => {
//         setValue(newValue)
//         try {
//           await updateTask(row.original._id, { status: newValue })
//           row.toggleSelected(false)
//         } catch (error) {
//           console.error("Failed to update status:", error)
//           setValue(row.getValue("status")) // Revert on error
//         }
//       }

//       const status = statuses.find((status) => status.value === value)

//       if (!status) return null

//       return (
//         <Select
//           value={value}
//           onValueChange={handleChange}
//           autoFocus
//         >
//           <SelectTrigger className="min-w-[80px]">
//             <SelectValue placeholder="Select status" />
//           </SelectTrigger>
//           <SelectContent>
//             {statuses.map((status) => (
//               <SelectItem key={status.value} value={status.value}>
//                 <div className="flex items-center">
//                   {status.icon && (
//                     <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
//                   )}
//                   {status.label}
//                 </div>
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>)},
//     filterFn: (row, id, value) => {
//       return value.includes(row.getValue(id))
//     },
//   },
//   {
//     accessorKey: "priority",
//     header: ({ column }) => (
//       <DataTableColumnHeader column={column} title="Priority" />
//     ),
//     cell: ({ row }) => {
//       const [value, setValue] = useState(row.getValue("priority"))

//       const handleChange = async (newValue: string) => {
//         setValue(newValue)
//         try {
//           await updateTask(row.original._id, { priority: newValue })
//           row.toggleSelected(false)
//         } catch (error) {
//           console.error("Failed to update priority:", error)
//           setValue(row.getValue("priority")) // Revert on error
//         }
//       }

//       const priority = priorities.find((priority) => priority.value === value)

//       if (!priority) return null

//       return (
//         <Select
//           value={value}
//           onValueChange={handleChange}
//           autoFocus
//         >
//           <SelectTrigger className="min-w-[80px]">
//             <SelectValue placeholder="Select priority" />
//           </SelectTrigger>
//           <SelectContent>
//             {priorities.map((priority) => (
//               <SelectItem key={priority.value} value={priority.value}>
//                 <div className="flex items-center">
//                   {priority.icon && (
//                     <priority.icon className="mr-2 h-4 w-4 text-muted-foreground" />
//                   )}
//                   {priority.label}
//                 </div>
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       )
//     },
//     filterFn: (row, id, value) => {
//       return value.includes(row.getValue(id))
//     },
//   },
//     {
//     accessorKey: "createdBy",
//     header: ({ column }) => (
//       <DataTableColumnHeader column={column} title="Created By" />
//     ),
//     cell: ({ row }) =>{
//       const creator:any=row.getValue("createdBy")
//       return(<div className="w-[80px]">{creator?.name}</div>)},
//     enableSorting: false,
//     enableHiding: false,
//   },
//     {
//     accessorKey: "dueDate",
//     header: ({ column }) => (
//       <DataTableColumnHeader column={column} title="Due Date" />
//     ),
//     cell: ({ row }) =>{
//       const dueDate:any=row.getValue("dueDate")
//       const formattedDate = format(new Date(dueDate), 'MMM dd, yyyy');
//       return(<div className="w-[80px]">{formattedDate}</div>)},
//     enableSorting: false,
//     enableHiding: false,
//   },
//   {
//     id: "actions",
//     cell: ({ row }) => <DataTableRowActions row={row} />,
//   },
// ]