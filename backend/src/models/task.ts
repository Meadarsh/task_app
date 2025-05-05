import { z } from "zod";
import mongoose from "mongoose";

export const taskSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  dueDate: z.coerce.date().min(new Date(), "Due date must be in the future"),
  priority: z.enum(["low", "medium", "high"]),
  status: z.enum(["todo", "backlog", "in progress", "done", "canceled"]),
  assignee: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid assignee ID",
  }),
});

export type Task = z.infer<typeof taskSchema>;

export const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date, required: true },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    status: {
      type: String,
      enum: ["todo", "backlog", "in progress", "done", "canceled"],
      default: "todo",
    },
    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export interface ITask extends mongoose.Document {
  title: string;
  description?: string;
  dueDate: Date;
  priority: "low" | "medium" | "high";
  status: "todo" | "backlog" | "in progress" | "done" | "canceled";
  assignee: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
}

const TaskModel =
  mongoose.models.Task || mongoose.model<ITask>("Task", TaskSchema);
export default TaskModel;
