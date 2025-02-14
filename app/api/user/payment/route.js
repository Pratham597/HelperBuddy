import Booking from "@/models/Booking";
import { NextResponse } from "next/server";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";
import Razorpay from "razorpay";
import connectDB from "@/db/connect";
import PartnerService from "@/models/PartnerService";
import User from "@/models/User";
import ServiceOrder from "@/models/ServiceOrder";
import Partner from "@/models/Partner";
import sendEmailToPartner from "@/actions/user/sendEmailToPartner";

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

    const userInfo = await Booking.findById(booking._id)
      .populate("user", "-password")
      .select("user");

    const userDetails = await ServiceOrder.findOne({
      booking: booking._id,
    }).select("pincode address timeline");

    const serviceOrders = await ServiceOrder.find({ booking: booking._id })
      .populate("service", "name price")
      .select("service");

    for (let i = 0; i < serviceOrders.length; i++) {
      const service = serviceOrders[i];
      const partners = await PartnerService.find({
        service: service.service._id,
      }).select("partner");

      const partnerIds = partners.map((item) => item.partner);
      const emails = await Partner.find({
        _id: { $in: partnerIds },
        pincode: { $in: [userDetails.pincode] },
      })
        .select("email")

      if (emails.length == 0)
        return NextResponse.json(
          { error: "No patners are available at that pincode :(" },
          { status: 404 }
        );
      userDetails.name = userInfo.user.name;
      userDetails.phone = userInfo.user.phone;
      await sendEmailToPartner(emails, userDetails, service.service);
      if (userInfo.referredBy && !userInfo.referredBonus) {
        const referrer = await User.findByIdAndUpdate(
          userInfo.referredBy, 
          { $inc: { wallet: Number(process.env.REFER_POINTS) } }, 
          { new: true }
        );
      
        if (referrer) {
          await User.findByIdAndUpdate(userInfo._id, { referredBonus: true });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Payment successful :)",
    });
  } else {
    return NextResponse.json(
      { success: false, message: "Payment failed :(" },
      { status: 400 }
    );
  }
};
