# 📝 Task Management App

A full-featured **task management application** built using **Next.js**, **Express**, **Tailwind CSS**, and **shadcn/ui**. It includes **role-based authentication**, **real-time notifications**, **task assignment**, and **comprehensive analytics**.

---

## ✨ Features

### 🔐 Authentication
- User registration & login  
- JWT-based authentication  
- Role-based access (Admin/User)  
- Protected routes  

### ✅ Task Management
- Create tasks with:
  - Title
  - Description
  - Priority
  - Due Date  
- Assign tasks to team members  
- Update status: `Todo`, `In Progress`, `Done`, `Canceled`  
- Filter tasks by:
  - Status
  - Priority
  - Search keyword  

### 🔔 Notifications
- Real-time task assignment alerts  
- Audible notification sounds  
- Notification history log  
- Mark notifications as read  

---

## 🧰 Tech Stack

### 🖥 Frontend
- Next.js 14 (App Router)
- React 18  
- TypeScript  
- Tailwind CSS  
- shadcn/ui  
- Axios (API calls)  
- React Hook Form + Zod (form validation)  
- WebSockets (real-time updates)  

### 🗄 Backend
- Express.js  
- MongoDB (Mongoose)  
- JWT (authentication)  
- Socket.io (real-time notifications)  
- Bcrypt (password hashing)  

---

## 🌐 API Endpoints

| Endpoint                | Method | Description                  | Access |
|-------------------------|--------|------------------------------|--------|
| `/api/auth/register`    | POST   | Register new user            | Public |
| `/api/auth/login`       | POST   | User login                   | Public |
| `/api/tasks`            | GET    | Get all tasks                | Admin  |
| `/api/tasks`            | POST   | Create new task              | Admin  |
| `/api/tasks/user`       | GET    | Get user's tasks             | User   |
| `/api/tasks/:id`        | PATCH  | Update task status           | User   |
| `/api/users`            | GET    | Get all users                | Admin  |
| `/api/notifications`    | GET    | Get user notifications       | User   |
| `/api/dashboard`        | GET    | Get users track              | User   |

---

## 🚀 Getting Started

### Start Frontend
- npm i
- npm run dev


### Start Backend
- npm i
- npm run dev


## 🤝 Contributing

1. **Fork** the project  
2. Create your feature branch:  
   ```bash
   git checkout -b feature/AmazingFeature
