import { RequestHandler } from "express";
import { MongoClient } from "mongodb";

const connectionString = "mongodb+srv://rajaadarsh25:B5t1yuwLvjj5GAGM@cluster0.bjggxsd.mongodb.net/";

export const handleGetLatestMenu: RequestHandler = async (req, res) => {
  let client: MongoClient | null = null;
  
  try {
    client = new MongoClient(connectionString);
    await client.connect();
    
    const db = client.db("messbook");
    const collection = db.collection("menus");
    
    // Get the latest menu by sorting by date in descending order
    const latestMenu = await collection
      .findOne({}, { sort: { date: -1 } });
    
    if (!latestMenu) {
      return res.status(404).json({ error: "No menu found" });
    }
    
    res.json(latestMenu);
  } catch (error) {
    console.error("Error fetching menu:", error);
    res.status(500).json({ error: "Failed to fetch menu" });
  } finally {
    if (client) {
      await client.close();
    }
  }
};
