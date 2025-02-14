import Partner from "@/models/Partner";
import Partner from "@/models/Partner";
import ServiceOrder from "@/models/ServiceOrder";
import { NextResponse } from "next/server";
import connectDB from "@/db/connect";

export const POST = async (req) => {
  await connectDB();
  const userId = req.headers.get("userId");
  if (!userId)
    return NextResponse.json({ error: "User unauthorized" }, { status: 401 });

  const partner=await Partner.findById(userId);
  if(!partner) return NextResponse.json({error:"Partner not found!"},{status:403})
  const serviceOrders=await ServiceOrder.find({partner:userId}).select("-userCode");
return NextResponse.json({serviceOrders})
};
