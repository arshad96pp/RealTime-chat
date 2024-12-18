import express from "express";
import { getAllMessages } from "./controller/Message.js";
import {
  GetAllUsersRoutes,
  LoginRoutes,
  registerRoutes,
} from "./controller/Auth.js";
import Message from "./models/Message.js";

const router = express.Router();

// Define routes
router.get("/", GetAllUsersRoutes);
router.get("/main", getAllMessages);
router.post("/register", registerRoutes);
router.post("/login", LoginRoutes);

// Get all messages between two users
router.get("/messages/:senderId/:receiverId", async (req, res) => {
  const { senderId, receiverId } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    }).sort({ timestamp: 1 });

    res.status(200).json({ messages });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching messages", error: err.message });
  }
});

export default router;
