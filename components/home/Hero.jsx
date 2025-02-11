"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function Hero() {
	const parallaxRef = useRef(null);

	useEffect(() => {
		const handleScroll = () => {
			if (parallaxRef.current) {
				const scrollPosition = window.scrollY;
				parallaxRef.current.style.transform = `translateY(${
					scrollPosition * 0.5
				}px)`;
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<section className="relative h-screen flex items-center justify-center overflow-hidden">
			<div
				ref={parallaxRef}
				className="absolute inset-0 z-0"
				style={{
					backgroundImage:
						'url("https://img.freepik.com/free-vector/background-blue-color-design-abstract_779267-1057.jpg")',
					backgroundSize: "cover",
					backgroundPosition: "center",
					filter: "grayscale(100%)",
				}}
			></div>
			<div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>
			<div className="relative z-20 text-center text-white px-4">
				<motion.h1
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					className="text-4xl md:text-6xl font-bold mb-4"
				>
					Find the Best Local Services at Your Fingertips!
				</motion.h1>
				<motion.p
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.2 }}
					className="text-xl md:text-2xl mb-8"
				>
					Book trusted professionals for any job, anytime, anywhere.
				</motion.p>
				<motion.button
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.4 }}
					className="bg-white text-black px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-200 hover:scale-105 transition-all duration-300"
				>
					Get Started
				</motion.button>
			</div>
		</section>
	);
}
