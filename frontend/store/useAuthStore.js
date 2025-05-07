import {create} from "zustand";
import { axiosInstance } from "../src/lib/axios";


export const useAuthStore = create((set)=>({
    authUser:null,
    isSigningup:false,
    isLoggingIng:false,
    isUpdatingProfile:false,
    isCheckingAuth:true,

    checkAuth:async()=>{
        try {
            const res = await axiosInstance.get("/auth/check");
            set({authUser:res.data});

        } catch (error) {
            console.log("Error in CheckAuth: ",error);
            set({authUser:null});

        }finally{
            set({isCheckingAuth:false});
        }
    }


}));