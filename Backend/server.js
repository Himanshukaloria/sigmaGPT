import express from "express";
const app = express();

import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/auth.js";
import protect from "./middleware/auth.js";

dotenv.config();

const PORT = process.env.PORT || 8080;
const configuredFrontendUrl = process.env.FRONTEND_URL;
const frontendUrl = configuredFrontendUrl
  ? (() => {
      const url = configuredFrontendUrl.startsWith("http")
        ? configuredFrontendUrl
        : `https://${configuredFrontendUrl}`;
      return url.includes(".onrender.com") ? url : `${url}.onrender.com`;
    })()
  : "http://localhost:5173";

// Middlewares
app.use(
  cors({
    origin: frontendUrl,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", protect, chatRoutes);

app.get("/", (req, res) => {
  res.send("Server Running");
});

export default app;

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected With Database");
};

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is listening at ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect with DB", err.message);
    process.exitCode = 1;
  }
};

startServer();
