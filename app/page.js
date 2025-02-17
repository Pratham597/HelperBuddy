import HomePage from "@/components/home/HomePage";
import axios from "axios";


// Fetch data for TrendingServices and TrustSection
async function fetchTrendingServices() {
	try {
		const res = await axios.get(
			`${process.env.NEXT_PUBLIC_URL}/api/analytics/most-sold-services`
		);
		return res.data.services;
	} catch (error) {
		console.error("Error fetching trending services:", error);
		return [];
	}
}

async function fetchTrustSection() {
	try {
		const res = await axios.get(
			`${process.env.NEXT_PUBLIC_URL}/api/analytics/site`
		);
		return res.data;
	} catch (error) {
		console.error("Error fetching trust section:", error);
		return {};
	}
}
// Fixed data for ServiceCategories


// Generate metadata for SEO
export async function generateMetadata() {
	return {
		title: "Home | HelperBuddy",
		description:
			"Discover top-rated services, trending categories, and trusted solutions for your needs.",
		openGraph: {
			title: "Home | HelperBuddy",
			description:
				"Discover top-rated services, trending categories, and trusted solutions for your needs.",
			images: [
				{
					url: "https://cdn.zyrosite.com/cdn-cgi/image/format=auto,w=656,h=492,fit=crop/cdn-ecommerce/store_01JCYZKF09EKDA2HS3ZXYAX2G1%2Fassets%2F1734724269763-washing-machine-installation-services.webp",
					alt: "HelperBuddy",
				},
			],
		},
	};
}

export default async function Page() {
	// Fetch data on the server
	const trendingServices = await fetchTrendingServices();
	const trustSection = await fetchTrustSection();
	// Pass data to the Home component
	return (
		<HomePage
			services = {trendingServices}
			trustSection={trustSection}
		/>
	);
}
