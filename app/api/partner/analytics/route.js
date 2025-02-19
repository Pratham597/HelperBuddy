import connectDB from "@/db/connect";
import serviceOrder from "@/models/ServiceOrder";
import payment from "@/models/Payment";
import Partner from "@/models/Partner";
import { NextResponse } from "next/server";
import { status } from "nprogress";

export const POST = async (req) => {
  try {
    await connectDB();
    const userId = req.headers.get("userId");
    if (!userId)
      return NextResponse.json({ error: "User unauthorized" }, { status: 401 });

    const partner = await Partner.findById(userId);
    if (!partner) return NextResponse.json({ error: "Partner not found!" }, { status: 403 })

    // Fetch completed and pending orders
    const completedOrders = await serviceOrder.find({
      partner: partner._id,
      userApproved: true,
      cancel: false
    }).select("rating");

    const pendingOrders = await serviceOrder.countDocuments({
      partner: partner._id,
      userApproved: false,
      cancel: false
    });

    // Calculate total revenue
    const payments = await payment.aggregate([
      {
        $lookup: {
          from: "serviceorders",
          localField: "serviceOrder",
          foreignField: "_id",
          as: "order"
        }
      },
      {
        $match: { "order.partner": partner._id }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    const totalRevenue = payments.length > 0 ? payments[0].totalRevenue : 0;

    // Calculate average rating
    const totalRatings = completedOrders.length;
    const avgRating = totalRatings > 0
      ? completedOrders.reduce((acc, order) => acc + order.rating, 0) / totalRatings
      : 0;

    return NextResponse.json({
      completedOrders: totalRatings,
      totalRevenue,
      pendingOrders,
      avgRating: avgRating.toFixed(1),
    });

  } catch (error) {
    console.error("Error fetching partner analytics:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
