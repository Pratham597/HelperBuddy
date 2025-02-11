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
];

export default function Testimonials() {
	const [currentIndex, setCurrentIndex] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentIndex(
				(prevIndex) => (prevIndex + 1) % testimonials.length
			);
		}, 5000);
		return () => clearInterval(timer);
	}, []);

	return (
		<section className="py-16 px-4 bg-white">
			<h2 className="text-3xl font-bold text-center mb-12">
				What Our Customers Say
			</h2>
			<div className="max-w-3xl mx-auto">
				<AnimatePresence mode="wait">
					<motion.div
						key={currentIndex}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.5 }}
						className="bg-gray-50 p-8 rounded-lg shadow-md text-center"
					>
						<img
							src={
								testimonials[currentIndex].avatar ||
								"/placeholder.svg"
							}
							alt={testimonials[currentIndex].name}
							className="w-20 h-20 rounded-full mx-auto mb-4 filter grayscale"
						/>
						<div className="text-xl mb-2">
							{"⭐".repeat(testimonials[currentIndex].rating)}
						</div>
						<p className="text-gray-600 italic mb-4">
							{testimonials[currentIndex].text}
						</p>
						<p className="font-semibold">
							{testimonials[currentIndex].name}
						</p>
					</motion.div>
				</AnimatePresence>
				<div className="flex justify-center mt-4 space-x-2">
					{testimonials.map((_, index) => (
						<button
							key={index}
							onClick={() => setCurrentIndex(index)}
							className={`w-3 h-3 rounded-full ${
								index === currentIndex
									? "bg-black"
									: "bg-gray-300"
							}`}
						></button>
					))}
				</div>
			</div>
		</section>
	);
}
