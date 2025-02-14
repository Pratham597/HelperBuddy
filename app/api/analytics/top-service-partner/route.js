import connectDB from "@/db/connect";
import ServiceOrder from "@/models/ServiceOrder";
import { NextResponse } from "next/server";
import Admin from "@/models/Admin";

export const POST = async (req) => {
  const userId = req.headers.get("userId");
  if (!userId)
    return NextResponse.json({ error: "User unauthorized" }, { status: 403 });

  const admin = await Admin.findById(userId);
  if (!admin)
    return NextResponse.json(
      { error: "Only admins are allowed :) " },
      { status: 403 }
    );

  await connectDB();

  try {
    const totalPartners = await ServiceOrder.countDocuments({ partner: { $ne: null }, userApproved: true });
    const topServicePartners = await ServiceOrder.aggregate([
      { $match: { partner: { $ne: null }, userApproved: true } },
      { $group: { _id: "$partner", completedOrders: { $sum: 1 } } },
      { $sort: { completedOrders: -1 } },
      { $limit: 10 },
    ]);

    return NextResponse.json({
      totalPartners,
      topPartners: topServicePartners
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
};