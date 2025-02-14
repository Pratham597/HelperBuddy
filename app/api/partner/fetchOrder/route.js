import connectDB from "@/db/connect";
import Partner from "@/models/Partner";
import PartnerService from "@/models/PartnerService";
import ServiceOrder from "@/models/ServiceOrder";
import Booking from "@/models/Booking";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  await connectDB();
  const userId = req.headers.get("userId");
  if (!userId)
    return NextResponse.json({ error: "User unauthorized" }, { status: 401 });

  const partnerServices = await PartnerService.find({ partner: userId }).select("service");
  const partner = await Partner.findById(userId).select("isApproved pincode");
  
  if (!partner?.isApproved) 
    return NextResponse.json({ error: "Partner Unauthorized" });

  if (partnerServices.length === 0) {
    return NextResponse.json(
      { message: "No services found for the partner" },
      { status: 200 }
    );
  }

  const partnerServiceIds = partnerServices.map((item) => item.service);
  let serviceOrders = await ServiceOrder.find({
    partner: null,
    service: { $in: partnerServiceIds },
    pincode: { $in: partner.pincode },
  })
    .populate("service")
    .populate("booking");
  serviceOrders = serviceOrders.filter(order => order.booking && order.booking.isPaid);

  return NextResponse.json({ serviceOrders });
};