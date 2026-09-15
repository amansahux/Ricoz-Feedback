import mongoose from 'mongoose';
import { questionSchema } from './question.schema.js';

const surveySchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: String,
    slug: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
    questions: [questionSchema],
  },
  {
    timestamps: true,
  }
);

// Index for public survey lookup
surveySchema.index({ organizationId: 1, slug: 1 });

export const Survey = mongoose.model('Survey', surveySchema);
