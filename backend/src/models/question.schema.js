import mongoose from 'mongoose';

export const questionSchema = new mongoose.Schema(
  {
    surveyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Survey',
      index: true,
    },
    type: {
      type: String,
      enum: ['rating', 'nps', 'csat', 'ces', 'text', 'textarea', 'multiple-choice', 'yes-no'],
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    required: {
      type: Boolean,
      default: false,
    },
    options: [String], // For multiple-choice, yes-no
  },
  {
    _id: true, // Automatically generates unique ObjectId for each question
  }
);