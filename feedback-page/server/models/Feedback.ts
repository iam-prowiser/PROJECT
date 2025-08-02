import mongoose, { Schema, Document } from 'mongoose';

export interface IFeedback extends Document {
  date: Date;
  mealType: 'breakfast' | 'lunch' | 'snacks' | 'dinner';
  rating: number;
  feedback?: string;
  submittedAt: Date;
}

const FeedbackSchema: Schema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  mealType: {
    type: String,
    required: true,
    enum: ['breakfast', 'lunch', 'snacks', 'dinner'],
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  feedback: {
    type: String,
    required: false,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

// Add indexes for better query performance
FeedbackSchema.index({ date: 1 });
FeedbackSchema.index({ mealType: 1 });
FeedbackSchema.index({ submittedAt: -1 });

export default mongoose.model<IFeedback>('Feedback', FeedbackSchema);
