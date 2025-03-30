"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import ImageCollage from "./ImageCollage.jsx";
import MobileHero from "./MobileHero.jsx";
import Link from "next/link";

export default function Hero() {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};
		checkMobile();
		window.addEventListener("resize", checkMobile);
		return () => window.removeEventListener("resize", checkMobile);
	}, []);

	if (isMobile) {
		return <MobileHero />;
	}

	return (
		<section className="relative mt-16 bg-gradient-to-br px-10 pt-5 from-white to-gray-100 overflow-hidden flex items-center justify-center">
			{isMobile && (
				<div className="absolute inset-0 z-0">
					<motion.div
						className="w-full h-full bg-gradient-to-r from-blue-200 to-purple-200 opacity-30"
						animate={{
							scale: [1, 1.1, 1],
							rotate: [0, 5, 0],
						}}
						transition={{
							duration: 20,
							repeat: Number.POSITIVE_INFINITY,
							repeatType: "reverse",
						}}
					/>
				</div>
			)}
			<div className="container mt-5 flex flex-col gap-5 md:flex-row items-center justify-between relative z-10">
				{!isMobile && (
					<div className="w-full md:w-3/5 mb-8 md:mb-0 px-5 ">
						<ImageCollage />
					</div>
				)}
				<motion.div
					className={`w-full md:w-2/5 text-center md:text-left z-10 ${
						isMobile ? "py-5" : ""
					}`}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
				>
					<h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r to-slate-500 from-neutral-800 bg-clip-text text-transparent">
						Your One-Stop Service Solution
					</h1>
					<p className="text-lg md:text-xl text-gray-700 mb-8">
						Find trusted professionals for any job, anytime,
						anywhere. Experience convenience like never before.
					</p>
					<Link href="/services">
						<motion.button
							className="px-8 py-3  bg-gradient-to-r to-slate-500 from-neutral-800 text-white rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							Book Now
						</motion.button>
					</Link>
				</motion.div>
			</div>
			{!isMobile && (
				<div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
			)}
		</section>
	);
}
