"use client";

import { useRef } from "react";
import { motion } from "framer-motion";

const services = [
	{ name: "House Cleaning", image: "/service1.jpg", rating: 4.8, price: 25 },
	{ name: "Plumbing", image: "/service2.jpg", rating: 4.7, price: 40 },
	{ name: "Haircut", image: "/service3.jpg", rating: 4.9, price: 30 },
	{ name: "Car Wash", image: "/service4.jpg", rating: 4.6, price: 20 },
	{ name: "Web Design", image: "/service5.jpg", rating: 4.8, price: 50 },
	{ name: "Dog Walking", image: "/service6.jpg", rating: 4.7, price: 15 },
];

export default function TrendingServices() {
	const scrollRef= useRef(null);

	const scroll = (direction) => {
		if (scrollRef.current) {
			const { current } = scrollRef;
			const scrollAmount =
				direction === "left"
					? -current.offsetWidth
					: current.offsetWidth;
			current.scrollBy({ left: scrollAmount, behavior: "smooth" });
		}
	};

	return (
		<section className="py-16 px-4 bg-white">
			<h2 className="text-3xl font-bold text-center mb-12">
				Most Used & Trending Services
			</h2>
			<div className="relative max-w-6xl mx-auto">
				<button
					onClick={() => scroll("left")}
					className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10"
				>
					←
				</button>
				<button
					onClick={() => scroll("right")}
					className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-md z-10"
				>
					→
				</button>
				<div
					ref={scrollRef}
					className="flex overflow-x-auto scrollbar-hide space-x-6 pb-4"
				>
					{services.map((service, index) => (
						<motion.div
							key={service.name}
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
							className="flex-shrink-0 w-64 bg-gray-50 rounded-lg shadow-md overflow-hidden"
						>
							<img
								src={service.image || "/placeholder.svg"}
								alt={service.name}
								className="w-full h-40 object-cover filter grayscale"
							/>
							<div className="p-4">
								<h3 className="font-semibold mb-2">
									{service.name}
								</h3>
								<div className="flex justify-between items-center">
									<span className="text-sm">
										⭐ {service.rating}
									</span>
									<span className="font-bold">
										${service.price}/hr
									</span>
								</div>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
