import User from "@/models/User";
import connectDB from "@/db/connect";
import { NextResponse } from "next/server";
import PartnerService from "@/models/PartnerService";
import ServiceOrder from "@/models/ServiceOrder";
import Partner from "@/models/Partner";
import Service from "@/models/Service";
import { generateCode } from "@/actions/user/refferalCode";
import sendEmailToPartner from "@/actions/user/sendEmailToPartner";

/** Controller for checking out cart */
export const POST = async (req, res) => {
  await connectDB();
  const userId = req.headers.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await User.findById(userId);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await req.json();
  // Validate services
  if (!Array.isArray(data.services)) {
    return NextResponse.json({ error: "Invalid data format" }, { status: 400 });
  }

  for (const { serviceId, timeline } of data.services) {
    if (!serviceId || !timeline) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
  }

  // Function to create service orders
  const createServiceOrders = async (services) => {
    const orders = services.map((service) => ({
      user:user._id,
      service: service.serviceId,
      timeline: service.timeline,
      pincode: data.pincode,
      address: data.address,
      userCode: generateCode(),
    }));

    const insertedOrders = await ServiceOrder.insertMany(orders);
    return insertedOrders;
  };

  const serviceOrders = await createServiceOrders(data.services);

  for (const service of serviceOrders) {
    const partners = await PartnerService.find({ service: service.service }).select("partner");
    const partnerIds = partners.map((item) => item.partner);
    const services=await Service.findById(service.service);
    const emails = await Partner.find({
      _id: { $in: partnerIds },
      pincode: { $in: [data.pincode] },
    }).select("email");
 
    if (emails.length === 0) {
      return NextResponse.json(
        { error: "No partners are available at that pincode :(" },
        { status: 404 }
      );
    }

    const userDetails = {
      name: user.name,
      phone: user.phone,
      address: data.address,
      pincode: data.pincode,
      timeline: service.timeline, 
    };

    await sendEmailToPartner(emails, userDetails, services);
  }

  return NextResponse.json({
    success: true,
    message: "Order placed successfully!",
  });
};
