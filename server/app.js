import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { syncDatabase } from "./models/index.js";

// Import routes
import jobRoutes from "./routes/jobRoutes.js";
import candidateRoutes from "./routes/candidateRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import voiceAgentRoutes from "./routes/voiceAgentRoutes.js";

// Initialize express app
const app = express();
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sync database
syncDatabase();

// API routes
app.use("/api/jobs", jobRoutes);
app.use("/api/candidates", candidateRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/conversations", conversationRoutes);
app.use("/api/voice-agent", voiceAgentRoutes);

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Voice Agent Interview Scheduling API" });
});

export default app;
