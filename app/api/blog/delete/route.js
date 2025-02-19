import { NextResponse } from "next/server";
import connectDB from "@/db/connect";
import Blog from "@/models/Blog";
import Admin from "@/models/Admin";

export const DELETE = async (req) => {
	await connectDB();

	const userId = req.headers.get("userId");
	if (!userId)
		return NextResponse.json(
			{ error: "User Not Authorized" },
			{ status: 400 }
		);

	const admin = await Admin.findById(userId);
	if (!admin)
		return NextResponse.json(
			{ error: "Unauthorized entity!" },
			{ status: 403 }
		);

	const { blogId } = await req.json();
	if (!blogId)
		return NextResponse.json(
			{ error: "No blog selected!" },
			{ status: 400 }
		);

	const deletedBlog = await Blog.findByIdAndDelete(blogId);
	if (!deletedBlog)
		return NextResponse.json({ error: "Blog not found!" }, { status: 404 });

	return NextResponse.json({
		success: true,
		message: "Blog deleted successfully.",
	});
};
