import connectDB from "@/db/connect";
import ServiceOrder from "@/models/ServiceOrder";
import { NextResponse } from "next/server";
import Admin from "@/models/Admin";
import Partner from "@/models/Partner"; // Import Partner model to fetch details

export const POST = async (req) => {
  await connectDB(); // Ensure DB connection before making queries

  const userId = req.headers.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "User unauthorized" }, { status: 403 });
  }

  try {
    const admin = await Admin.findById(userId);
    if (!admin) {
      return NextResponse.json(
        { error: "Only admins are allowed :) " },
        { status: 403 }
      );
    }

    const totalPartners = await Partner.countDocuments({});

    const topServicePartners = await ServiceOrder.aggregate([
      { $match: { partner: { $ne: null }, userApproved: true ,isPaid:true} },
      { $group: { _id: "$partner", completedOrders: { $sum: 1 } } },
      { $sort: { completedOrders: -1 } },
    ]);

    const topPartners = await Partner.find({
      _id: { $in: topServicePartners.map((p) => p._id) },
    }).select("name email phone");

    // Combine partner details with order count
    const formattedTopPartners = topPartners.map((partner) => {
      const partnerOrders = topServicePartners.find((p) => String(p._id) === String(partner._id));
      return {
        name: partner.name,
        email: partner.email,
        phone: partner.phone,
        completedOrders: partnerOrders ? partnerOrders.completedOrders : 0,
      };
    });

    return NextResponse.json({
      success: true,
      totalPartners,
      topPartners: formattedTopPartners,
    });
  } catch (error) {
    console.error("Error fetching service partner statistics:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
};
