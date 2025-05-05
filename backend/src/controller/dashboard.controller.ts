import { Response } from "express";
import TaskModel from "../models/task";
import { AuthenticatedRequest } from "./user.controller";

export const dashboardChart=async(req:AuthenticatedRequest,res:Response)=>{
  try {
    
    const tasks = await TaskModel.find().lean();

    const statusCounts = tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const statusData = [
      { status: "todo", count: statusCounts.todo || 0, fill: "var(--color-todo)" },
      { status: "backlog", count: statusCounts.backlog || 0, fill: "var(--color-backlog)" },
      { status: "in progress", count: statusCounts["in progress"] || 0, fill: "var(--color-in-progress)" },
      { status: "done", count: statusCounts.done || 0, fill: "var(--color-done)" },
      { status: "canceled", count: statusCounts.canceled || 0, fill: "var(--color-canceled)" },
    ];

    const priorityCounts = tasks.reduce((acc:any, task:any) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const priorityData = [
      { priority: "low", count: priorityCounts.low || 0 },
      { priority: "medium", count: priorityCounts.medium || 0 },
      { priority: "high", count: priorityCounts.high || 0 },
    ];

     res.status(200).json({
      statusData,
      priorityData,
      totalTasks: tasks.length,
    });
    return
  } catch (error) {
    res.status(500).json({ message: "Server error" });
    return 
  }
}