import User from "@/models/User";
import { NextResponse } from "next/server";
import Booking from "@/models/Booking";
import ServiceOrder from "@/models/ServiceOrder";
import Service from "@/models/Service";

export const POST = async (req) => {
    const userId = req.headers.get("userId");

    if (!userId) return NextResponse.json({ error: "User Not Found" }, { status: 400 })
    const user = await User.findById(userId)

    const booking = await Booking.find({
        user: user._id,
        $or:[{isPaid: true},{paymentMethod:"COD"}],
        $or:[{paymentId: { $ne: null }},{paymentMethod:"COD"}],
      });
    const serviceOrder = await ServiceOrder.find({ booking: { $in: booking }, partner: null }).populate("service").populate("booking")
    return NextResponse.json({ booking, serviceOrder });
}