import connectDB from "@/db/connect";
import Booking from "@/models/Payment";
import { NextResponse } from "next/server";
import Admin from "@/models/Admin";

export const POST = async (req) => {
  const userId = req.headers.get("userId");
  if (!userId)
    return NextResponse.json({ error: "User unauthorized!" }, { status: 403 });

  const admin = await Admin.findById(userId);
  if (!admin)
    return NextResponse.json({ error: "Only admins are allowed!" }, { status: 403 });

  await connectDB();

  try {
    const { year } = await req.json(); 
    if (!year) {
      return NextResponse.json({ error: "Year is required!" }, { status: 400 });
    }

    const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
    const endDate = new Date(`${year}-12-31T23:59:59.999Z`);

    // Aggregate sales per month
    const monthlySalesData = await Booking.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" }, 
          totalSales: { $sum: "$totalAmount" }, 
          totalBookings: { $sum: 1 }, 
        },
      },
      { $sort: { _id: 1 } }, 
    ]);

    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const fullMonthlySales = months.map((month, index) => {
      const foundMonth = monthlySalesData.find((data) => data._id === index + 1);
      return {
        month,
        totalSales: foundMonth ? foundMonth.totalSales : 0,
        totalBookings: foundMonth ? foundMonth.totalBookings : 0
      };
    });
    
    return NextResponse.json({ success: true, year, monthlySales: fullMonthlySales });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
