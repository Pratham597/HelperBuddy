import BlogPage from "@/components/blog/BlogPage";
import axios from "axios";

// Fetch blog data on the server
async function fetchBlog(slug) {
	try {
		const res = await axios.get(
			`${process.env.NEXT_PUBLIC_URL}/api/blog/${slug}`
		);
		return res.data.blog;
	} catch (error) {
		console.error("Error fetching blog:", error);
		return null;
	}
}
// Generate metadata for SEO
export async function generateMetadata({ params }) {
	const blog = await fetchBlog(params.slug);

	return {
		title: blog?.title || "Blog Post",
		description:
			blog?.content ||
			"Discover insights and tips on home services and more.",
		openGraph: {
			title: blog?.title || "Blog Post",
			description:
				blog?.content ||
				"Discover insights and tips on home services and more.",
			images: [
				{
					url: blog?.image || "/default-image.jpg",
					alt: blog?.title || "Blog Post",
				},
			],
		},
	};
}

export default async function Page({ params }) {
	// Fetch blog data on the server
	const blog = await fetchBlog(params.slug);

	// Format the date on the server
	const formattedDate = new Date(blog.createdAt).toLocaleDateString("en-US", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	});

	// Pass the blog data and formatted date to the BlogPage component
	return <BlogPage blog={{ ...blog, formattedDate }} />;
}
