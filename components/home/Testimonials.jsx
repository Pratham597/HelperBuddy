"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
	{
		name: "John D.",
		avatar: "/avatar1.jpg",
		rating: 5,
		text: "Helper Buddy made finding a reliable plumber so easy! Great service and communication.",
	},
	{
		name: "Sarah M.",
		avatar: "/avatar2.jpg",
		rating: 4,
		text: "I use Helper Buddy for all my home cleaning needs. The professionals are always punctual and do an excellent job.",
	},
	{
		name: "Mike R.",
		avatar: "/avatar3.jpg",
		rating: 5,
		text: "As a busy professional, Helper Buddy has been a lifesaver for various household tasks. Highly recommended!",
	},
	{
		name: "Emma L.",
		avatar: "/avatar4.jpg",
		rating: 4,
		text: "A fantastic service that connects you to the best professionals in no time!",
	},
	{
		name: "Robert P.",
		avatar: "/avatar5.jpg",
		rating: 5,
		text: "Very convenient and easy to use. I love Helper Buddy!",
	},
	{
		name: "Lisa T.",
		avatar: "/avatar6.jpg",
		rating: 4,
		text: "Great experience, I’ve used it multiple times and never been disappointed.",
	},
	{
		name: "John D.",
		avatar: "/avatar1.jpg",
		rating: 5,
		text: "Helper Buddy made finding a reliable plumber so easy! Great service and communication.",
	},
	{
		name: "Sarah M.",
		avatar: "/avatar2.jpg",
		rating: 4,
		text: "I use Helper Buddy for all my home cleaning needs. The professionals are always punctual and do an excellent job.",
	},
	{
		name: "Mike R.",
		avatar: "/avatar3.jpg",
		rating: 5,
		text: "As a busy professional, Helper Buddy has been a lifesaver for various household tasks. Highly recommended!",
	},
	{
		name: "Emma L.",
		avatar: "/avatar4.jpg",
		rating: 4,
		text: "A fantastic service that connects you to the best professionals in no time!",
	},
	{
		name: "Robert P.",
		avatar: "/avatar5.jpg",
		rating: 5,
		text: "Very convenient and easy to use. I love Helper Buddy!",
	},
	{
		name: "Lisa T.",
		avatar: "/avatar6.jpg",
		rating: 4,
		text: "Great experience, I’ve used it multiple times and never been disappointed.",
	},
	{
		name: "John D.",
		avatar: "/avatar1.jpg",
		rating: 5,
		text: "Helper Buddy made finding a reliable plumber so easy! Great service and communication.",
	},
	{
		name: "Sarah M.",
		avatar: "/avatar2.jpg",
		rating: 4,
		text: "I use Helper Buddy for all my home cleaning needs. The professionals are always punctual and do an excellent job.",
	},
	{
		name: "Mike R.",
		avatar: "/avatar3.jpg",
		rating: 5,
		text: "As a busy professional, Helper Buddy has been a lifesaver for various household tasks. Highly recommended!",
	},
	{
		name: "Emma L.",
		avatar: "/avatar4.jpg",
		rating: 4,
		text: "A fantastic service that connects you to the best professionals in no time!",
	},
	{
		name: "Robert P.",
		avatar: "/avatar5.jpg",
		rating: 5,
		text: "Very convenient and easy to use. I love Helper Buddy!",
	},
	{
		name: "Lisa T.",
		avatar: "/avatar6.jpg",
		rating: 4,
		text: "Great experience, I’ve used it multiple times and never been disappointed.",
	},
];

export default function Testimonials() {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [visibleCount, setVisibleCount] = useState(3);

	useEffect(() => {
		const updateVisibleCount = () => {
			setVisibleCount(window.innerWidth < 768 ? 1 : 3);
		};

		updateVisibleCount();
		window.addEventListener("resize", updateVisibleCount);
		return () => window.removeEventListener("resize", updateVisibleCount);
	}, []);

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentIndex(
				(prevIndex) => (prevIndex + visibleCount) % testimonials.length
			);
		}, 10000);
		return () => clearInterval(timer);
	}, [visibleCount]);

	return (
		<section className="py-16 px-4 bg-gray-50">
			<h2 className="text-3xl font-bold text-center mb-12">
				What Our Customers Say
			</h2>
			<div className=" mx-auto overflow-hidden">
				<AnimatePresence mode="wait">
					<motion.div
						key={currentIndex}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.5 }}
						className="grid grid-cols-1 gap-6 md:grid-cols-3"
					>
						{testimonials
							.slice(currentIndex, currentIndex + visibleCount)
							.map((testimonial, index) => (
								<div
									key={index}
									className="bg-gray-100 p-6 rounded-lg shadow-md text-center"
								>
									<div className="text-xl mb-2">
										{"⭐".repeat(testimonial.rating)}
									</div>
									<p className="text-gray-600 italic mb-4">
										{testimonial.text}
									</p>
									<p className="font-semibold">
										{testimonial.name}
									</p>
								</div>
							))}
					</motion.div>
				</AnimatePresence>
			</div>
		</section>
	);
}
