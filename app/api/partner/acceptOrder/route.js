import ServiceOrder from "@/models/ServiceOrder";
import Partner from "@/models/Partner";
import connectDB from "@/db/connect";
import { NextResponse } from "next/server";
import Payment from "@/models/Payment";
import sendEmailToUser from "@/actions/user/sendEmailToUser";
import User from "@/models/User";

export const POST = async (req) => {
	await connectDB();
	const userId = req.headers.get("userId");

	if (!userId) return NextResponse.json({ error: "User unathorized" }, { status: 403 });
	const partner = await Partner.findById(userId);
	if (!partner) return NextResponse.json({ error: "User unauthorized!" }, { status: 403 });
	const data = await req.json();
	if (!data.serviceorder_id) return NextResponse.json({ error: "Incomplete Fields" }, { status: 403 });

	const serviceOrder = await ServiceOrder.findById(data.serviceorder_id).populate("service", "name").populate("user", "email name");
	if (!serviceOrder) return NextResponse.json({ error: "Service Not Found" }, { status: 404 });
	if (serviceOrder.partner) {
		return NextResponse.json({ error: "Order has been placed already to another partner!" }, { status: 403 });
	}


	serviceOrder.partner = partner._id;
	await serviceOrder.save();
	await sendEmailToUser(serviceOrder.user.email, serviceOrder.user.name, serviceOrder, partner);

	return NextResponse.json({ success: true, message: "Order has been handled to you successfully!" });
}