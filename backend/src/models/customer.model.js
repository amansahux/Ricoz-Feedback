import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: true,
      index: true,
    },
    name: String,
    email: String,
  },
  {
    timestamps: true,
  }
);

customerSchema.index({ organizationId: 1, email: 1 });

export const Customer = mongoose.model('Customer', customerSchema);
