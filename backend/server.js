import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRouter from "./routes/Auth.js";
import jobRouter from "./routes/jobs.js";
import applicationRouter from "./routes/Application.js";
import notificationRouter from "./routes/notifications.js";
import cors from "cors";

dotenv.config();
const app = express();

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/jobs", jobRouter);
app.use("/api/applications", applicationRouter);
app.use("/api/notifications", notificationRouter);

// Test route
app.get("/", (req, res) => {
  res.send("Hello");
});

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection error:", error);
  });

// Test route
app.get("/", (req, res) => {
  res.send("Hello");
});
