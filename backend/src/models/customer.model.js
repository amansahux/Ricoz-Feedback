import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
      index: true,
    },
    name: {
      type: String,
      trim: true,
      default: "Anonymous",
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    metadata: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

customerSchema.index({ organizationId: 1, email: 1 });
customerSchema.index({ organizationId: 1, createdAt: -1 });

export const Customer = mongoose.model("Customer", customerSchema);
