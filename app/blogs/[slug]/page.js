"use client";
import Navbar from "@/components/navbar/Navbar";
import React, { useState, useEffect } from "react";
import BlogPost from "@/components/blog/BlogPost";
import axios from "axios";
import ReadNext from "@/components/blog/ReadNext";
import CTA from "@/components/blog/CTA";



const BlogPage = (req) => {
	const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchBlog = async (slug) => {
		const res = await axios.get(
			`${process.env.NEXT_PUBLIC_URL}/api/blog/${slug}`
		);
		return res.data.blog;
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const { slug } = await req.params;
                const data = await fetchBlog(slug);
                console.log(data);
                setBlog(data);
                setLoading(false);
			} catch (error) {
				console.error("Error fetching blog:", error);
			} 
		};

		fetchData();
	}, []);

	return (
		<>
            <Navbar />
            {loading && <div>Loading...</div>}
			{!loading && (
				<div className="min-h-screen bg-white">
					<BlogPost blog={blog} />
					<ReadNext />
					<CTA />
				</div>
			)}
		</>
	);
};

export default BlogPage;
