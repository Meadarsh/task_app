import { Metadata } from "next"
import { DataTable } from "./components/data-table"
import { CreateTaskDialog } from "./components/create-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"


export const metadata: Metadata = {
  title: "Tasks",
  description: "A task and issue tracker.",
}


export default async function TaskPage() {

  return (
    <>     
      <div className=" h-full flex-1 flex-col space-y-8 p-8 flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your tasks!
            </p>
          </div>
          <CreateTaskDialog><Button>Create Task <Plus/></Button></CreateTaskDialog>
        </div>
        <DataTable />
      </div>
    </>
  )
}