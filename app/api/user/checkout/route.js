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
  // console.log(data) 
  for (let i = 0; i < data.services.length; i++) {
    const service = data.services[i];
    const serviceId = service.serviceId;
    if(!serviceId || !service.timeline){
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
  }
 
  if(!data.totalAmount ||  !data.pincode || !data.address) return NextResponse.json({error:"Total amount required"},{status:403});
  const orderId = await generateOrderId(data.totalAmount);
  const booking=new Booking({
    user: userId,
    orderId: orderId,
    totalAmount:parseInt(data.totalAmount)
  });
  
  await booking.save();
  for (let i = 0; i < data.services.length; i++) {
    const service = data.services[i];
    service.booking=booking._id;
    service.pincode=data.pincode
    service.address=data.address
    service.timeline=data.services[i].timeline
    service.service=service.serviceId;
    const serviceOrder=new ServiceOrder(service);
    await serviceOrder.save();
  }
  return NextResponse.json({ success: true,booking});
};

export const GET=async (req)=>{
  const userId=req.headers.get("userId");
  const user=await User.findById(userId);
  if(!user){
    return NextResponse.json({error:"User unauthorized"},{status:403});
  }
  const bookings=await Booking.find({user:userId}).select("_id");
  const service=await ServiceOrder.find({booking:{$in:bookings}}).populate("partner").populate("service")
  return NextResponse.json({service});
}