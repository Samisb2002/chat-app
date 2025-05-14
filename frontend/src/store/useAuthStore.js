import {create} from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:5001";

export const useAuthStore = create((set,get)=>({
    authUser:null,
    isSigningup:false,
    isLoggingIng:false,
    isUpdatingProfile:false,
    isCheckingAuth:true,
    onlineUsers: [],
    socket:null,


    checkAuth:async()=>{
        try {
            const res = await axiosInstance.get("/auth/check");
            set({authUser:res.data});
            get().connectSocket();

        } catch (error) {
            console.log("Error in CheckAuth: ",error);
            set({authUser:null});

        }finally{
            set({isCheckingAuth:false});
        }
    },
    signup:async(data)=>{
            set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();

    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }

    },
    login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");

      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

    logout: async () => {
        try {
        await axiosInstance.post("/auth/logout");
        set({ authUser: null });
        toast.success("Logged out successfully");
        get().disconnectSocket();
        } catch (error) {
        toast.error(error.response.data.message);
        }
    },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  // Méthode pour mettre à jour la liste des utilisateurs en ligne
  setOnlineUsers: (onlineUserIds) => {
    set({ onlineUsers: onlineUserIds });
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    // Créer la connexion socket avec l'ID utilisateur pour l'identifier
    const socket = io(BASE_URL, {
      query: { userId: authUser._id }
    });
    
    socket.connect();

    // Écouter l'événement pour les utilisateurs en ligne
    socket.on("getOnlineUsers", (onlineUserIds) => {
      // Mettre à jour l'état avec les utilisateurs en ligne reçus du serveur
      get().setOnlineUsers(onlineUserIds);
    });

    // Configurer un ping périodique pour maintenir le statut "en ligne"
    const pingInterval = setInterval(() => {
      if (socket.connected) {
        socket.emit("ping");
      }
    }, 60000); // Ping toutes les minutes

    // Stocker l'intervalle pour pouvoir le nettoyer plus tard
    socket.pingInterval = pingInterval;

    set({ socket: socket });
  },
  
  disconnectSocket: () => {
    const socket = get().socket;
    if (socket?.connected) {
      // Nettoyer l'intervalle de ping
      if (socket.pingInterval) {
        clearInterval(socket.pingInterval);
      }
      socket.disconnect();
    }
    set({ socket: null, onlineUsers: [] });
  },

}));