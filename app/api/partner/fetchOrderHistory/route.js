import Partner from "@/models/Partner";
import ServiceOrder from "@/models/ServiceOrder";
import { NextResponse } from "next/server";
import connectDB from "@/db/connect";
import Payment from "@/models/Payment";
import Service from "@/models/Service";

export const POST = async (req) => {
  await connectDB();
  const userId = req.headers.get("userId");
  if (!userId)
    return NextResponse.json({ error: "User unauthorized" }, { status: 401 });

  const partner = await Partner.findById(userId);
  if (!partner)
    return NextResponse.json({ error: "Partner not found!" }, { status: 403 });
  const serviceOrders = await ServiceOrder.find({
    partner: userId,
    userApproved: true,
    isPaid: true
  })
    .populate("service")
    .select("-userCode")
    .populate("payment");
  return NextResponse.json({ serviceOrders });
};
