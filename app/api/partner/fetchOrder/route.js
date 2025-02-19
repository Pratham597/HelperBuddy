import connectDB from "@/db/connect";
import Partner from "@/models/Partner";
import PartnerService from "@/models/PartnerService";
import ServiceOrder from "@/models/ServiceOrder";
import Payment from "@/models/Payment";
import { NextResponse } from "next/server";
import Service from "@/models/Service";

export const POST = async (req) => {
  await connectDB();
  const userId = req.headers.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "User unauthorized" }, { status: 401 });
  }

  const partner = await Partner.findById(userId).select("isApproved pincode");
  if (!partner || partner.isApproved !== "1") {
    return NextResponse.json({ error: "Partner Unauthorized" }, { status: 403 });
  }

  const partnerServices = await PartnerService.find({ partner: userId }).select("service");
  if (partnerServices.length === 0) {
    return NextResponse.json({ message: "No services found for the partner" }, { status: 200 });
  }

  const partnerServiceIds = partnerServices.map((item) => item.service);

  const serviceOrders = await ServiceOrder.aggregate([
    {
      $match: {
        partner: null,
        service: { $in: partnerServiceIds },
        pincode: { $in: partner.pincode }
      }
    },
    {
      $lookup: {
        from: "services",
        localField: "service",
        foreignField: "_id",
        as: "service"
      }
    },
    { $unwind: "$service" }
  ]);

  return NextResponse.json({ success: true, serviceOrders });
};
