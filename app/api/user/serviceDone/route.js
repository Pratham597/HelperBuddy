import User from "@/models/User";
import { NextResponse } from "next/server";
import Booking from "@/models/Booking";
import ServiceOrder from "@/models/ServiceOrder";
import Service from "@/models/Service";

export const POST = async (req) => {
  const userId = req.headers.get("userId");

  if (!userId)
    return NextResponse.json({ error: "User Not Found" }, { status: 400 });
  const user = await User.findById(userId);

  const booking = await Booking.find({
    user: user._id,
    isPaid: true,
    paymentId: { $ne: null },
  });
  const serviceOrder = await ServiceOrder.find({
    booking: { $in: booking },
    partner: { $ne: null },
    userApproved:true
  }).populate("service");
  console.log(serviceOrder);
  return NextResponse.json({ booking, serviceOrder });
};
