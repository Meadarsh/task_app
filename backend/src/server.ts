import express, {Request, Response, NextFunction } from "express";
import helmet from "helmet";
import dotenv from "dotenv";
import { connectDB } from "./db/db.connection";
import cors from "cors";
import http from "http";
import { Server, Socket } from 'socket.io';
import mongoose from "mongoose";
import Users from "./routes/userRoutes"
import Notifications from "./routes/notificationRoutes"
import Tasks from "./routes/taskRoutes"
import Dashboard from "./routes/dashboardRoutes"
dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

connectDB();
app.use(
  cors({
    origin: [
      "https://taskapp-stamurai.amiigo.in",
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
    ],
    methods: ["GET", "POST", "PUT","PATCH", "DELETE", "OPTIONS"],
    credentials: true, 
  })
);

app.use(helmet());
app.use(express.json());

app.use("/api/users",Users);
app.use("/api/tasks",Tasks);
app.use("/api/notifications",Notifications);
app.use("/api/dashboard",Dashboard);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});
console.log(mongoose.models); 
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    success: false,
  });
});

const server = http.createServer(app);
export const io = new Server(server,{
  cors: {
    origin: ["http://localhost:3000","https://taskapp-stamurai.amiigo.in"],
    methods: ["GET", "POST"],
    credentials: true
  },
});

io.on('connection', (socket: Socket) => {  
  console.log('Client connected:', socket.id);
  socket.on('authenticate', (userId) => {
    socket.join(userId); 
    console.log(`User ${userId} connected`);
  });
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

