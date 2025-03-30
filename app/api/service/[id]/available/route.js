import { NextResponse } from "next/server";
import connectDB from "@/db/connect";
import PartnerService from "@/models/PartnerService";
import Partner from "@/models/Partner";

export const GET = async (req, { params }) => {
  const { id } = await params;
  await connectDB();

  const pincode = req.nextUrl.searchParams.get("pincode");
  if (!pincode) {
    return NextResponse.json({ error: "Pincode required" }, { status: 400 });
  }

  const partnerServices = await PartnerService.find({ service: id })
    .populate("partner", "pincode")
    .select("partner");

    const isServiceAvailable = partnerServices.some(
      (service) => service.partner?.pincode?.includes(pincode)
    );
  

  return NextResponse.json({ available: isServiceAvailable }, { status: 200 });
};
