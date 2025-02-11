"use client";

import { motion } from "framer-motion";

const categories = [
	{ name: "Home Repairs", icon: "🛠️" },
	{ name: "Cleaning Services", icon: "🏠" },
	{ name: "Beauty & Wellness", icon: "💆" },
	{ name: "Car Services", icon: "🚗" },
	{ name: "Freelance Work", icon: "💼" },
	{ name: "Pet Care", icon: "🐾" },
	{ name: "Tech Support", icon: "💻" },
	{ name: "Event Planning", icon: "🎉" },
];

export default function ServiceCategories() {
	return (
		<section className="py-16 px-4 bg-gray-50">
			<h2 className="text-3xl font-bold text-center mb-12">
				Our Services
			</h2>
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
				{categories.map((category, index) => (
					<motion.div
						key={category.name}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: index * 0.1 }}
						className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
					>
						<div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
							{category.icon}
						</div>
						<h3 className="text-lg font-semibold">
							{category.name}
						</h3>
					</motion.div>
				))}
			</div>
		</section>
	);
}
