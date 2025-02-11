import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  totalAmount: {
    type: Number,
    default: 0,
  },
  orderId: {
    type: String,
    required: true,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.models.booking ||
  mongoose.model("booking", bookingSchema);
