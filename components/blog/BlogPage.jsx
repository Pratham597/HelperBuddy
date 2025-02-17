"use client";
import Navbar from "@/components/navbar/Navbar";
import BlogPost from "@/components/blog/BlogPost";
import ReadNext from "@/components/blog/ReadNext";
import CTA from "@/components/blog/CTA";
import Footer from "@/components/home/Footer";
import { Loader2 } from "lucide-react";

const BlogPage = ({ blog }) => {
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
