import HomePage from "@/components/home/HomePage";
import axios from "axios";
import Script from "next/script";

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
		<>
			<Script
				id="chatbase-script"
				strategy="lazyOnload"
				dangerouslySetInnerHTML={{
					__html: `(function(){if(!window.chatbase||window.chatbase("getState")!=="initialized"){window.chatbase=(...arguments)=>{if(!window.chatbase.q){window.chatbase.q=[]}window.chatbase.q.push(arguments)};window.chatbase=new Proxy(window.chatbase,{get(target,prop){if(prop==="q"){return target.q}return(...args)=>target(prop,...args)}})}const onLoad=function(){const script=document.createElement("script");script.src="https://www.chatbase.co/embed.min.js";script.id="uQk2vh0ctg44P6UgfIcYW";script.domain="www.chatbase.co";document.body.appendChild(script)};if(document.readyState==="complete"){onLoad()}else{window.addEventListener("load",onLoad)}})();`,
				}}
			/>
			<HomePage  />
		</>
	);
}
