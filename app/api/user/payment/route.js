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
  let body = await req.json();
  const orderId = body.razorpay_order_id;
  if (
    !body.razorpay_order_id ||
    !body.razorpay_payment_id ||
    !body.razorpay_signature
  ) {
    return new Response(
      JSON.stringify({ error: "Missing required payment details" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
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
    process.env.RAZORPAY_KEY_SECRET
  );

  if (xx) {
    booking.isPaid = true;
    booking.paymentId = body.razorpay_payment_id;
    await booking.save();
    return NextResponse.json({
      success: true,
      message: "Payment successful :)",
    });
  } else {
    return NextResponse.json({ success: false,message:"Payment failed :(" }, { status: 400 });
  }
};
