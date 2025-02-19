import mongoose from "mongoose";
const complaintSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String},
    email: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.complaint ||
  mongoose.model("complaint", complaintSchema);
