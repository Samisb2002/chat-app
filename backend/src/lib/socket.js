// lib/socket.js - pour votre serveur
import { Server } from "socket.io";
import http from "http";
import express from "express";
import { setUserOnline, setUserOffline, getOnlineUsers, refreshUserOnlineStatus } from "./redis.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    credentials: true,
  },
});

// Stockage temporaire des relations utilisateur-socket
const userSocketMap = {}; // {userId: socketId}

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

io.on("connection", async (socket) => {
  console.log("A user connected", socket.id);
  
  const userId = socket.handshake.query.userId;
  
  if (userId) {
    // Associer l'ID utilisateur à l'ID socket
    userSocketMap[userId] = socket.id;
    
    // Marquer l'utilisateur comme en ligne dans Redis
    await setUserOnline(userId);
    
    // Récupérer la liste des utilisateurs en ligne depuis Redis
    const onlineUserIds = await getOnlineUsers();
    
    // Émettre l'événement avec la liste des utilisateurs en ligne à tous les clients
    io.emit("getOnlineUsers", onlineUserIds);

    // Émettre un événement pour mettre à jour le dashboard
    io.emit("dashboardUpdate", { type: "userConnected", userId });
  }

  // Événement de ping pour maintenir le statut "en ligne"
  socket.on("ping", async () => {
    if (userId) {
      await refreshUserOnlineStatus(userId);
    }
  });

  // Événement pour les nouveaux messages (émis depuis message.controller.js)
  socket.on("newMessage", (messageData) => {
    // Émettre le message au destinataire spécifique
    const receiverSocketId = userSocketMap[messageData.receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("getMessage", messageData);
    }

    // Émettre un événement pour mettre à jour le dashboard
    io.emit("dashboardUpdate", { type: "newMessage", messageData });
  });

  // Gestion de la déconnexion
  socket.on("disconnect", async () => {
    console.log("A user disconnected", socket.id);
    
    if (userId) {
      // Supprimer l'association utilisateur-socket
      delete userSocketMap[userId];
      
      // Marquer l'utilisateur comme hors ligne dans Redis
      await setUserOffline(userId);
      
      // Récupérer la liste mise à jour des utilisateurs en ligne
      const onlineUserIds = await getOnlineUsers();
      
      // Émettre l'événement avec la liste mise à jour à tous les clients
      io.emit("getOnlineUsers", onlineUserIds);

      // Émettre un événement pour mettre à jour le dashboard
      io.emit("dashboardUpdate", { type: "userDisconnected", userId });
    }
  });
});

export { io, app, server };