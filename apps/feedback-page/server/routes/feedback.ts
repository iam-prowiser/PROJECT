import { RequestHandler } from "express";
import { z } from "zod";
import { promises as fs } from "fs";
import path from "path";
import Feedback, { IFeedback } from "../models/Feedback";
import { isMongoConnected } from "../config/database";

// Zod schema for feedback validation
const feedbackSchema = z.object({
  date: z.string().transform((str) => new Date(str)),
  mealType: z.enum(["breakfast", "lunch", "snacks", "dinner"]),
  rating: z.number().min(1).max(5),
  feedback: z.string().optional(),
});

export type FeedbackData = z.infer<typeof feedbackSchema>;

// File storage fallback
const FEEDBACK_FILE = path.join(process.cwd(), 'feedback.txt');

// Helper function to read feedback from file
const readFeedbackFromFile = async (): Promise<(FeedbackData & { id: string; submittedAt: Date })[]> => {
  try {
    const data = await fs.readFile(FEEDBACK_FILE, 'utf-8');
    return data.split('\n').filter(line => line.trim()).map(line => JSON.parse(line));
  } catch (error) {
    // File doesn't exist yet, return empty array
    return [];
  }
};

// Helper function to append feedback to file
const appendFeedbackToFile = async (feedback: FeedbackData & { id: string; submittedAt: Date }) => {
  const feedbackLine = JSON.stringify(feedback) + '\n';
  await fs.appendFile(FEEDBACK_FILE, feedbackLine, 'utf-8');
};

export const submitFeedback: RequestHandler = async (req, res) => {
  try {
    // Validate the request body
    const validatedData = feedbackSchema.parse(req.body);
    
    if (isMongoConnected) {
      // Use MongoDB
      const feedbackEntry = new Feedback({
        date: validatedData.date,
        mealType: validatedData.mealType,
        rating: validatedData.rating,
        feedback: validatedData.feedback,
      });
      
      const savedFeedback = await feedbackEntry.save();
      
      console.log("New anonymous feedback saved to MongoDB:", {
        id: savedFeedback._id,
        mealType: savedFeedback.mealType,
        rating: savedFeedback.rating,
        date: savedFeedback.date.toDateString(),
      });
      
      res.status(201).json({
        success: true,
        message: "Feedback submitted successfully",
        feedbackId: savedFeedback._id,
      });
    } else {
      // Use file storage
      const feedbackEntry = {
        id: `fb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...validatedData,
        submittedAt: new Date(),
      };
      
      await appendFeedbackToFile(feedbackEntry);
      
      console.log("New anonymous feedback saved to file:", {
        id: feedbackEntry.id,
        mealType: feedbackEntry.mealType,
        rating: feedbackEntry.rating,
        date: feedbackEntry.date.toDateString(),
      });
      
      res.status(201).json({
        success: true,
        message: "Feedback submitted successfully",
        feedbackId: feedbackEntry.id,
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: "Invalid feedback data",
        errors: error.errors,
      });
    } else {
      console.error("Error saving feedback:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
};

export const getFeedback: RequestHandler = async (req, res) => {
  try {
    const { mealType, date } = req.query;
    
    if (isMongoConnected) {
      // Use MongoDB
      const query: any = {};
      
      if (mealType && mealType !== 'all') {
        query.mealType = mealType;
      }
      
      if (date) {
        const targetDate = new Date(date as string);
        const nextDay = new Date(targetDate);
        nextDay.setDate(nextDay.getDate() + 1);
        
        query.date = {
          $gte: targetDate,
          $lt: nextDay,
        };
      }
      
      const feedback = await Feedback.find(query)
        .sort({ submittedAt: -1 })
        .lean()
        .exec();
      
      res.json({
        success: true,
        feedback: feedback.map(fb => ({
          ...fb,
          id: fb._id.toString(),
        })),
        total: feedback.length,
      });
    } else {
      // Use file storage
      let filteredFeedback = await readFeedbackFromFile();
      
      if (mealType && mealType !== 'all') {
        filteredFeedback = filteredFeedback.filter(fb => fb.mealType === mealType);
      }
      
      if (date) {
        const targetDate = new Date(date as string).toDateString();
        filteredFeedback = filteredFeedback.filter(fb => new Date(fb.date).toDateString() === targetDate);
      }
      
      // Sort by most recent first
      filteredFeedback.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
      
      res.json({
        success: true,
        feedback: filteredFeedback,
        total: filteredFeedback.length,
      });
    }
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching feedback data',
    });
  }
};

export const getFeedbackStats: RequestHandler = async (req, res) => {
  try {
    if (isMongoConnected) {
      // Use MongoDB aggregation
      const [totalStats, mealTypeStats, ratingStats] = await Promise.all([
        Feedback.aggregate([
          {
            $group: {
              _id: null,
              totalFeedback: { $sum: 1 },
              averageRating: { $avg: "$rating" },
            },
          },
        ]),
        
        Feedback.aggregate([
          {
            $group: {
              _id: "$mealType",
              count: { $sum: 1 },
            },
          },
        ]),
        
        Feedback.aggregate([
          {
            $group: {
              _id: "$rating",
              count: { $sum: 1 },
            },
          },
        ]),
      ]);
      
      const total = totalStats[0]?.totalFeedback || 0;
      const averageRating = totalStats[0]?.averageRating || 0;
      
      const mealTypeBreakdown = {
        breakfast: 0,
        lunch: 0,
        snacks: 0,
        dinner: 0,
      };
      
      mealTypeStats.forEach((item) => {
        if (item._id in mealTypeBreakdown) {
          mealTypeBreakdown[item._id as keyof typeof mealTypeBreakdown] = item.count;
        }
      });
      
      const ratingDistribution = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      };
      
      ratingStats.forEach((item) => {
        if (item._id >= 1 && item._id <= 5) {
          ratingDistribution[item._id as keyof typeof ratingDistribution] = item.count;
        }
      });
      
      res.json({
        success: true,
        stats: {
          totalFeedback: total,
          averageRating: Number(averageRating.toFixed(1)),
          mealTypeBreakdown,
          ratingDistribution,
        },
      });
    } else {
      // Use file storage
      const feedbackStorage = await readFeedbackFromFile();
      
      const stats = {
        totalFeedback: feedbackStorage.length,
        averageRating: feedbackStorage.length > 0 
          ? feedbackStorage.reduce((sum, fb) => sum + fb.rating, 0) / feedbackStorage.length 
          : 0,
        mealTypeBreakdown: {
          breakfast: feedbackStorage.filter(fb => fb.mealType === "breakfast").length,
          lunch: feedbackStorage.filter(fb => fb.mealType === "lunch").length,
          snacks: feedbackStorage.filter(fb => fb.mealType === "snacks").length,
          dinner: feedbackStorage.filter(fb => fb.mealType === "dinner").length,
        },
        ratingDistribution: {
          1: feedbackStorage.filter(fb => fb.rating === 1).length,
          2: feedbackStorage.filter(fb => fb.rating === 2).length,
          3: feedbackStorage.filter(fb => fb.rating === 3).length,
          4: feedbackStorage.filter(fb => fb.rating === 4).length,
          5: feedbackStorage.filter(fb => fb.rating === 5).length,
        },
      };
      
      res.json({
        success: true,
        stats,
      });
    }
  } catch (error) {
    console.error('Error calculating feedback statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Error calculating feedback statistics',
    });
  }
};
