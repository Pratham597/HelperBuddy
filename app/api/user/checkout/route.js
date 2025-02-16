import User from "@/models/User";
import connectDB from "@/db/connect";
import { NextResponse } from "next/server";
import PartnerService from "@/models/PartnerService";
import ServiceOrder from "@/models/ServiceOrder";
import generateOrderId from "@/actions/user/generateOrderId";
import Booking from "@/models/Booking";
import { generateCode } from "@/actions/user/refferalCode";


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

  for (let i = 0; i < data.services.length; i++) {
    const service = data.services[i];
    const serviceId = service.serviceId;
    if (!serviceId || !service.timeline) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
  }

  const createServiceOrders = async (services, booking) => {
    const orders = services.map((service) => {
      return new ServiceOrder({
        service: service.serviceId,
        timeline: service.timeline,
        pincode: data.pincode,
        address: data.address,
        userCode: generateCode(),
        booking: booking._id,
      });
    });
    await ServiceOrder.insertMany(orders);
  };

  if (!data.totalAmount || !data.pincode || !data.address)
    return NextResponse.json(
      { error: "Total amount required" },
      { status: 403 }
    );

  if (!data.paymentMethod || data.walletUsed === undefined) {
    return NextResponse.json(
      { error: "Required Fields are empty!" },
      { status: 403 }
    );
  }
  if (data.paymentMethod === "COD") {
    const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const booking = new Booking({
      user: userId,
      orderId: orderId,
      totalAmount: parseInt(data.totalAmount),
      paymentMethod: "COD",
    });
    await booking.save();
    await createServiceOrders(data.services,booking)
    return NextResponse.json({ success: true, booking });
  }
   else if (data.paymentMethod === "Wallet+Online") {
    const walletUsed = Number(data.walletUsed);
    if (user.wallet < walletUsed)
      return NextResponse.json(
        { success: false, error: "Walled is unsufficient for booking" },
        { status: 403 }
      );
    
    if(walletUsed>=Number(data.totalAmount)){
      return NextResponse.json(
        { success: false, error: "Wallet amount must less than total amount!" },
        { status: 403 }
      );
    }

    const orderId = await generateOrderId(
      Number(data.totalAmount) - walletUsed
    );
    const booking = new Booking({
      user: userId,
      orderId: orderId,
      totalAmount: Number(data.totalAmount),
      walletUsed: walletUsed,
      paymentMethod: "Wallet+Online",
    });
    await booking.save();
    await createServiceOrders(data.services,booking);
    return NextResponse.json({ success: true, booking });
  } else if (data.paymentMethod === "Online") {
    const orderId = await generateOrderId(data.totalAmount);
    const booking = new Booking({
      user: userId,
      orderId: orderId,
      totalAmount: parseInt(data.totalAmount),
      paymentMethod: "Online",
    });
      await booking.save();
      await createServiceOrders(data.services,booking)
      return NextResponse.json({ success: true, booking });
  } else
    return NextResponse.json(
      { error: "Payment Method is altered!" },
      { status: 403 }
    );
};

export const GET = async (req) => {
  const userId = req.headers.get("userId");
  const user = await User.findById(userId);
  if (!user) {
    return NextResponse.json({ error: "User unauthorized" }, { status: 403 });
  }
  const bookings = await Booking.find({ user: userId }).select("_id");
  const service = await ServiceOrder.find({ booking: { $in: bookings } })
    .populate("partner")
    .populate("service");
  return NextResponse.json({ service });
};
