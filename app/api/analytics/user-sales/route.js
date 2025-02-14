import connectDB from "@/db/connect";
import Booking from "@/models/Booking";
import { NextResponse } from "next/server";
import Admin from "@/models/Admin";

export const POST = async (req) => {
  const userId = req.headers.get("userId");
  if (!userId)
    return NextResponse.json({ error: "User unauthorized!" }, { status: 403 });
  const admin = await Admin.findById(userId);
  if (!admin)
    return NextResponse.json({ error: "User unauthorized" }, { status: 403 });

  await connectDB();

  try {
    const userSales = await Booking.aggregate([
      { $match: { isPaid: true } },
      {
        $group: {
          _id: "$user",
          totalSpent: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
        },
      },
      { $sort: { totalSpent: -1 } },
    ]);
    return NextResponse.json({ success: true, userSales });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
