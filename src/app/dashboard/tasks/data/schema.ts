import { z } from "zod"


export const taskSchema = z.object({
  _id: z.string(),
  title: z.string(),
  status: z.string(),
  priority: z.string(),
})

export type Task = z.infer<typeof taskSchema>
