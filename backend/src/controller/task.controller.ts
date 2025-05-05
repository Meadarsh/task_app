import { Request, Response } from "express";
import TaskModel from "../models/task";
import NotificationModel from "../models/notification";
import { taskSchema } from "../models/task";
import { z } from "zod";
import { AuthenticatedRequest } from "./user.controller";
import mongoose from "mongoose";
import { io } from "../server";


export const createTask = async (req:AuthenticatedRequest, res: Response) => {
  try {
    const validatedData = {
      ...req.body,
      assignee: req.body.assignee || req.user._id,
      createdBy: req.user._id,
    };

    const task = await TaskModel.create(validatedData);

    if (task.assignee) {
      const notification= await NotificationModel.create({
        recipient: task.assignee,
        sender: req.user._id,
        task: task._id,
        message: `You've been assigned a new task: ${task.title}`,
        type: "assignment",
      });
      const populatedNotification = await NotificationModel.populate(notification, {
        path: 'sender',
        select: 'name email'
      });
    
      io.to(task.assignee.toString()).emit('new-notification', populatedNotification)
    }

    res.status(201).json(task);
  } catch (error) {
    if (error instanceof z.ZodError) {
        res.status(400).json({ errors: error.errors });
      return
    }
    console.log(error);
    
    res.status(500).json({ message: "Server error" });
  }
};


export const getTasks = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { search, status, priority } = req.query;
    
    const filter: any = {};
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if(req?.user.role=="admin"){
      filter.createdBy = req.user._id;
    } else{
      filter.assignee = req.user._id;
    }

    const tasks = await TaskModel.find(filter)
      .populate("assignee", "name email")
      .populate("createdBy", "name email");

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateTask = async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
          res.status(400).json({ message: "Invalid task ID" });
        return 
      }
  
      const task = await TaskModel.findById(req.params.id);
      if (!task) {
          res.status(404).json({ message: "Task not found" });
        return 
      }
  
      if (task.createdBy.toString() !== req.user._id.toString() && 
          task.assignee.toString() !== req.user._id.toString()) {
              res.status(403).json({ message: "Not authorized to update this task" });
        return
      }
  
      const oldTask = { ...task.toObject() }; 
      const validatedData = taskSchema.partial().parse(req.body);
      
      const updatedTask = await TaskModel.findByIdAndUpdate(
        req.params.id,
        validatedData,
        { new: true }
      ).populate("assignee", "name email")
       .populate("createdBy", "name email");
  
      if (!updatedTask) {
          res.status(404).json({ message: "Task not found after update" });
        return
      }
  
      // if (req.user._id.toString() === task.createdBy.toString()) {

      //   if (updatedTask.assignee.toString() !== req.user._id.toString()) {
      //     let message = `Your task "${updatedTask.title}" has been updated`;
          
      //     if (req.body.priority && req.body.priority !== oldTask.priority) {
      //       message += ` (priority changed from ${oldTask.priority} to ${updatedTask.priority})`;
      //     }
      //     if (req.body.status && req.body.status !== oldTask.status) {
      //       message += ` (status changed to ${updatedTask.status})`;
      //     }
  
      //     await NotificationModel.create({
      //       recipient: updatedTask.assignee,
      //       sender: req.user._id,
      //       task: updatedTask._id,
      //       message,
      //       type: "update",
      //     });
      //   }
      // } else {

      //   let message = `Task "${updatedTask.title}" has been updated by assignee`;
        
      //   if (req.body.status && req.body.status !== oldTask.status) {
      //     message += ` (status changed to ${updatedTask.status})`;
      //   }
  
      //   await NotificationModel.create({
      //     recipient: updatedTask.createdBy,
      //     sender: req.user._id,
      //     task: updatedTask._id,
      //     message,
      //     type: "update",
      //   });
      // }
  
      res.json(updatedTask);
    } catch (error) {
      if (error instanceof z.ZodError) {
          res.status(400).json({ errors: error.errors });
        return
      }
      res.status(500).json({ message: "Server error" });
    }
  };
  
  export const deleteTask = async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
          res.status(400).json({ message: "Invalid task ID" });
        return
      }
  
      const task = await TaskModel.findById(req.params.id);
      if (!task) {
          res.status(404).json({ message: "Task not found" });
        return
      }
  
      // Only creator can delete the task
      if (task.createdBy.toString() !== req.user._id.toString()) {
          res.status(403).json({ 
              message: "Only task creator can delete this task" 
            });
            return 
      }
  
      await task.deleteOne();
      
      if (task.assignee.toString() !== req.user._id.toString()) {
        await NotificationModel.create({
          recipient: task.assignee,
          sender: req.user._id,
          task: task._id,
          message: `Task "${task.title}" has been deleted by the creator`,
          type: "update",
        });
      }
  
      res.json({ message: "Task deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };