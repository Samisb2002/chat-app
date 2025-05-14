import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import { getOnlineUsers } from "../lib/redis.js";

export const getDashboardStats = async (req, res) => {
    try {
        // Utilisateur le plus sollicité (celui qui reçoit le plus de messages)
        const mostContactedUser = await Message.aggregate([
            { $group: { _id: "$receiverId", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 1 }
        ]);

        // Utilisateur qui communique le plus (celui qui envoie le plus de messages)
        const mostActiveUser = await Message.aggregate([
            { $group: { _id: "$senderId", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 1 }
        ]);

        // Nombre total de messages
        const totalMessages = await Message.countDocuments();

        // Nombre total d'utilisateurs
        const totalUsers = await User.countDocuments();

        // Messages par jour (7 derniers jours)
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);

        const messagesPerDay = await Message.aggregate([
            { 
                $match: { 
                    createdAt: { $gte: sevenDaysAgo } 
                } 
            },
            {
                $group: {
                    _id: { 
                        $dateToString: { 
                            format: "%Y-%m-%d", 
                            date: "$createdAt" 
                        } 
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Moyenne de messages par utilisateur
        const averageMessagesPerUser = totalUsers > 0 ? totalMessages / totalUsers : 0;

        // Si nous avons trouvé des utilisateurs, récupérer leurs informations complètes
        let mostContactedUserData = null;
        let mostActiveUserData = null;

        if (mostContactedUser.length > 0) {
            mostContactedUserData = await User.findById(mostContactedUser[0]._id).select("-password");
        }

        if (mostActiveUser.length > 0) {
            mostActiveUserData = await User.findById(mostActiveUser[0]._id).select("-password");
        }

        res.status(200).json({
            mostContactedUser: {
                user: mostContactedUserData,
                messageCount: mostContactedUser.length > 0 ? mostContactedUser[0].count : 0
            },
            mostActiveUser: {
                user: mostActiveUserData,
                messageCount: mostActiveUser.length > 0 ? mostActiveUser[0].count : 0
            },
            totalMessages,
            totalUsers,
            messagesPerDay,
            averageMessagesPerUser: Math.round(averageMessagesPerUser * 100) / 100
        });

    } catch (error) {
        console.log("Error in getDashboardStats controller:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getOnlineUsersStats = async (req, res) => {
    try {
        // Récupérer la liste des utilisateurs en ligne depuis Redis
        const onlineUserIds = await getOnlineUsers();
        
        // Récupérer les informations complètes des utilisateurs en ligne
        const onlineUsers = await User.find({
            _id: { $in: onlineUserIds }
        }).select("-password");

        res.status(200).json(onlineUsers);
    } catch (error) {
        console.log("Error in getOnlineUsersStats controller:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};