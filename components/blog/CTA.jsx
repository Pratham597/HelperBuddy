"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function CTA() {
	return (
		<section className="py-20 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
			<div className="max-w-4xl mx-auto text-center px-4">
				<motion.h2
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					className="text-4xl font-serif font-bold mb-6"
				>
					Ready to Transform Your Home?
				</motion.h2>
				<motion.p
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.2 }}
					className="text-xl mb-8"
				>
					Book a service with Helper Buddy today and let our experts
					take care of your home maintenance needs.
				</motion.p>
				<Link href={`${process.env.NEXT_PUBLIC_URL}/services`}>
					<motion.button
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.4 }}
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						className="bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-opacity-90 transition-all duration-300"
					>
						Book a Service Now
					</motion.button>
				</Link>
			</div>
		</section>
	);
}
