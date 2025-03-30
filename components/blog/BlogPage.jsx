"use client";
import Navbar from "@/components/navbar/Navbar";
import BlogPost from "@/components/blog/BlogPost";
import ReadNext from "@/components/blog/ReadNext";
import CTA from "@/components/blog/CTA";
import Footer from "@/components/home/Footer";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { useEffect, useState } from "react";

const BlogPage = (slug) => {
	// console.log(slug);
	const slug1 = slug.slug;
	const [blog, setBlog] = useState(null);

	useEffect(() => {
		const fetchBlog = async () => {
			try {
				const res = await axios.get(
					`${process.env.NEXT_PUBLIC_URL}/api/blog/${slug1}`
				);
				setBlog(res.data.blog);
			} catch (error) {
				console.error("Error fetching blog:", error);
			}
		};

		fetchBlog();
	}, [slug1]);
	return (
		<>
			<Navbar />
			{!blog ? (
				<div className="flex min-h-[90vh] mt-16 items-center justify-center bg-white">
					<div className="flex flex-col items-center space-y-4">
						<Loader2 className="h-12 w-12 animate-spin text-gray-800" />
						<p className="text-lg font-semibold text-gray-800">
							Loading...
						</p>
					</div>
				</div>
			) : (
				<div className="min-h-screen mt-24 bg-white">
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
