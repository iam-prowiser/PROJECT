/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Feedback API types
 */
export interface FeedbackSubmission {
  date: Date;
  mealType: "breakfast" | "lunch" | "snacks" | "dinner";
  rating: 1 | 2 | 3 | 4 | 5;
  feedback?: string;
}

export interface FeedbackResponse {
  success: boolean;
  message: string;
  feedbackId?: string;
  errors?: any[];
}

export interface FeedbackEntry extends FeedbackSubmission {
  id: string;
  submittedAt: Date;
}

export interface FeedbackListResponse {
  success: boolean;
  feedback: FeedbackEntry[];
  total: number;
}

export interface FeedbackStats {
  totalFeedback: number;
  averageRating: number;
  mealTypeBreakdown: {
    breakfast: number;
    lunch: number;
    snacks: number;
    dinner: number;
  };
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface FeedbackStatsResponse {
  success: boolean;
  stats: FeedbackStats;
}
