"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Trophy, Clock1, Handshake } from "lucide-react";

export default function AboutSection(p) {
	return (
		<section className="py-12 mt-16 md:py-20 px-4 md:px-8 lg:px-16 bg-gradient-to-b from-white to-gray-100">
			<div className="max-w-6xl mx-auto">
				{/* About Content */}
				<div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
					{/* Image Section */}
					<motion.div
						initial={{ opacity: 0, x: -50 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8 }}
						className="w-full md:w-1/2 flex justify-center"
					>
						<div className="relative w-64 h-64 md:w-96 md:h-96 rounded-full overflow-hidden shadow-lg">
							<Image
								src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=656,h=651,fit=crop/AzGeNv8QxRTqXJan/img_20241225_095321_917-AMqlqLEqp3tk7qEe.webp"
								alt="Helper Buddy Logo"
								layout="fill"
								objectFit="cover"
								className="filter drop-shadow-xl"
							/>
							<div className="absolute inset-0 bg-blue-500 mix-blend-color-burn opacity-20 rounded-full"></div>
						</div>
					</motion.div>

					{/* Text Section */}
					<motion.div
						initial={{ opacity: 0, x: 50 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}
						className="w-full md:w-1/2 text-center md:text-left"
					>
						<h1 className="text-3xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
							About Helper Buddy
						</h1>
						<p className="text-base md:text-lg mb-4 text-gray-700">
							{p[0]}
						</p>
						<p className="text-base md:text-lg mb-4 text-gray-700">
							{p[1]}
						</p>
						<p className="text-base md:text-lg text-gray-700">
							{p[2]}
						</p>
					</motion.div>
				</div>

				{/* Values Section */}
				<motion.div
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.4 }}
					className="mt-12 md:mt-16"
				>
					<h2 className="text-2xl md:text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
						Our Values
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
						{/* Quality Card */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.1 }}
							className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
						>
							<div className="text-4xl mb-4 text-blue-600">
								<Trophy size={40} />
							</div>
							<h3 className="text-xl font-semibold mb-3 text-blue-600">
								Quality
							</h3>
							<p className="text-gray-700">
								We ensure top-notch service quality through
								rigorous vetting of our professionals.
							</p>
						</motion.div>

						{/* Reliability Card */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.2 }}
							className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
						>
							<div className="text-4xl mb-4 text-blue-600">
								<Clock1 size={40} />
							</div>
							<h3 className="text-xl font-semibold mb-3 text-blue-600">
								Reliability
							</h3>
							<p className="text-gray-700">
								Punctuality and dependability are at the core of
								our service promise.
							</p>
						</motion.div>

						{/* Customer-Centric Card */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5, delay: 0.3 }}
							className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
						>
							<div className="text-4xl mb-4 text-blue-600">
								<Handshake size={40} />
							</div>
							<h3 className="text-xl font-semibold mb-3 text-blue-600">
								Customer-Centric
							</h3>
							<p className="text-gray-700">
								Your satisfaction is our priority. We go the
								extra mile to exceed expectations.
							</p>
						</motion.div>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
