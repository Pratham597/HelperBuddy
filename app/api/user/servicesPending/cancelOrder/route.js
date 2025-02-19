import Service from "@/models/Service";
import ServiceOrder from "@/models/ServiceOrder";
import { NextResponse } from "next/server";


export const POST = async (req) => {
  try {
    const userId = req.headers.get("userId");

    if (!userId)
      return NextResponse.json({ error: "User unauthorized" }, { status: 403 });

    const { serviceOrderId } = await req.json();

    if (!serviceOrderId)
      return NextResponse.json(
        { error: "Required Fields are empty!" },
        { status: 400 }
      );

    const serviceOrder = await ServiceOrder.findById(serviceOrderId).populate("service");

    if (!serviceOrder)
      return NextResponse.json({ error: "Service Order not found!" }, { status: 404 });

    if (!serviceOrder.user.equals(userId)) {
      throw new UnauthorizedException("You are not allowed to access this order");
    }
    if (serviceOrder.partner)
      return NextResponse.json({ error: "Partner is already assigned!" }, { status: 403 });

    const timeDifference = (Date.now() - serviceOrder.createdAt) / (1000 * 60 * 60);

    if (timeDifference < serviceOrder.service.threshold) {
      const remainingTime = serviceOrder.service.threshold - timeDifference;
      return NextResponse.json(
        { error: `Wait for ${remainingTime.toFixed(2)} hours before canceling.` },
        { status: 403 }
      );
    }

    serviceOrder.cancel = true;
    await serviceOrder.save();

    return NextResponse.json(
      { success: true, message: "Service Order cancelled successfully!" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};

