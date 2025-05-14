import {create} from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useDashboardStore = create((set) => ({
  dashboardStats: null,
  onlineUsers: [],
  isLoading: false,

  getDashboardStats: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/dashboard/stats");
      set({ dashboardStats: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Échec du chargement des statistiques");
    } finally {
      set({ isLoading: false });
    }
  },

  getOnlineUsers: async () => {
    try {
      const res = await axiosInstance.get("/dashboard/online-users");
      set({ onlineUsers: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Échec du chargement des utilisateurs en ligne");
    }
  }
}));