// lib/redis.js
import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

// Utilisez votre URL Redis ou localhost par défaut
const redisClient = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

redisClient.on("connect", () => {
  console.log("Connected to Redis");
});

redisClient.on("error", (err) => {
  console.error("Redis connection error:", err);
});

// Définir la durée pendant laquelle un utilisateur est considéré comme "en ligne" (en secondes)
const ONLINE_USER_EXPIRY = 300; // 5 minutes

// Fonction pour marquer un utilisateur comme en ligne
export const setUserOnline = async (userId) => {
  try {
    await redisClient.sadd("online_users", userId);
    await redisClient.expire("online_users", ONLINE_USER_EXPIRY);
    return true;
  } catch (error) {
    console.error("Error setting user online:", error);
    return false;
  }
};

// Fonction pour marquer un utilisateur comme hors ligne
export const setUserOffline = async (userId) => {
  try {
    await redisClient.srem("online_users", userId);
    return true;
  } catch (error) {
    console.error("Error setting user offline:", error);
    return false;
  }
};

// Fonction pour obtenir tous les utilisateurs en ligne
export const getOnlineUsers = async () => {
  try {
    return await redisClient.smembers("online_users");
  } catch (error) {
    console.error("Error getting online users:", error);
    return [];
  }
};

// Fonction pour vérifier si un utilisateur est en ligne
export const isUserOnline = async (userId) => {
  try {
    return await redisClient.sismember("online_users", userId);
  } catch (error) {
    console.error("Error checking if user is online:", error);
    return false;
  }
};

// Rafraîchir le statut "en ligne" d'un utilisateur
export const refreshUserOnlineStatus = async (userId) => {
  try {
    // Si l'utilisateur est déjà dans l'ensemble, cela réinitialise le TTL
    await setUserOnline(userId);
    return true;
  } catch (error) {
    console.error("Error refreshing user online status:", error);
    return false;
  }
};

export { redisClient };