import User from "@/models/User";
import connectDB from "@/db/connect";
import { NextResponse } from "next/server";
import PartnerService from "@/models/PartnerService";
import ServiceOrder from "@/models/ServiceOrder";
import generateOrderId from "@/actions/user/generateOrderId"
import Booking from "@/models/Booking";

/** Controller for checking out cart */
export const POST = async (req, res) => {
  await connectDB();
  const userId = req.headers.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await User.findById(userId);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await req.json();
  for (let i = 0; i < data.length; i++) {
    const service = data[i];
    const serviceId = service.serviceId;
    const pincode = service.pincode;
    if(!serviceId || !pincode || !service.timeline || !service.address){
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
  }
  if(!data.totalAmount) return NextResponse.json({error:"Total amount required"},{status:403});
  const orderId = await generateOrderId(data.totalAmount);
  const booking=new Booking({
    user: userId,
    orderId: orderId,
    totalAmount:parseInt(data.totalAmount)
  });
  await booking.save();
  for (let i = 0; i < data.length; i++) {
    const service = data[i];
    service.booking=booking._id;
    const serviceOrder=new ServiceOrder(service);
    await serviceOrder.save();
  }
  return NextResponse.json({ success: true ,booking});
};

export const GET=async (req)=>{
  const userId=req.headers.get("userId");
  const user=await User.findById(userId);
  if(!user){
    return NextResponse.json({error:"User unauthorized"},{status:403});
  }
  const bookings=await Booking.find({user:userId});
  const service=await ServiceOrder.find({})
  return NextResponse.json({bookings});
}