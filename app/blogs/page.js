import BlogGrid from "@/components/blog/BlogGrid.jsx";
import Footer from "@/components/home/Footer.jsx";
import Navbar from "@/components/navbar/Navbar.jsx";

// async function fetchBlogs() {
// 	try {
// 		const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/blog`);
// 		const data = await res.json();
// 		return data.blogs;
// 	} catch (error) {
// 		console.error("Failed to fetch blogs:", error);
// 		return [];
// 	}
// }

export const metadata = {
	title: "Blogs | HelperBuddy",
	description:
		"Stay informed with the latest home service trends, expert tips, and maintenance guides. Explore our blogs on plumbing, electrical repairs, home improvement, and more.",
	keywords:
		"home repair blog, home maintenance tips, plumbing advice, electrical fixes, appliance repair, handyman insights, home improvement, HelperBuddy blog",
	robots: "index, follow",
	viewport: "width=device-width, initial-scale=1.0",
	openGraph: {
		title: "HelperBuddy Blog - Expert Home Service Tips & Trends",
		description:
			"Explore expert advice, home maintenance guides, and service insights to keep your home in top shape.",
		url: "https://helperbuddy.com/blogs",
		siteName: "HelperBuddy",
		type: "website",
		images: [
			{
				url: "/blog-preview.png",
				width: 1200,
				height: 630,
				alt: "Blogs | HelperBuddy",
			},
		],
	},
};


export default async function BlogListingPage() {
	// const blogs = await fetchBlogs();
	return (
		<>
			<Navbar/>
			<div className="min-h-screen mt-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
					<h1 className="text-4xl md:text-5xl font-extrabold text-center mb-8 text-gray-900 dark:text-white">
						<span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
							Our Latest Insights
						</span>
					</h1>
					<p className="text-xl text-center mb-12 text-gray-600 dark:text-gray-300">
						Discover tips, trends, and expert advice on home
						services and more.
					</p>
					<BlogGrid  />
				</div>
			</div>
			<Footer />
		</>
	);
}
