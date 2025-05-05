import api from "@/lib/api"
import { Task } from "../data/schema"

export async function updateTask(id: string, data: Partial<Task>) {
    const response = await api.put(`/tasks/${id}`,data)
    if (response.status>300) throw new Error('Failed to update task')
    return response
  }