import mongoose from "mongoose";

const partnerServiceSchema = new mongoose.Schema(
  {
    partner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Partner",
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    pincode: [{ type: String, required: true }],
  },
  { timestamps: true }
);

export default mongoose.models.partnerService ||
  mongoose.model("partnerService", partnerServiceSchema);
