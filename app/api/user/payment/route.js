import Booking from "@/models/Booking";
import { NextResponse } from "next/server";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";
import Razorpay from "razorpay";
import connectDB from "@/db/connect";
import PartnerService from "@/models/PartnerService";
import User from "@/models/User";
import ServiceOrder from "@/models/ServiceOrder";

export const POST = async (req) => {
  await connectDB();
  let body = await req.formData();
  body = Object.fromEntries(body);
  const orderId = body.razorpay_order_id;
  if (!orderId) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
  const booking = await Booking.findOne({ orderId });
  if (!booking) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
  let xx = validatePaymentVerification(
    {
      order_id: body.razorpay_order_id,
      payment_id: body.razorpay_payment_id,
    },
    body.razorpay_signature,
    process.env.RAZORPAY_SECRET
  );

  if(xx){
    booking.isPaid = true;
    await booking.save();
    const serviceOrders=await ServiceOrder.find({booking:booking._id});

    for(let i=0;i<serviceOrders.length;i++){
        let service = serviceOrders[i];
        const serviceId=service.service;
        const pincode=service.pincode;
        const partner=await PartnerService.find({service:serviceId,pincode}).populate("partner");
        /** Send email to partner email */
    }
    return NextResponse.json({ success: "Payment successful :)" });
  }
  else{
    return NextResponse.json({ error: "Payment failed :(" }, { status: 400 });
  }
};


