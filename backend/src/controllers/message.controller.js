import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { io, getReceiverSocketId } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("error in getUsersForSidebar :", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId }
      ]
    }).sort({ createdAt: 1 }); // Tri par ordre chronologique
    
    res.status(200).json(messages);
  } catch (error) {
    console.log("error in getMessages controller :", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessages = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;
    let imageUrl;

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl
    });

    await newMessage.save();

    // Envoyer le message au destinataire via socket.io
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("getMessage", newMessage);
    }

    // Émettre un événement pour mettre à jour le dashboard
    io.emit("dashboardUpdate", {
      type: "newMessage",
      messageData: {
        senderId,
        receiverId,
        _id: newMessage._id,
        createdAt: newMessage.createdAt
      }
    });

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("error in sendMessages controller :", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};