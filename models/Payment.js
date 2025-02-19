import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  totalAmount: {
    type: Number,
    default: 0,
  },
  orderId: {
    type: String,
    required: true,
  },
  paymentId: {
    type: String,
  },
  paymentMethod: {
    type: String,
    enum: ["COD", "Online", "Wallet+Online"],
    required: true,
  },
  walletUsed: {
    type: Number,
    default: 0,
  },
  serviceOrder:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"serviceOrder",
    required:true,
  }
}, {
  timestamps: true
});

export default mongoose.models.payment ||
  mongoose.model("payment", paymentSchema);
