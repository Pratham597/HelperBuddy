"use client";

import { useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MobileHero() {
    const router = useRouter()
	const controls = useAnimation();
	const containerRef = useRef(null)

	useEffect(() => {
		const handleScroll = () => {
			if (containerRef.current) {
				const scrollY = window.scrollY;
				const opacity = Math.max(0, 1 - scrollY / 200);
				controls.start({ opacity });
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [controls]);

	return (
		<div ref={containerRef} className=" top-0 h-screen  overflow-hidden">
			{/* Background Image with Parallax Effect */}
			<div
				className="absolute inset-0 bg-cover bg-center"
				style={{
					backgroundImage:
						'url("https://cdn.prod.website-files.com/5fbde3dc76aea24cb3b0ae52/6017bb2859b475c6f95ef05f_home-cleaning-hero-p-2000.jpeg")',
				}}
			/>

			{/* Gradient Overlay */}
			<div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-transparent" />

			{/* Content */}
			<motion.div
				className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-white text-center"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8 }}
			>
				<motion.h1
					className="text-4xl font-bold mb-4 leading-tight"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.2 }}
				>
					Find the Best Local Services
				</motion.h1>
				<motion.p
					className="text-xl mb-8"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.4 }}
				>
					At Your Fingertips!
				</motion.p>
				<motion.button
					className="bg-white text-black px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-200 transition-colors duration-300"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.6 }}
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={() => {
						router.push("/services");
					}}
				>
					Get Started
				</motion.button>
			</motion.div>

			{/* Scroll Indicator */}
			<motion.div
				className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: [0, 10, 0] }}
				transition={{
					duration: 1.5,
					repeat: Number.POSITIVE_INFINITY,
					repeatType: "reverse",
				}}
			>
				<ChevronDown className="text-white w-8 h-8" />
			</motion.div>
		</div>
	);
}
