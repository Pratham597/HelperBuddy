"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useEffect } from "react";
import Image from "next/image";
import { marked } from "marked";

export default function BlogPost({ blog }) {

	const ref = useRef(null);
	const contentRef = useRef(null);

	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ["start start", "end start"],
	});

	const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

	// Parallax effect for text sections
	const { scrollYProgress: contentProgress } = useScroll({
		target: contentRef,
		offset: ["start end", "end start"],
	});

	const contentY = useTransform(contentProgress, [0, 1], ["50px", "-50px"]);
	const opacity = useTransform(contentProgress, [0, 0.2, 1], [0, 1, 1]);

	useEffect(() => {
		const dropCaps = document.querySelectorAll(
			".blog-content > p:first-of-type::first-letter"
		);
		dropCaps.forEach((cap) => {
			if (cap instanceof HTMLElement) {
				cap.style.cssFloat = "left";
				cap.style.fontSize = "5.5rem";
				cap.style.lineHeight = "0.8";
				cap.style.padding = "0.2em 0.1em 0 0";
				cap.style.color = "#374151";
				cap.style.fontFamily = "Playfair Display, serif";
				cap.style.fontWeight = "700";
				cap.style.textShadow = "2px 2px 4px rgba(0,0,0,0.1)";
			}
		});
	}, []);

	return (
		<article ref={ref} className="relative bg-white min-h-screen">
			{/* Hero Section with Gradient Overlay */}
			<div className="relative h-[50vh] md:h-[60vh]  overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/30 z-10" />
				<motion.div
					style={{
						scale: useTransform(scrollYProgress, [0, 1], [1.1, 1]),
					}}
					className="absolute inset-0"
				>
					<Image
						src={blog.image || "/placeholder.svg"}
						alt={blog.title}
						layout="fill"
						objectFit="cover"
						className="filter brightness-95"
						priority
					/>
				</motion.div>

				{/* Title Overlay with Enhanced Animation */}
				<div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 1.2, ease: "easeOut" }}
						className="text-center max-w-5xl mx-auto"
					>
						<h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold mb-8 text-white leading-tight tracking-tight">
							{blog.title}
						</h1>
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.7 }}
							className="flex items-center justify-center space-x-6 text-white/90"
						>
							<span className="text-xl md:text-2xl font-light">
								{blog.author.name}
							</span>
							<span className="w-2 h-2 rounded-full bg-white/70" />
							<span className="text-xl md:text-2xl font-light">
								{blog.createdAt.split("T")[0]}
							</span>
						</motion.div>
					</motion.div>
				</div>
			</div>

			{/* Content Section with Full-width Layout */}
			<div className="max-w-full mx-auto  py-8" ref={contentRef}>
				<motion.div
					style={{ y: contentY, opacity }}
					className="grid grid-cols-1 gap-12"
				>
					{/* Main Content with Enhanced Typography */}
					<div className="blog-content prose prose-xl md:prose-2xl px-5 mx-auto w-full max-w-4xl">
						<div
							dangerouslySetInnerHTML={{
								__html: marked.parse(blog.content),
							}}
							className="prose-headings:font-sans prose-h1:text-5xl prose-headings:font-bold prose-headings:tracking-tight
                         prose-p:leading-relaxed prose-p:text-gray-800 prose-p:text-justify
                         prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                         prose-strong:text-gray-900 prose-strong:font-semibold
                         prose-blockquote:border-l-4 prose-blockquote:border-gray-300
                         prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-xl
                         prose-blockquote:text-gray-700 prose-blockquote:font-sans
                         prose-img:rounded-lg prose-img:shadow-xl prose-img:mx-auto
                         prose-h2:text-4xl prose-h3:text-3xl
                         prose-pre:bg-gray-50 prose-pre:shadow-inner prose-pre:rounded-xl
                         [&>p:first-of-type]:text-xl [&>p:first-of-type]:leading-relaxed
                         [&>p:first-of-type]:text-gray-700 [&>p:first-of-type]:font-sans"
						/>
					</div>
				</motion.div>
			</div>

			{/* Floating Share Button */}
			<motion.div
				initial={{ opacity: 0, x: 100 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ delay: 1 }}
				className="fixed right-8 bottom-8 z-40"
			></motion.div>
		</article>
	);
}
