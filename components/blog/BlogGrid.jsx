"use client";

import { motion } from "framer-motion";
import BlogCard from "./BlogCard";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function BlogGrid() {
	const [blogs, setBlogs] = useState([]);
	const router = useRouter();
	// Fetch blogs from the API
	const fetchBlogs = async () => {
		try {
			const res = await axios.get("/api/blog");
			console.log(res.data.blogs);
			setBlogs(res.data.blogs);
		} catch (error) {
			console.error(error);
		}
	};

	// Fetch blogs on component mount
	useEffect(() => {
		fetchBlogs();
	}, []);
	
	const handleOnClick = (slug) => {
		router.push(`/blogs/${slug}`);
	};
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}
			className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
		>
            {blogs.map((blog, index) => {
				return (
					<motion.div
						key={blog._id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: index * 0.1 }}
						onClick={() => handleOnClick(blog.slug)}
					>
							<BlogCard blog={blog} />
					</motion.div>
				);
			})}
		</motion.div>
	);
}
