"use client";

import { motion } from "framer-motion";
import BlogCard from "./BlogCard";
import Link from "next/link";

// Sample blog data (replace with actual data fetching in a real application)
const blogs = [
	{
		id: 1,
		title: "10 Essential Home Maintenance Tips for Every Homeowner",
		author: "Emma Johnson",
		image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9fOAjjCL7u2swwb8UiEjVXgrvKCcdfHVnaA&s",
		category: "Home Maintenance",
	},
	{
		id: 2,
		title: "The Ultimate Guide to Hiring a Professional Plumber",
		author: "Michael Chen",
		image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9fOAjjCL7u2swwb8UiEjVXgrvKCcdfHVnaA&s",
		category: "Plumbing",
	},
	{
		id: 3,
		title: "5 Eco-Friendly Cleaning Solutions for a Greener Home",
		author: "Sophia Patel",
		image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9fOAjjCL7u2swwb8UiEjVXgrvKCcdfHVnaA&s",
		category: "Cleaning",
	},
	{
		id: 4,
		title: "How to Prepare Your Home for a Professional Paint Job",
		author: "David Wilson",
		image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9fOAjjCL7u2swwb8UiEjVXgrvKCcdfHVnaA&s",
		category: "Home Improvement",
	},
	{
		id: 5,
		title: "The Benefits of Regular HVAC Maintenance",
		author: "Laura Martinez",
		image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9fOAjjCL7u2swwb8UiEjVXgrvKCcdfHVnaA&s",
		category: "HVAC",
	},
	{
		id: 6,
		title: "DIY vs. Professional: When to Call in the Experts",
		author: "Alex Thompson",
		image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9fOAjjCL7u2swwb8UiEjVXgrvKCcdfHVnaA&s",
		category: "Home Services",
	},
];

export default function BlogGrid() {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}
			className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
		>
            {blogs.map((blog, index) => {
                const slug = blog.title
					.toLowerCase() // Convert to lowercase
					.replace(/[^a-z0-9\s-]/g, "") // Remove special characters
					.replace(/\s+/g, "-") // Replace spaces with hyphens
                    .replace(/-+/g, "-");
                console.log(slug);
				return (
					<motion.div
						key={blog.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: index * 0.1 }}
					>
						<Link href={`/blogs/${slug}`}>
							<BlogCard blog={blog} />
						</Link>
					</motion.div>
				);
			})}
		</motion.div>
	);
}
