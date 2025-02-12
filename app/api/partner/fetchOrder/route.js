import PartnerService from "@/models/PartnerService";
import ServiceOrder from "@/models/ServiceOrder";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  const userId = req.headers.get("userId");
  if (!userId)
    return NextResponse.json({ error: "User unauthorized" }, { status: 401 });

  const partnerServices = await PartnerService.find({ partner: userId }).select(
    "service pincode"
  );

  if (partnerServices.length === 0) {
    return NextResponse.json(
      { error: "No services found for the partner" },
      { status: 404 }
    );
  }

  //  2: Extract the  details (service and pincode)
  const partnerServiceIds = partnerServices.map((item) => item.service);
  const partnerPincodeMap = partnerServices.reduce((acc, item) => {
    if (!acc[item.service]) {
      acc[item.service] = new Set();
    }
    item.pincode.forEach((pincode) => acc[item.service].add(pincode));
    return acc;
  }, {});

  const serviceOrders = await ServiceOrder.find({
    partner: null, 
    service: { $in: partnerServiceIds }, 
    pincode: {
      $in: partnerServices
        .filter((service) => partnerPincodeMap[service.service])
        .map((service) => partnerPincodeMap[service.service])
        .flat(),
    },
  });

  return NextResponse.json({ serviceOrders });
};
