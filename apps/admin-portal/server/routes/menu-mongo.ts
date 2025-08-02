import { RequestHandler } from "express";
import { ObjectId } from "mongodb";
import { getMenusCollection } from "../lib/database";

export interface MenuEntry {
  _id?: ObjectId | string;
  date: string;
  mealType: "breakfast" | "lunch" | "snacks" | "dinner";
  menu: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const handleGetMenus: RequestHandler = async (req, res) => {
  try {
    const collection = await getMenusCollection();
    const menus = await collection
      .find({})
      .sort({ date: -1, mealType: 1 })
      .toArray();

    // Convert ObjectId to string for JSON serialization
    const serializedMenus = menus.map(menu => ({
      ...menu,
      _id: menu._id.toString(),
    }));

    res.json(serializedMenus);
  } catch (error) {
    console.error("Get menus error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const handleCreateMenu: RequestHandler = async (req, res) => {
  try {
    const { date, mealType, menu } = req.body;

    if (!date || !mealType || !menu) {
      res.status(400).json({ message: "Date, meal type, and menu are required" });
      return;
    }

    const collection = await getMenusCollection();

    // Check if menu already exists for this date and meal type
    const existingMenu = await collection.findOne({ date, mealType });

    if (existingMenu) {
      res.status(409).json({ 
        message: `Menu for ${mealType} on ${date} already exists. Please edit the existing entry.` 
      });
      return;
    }

    const newEntry: MenuEntry = {
      date,
      mealType,
      menu,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(newEntry);
    const createdMenu = await collection.findOne({ _id: result.insertedId });

    if (createdMenu) {
      res.status(201).json({
        ...createdMenu,
        _id: createdMenu._id.toString(),
      });
    } else {
      res.status(500).json({ message: "Failed to create menu entry" });
    }
  } catch (error) {
    console.error("Create menu error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const handleUpdateMenu: RequestHandler = async (req, res) => {
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

    // Check if another menu already exists for this date and meal type (excluding current entry)
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
          updatedAt: new Date() 
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
        _id: updatedMenu._id.toString(),
      });
    } else {
      res.status(500).json({ message: "Failed to retrieve updated menu" });
    }
  } catch (error) {
    console.error("Update menu error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const handleDeleteMenu: RequestHandler = async (req, res) => {
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

export const handleGetMenuByDate: RequestHandler = async (req, res) => {
  try {
    const { date } = req.params;
    const { mealType } = req.query;

    const collection = await getMenusCollection();
    const query: any = { date };
    
    if (mealType) {
      query.mealType = mealType;
    }

    const menus = await collection.find(query).sort({ mealType: 1 }).toArray();
    
    // Convert ObjectId to string for JSON serialization
    const serializedMenus = menus.map(menu => ({
      ...menu,
      _id: menu._id.toString(),
    }));

    res.json(serializedMenus);
  } catch (error) {
    console.error("Get menu by date error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
