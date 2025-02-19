import ServiceOrder from "@/models/ServiceOrder";
import connectDB from "@/db/connect";
import Partner from "@/models/Partner";
import { NextResponse } from "next/server";
export const POST = async (req) => {
	await connectDB();
	const userId = req.headers.get("userId");

	if (!userId)
		return NextResponse.json(
			{ error: "User unathorized" },
			{ status: 403 }
		);
	const partner = await Partner.findById(userId);
	if (!partner)
		return NextResponse.json(
			{ error: "User unauthorized!" },
			{ status: 403 }
		);

	const { userCode, serviceorder_id } = await req.json();
	if (!userCode || !serviceorder_id)
		return NextResponse.json({ error: "Usercode is empty!" });

	const serviceOrder = await ServiceOrder.findById(serviceorder_id);

	if (!serviceOrder)
		return NextResponse.json(
			{ error: "ServiceOrder not found!" },
			{ status: 404 }
		);
	
	if(!serviceOrder.isPaid) return NextResponse.json({error:"Please ask user to paid service order!"},{status:403});
	if (
		serviceOrder.partner?.equals(partner._id) &&
		serviceOrder.userCode === userCode
	) {
		serviceOrder.userApproved = true;
		await serviceOrder.save();
		return NextResponse.json({
			success: true,
			message: "User code matched successfully!",
		});
	} else
		return NextResponse.json(
			{ error: "Partner Mismatch or Usercode mismatch" },
			{ status: 403 }
		);
};
