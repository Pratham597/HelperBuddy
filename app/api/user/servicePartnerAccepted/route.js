import User from "@/models/User";
import { NextResponse } from "next/server";
import Booking from "@/models/Payment";
import ServiceOrder from "@/models/ServiceOrder";
import Service from "@/models/Service";

export const POST = async (req) => {
  const userId = req.headers.get("userId");

  if (!userId)
    return NextResponse.json({ error: "User Not Found" }, { status: 400 });
  const user = await User.findById(userId);

  const serviceOrder = await ServiceOrder.find({
    partner: {$ne:null},
    userApproved:false
  }).populate("service");
  return NextResponse.json({serviceOrder });
};
