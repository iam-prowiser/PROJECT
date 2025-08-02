import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/database";
import { handleDemo } from "./routes/demo";
import { submitFeedback, getFeedback, getFeedbackStats } from "./routes/feedback";

export function createServer() {
  const app = express();

  // Connect to MongoDB (optional)
  connectDB().catch(console.warn);

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Feedback API routes
  app.post("/api/feedback", submitFeedback);
  app.get("/api/feedback", getFeedback);
  app.get("/api/feedback/stats", getFeedbackStats);

  return app;
}
