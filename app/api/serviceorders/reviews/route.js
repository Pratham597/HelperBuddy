import { NextResponse } from "next/server";
import connectDB from "@/db/connect";
import ServiceOrder from "@/models/ServiceOrder";

export async function GET() {
	try {
		await connectDB();

		// Fetch reviews with rating 4 or 5
		const reviews = await ServiceOrder.find({
			rating: { $gte: 4 },
			remarks: { $ne: null },
		})
			.populate("user", "name") // Fetch user details
			.sort({ createdAt: -1 }) // Latest reviews first
			.limit(10); // Optional: Fetch only 10 reviews

		// Format response
		const formattedReviews = reviews.map((review) => ({
			name: review.user?.name || "Anonymous",
			rating: review.rating,
			text: review.remarks || "No review text provided.",
		}));

		return NextResponse.json(formattedReviews);
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to fetch reviews" },
			{ status: 500 }
		);
	}
}
