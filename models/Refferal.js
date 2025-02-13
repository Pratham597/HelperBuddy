import mongoose from "mongoose";
const referralSchema = new mongoose.Schema(
  {
    referrer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    referredUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    bonusAmount: { type: Number, default: 50 },
    status: { type: String, enum: ["Pending", "Credited"], default: "Pending" },
  },
  { timestamps: true }
);

export default mongoose.models.referral ||
  mongoose.model("referral", referralSchema);
