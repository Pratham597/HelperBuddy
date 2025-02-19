import User from "@/models/User";
import { NextResponse } from "next/server";
import ServiceOrder from "@/models/ServiceOrder";
import Service from "@/models/Service";
import connectDB from "@/db/connect";

export const POST = async (req) => {
  const userId = req.headers.get("userId");
  await connectDB();
  if (!userId)
    return NextResponse.json({ error: "User Not Found" }, { status: 400 });
  const user = await User.findById(userId);

  const serviceOrder = await ServiceOrder.find({
    partner: { $ne: null },
    isPaid:true,
    userApproved:true
  }).populate("service");
  return NextResponse.json({ booking, serviceOrder });
};
