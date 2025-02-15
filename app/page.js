"use client";
import Hero from "@/components/home/Hero";
import ServiceCategories from "@/components/home/ServiceCategories";
import TrendingServices from "@/components/home/TrendingServices";
import TrustSection from "@/components/home/TrustSection";
import Testimonials from "@/components/home/Testimonials";
import CallToAction from "@/components/home/CallToAction";
import Footer from "@/components/home/Footer";
import Navbar from "@/components/navbar/Navbar";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
	const [loading, setLoading] = useState(true);
	const [progress, setProgress] = useState(20);

	useEffect(() => {
		let interval = setInterval(() => {
			setProgress((oldProgress) => {
				if (oldProgress >= 100) {
					clearInterval(interval);
					setTimeout(() => setLoading(false), 200); // Small delay before showing the main content
					return 100;
				}
				return oldProgress + 5; // Increase progress by 5% every 100ms
			});
		}, 100);

		return () => clearInterval(interval);
	}, []);

	if (loading) {
		return (
			<div className="fixed top-0 left-0 w-full h-screen flex flex-col items-center justify-center bg-black z-50">
				<Image
					src="/logo.png"
					alt="Loading..."
					width={150}
					height={150}
				/>
				<div className="w-64 h-2 bg-gray-700 rounded-full mt-4 overflow-hidden">
					<div
						className="h-full bg-slate-200 transition-all"
						style={{ width: `${progress}%` }}
					></div>
				</div>
				{/* <p className="text-white mt-2">{progress}%</p> */}
			</div>
		);
	}
	return (
		<main className="bg-white text-black">
			<Navbar />
			<Hero />
			<TrendingServices />
			<ServiceCategories />
			<TrustSection />
			<Testimonials />
			{/* <CallToAction /> */}
			<Footer />
		</main>
	);
}
