import BlogGrid from "@/components/blog/BlogGrid";
import Footer from "@/components/home/Footer";
import Navbar from "@/components/navbar/Navbar";

export default function BlogListingPage() {
	return (
		<>
			<Navbar/>
			<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
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
					<BlogGrid />
				</div>
			</div>
			<Footer />
		</>
	);
}
