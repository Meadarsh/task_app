import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    type: {
      type: String,
      enum: ["assignment", "update", "reminder"],
      required: true,
    },
  },
  { timestamps: true }
);

export interface INotification extends mongoose.Document {
  recipient: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  task: mongoose.Types.ObjectId;
  message: string;
  read: boolean;
  type: "assignment" | "update" | "reminder";
}

const NotificationModel =
  mongoose.models.Notification || mongoose.model<INotification>("Notification", NotificationSchema);
export default NotificationModel;