import mongoose from "mongoose";
import Complaint from "@/models/Complaint";
import connectDB from "@/db/connect";
import { NextResponse } from "next/server";

export const POST = async (req) => {
	try {
		await connectDB();
		const { firstName, lastName, email, message } = await req.json();
		// console.log(req);
		if (!firstName || !email || !message) {
			return NextResponse.json(
				{ error: "All fields are required" },
				{ status: 400 }
			);
		}

		const newComplaint = new Complaint({
			firstName,
			lastName,
			email,
			message,
		});

		await newComplaint.save();

		return NextResponse.json(
			{ message: "Complaint sent successfully" },
			{ status: 200 }
		);
	} catch (error) {
		// console.log(error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
};

export const GET = async (req) => {

	try {
		await connectDB();
		const complaints = await Complaint.find();
		return NextResponse.json({ complaints }, { status: 200 });
	} catch (error) {
		// console.log(error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
};
