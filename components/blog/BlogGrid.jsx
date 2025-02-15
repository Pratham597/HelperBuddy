"use client";

import { motion } from "framer-motion";
import BlogCard from "./BlogCard";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { Loader2 } from "lucide-react";

export default function BlogGrid() {
	const [loading, setLoading] = useState(true);
	const [blogs, setBlogs] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const blogsPerPage = 9;
	const router = useRouter();

	const fetchBlogs = async () => {
		try {
			const res = await axios.get("/api/blog");
			const shuffledBlogs = res.data.blogs.sort(
				() => Math.random() - 0.5
			);
			setBlogs(shuffledBlogs);
			setLoading(false)
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		fetchBlogs();
	}, []);

	const handleOnClick = (slug) => {
		router.push(`/blogs/${slug}`);
	};

	const indexOfLastBlog = currentPage * blogsPerPage;
	const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
	const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);
	const totalPages = Math.ceil(blogs.length / blogsPerPage);
	const handleNext = () => {
		if (currentPage < totalPages) setCurrentPage(currentPage + 1);
	};

	const handlePrev = () => {
		if (currentPage > 1) setCurrentPage(currentPage - 1);
	};
	return (
		<div>
			{loading && (
				<div className="flex min-h-[60vh] items-center justify-center">
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
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5 }}
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
				>
					{currentBlogs.map((blog, index) => (
						<motion.div
							key={blog._id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
							onClick={() => handleOnClick(blog.slug)}
						>
							<BlogCard blog={blog} />
						</motion.div>
					))}
				</motion.div>
			)}

			{/* Pagination */}
			{totalPages > 1 && (
				<Pagination className="mt-8">
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious
								onClick={() =>
									setCurrentPage((prev) =>
										Math.max(prev - 1, 1)
									)
								}
								className="bg-slate-950 text-white hover:bg-slate-800 duration-500 hover:text-white hover:cursor-pointer"
								disabled={currentPage === 1}
							/>
						</PaginationItem>
						{[...Array(totalPages)].map((_, index) => (
							<PaginationItem key={index}>
								<Button
									variant={
										currentPage === index + 1
											? "default"
											: "outline"
									}
									className={`hover:bg-slate-800 hover:text-white duration-500 ${
										currentPage == index + 1
											? "bg-slate-950"
											: ""
									} `}
									onClick={() => setCurrentPage(index + 1)}
								>
									{index + 1}
								</Button>
							</PaginationItem>
						))}
						<PaginationItem>
							<PaginationNext
								onClick={() =>
									setCurrentPage((prev) =>
										Math.min(prev + 1, totalPages)
									)
								}
								className="bg-slate-950 text-white hover:bg-slate-800 duration-500 hover:text-white hover:cursor-pointer"
								disabled={currentPage === totalPages}
							/>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			)}
		</div>
	);
}
