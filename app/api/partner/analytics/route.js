import { connectDB } from "@/utils/db";
import ServiceOrder from "@/models/ServiceOrder";
import Payment from "@/models/Payment";
import { NextResponse } from "next/server";



export async function POST(req, { params }) {
    await connectDB();
	try {
		

		if (!partnerId) {
			return NextResponse.json({ error: "Partner ID is required" }, { status: 400 });
		}

		// Fetch completed orders for the partner
		const completedOrders = await ServiceOrder.find({
			partner: partnerId,
			userApproved: true,
			cancel: false,
		});

		// Calculate total revenue from completed orders
		const totalRevenue = await Payment.aggregate([
			{
				$match: {
					serviceOrder: { $in: completedOrders.map((order) => order._id) },
				},
			},
			{
				$group: {
					_id: null,
					totalRevenue: { $sum: "$totalAmount" },
				},
			},
		]);

		// Fetch pending orders for the partner
		const pendingOrdersCount = await ServiceOrder.countDocuments({
			partner: partnerId,
			userApproved: false,
			cancel: false,
		});

		// Calculate average rating for the partner
		const ratingStats = await ServiceOrder.aggregate([
			{
				$match: {
					partner: partnerId,
					userApproved: true,
				},
			},
			{
				$group: {
					_id: null,
					averageRating: { $avg: "$rating" },
				},
			},
		]);

		const averageRating = ratingStats.length > 0 ? ratingStats[0].averageRating.toFixed(2) : "N/A";

		return NextResponse.json({
			success: true,
			data: {
				totalOrdersCompleted: completedOrders.length,
				totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].totalRevenue : 0,
				pendingOrders: pendingOrdersCount,
				averageRating,
			},
		});
	} catch (error) {
		console.error("Error fetching partner analytics:", error);
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}
