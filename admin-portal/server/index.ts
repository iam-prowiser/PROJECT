import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleAdminLogin, verifyAdminToken } from "./routes/admin";
import {
  handleGetMenus,
  handleCreateMenu,
  handleUpdateMenu,
  handleDeleteMenu,
  handleGetMenuByDate
} from "./routes/menu-mongo";

export function createServer() {
  const app = express();

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

  // Admin authentication routes
  app.post("/api/admin/login", handleAdminLogin);

  // Menu management routes (protected)
  app.get("/api/admin/menus", verifyAdminToken, handleGetMenus);
  app.post("/api/admin/menus", verifyAdminToken, handleCreateMenu);
  app.put("/api/admin/menus/:id", verifyAdminToken, handleUpdateMenu);
  app.delete("/api/admin/menus/:id", verifyAdminToken, handleDeleteMenu);

  // Public routes for menu viewing
  app.get("/api/menus/:date", handleGetMenuByDate);

  return app;
}
