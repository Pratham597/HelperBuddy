"use client";

import { motion } from "framer-motion";
import BlogCard from "./BlogCard";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";


export default function BlogGrid({ blogs }) {
	const [currentPage, setCurrentPage] = useState(1);
	const blogsPerPage = 9;


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
			{/* Blog Grid */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.5 }}
				className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
			>
				{currentBlogs.map((blog, index) => (
					<Link key={blog._id} href={`/blogs/${blog.slug}`}>
					<motion.div
						key={blog._id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.5,
							delay: index * 0.1,
						}}
					>
						<BlogCard blog={blog} />
						</motion.div>
					</Link>
				))}
			</motion.div>

			{/* Pagination */}
			{totalPages > 1 && (
				<Pagination className="mt-8">
					<PaginationContent>
						<PaginationItem>
							<PaginationPrevious
								onClick={handlePrev}
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
										currentPage === index + 1
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
								onClick={handleNext}
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
