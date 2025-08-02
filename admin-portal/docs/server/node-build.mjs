import path from "path";
import "dotenv/config";
import * as express from "express";
import express__default from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import { MongoClient, ObjectId } from "mongodb";
const handleDemo = (req, res) => {
  const response = {
    message: "Hello from Express server"
  };
  res.status(200).json(response);
};
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const handleAdminLogin = (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({
        success: false,
        message: "Username and password are required"
      });
      return;
    }
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
      return;
    }
    const token = jwt.sign(
      { username, role: "admin" },
      JWT_SECRET,
      { expiresIn: "24h" }
    );
    res.json({
      success: true,
      token,
      message: "Login successful"
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
const verifyAdminToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "No token provided" });
      return;
    }
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== "admin") {
      res.status(403).json({ message: "Access denied" });
      return;
    }
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
let client = null;
let db = null;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://rajaadarsh25:B5t1yuwLvjj5GAGM@cluster0.bjggxsd.mongodb.net/";
const DATABASE_NAME = process.env.DATABASE_NAME || "messbook";
async function connectToDatabase() {
  if (db) {
    return db;
  }
  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(DATABASE_NAME);
    console.log("Connected to MongoDB successfully");
    return db;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
}
async function getMenusCollection() {
  const database = await connectToDatabase();
  return database.collection("menus");
}
async function closeDatabaseConnection() {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log("Disconnected from MongoDB");
  }
}
process.on("SIGINT", async () => {
  await closeDatabaseConnection();
  process.exit(0);
});
process.on("SIGTERM", async () => {
  await closeDatabaseConnection();
  process.exit(0);
});
const handleGetMenus = async (req, res) => {
  try {
    const collection = await getMenusCollection();
    const menus = await collection.find({}).sort({ date: -1, mealType: 1 }).toArray();
    const serializedMenus = menus.map((menu) => ({
      ...menu,
      _id: menu._id.toString()
    }));
    res.json(serializedMenus);
  } catch (error) {
    console.error("Get menus error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const handleCreateMenu = async (req, res) => {
  try {
    const { date, mealType, menu } = req.body;
    if (!date || !mealType || !menu) {
      res.status(400).json({ message: "Date, meal type, and menu are required" });
      return;
    }
    const collection = await getMenusCollection();
    const existingMenu = await collection.findOne({ date, mealType });
    if (existingMenu) {
      res.status(409).json({
        message: `Menu for ${mealType} on ${date} already exists. Please edit the existing entry.`
      });
      return;
    }
    const newEntry = {
      date,
      mealType,
      menu,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    const result = await collection.insertOne(newEntry);
    const createdMenu = await collection.findOne({ _id: result.insertedId });
    if (createdMenu) {
      res.status(201).json({
        ...createdMenu,
        _id: createdMenu._id.toString()
      });
    } else {
      res.status(500).json({ message: "Failed to create menu entry" });
    }
  } catch (error) {
    console.error("Create menu error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const handleUpdateMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, mealType, menu } = req.body;
    if (!date || !mealType || !menu) {
      res.status(400).json({ message: "Date, meal type, and menu are required" });
      return;
    }
    if (!ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid menu ID" });
      return;
    }
    const collection = await getMenusCollection();
    const existingMenu = await collection.findOne({
      _id: { $ne: new ObjectId(id) },
      date,
      mealType
    });
    if (existingMenu) {
      res.status(409).json({
        message: `Another menu for ${mealType} on ${date} already exists.`
      });
      return;
    }
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          date,
          mealType,
          menu,
          updatedAt: /* @__PURE__ */ new Date()
        }
      }
    );
    if (result.matchedCount === 0) {
      res.status(404).json({ message: "Menu entry not found" });
      return;
    }
    const updatedMenu = await collection.findOne({ _id: new ObjectId(id) });
    if (updatedMenu) {
      res.json({
        ...updatedMenu,
        _id: updatedMenu._id.toString()
      });
    } else {
      res.status(500).json({ message: "Failed to retrieve updated menu" });
    }
  } catch (error) {
    console.error("Update menu error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const handleDeleteMenu = async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid menu ID" });
      return;
    }
    const collection = await getMenusCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      res.status(404).json({ message: "Menu entry not found" });
      return;
    }
    res.json({ message: "Menu entry deleted successfully" });
  } catch (error) {
    console.error("Delete menu error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const handleGetMenuByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const { mealType } = req.query;
    const collection = await getMenusCollection();
    const query = { date };
    if (mealType) {
      query.mealType = mealType;
    }
    const menus = await collection.find(query).sort({ mealType: 1 }).toArray();
    const serializedMenus = menus.map((menu) => ({
      ...menu,
      _id: menu._id.toString()
    }));
    res.json(serializedMenus);
  } catch (error) {
    console.error("Get menu by date error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
function createServer() {
  const app2 = express__default();
  app2.use(cors());
  app2.use(express__default.json());
  app2.use(express__default.urlencoded({ extended: true }));
  app2.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });
  app2.get("/api/demo", handleDemo);
  app2.post("/api/admin/login", handleAdminLogin);
  app2.get("/api/admin/menus", verifyAdminToken, handleGetMenus);
  app2.post("/api/admin/menus", verifyAdminToken, handleCreateMenu);
  app2.put("/api/admin/menus/:id", verifyAdminToken, handleUpdateMenu);
  app2.delete("/api/admin/menus/:id", verifyAdminToken, handleDeleteMenu);
  app2.get("/api/menus/:date", handleGetMenuByDate);
  return app2;
}
const app = createServer();
const port = process.env.PORT || 3e3;
const __dirname = import.meta.dirname;
const distPath = path.join(__dirname, "../spa");
app.use(express.static(distPath));
app.get("*", (req, res) => {
  if (req.path.startsWith("/api/") || req.path.startsWith("/health")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }
  res.sendFile(path.join(distPath, "index.html"));
});
app.listen(port, () => {
  console.log(`🚀 Fusion Starter server running on port ${port}`);
  console.log(`📱 Frontend: http://localhost:${port}`);
  console.log(`🔧 API: http://localhost:${port}/api`);
});
process.on("SIGTERM", () => {
  console.log("🛑 Received SIGTERM, shutting down gracefully");
  process.exit(0);
});
process.on("SIGINT", () => {
  console.log("🛑 Received SIGINT, shutting down gracefully");
  process.exit(0);
});
//# sourceMappingURL=node-build.mjs.map
