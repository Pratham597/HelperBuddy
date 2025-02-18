"use client";

import { motion } from "framer-motion";
import Image from "next/legacy/image";
import { useRef, useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

export default function ReadNext() {
	const [relatedPosts, setRelatedPosts] = useState([]);

	const shuffleArray = (array) => {
		return array.sort(() => Math.random() - 0.5);
	};

	const fetchBlogs = async () => {
		try {
			const res = await axios.get("/api/blog");
			const shuffledBlogs = shuffleArray(res.data.blogs);
			setRelatedPosts(shuffledBlogs.slice(0, 5));
		} catch (error) {
			console.error(error);
		}
	};

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
							<Link key={post._id} href={`/blogs/${post.slug}`}>
								<motion.div
									key={post._id}
									whileHover={{ scale: 1.03 }}
									transition={{ duration: 0.3 }}
									className="relative h-96 min-w-80 rounded-xl overflow-hidden shadow-lg group cursor-pointer"
								>
									<Image
										src={post.image || "/placeholder.svg"}
										alt={post.title}
										layout="fill"
										objectFit="cover"
										className="transition-transform duration-300 group-hover:scale-110"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-70 group-hover:opacity-80 transition-opacity duration-300"></div>
									<div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
										<motion.h2
											className="text-lg font-bold mb-2 leading-tight"
											initial={{ y: 20, opacity: 0 }}
											animate={{ y: 0, opacity: 1 }}
											transition={{ duration: 0.5 }}
										>
											{post.title}
										</motion.h2>
										<motion.button
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
											className="bg-white text-black font-bold py-2 px-4 rounded-full w-max text-sm transition-colors duration-300 hover:bg-gray-200"
											initial={{ y: 20, opacity: 0 }}
											animate={{ y: 0, opacity: 1 }}
											transition={{
												duration: 0.5,
												delay: 0.2,
											}}
										>
											Read More
										</motion.button>
									</div>
								</motion.div>
							</Link>
						))}
					</motion.div>
				</div>
			</div>
		</section>
	);
}
