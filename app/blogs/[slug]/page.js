"use client";
import Navbar from "@/components/navbar/Navbar";
import React, { useState, useEffect } from "react";
import BlogPost from "@/components/blog/BlogPost";
import axios from "axios";
import ReadNext from "@/components/blog/ReadNext";
import CTA from "@/components/blog/CTA";
import Footer from "@/components/home/Footer";
import { Loader2 } from "lucide-react";

const BlogPage = (req) => {
	const [blog, setBlog] = useState(null);
	const [loading, setLoading] = useState(true);

	const fetchBlog = async (slug) => {
		const res = await axios.get(
			`${process.env.NEXT_PUBLIC_URL}/api/blog/${slug}`
		);
		return res.data.blog;
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const { slug } = await req.params;
				const data = await fetchBlog(slug);
				// console.log(data);
				setBlog(data);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching blog:", error);
			}
		};

		fetchData();
	}, []);

	return (
		<>
			<Navbar />
			{loading && (
				<div className="flex min-h-[90vh] mt-16 items-center justify-center bg-white">
					<div className="flex flex-col items-center space-y-4">
						{/* Shadcn Spinner */}
						<Loader2 className="h-12 w-12 animate-spin text-gray-800" />
						{/* Loading Text */}
						<p className="text-lg font-semibold text-gray-800">
							Loading...
						</p>
					</div>
				</div>
			)}
			{!loading && (
				<div className="min-h-screen mt-16 bg-white">
					<BlogPost blog={blog} />
					<ReadNext />
					<CTA />
				</div>
			)}
			<Footer />
		</>
	);
};

export default BlogPage;
