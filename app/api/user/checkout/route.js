import User from "@/models/User";
import connectDB from "@/db/connect";
import { NextResponse } from "next/server";
import PartnerService from "@/models/PartnerService";
import ServiceOrder from "@/models/ServiceOrder";
import generateOrderId from "@/actions/user/generateOrderId";
import Payment from "@/models/Payment";
import { generateCode } from "@/actions/user/refferalCode";


/** Controller for checking out order */
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
  // Contain serviceOrder Id paymentMethod walletUsed 

  if (!data.serviceOrderId || !data.paymentMethod || data.walletUsed === undefined || data.totalAmount === undefined) {
    return NextResponse.json(
      { error: "Required Fields are empty!" },
      { status: 403 }
    );
  }
  const serviceOrder = await ServiceOrder.findById(data.serviceOrderId);
  if (!serviceOrder) return NextResponse.json({ error: "Service Order not found!" }, { status: 404 });

  // Setting up total Amount!
  if (data.paymentMethod === "COD") {
    const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const payment = new Payment({
      orderId: orderId,
      totalAmount: parseInt(data.totalAmount),
      paymentMethod: "COD",
      serviceOrder: serviceOrder._id
    });
    serviceOrder.isPaid=true;
    serviceOrder.payment=payment._id;
    await serviceOrder.save();
    await payment.save();
    return NextResponse.json({ success: true, payment });
  }
  else if (data.paymentMethod === "Wallet+Online") {
    const walletUsed = Number(data.walletUsed);
    if (user.wallet < walletUsed)
      return NextResponse.json(
        { success: false, error: "Wallet balance is insufficient for Payment" },
        { status: 403 }
      );

    if (walletUsed >= Number(data.totalAmount)) {
      return NextResponse.json(
        { success: false, error: "Wallet amount must less than total amount!" },
        { status: 403 }
      );
    }

    const orderId = await generateOrderId(
      Number(data.totalAmount) - walletUsed
    );
    const payment = new Payment({
      orderId: orderId,
      totalAmount: Number(data.totalAmount),
      walletUsed: walletUsed,
      paymentMethod: "Wallet+Online",
      serviceOrder: serviceOrder._id
    });
    await payment.save();
    return NextResponse.json({ success: true, payment });
  } else if (data.paymentMethod === "Online") {
    const orderId = await generateOrderId(data.totalAmount);
    const payment = new Payment({
      orderId: orderId,
      totalAmount: Number(data.totalAmount),
      paymentMethod: "Online",
      serviceOrder: serviceOrder._id
    });
    await payment.save();
    return NextResponse.json({ success: true, payment });
  } else
    return NextResponse.json(
      { error: "Unable to process payment!" },
      { status: 403 }
    );
};

export const GET = async (req) => {
  const userId = req.headers.get("userId");
  const user = await User.findById(userId);
  if (!user) {
    return NextResponse.json({ error: "User unauthorized" }, { status: 403 });
  }
  const service = await ServiceOrder.find({ user: userId, cancel: false, partner: null }).populate("service");
  return NextResponse.json({ service });
};
