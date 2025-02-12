// "use client";

// import { useRef, useEffect } from "react";
// import { motion } from "framer-motion";

// const services = [
// 	{ name: "House Cleaning", image: "/service1.jpg", rating: 4.8, price: 25 },
// 	{ name: "Plumbing", image: "/service2.jpg", rating: 4.7, price: 40 },
// 	{ name: "Haircut", image: "/service3.jpg", rating: 4.9, price: 30 },
// 	{ name: "Car Wash", image: "/service4.jpg", rating: 4.6, price: 20 },
// 	{ name: "Web Design", image: "/service5.jpg", rating: 4.8, price: 50 },
// 	{ name: "Dog Walking", image: "/service6.jpg", rating: 4.7, price: 15 },
// ];

// export default function TrendingServices() {
// 	const scrollRef = useRef(null);

// 	useEffect(() => {
// 		const interval = setInterval(() => {
// 			if (scrollRef.current) {
// 				const { scrollLeft, scrollWidth, clientWidth } =
// 					scrollRef.current;

// 				if (scrollLeft + clientWidth >= scrollWidth - 1) {
// 					// If at the end, smoothly reset back to the start
// 					scrollRef.current.scrollTo({
// 						left: 0,
// 						behavior: "instant",
// 					});
// 				} else {
// 					// Otherwise, scroll right
// 					scrollRef.current.scrollBy({
// 						left: clientWidth,
// 						behavior: "smooth",
// 					});
// 				}
// 			}
// 		}, 3000); // Adjust timing as needed

// 		return () => clearInterval(interval);
// 	}, []);

// 	return (
// 		<section className="py-16 px-4 bg-white">
// 			<h2 className="text-3xl font-bold text-center mb-12">
// 				Most Used & Trending Services
// 			</h2>
// 			<div className="relative max-w-6xl mx-auto">
// 				<div
// 					ref={scrollRef}
// 					className="flex overflow-x-auto scrollbar-hide space-x-6 pb-4"
// 				>
// 					{[...services, ...services].map((service, index) => (
// 						// Duplicating array for seamless looping
// 						<motion.div
// 							key={index}
// 							initial={{ opacity: 0, x: 20 }}
// 							animate={{ opacity: 1, x: 0 }}
// 							transition={{
// 								duration: 0.5,
// 								delay: (index % services.length) * 0.1,
// 							}}
// 							className="flex-shrink-0 w-64 bg-gray-50 rounded-lg shadow-md overflow-hidden"
// 						>
// 							<img
// 								src={service.image || "/placeholder.svg"}
// 								alt={service.name}
// 								className="w-full h-40 object-cover filter grayscale"
// 							/>
// 							<div className="p-4">
// 								<h3 className="font-semibold mb-2">
// 									{service.name}
// 								</h3>
// 								<div className="flex justify-between items-center">
// 									<span className="text-sm">
// 										⭐ {service.rating}
// 									</span>
// 									<span className="font-bold">
// 										${service.price}/hr
// 									</span>
// 								</div>
// 							</div>
// 						</motion.div>
// 					))}
// 				</div>
// 			</div>
// 		</section>
// 	);
// }

"use client";

import React, { useRef, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

const services = [
	{ name: "House Cleaning", image: "/service1.jpg", rating: 4.8, price: 25 },
	{ name: "Plumbing", image: "/service2.jpg", rating: 4.7, price: 40 },
	{ name: "Haircut", image: "/service3.jpg", rating: 4.9, price: 30 },
	{ name: "Car Wash", image: "/service4.jpg", rating: 4.6, price: 20 },
	{ name: "Web Design", image: "/service5.jpg", rating: 4.8, price: 50 },
	{ name: "Dog Walking", image: "/service6.jpg", rating: 4.7, price: 15 },
];

const TrendingServices = () => {
	const containerRef = useRef(null);
	const scrollRef = useRef(null);

	useEffect(() => {
		const scrollContainer = scrollRef.current;
		if (!scrollContainer) return;

		const scroll = () => {
			if (scrollContainer) {
				if (
					scrollContainer.scrollLeft >=
					scrollContainer.scrollWidth / 2 -
						scrollContainer.offsetWidth / 2
				) {
					scrollContainer.scrollLeft = 0;
				} else {
					scrollContainer.scrollLeft += 1;
				}
			}
		};

		const animationFrame = setInterval(scroll, 15);

		const handleMouseEnter = () => clearInterval(animationFrame);
		const handleMouseLeave = () => {
			clearInterval(animationFrame);
			const newAnimation = setInterval(scroll, 20);
			return () => clearInterval(newAnimation);
		};

		scrollContainer.addEventListener("mouseenter", handleMouseEnter);
		scrollContainer.addEventListener("mouseleave", handleMouseLeave);

		return () => {
			clearInterval(animationFrame);
			if (scrollContainer) {
				scrollContainer.removeEventListener(
					"mouseenter",
					handleMouseEnter
				);
				scrollContainer.removeEventListener(
					"mouseleave",
					handleMouseLeave
				);
			}
		};
	}, []);

	return (
		<section className="py-16 px-4 bg-gradient-to-b from-white to-gray-50">
			<div className="max-w-6xl mx-auto">
				<h2 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-black to-black bg-clip-text text-transparent">
					Trending Services
				</h2>

				<div ref={containerRef} className="relative overflow-hidden">
					<div
						ref={scrollRef}
						className="flex gap-6 overflow-x-hidden whitespace-nowrap py-4"
					>
						{[...services, ...services, ...services].map(
							(service, index) => (
								<Card
									key={index}
									className="w-72 flex-shrink-0 hover:shadow-xl transition-all duration-300 bg-white/50 backdrop-blur-sm border-0 hover:scale-105"
								>
									<div className="relative h-48 overflow-hidden rounded-t-lg">
										<img
											src={
												service.image ||
												"/api/placeholder/400/320"
											}
											alt={service.name}
											className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
										/>
										<div className="absolute top-2 right-2">
											<Badge
												variant="secondary"
												className="bg-white/90 backdrop-blur-sm"
											>
												${service.price}/hr
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
												{service.rating}
											</span>
										</div>
									</CardContent>
								</Card>
							)
						)}
					</div>

					<div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-white to-transparent pointer-events-none" />
					<div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-white to-transparent pointer-events-none" />
				</div>
			</div>
		</section>
	);
};

export default TrendingServices;