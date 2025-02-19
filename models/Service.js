import mongoose from "mongoose";
const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: String },
    threshold:{
      type:Number,
      required:true,
      default:1
    }
  },
  { timestamps: true }
);

export default mongoose.models.service ||
  mongoose.model("service", serviceSchema);
