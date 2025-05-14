# Chatty - Real-Time Chat Application
Chatty is a modern real-time chat application built with the MERN stack (MongoDB, Express, React, Node.js), enhanced with Socket.IO for real-time communication and Redis for online presence management.
## ✨ Features

Real-time messaging with instant message delivery
User authentication with JWT for secure access
Online presence tracking to see who's currently available
Image sharing in conversations
Message history persistence
Responsive design for desktop and mobile devices
Dark/Light mode support
Profile management including photo uploads

## 🚀 Technology Stack
### Backend

Node.js & Express.js - Server framework
MongoDB & Mongoose - Database and ODM
Socket.IO - Real-time bidirectional communication
Redis - Online user tracking and presence management
JWT - Authentication with HTTP-only cookies
Cloudinary - Cloud storage for images
bcrypt - Password hashing

### Frontend

React - UI library
Zustand - State management
Socket.IO Client - Real-time communication
Tailwind CSS & DaisyUI - Styling
Axios - HTTP client
React Router - Navigation
React Hot Toast - Notifications

## 📦 Installation
### Prerequisites

Node.js (v14+)
MongoDB
Redis
Cloudinary account

### Environment Setup

#### 1 Clone the repository

git clone https://github.com/yourusername/chatty.git](https://github.com/Samisb2002/chat-app.git
cd chatty

#### 2 Install dependencies

##### Backend dependencies:

bashcd backend
npm install express mongoose socket.io ioredis dotenv bcryptjs jsonwebtoken cookie-parser cors cloudinary
npm install nodemon -D

##### Frontend dependencies:
bashcd ../frontend
npm install react react-dom react-router-dom axios socket.io-client zustand react-hot-toast lucide-react
npm install tailwindcss daisyui postcss autoprefixer -D
    

### Running the Application

#### Start the backend server

bashcd backend
npm run dev

#### Start the frontend development server

bashcd frontend
npm run dev

Access the application at http://localhost:5173
RéessayerClaude peut faire des erreurs. Assurez-vous de vérifier ses réponses.
