# Chatty - Real-Time Chat Application

Chatty is a modern real-time chat application built with the MERN stack (MongoDB, Express, React, Node.js), enhanced with Socket.IO for real-time communication and Redis for online presence management.

![Chatty Demo](https://placeholder-for-demo-screenshot.com/screenshot.png)

## ✨ Features

- **Real-time messaging** with instant message delivery
- **User authentication** with JWT for secure access
- **Online presence tracking** to see who's currently available
- **Image sharing** in conversations
- **Message history** persistence
- **Responsive design** for desktop and mobile devices
- **Dark/Light mode** support
- **Profile management** including photo uploads

## 🚀 Technology Stack

### Backend
- **Node.js** & **Express.js** - Server framework
- **MongoDB** & **Mongoose** - Database and ODM
- **Socket.IO** - Real-time bidirectional communication
- **Redis** - Online user tracking and presence management
- **JWT** - Authentication with HTTP-only cookies
- **Cloudinary** - Cloud storage for images
- **bcrypt** - Password hashing

### Frontend
- **React** - UI library
- **Zustand** - State management
- **Socket.IO Client** - Real-time communication
- **Tailwind CSS** & **DaisyUI** - Styling
- **Axios** - HTTP client
- **React Router** - Navigation
- **React Hot Toast** - Notifications

## 📦 Installation

### Prerequisites
- Node.js (v14+)
- MongoDB
- Redis
- Cloudinary account

### Environment Setup
1. Clone the repository
```bash
git clone https://github.com/yourusername/chatty.git
cd chatty

Install dependencies

bash# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install

Create .env files

For backend (.env in backend directory):
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
REDIS_URL=your_redis_url
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
For frontend (.env in frontend directory):
VITE_API_BASE_URL=http://localhost:5001
Running the Application

Start the backend server

bashcd backend
npm run dev

Start the frontend development server

bashcd frontend
npm run dev

Access the application at http://localhost:5173

