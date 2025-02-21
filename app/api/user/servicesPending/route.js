import User from "@/models/User";
import { NextResponse } from "next/server";
import Booking from "@/models/Payment";
import ServiceOrder from "@/models/ServiceOrder";
import Service from "@/models/Service";

export const POST = async (req) => {
  const userId = req.headers.get("userId");

  if (!userId) return NextResponse.json({ error: "User Not Found" }, { status: 400 })
  const user = await User.findById(userId)

  if (!user) return NextResponse.json({ error: "User unauthorized" }, { status: 403 });
  const serviceOrder = await ServiceOrder.find({
    partner: null,
    user: userId,
    isPaid: false,
    cancel: false,
  }).populate("service")
  return NextResponse.json({ serviceOrder });
}
