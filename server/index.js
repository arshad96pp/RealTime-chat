import express from "express";
import routes from "./routes.js";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";

import multer from "multer";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { initSocket } from "./socket.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8000;

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/uploads", express.static(uploadsDir));

const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

// File upload endpoint
app.post("/upload", upload.single("file"), (req, res) => {
  console.log("File upload request received.");
  if (!req.file) {
    console.error("No file uploaded.");
    return res.status(400).send("No file uploaded.");
  }
  console.log("File uploaded successfully:", req.file);
  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${
    req.file.filename
  }`;
  res.json({ filePath: fileUrl });
});

// Routes
app.use("/api/auth", routes);

mongoose
  .connect("mongodb://localhost:27017", {})
  .then(() => {
    console.log("Connected to MongoDB");
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });
