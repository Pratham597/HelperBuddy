import mongoose from "mongoose";

const partnerServiceSchema = new mongoose.Schema(
  {
    partner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "partner",
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "service",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.partnerService ||
  mongoose.model("partnerService", partnerServiceSchema);
