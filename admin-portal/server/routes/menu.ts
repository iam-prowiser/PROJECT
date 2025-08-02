import { RequestHandler } from "express";

export interface MenuEntry {
  _id?: string;
  date: string;
  mealType: "breakfast" | "lunch" | "snacks" | "dinner";
  menu: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// In-memory storage for demo purposes
// In production, this should be replaced with MongoDB
let menuEntries: MenuEntry[] = [];
let nextId = 1;

export const handleGetMenus: RequestHandler = (req, res) => {
  try {
    // Sort by date (newest first) and then by meal type
    const sortedMenus = [...menuEntries].sort((a, b) => {
      const dateCompare = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (dateCompare !== 0) return dateCompare;
      
      const mealOrder = ["breakfast", "lunch", "snacks", "dinner"];
      return mealOrder.indexOf(a.mealType) - mealOrder.indexOf(b.mealType);
    });

    res.json(sortedMenus);
  } catch (error) {
    console.error("Get menus error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const handleCreateMenu: RequestHandler = (req, res) => {
  try {
    const { date, mealType, menu } = req.body;

    if (!date || !mealType || !menu) {
      res.status(400).json({ message: "Date, meal type, and menu are required" });
      return;
    }

    // Check if menu already exists for this date and meal type
    const existingMenu = menuEntries.find(
      entry => entry.date === date && entry.mealType === mealType
    );

    if (existingMenu) {
      res.status(409).json({ 
        message: `Menu for ${mealType} on ${date} already exists. Please edit the existing entry.` 
      });
      return;
    }

    const newEntry: MenuEntry = {
      _id: nextId.toString(),
      date,
      mealType,
      menu,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    menuEntries.push(newEntry);
    nextId++;

    res.status(201).json(newEntry);
  } catch (error) {
    console.error("Create menu error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const handleUpdateMenu: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const { date, mealType, menu } = req.body;

    if (!date || !mealType || !menu) {
      res.status(400).json({ message: "Date, meal type, and menu are required" });
      return;
    }

    const entryIndex = menuEntries.findIndex(entry => entry._id === id);
    if (entryIndex === -1) {
      res.status(404).json({ message: "Menu entry not found" });
      return;
    }

    // Check if another menu already exists for this date and meal type (excluding current entry)
    const existingMenu = menuEntries.find(
      entry => entry._id !== id && entry.date === date && entry.mealType === mealType
    );

    if (existingMenu) {
      res.status(409).json({ 
        message: `Another menu for ${mealType} on ${date} already exists.` 
      });
      return;
    }

    menuEntries[entryIndex] = {
      ...menuEntries[entryIndex],
      date,
      mealType,
      menu,
      updatedAt: new Date(),
    };

    res.json(menuEntries[entryIndex]);
  } catch (error) {
    console.error("Update menu error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const handleDeleteMenu: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;

    const entryIndex = menuEntries.findIndex(entry => entry._id === id);
    if (entryIndex === -1) {
      res.status(404).json({ message: "Menu entry not found" });
      return;
    }

    menuEntries.splice(entryIndex, 1);
    res.json({ message: "Menu entry deleted successfully" });
  } catch (error) {
    console.error("Delete menu error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const handleGetMenuByDate: RequestHandler = (req, res) => {
  try {
    const { date } = req.params;
    const { mealType } = req.query;

    let filteredMenus = menuEntries.filter(entry => entry.date === date);
    
    if (mealType) {
      filteredMenus = filteredMenus.filter(entry => entry.mealType === mealType);
    }

    res.json(filteredMenus);
  } catch (error) {
    console.error("Get menu by date error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
