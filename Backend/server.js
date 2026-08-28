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
const frontendUrl = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.startsWith("http")
    ? process.env.FRONTEND_URL
    : `https://${process.env.FRONTEND_URL}`
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

// Routes
app.use("/api/auth", authRoutes); // login/signup — public, protect nahi
app.use("/api", protect, chatRoutes); // chat/thread routes — protected

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

// import express from "express";
// const app = express();
// import cors from "cors";
// import dotenv from "dotenv";
// import fetch from "node-fetch";
// import mongoose from "mongoose";
// import cookieParser from "cookie-parser";
// import chatRoutes from "./routes/chat.js";
// import authRoutes from "./routes/auth.js"
// dotenv.config();

// const PORT = 8080;

// app.use(cors());
// app.use(express.json());
// app.use("/api", chatRoutes);

// app.get("/", (req, res) => {
//   res.send("Server Running");
// });

// app.listen(PORT, () => {
//   console.log(`Server is listening at ${PORT}`);
//   connectDB();
// });

// //MongoDb connection

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGODB_URI);
//     console.log("Connected With Database");
//   } catch (err) {
//     console.log("Failed to connect with DB", err);
//   }
// };
