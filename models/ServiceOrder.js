import mongoose from "mongoose";

const serviceOrderSchema = new mongoose.Schema({
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "service",
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
  booking:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"booking",
    required:true
  },
  userCode:{
    type:String,
    required:true,
  },
  userApproved:{
    type:Boolean,
    default:false
  }
});

export default mongoose.models.serviceOrder ||
  mongoose.model("serviceOrder", serviceOrderSchema);
