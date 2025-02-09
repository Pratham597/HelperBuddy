import mongoose from "mongoose";
const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.service || mongoose.model("service", serviceSchema);
