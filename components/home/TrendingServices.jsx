"use client";

import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import useServiceStore from "@/Store/useServiceStore";

const TrendingServices = () => {
	const [services, setServices] = useState([]);
	const [loading, setLoading] = useState(true);
	const containerRef = useRef(null);
	const scrollRef = useRef(null);
	const { setSelectedServiceId } = useServiceStore();

	useEffect(() => {
		const fetchTrendingServices = async () => {
			try {
				const res = await axios.get(
					`${process.env.NEXT_PUBLIC_URL}/api/analytics/most-sold-services`
				);
				setServices(res.data.services);
			} catch (error) {
				console.error("Error fetching trending services:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchTrendingServices();
	}, []);

	// Auto-scrolling effect
	useEffect(() => {
		const scrollContainer = scrollRef.current;
		if (!scrollContainer || services.length === 0) return;

		let animationFrame;

		const scroll = () => {
			if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
				scrollContainer.scrollLeft = 0; // Reset for infinite loop
			} else {
				scrollContainer.scrollLeft += 1;
			}
		};

		const startScrolling = () => {
			if (!animationFrame) {
				animationFrame = setInterval(scroll, 20);
			}
		};

		const stopScrolling = () => {
			clearInterval(animationFrame);
			animationFrame = null;
		};

		startScrolling(); // Start scrolling when component mounts

		const handleMouseEnter = () => stopScrolling();
		const handleMouseLeave = () => startScrolling();

		scrollContainer.addEventListener("mouseenter", handleMouseEnter);
		scrollContainer.addEventListener("mouseleave", handleMouseLeave);

		return () => {
			stopScrolling(); // Cleanup when component unmounts
			scrollContainer.removeEventListener("mouseenter", handleMouseEnter);
			scrollContainer.removeEventListener("mouseleave", handleMouseLeave);
		};
	}, [services]); // Re-run when services are updated

	return (
		<section className="py-16 px-4 bg-gradient-to-b from-white to-gray-50">
			<div className="max-w-screen-xl mx-auto">
				<h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-gray-800 to-slate-700 bg-clip-text text-transparent">
					Trending Services
				</h2>

				<div
					ref={containerRef}
					className="relative overflow-hidden shadow-xl rounded-lg bg-white/90 backdrop-blur-sm"
				>
					<div
						ref={scrollRef}
						className="flex gap-6 overflow-x-hidden whitespace-nowrap py-4"
					>
						{[...services, ...services].map((service, index) => (
							<Link
								href={`/services`}
								onClick={() => {
									setSelectedServiceId(service._id);
								}}
								passHref
								key={`${service._id}-${index}`}
							>
								<Card
									className="w-72 flex-shrink-0 hover:shadow-xl transition-all duration-300 bg-gray-50 backdrop-blur-sm border-0 hover:cursor-pointer hover:scale-105"
									aria-label={`View ${service.name}`}
								>
									<div className="relative h-48 overflow-hidden rounded-t-lg">
										<Image
											src={
												service.image.trim() ||
												"/placeholder.svg"
											}
											width={300}
											height={200}
											alt={service.name}
											className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
										/>
										<div className="absolute top-2 right-2">
											<Badge
												variant="secondary"
												className="bg-white/90 backdrop-blur-sm"
											>
												Rs.{service.price}
											</Badge>
										</div>
									</div>

									<CardContent className="p-4">
										<h3 className="font-semibold text-lg mb-2">
											{service.name}
										</h3>
										<div className="flex items-center gap-1">
											<Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
											<span className="text-sm text-gray-600">
												{service.rating.toFixed(1)}
											</span>
										</div>
									</CardContent>
								</Card>
							</Link>
						))}
					</div>

					{/* Gradient Shadows for better UI */}
					<div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-white to-transparent pointer-events-none" />
					<div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-white to-transparent pointer-events-none" />
				</div>
			</div>
		</section>
	);
};

export default TrendingServices;
