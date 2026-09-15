import mongoose from 'mongoose';

export const questionSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  type: {
    type: String,
    enum: ['rating', 'nps', 'csat', 'ces', 'text', 'textarea', 'multiple-choice', 'yes-no'],
    required: true,
  },
  question: String,
  required: Boolean,
  options: [String], // For multiple-choice, yes-no
}, { _id: false });