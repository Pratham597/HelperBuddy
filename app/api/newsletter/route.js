import connectDB from "@/db/connect";
import Newsletter from "@/models/Newsletter";
import { NextResponse } from "next/server";

// POST: Add a new email to the newsletter
export const POST = async (req) => {
	try {
		await connectDB();
        const body = await req.json();
        const { email } = body;

        console.log( "body: ", body);

		if (!email) {
			return NextResponse.json(
				{ error: "Email is required" },
				{ status: 400 }
			);
		}

		// Check if email already exists
		const existingEmail = await Newsletter.findOne({ email });
		if (existingEmail) {
			return NextResponse.json(
				{ error: "Email already subscribed" },
				{ status: 400 }
			);
		}

		// Save new email
		const newSubscriber = new Newsletter({ email });
		await newSubscriber.save();

		return NextResponse.json(
			{ message: "Successfully subscribed!" },
			{ status: 201 }
		);
	} catch (error) {
		console.error("Newsletter POST error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
};

// GET: Retrieve all subscribed emails (for admin)
export const GET = async () => {
	try {
		await connectDB();
		const emails = await Newsletter.find({}, "email subscribedAt");
		return NextResponse.json({ emails }, { status: 200 });
	} catch (error) {
		console.error("Newsletter GET error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
};
