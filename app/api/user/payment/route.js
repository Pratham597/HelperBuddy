import Booking from "@/models/Booking";
import { NextResponse } from "next/server";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";
import Razorpay from "razorpay";
import connectDB from "@/db/connect";
import PartnerService from "@/models/PartnerService";
import User from "@/models/User";
import ServiceOrder from "@/models/ServiceOrder";
import Partner from "@/models/Partner";
import Service from "@/models/Service";
import sendEmailToPartner from "@/actions/user/sendEmailToPartner";

export const POST = async (req) => {
  await connectDB();
  const userId = req.headers.get("userId");
  if (!userId)
    return NextResponse.json({ error: "User unauthorized" }, { status: 403 });

  const user = await User.findById(userId);
  let body = await req.json();
  const orderId = body.razorpay_order_id;
  if (
    !body.razorpay_order_id ||
    !body.razorpay_payment_id ||
    !body.razorpay_signature
  ) {
    return NextResponse.json(
      { error: "Required Fields are empty!" },
      { status: 403 }
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

    user.wallet = user.wallet - booking.walletUsed;
    await user.save();
    await booking.save();

    return NextResponse.json({
      success: true,
      message: "Payment successful :)",
      booking,
    });
  } else {
    return NextResponse.json(
      { success: false, message: "Payment failed :(" },
      { status: 400 }
    );
  }
};
