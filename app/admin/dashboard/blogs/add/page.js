"use client";

import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function AddBlogPage() {
	const [blog, setBlog] = useState({
		title: "",
		slug: "",
		image: "",
		content: "",
	});
	const [loading, setLoading] = useState(false);

	const handleInputChange = (e) => {
		setBlog({ ...blog, [e.target.name]: e.target.value });
	};

    const validateFields = () => {
        blog.slug = blog.title.toLowerCase().replace(/ /g, "-");
        
		if (!blog.title || !blog.slug || !blog.image || !blog.content) {
			toast.error("Please fill in all required fields.");
			return false;
		}
		return true;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validateFields()) return;
		setLoading(true);

		try {
			const admin = localStorage.getItem("admin");
            const { token, id: id } = JSON.parse(admin);
			if (!token || !id)
				throw new Error("No authentication token found.");

			const response = await axios.post(
				"/api/blog",
				{ ...blog, author: id },
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);

			if (response.status === 200) {
				setBlog({ title: "", slug: "", image: "", content: "" });
				toast.success("Blog added successfully!");
			}
		} catch (error) {
			toast.error("Failed to add blog. Please try again.");
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
								<BreadcrumbPage>Add Blog</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</div>
			</header>
			<div className="p-6 space-y-6">
				<h1 className="text-3xl font-bold">Add Blog</h1>
				<Card>
					<CardHeader>
						<CardTitle>Blog Information</CardTitle>
						<CardDescription>
							Enter the details of the new blog post.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="title">Blog Title</Label>
							<Input
								id="title"
								name="title"
								placeholder="Enter blog title"
								value={blog.title}
								onChange={handleInputChange}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="image">Image URL</Label>
							<Input
								id="image"
								name="image"
								type="text"
								placeholder="Enter image URL"
								value={blog.image}
								onChange={handleInputChange}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="content">Content</Label>
							<Textarea
								id="content"
								name="content"
								placeholder="Enter blog content"
								value={blog.content}
								onChange={handleInputChange}
								required
							/>
						</div>
					</CardContent>
					<CardFooter className="flex flex-col sm:flex-row justify-between gap-2">
						<Button onClick={handleSubmit} disabled={loading}>
							{loading ? "Adding..." : "Add Blog"}
						</Button>
					</CardFooter>
				</Card>
			</div>
		</>
	);
}
