import { Response } from "express";
import NotificationModel from "../models/notification";
import { AuthenticatedRequest } from "./user.controller";

export const getNotifications = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const users = await NotificationModel.find({recipient:req.user._id}).sort({ createdAt: -1 }).populate("sender", "name email");      res.json(users);
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };

  export const markNotificationAsRead = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
  
      const notification = await NotificationModel.findOneAndUpdate(
        { 
          _id: id,
          recipient: req.user._id 
        },
        { $set: { read: true } },
        { new: true } 
      ).populate('sender', 'name email');
  
      if (!notification) {
          res.status(404).json({ message: 'Notification not found' });
        return 
      }
  
      res.json(notification);
    } catch (error: any) {
      console.error('Error marking notification as read:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };