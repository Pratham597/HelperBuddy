import Blog from "@/models/Blog";   
import { NextResponse } from "next/server";
import connectDB from "@/db/connect";
import Admin from "@/models/Admin";

export const GET = async (req, context) => {
	await connectDB();

	const { params } = context; // ✅ Extract params correctly
	const { slug } = params;


	if (!slug) {
		return NextResponse.json({ error: "Slug Not Found!" }, { status: 404 });
	}

	try {
		const blog = await Blog.findOne({ slug }).populate("author", "name");

		if (!blog) {
			return NextResponse.json(
				{ error: "Blog Not Found!" },
				{ status: 404 }
			);
		}

		return NextResponse.json({ success: true, blog });
	} catch (error) {
		console.error("Error fetching blog:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
};
