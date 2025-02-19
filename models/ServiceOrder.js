import mongoose from "mongoose";

const serviceOrderSchema = new mongoose.Schema({
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "service",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  timeline: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  remarks: {
    type: String,
  },
  partner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "partner",
  },
  cancel: {
    type: Boolean,
    default: false,
  },
  userCode: {
    type: String,
    required: true,
  },
  userApproved: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 5,
    max: [5, "Max rating is 5"]
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "payment"
  }
}, {
  timestamps: true
});

export default mongoose.models.serviceOrder ||
  mongoose.model("serviceOrder", serviceOrderSchema);
