// socket.js
import { Server } from "socket.io";
import Message from "./models/Message.js";
import User from "./models/User.js";

let io; // Define io variable to store Socket.io instance

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join_room", async (userId) => {
      socket.join(userId);
      socket.userId = userId; // Store userId in socket session
      console.log(`User ${userId} joined room ${userId}`);
      try {
        await User.findByIdAndUpdate(userId, { online: true });
        io.emit("statusUpdate", { userId, online: true });
      } catch (err) {
        console.error("Error updating user status", err);
      }
    });

    socket.on("send_message", async (data) => {
      const {
        tempId,
        sender,
        receiver,
        content,
        file,
        fileType,
        fileName,
        fileSize,
      } = data;

      const message = new Message({
        sender,
        receiver,
        content,
        file,
        fileType,
        fileName,
        fileSize,
      });

      try {
        const savedMessage = await message.save();

        const lastMessageUser =
          sender === savedMessage.sender.toString() ? sender : receiver;
        // Update lastMessage field in User model
        await User.findByIdAndUpdate(lastMessageUser, {
          lastMessage: savedMessage.content,
        });

        io.to(receiver).emit("receive_message", savedMessage);
        io.to(sender).emit("message_sent", { ...savedMessage._doc, tempId }); // Emit back to sender with the correct ID and tempId
        console.log(`Message from ${sender} to ${receiver}: ${content}`);
      } catch (err) {
        console.error("Error saving message to database", err);
      }
    });

    socket.on("disconnect", async () => {
      console.log(`User disconnected: ${socket.id}`);
      const userId = socket.userId;
      if (userId) {
        try {
          await User.findByIdAndUpdate(userId, { online: false });
          io.emit("statusUpdate", { userId, online: false });
        } catch (err) {
          console.error("Error updating user status on disconnect", err);
        }
      }
    });
  });
}

function getIo() {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
}

export { initSocket, getIo };
