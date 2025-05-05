# Task Management App

A full-featured task management application built with Next.js, Express, Tailwind CSS, and shadcn/ui. Features include role-based authentication, real-time notifications, task assignment, and comprehensive analytics.

## ✨ Features

### 🔐 Authentication
```bash
- User registration and login
- JWT token-based authentication
- Role-based access control (Admin/User)
- Protected routes


- Create tasks with title, description, priority, due date
- Assign tasks to team members
- Update task status (Todo/In Progress/Done/Canceled)
- Filter tasks by status, priority, or search

- Real-time task assignment alerts
- Audible notification sounds
- Notification history log
- Mark as read functionality

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Axios for API calls
- React Hook Form + Zod for forms
- WebSockets for real-time updates

- Express.js
- MongoDB (with Mongoose)
- JSON Web Tokens (JWT)
- Socket.io for real-time notifications
- Bcrypt for password hashing

🌐 API Endpoints
Endpoint	Method	Description	Access
/api/auth/register	POST	Register new user	Public
/api/auth/login	POST	User login	Public
/api/tasks	GET	Get all tasks	Admin
/api/tasks	POST	Create new task	Admin
/api/tasks/user	GET	Get user's tasks	User
/api/tasks/:id	PATCH	Update task status	User
/api/users	GET	Get all users	Admin
/api/notifications	GET	Get user notifications	User


🤝 Contributing
Fork the Project

Create your Feature Branch (git checkout -b feature/AmazingFeature)

Commit your Changes (git commit -m 'Add some AmazingFeature')

Push to the Branch (git push origin feature/AmazingFeature)

Open a Pull Request

📜 License
Distributed under the MIT License. See LICENSE for more information.