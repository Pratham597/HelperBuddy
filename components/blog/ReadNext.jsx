"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";
import { useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function ReadNext() {
	const [relatedPosts, setRelatedPosts] = useState([]);
	const router = useRouter();
	// Fetch blogs from the API
	const fetchBlogs = async () => {
		try {
			const res = await axios.get("/api/blog");
			console.log(res.data.blogs);
			setRelatedPosts(res.data.blogs);
		} catch (error) {
			console.error(error);
		}
	};

	// Fetch blogs on component mount
	useEffect(() => {
		fetchBlogs();
	}, []);
	const scrollRef = useRef(null);

	const scroll = (direction) => {
		if (scrollRef.current) {
			const { current } = scrollRef;
			const scrollAmount =
				direction === "left"
					? -current.offsetWidth
					: current.offsetWidth;
			current.scrollBy({ left: scrollAmount, behavior: "smooth" });
		}
	};

	return (
		<section className="py-16 bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<h2 className="text-3xl font-serif font-bold text-center mb-12">
					Read Next
				</h2>
				<div className="relative">
					<button
						onClick={() => scroll("left")}
						className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10"
					>
						←
					</button>
					<button
						onClick={() => scroll("right")}
						className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10"
					>
						→
					</button>
					<motion.div
						ref={scrollRef}
						className="flex overflow-x-auto scrollbar-hide space-x-6 pb-4"
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8 }}
					>
						{relatedPosts.slice(0, 5).map((post) => (
							<motion.div
								key={post._id}
								className="flex-shrink-0 w-72 bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
								whileHover={{ scale: 1.05 }}
								transition={{ duration: 0.3 }}
								onClick={() => router.push(`/blogs/${post.slug}`)}
							>
								<Image
									src={post.image || "/placeholder.svg"}
									alt={post.title}
									width={288}
									height={162}
									objectFit="cover"
								/>
								<div className="p-4">
									<h3 className="font-serif font-semibold text-lg">
										{post.title}
									</h3>
								</div>
							</motion.div>
						))}
					</motion.div>
				</div>
			</div>
		</section>
	);
}
