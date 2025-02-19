"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Testimonials() {
	const [reviews, setReviews] = useState([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [visibleCount, setVisibleCount] = useState(3);

	// Fetch reviews from API
	useEffect(() => {
		const fetchReviews = async () => {
			try {
				const res = await fetch("/api/serviceorders/reviews");
				const data = await res.json();
				setReviews(data);
			} catch (error) {
				console.error("Error fetching reviews:", error);
			}
		};
		fetchReviews();
	}, []);

	// Adjust visible count based on screen size
	useEffect(() => {
		const updateVisibleCount = () => {
			setVisibleCount(window.innerWidth < 768 ? 1 : 3);
		};
		updateVisibleCount();
		window.addEventListener("resize", updateVisibleCount);
		return () => window.removeEventListener("resize", updateVisibleCount);
	}, []);

	// Auto-scroll testimonials
	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentIndex(
				(prevIndex) => (prevIndex + visibleCount) % reviews.length
			);
		}, 7000);
		return () => clearInterval(timer);
	}, [visibleCount, reviews.length]);

	return (
		<section className="py-16 px-4 bg-gray-50">
			<h2 className="text-3xl font-bold text-center mb-12">
				What Our Customers Say
			</h2>
			<div className="mx-auto overflow-hidden">
				<AnimatePresence mode="wait">
					{reviews.length > 0 ? (
						<motion.div
							key={currentIndex}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							transition={{ duration: 0.5 }}
							className="grid grid-cols-1 gap-6 md:grid-cols-3"
						>
							{reviews
								.slice(
									currentIndex,
									currentIndex + visibleCount
								)
								.map((review, index) => (
									<div
										key={index}
										className="bg-gray-100 p-6 rounded-lg shadow-md text-center"
									>
										<div className="text-xl mb-2">
											{"⭐".repeat(review.rating)}
										</div>
										<p className="text-gray-600 italic mb-4">
											{review.text}
										</p>
										<p className="font-semibold">
											{review.name}
										</p>
									</div>
								))}
						</motion.div>
					) : (
						<p className="text-center text-gray-500">
							No reviews available.
						</p>
					)}
				</AnimatePresence>
			</div>
		</section>
	);
}
