"use client";

import { motion } from "framer-motion";

const features = [
	{
		icon: "✅",
		title: "Verified Professionals",
		description:
			"All our service providers are thoroughly vetted and background-checked.",
	},
	{
		icon: "💰",
		title: "Affordable Pricing",
		description: "Competitive rates with no hidden fees or surprises.",
	},
	{
		icon: "🔒",
		title: "Secure Booking & Payments",
		description: "Book and pay with confidence using our secure platform.",
	},
	{
		icon: "⭐",
		title: "Customer Reviews & Ratings",
		description: "Make informed decisions based on real customer feedback.",
	},
];

export default function TrustSection() {
	return (
		<section className="py-16 px-4 bg-gray-50">
			<h2 className="text-3xl font-bold text-center mb-12">
				Why Choose Helper Buddy?
			</h2>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
				{features.map((feature, index) => (
					<motion.div
						key={feature.title}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: index * 0.1 }}
						className="bg-white p-6 rounded-lg shadow-md text-center"
					>
						<div className="text-4xl mb-4">{feature.icon}</div>
						<h3 className="text-xl font-semibold mb-2">
							{feature.title}
						</h3>
						<p className="text-gray-600">{feature.description}</p>
					</motion.div>
				))}
			</div>
		</section>
	);
}
