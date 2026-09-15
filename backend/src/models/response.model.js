import mongoose from 'mongoose';

const responseSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true,
    },
    surveyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Survey',
      required: true,
      index: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
    },
    answers: [
      {
        questionId: mongoose.Schema.Types.ObjectId,
        value: mongoose.Schema.Types.Mixed,
      },
    ],
    npsScore: Number,
    csatScore: Number,
    cesScore: Number,
    sentiment: {
      type: String,
      enum: ['positive', 'neutral', 'negative'],
    },
    topics: [String],
    source: {
      type: String,
      enum: ['link', 'qr', 'widget'],
      default: 'link',
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'resolved'],
      default: 'open',
    },
    followUpNote: String,
    resolvedAt: Date,
  },
  {
    timestamps: true,
  }
);

responseSchema.index({ organizationId: 1, createdAt: -1 });

export const Response = mongoose.model('Response', responseSchema);
