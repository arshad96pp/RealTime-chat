import express from "express";
import connectDB from "./db.js";
import routes from "./routes.js";
import mongoose from "mongoose";
import { Server } from "socket.io"; // Import Server, not Socket
import cors from "cors";
import Message from "./models/Message.js";
const http = require("http");
// import dotenv from "dotenv";

// dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
const server = http.createServer(app);

// Use Server class to create a Socket.io instance
const io = new Server(server); // Pass the HTTP server to Server constructor

// Routes
app.use("/api/auth", routes);

// Socket.io logic
io.on("connection", (socket) => {
  console.log("New client connected");

  // Listen for incoming messages
  socket.on("message", async (data) => {
    try {
      // Save the message to the database
      const message = new Message({
        sender: data.sender,
        receiver: data.receiver,
        content: data.content,
      });
      await message.save();

      // Emit the message to the receiver
      io.to(data.receiver).emit("message", message);
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });

  // Listen for user joining chat room
  socket.on("join", (userId) => {
    socket.join(userId);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

mongoose
  .connect("mongodb://localhost:27017", {})
  .then(() => {
    console.log("Connected to MongoDB");
    server.listen(PORT, () => {
      // Use server.listen to start the server
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });
