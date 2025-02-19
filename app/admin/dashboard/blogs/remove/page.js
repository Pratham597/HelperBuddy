"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { toast } from "react-hot-toast";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export default function RemoveBlogPage() {
	const [blogs, setBlogs] = useState([]);
	const [selectedBlog, setSelectedBlog] = useState("");
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchBlogs = async () => {
			try {
				const { data } = await axios.get("/api/blog");
				if (data.success) {
					setBlogs(data.blogs);
				} else {
					toast.error("Failed to fetch blogs.");
				}
			} catch (error) {
				console.error(error);
				toast.error("Error fetching blogs.");
			}
		};
		fetchBlogs();
	}, []);

	const handleDelete = async () => {
		if (!selectedBlog) {
			toast.error("Please select a blog to remove.");
			return;
		}
		setLoading(true);

		try {
			const admin = localStorage.getItem("admin");
			const { token } = JSON.parse(admin);
			if (!token) throw new Error("No authentication token found.");

			const response = await axios.delete("/api/blog/delete", {
				headers: { Authorization: `Bearer ${token}` },
				data: { blogId: selectedBlog },
			});

			if (response.status === 200) {
				setBlogs(blogs.filter((blog) => blog._id !== selectedBlog));
				setSelectedBlog("");
				toast.success("Blog removed successfully!");
			}
		} catch (error) {
			toast.error("Failed to remove blog. Please try again.");
			console.error(error.message);
		}
		setLoading(false);
	};

	return (
		<>
			<header className="flex h-16 shrink-0 items-center gap-2">
				<div className="flex items-center gap-2 px-4">
					<SidebarTrigger className="-ml-1" />
					<Separator orientation="vertical" className="mr-2 h-4" />
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem className="hidden md:block">
								<Link href={`/admin/dashboard`}>Admin</Link>
							</BreadcrumbItem>
							<BreadcrumbSeparator className="hidden md:block" />
							<BreadcrumbItem>
								<BreadcrumbPage>Remove Blog</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</div>
			</header>
			<div className="p-6 space-y-6">
				<h1 className="text-3xl font-bold">Remove Blog</h1>
				<Card>
					<CardHeader>
						<CardTitle>Select Blog</CardTitle>
						<CardDescription>
							Choose a blog to remove from the platform.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<Select
							value={selectedBlog}
							onValueChange={setSelectedBlog}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select a blog to remove" />
							</SelectTrigger>
							<SelectContent>
								{blogs.map((blog) => (
									<SelectItem key={blog._id} value={blog._id}>
										{blog.title} (by{" "}
										{blog.author?.name || "Unknown"})
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</CardContent>
					<CardFooter className="flex flex-col sm:flex-row justify-between gap-2">
						<Button
							onClick={handleDelete}
							disabled={loading || !selectedBlog}
						>
							{loading ? "Removing..." : "Remove Blog"}
						</Button>
					</CardFooter>
				</Card>
			</div>
		</>
	);
}
