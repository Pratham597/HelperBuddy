"use client";

import { motion } from "framer-motion";

export default function CallToAction() {
	return (
		<section className="py-20 px-4 bg-gray-900 text-white text-center">
			<motion.h2
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="text-4xl font-bold mb-8"
			>
				Book Your First Service Now!
			</motion.h2>
			<motion.button
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.2 }}
				className="bg-white text-black px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-200 hover:scale-105 transition-all duration-300"
			>
				Get Started
			</motion.button>
		</section>
	);
}
