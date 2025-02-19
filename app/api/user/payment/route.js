import Payment from "@/models/Payment";
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

  const payment = await Payment.findOne({ orderId });
  if (!payment) {
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
    await ServiceOrder.findByIdAndUpdate(payment.serviceOrder, { isPaid: true, payment: payment._id }, { new: true });
    payment.paymentId = body.razorpay_payment_id;

    user.wallet = user.wallet - payment.walletUsed;
    await user.save();
    await payment.save();

    if (user && user.referredBy && !user.referredBonus) {
      const referrer = await User.findById(user.referredBy);
      if (referrer) {
        const referralBonus = Number(process.env.REFFER_POINTS);
        const maxWalletLimit = 1000;
        const updatedWallet = Math.min(
          referrer.wallet + referralBonus,
          maxWalletLimit
        );
        if (updatedWallet > referrer.wallet) {
          await User.findByIdAndUpdate(
            user.referredBy,
            { $set: { wallet: updatedWallet } },
            { new: true }
          );
        }
        await User.findByIdAndUpdate(user._id, { referredBonus: true });
      }
    }
    return NextResponse.json({
      success: true,
      message: "Payment successful :)",
      payment,
    });
  } else {
    return NextResponse.json(
      { success: false, message: "Payment failed :(" },
      { status: 400 }
    );
  }
};
