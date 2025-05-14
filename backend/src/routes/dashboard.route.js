import express from "express";
import { getDashboardStats, getOnlineUsersStats } from "../controllers/dashboard.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/stats", protectRoute, getDashboardStats);
router.get("/online-users", protectRoute, getOnlineUsersStats);

export default router;