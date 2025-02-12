"use client";

import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import AnimatedCounter from "./AnimatedCounter";

const trustData = [
	{ title: "Trusted Service Partners", value: 150, icon: "🤝" },
	{ title: "Satisfied Customers", value: 1000, icon: "😊" },
	{ title: "Services Offered", value: 100, icon: "🛠️" },
	{ title: "Services Completed", value: 5000, icon: "✅" },
];

export default function TrustSection() {
	const [ref, isInView] = useInView({ threshold: 1 });

	return (
		<section ref={ref} className="md:py-16 px-4 bg-white">
			<div className="max-w-full mx-auto">
				<h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
					Why Choose Us?
				</h2>
				<div className="flex flex-wrap justify-center gap-8">
					{trustData.map((item, index) => (
						<motion.div
							key={item.title}
							initial={{ opacity: 0, y: 20 }}
							animate={isInView ? { opacity: 1, y: 0 } : {}}
							transition={{ duration: 0.5, delay: index * 0.1 }}
							className="border-teal-700 shadow-2xl  p-6 rounded-lg max-w-fit text-center w-full sm:w-1/2 md:w-1/4"
						>
							<div className="text-4xl mb-4">{item.icon}</div>
							<h3 className="text-xl font-semibold mb-2 text-gray-800">
								{item.title}
							</h3>
							<p className="text-3xl font-bold text-green-600">
								{isInView ? (
									<AnimatedCounter from={0} to={item.value} />
								) : (
									0
								)}
								{item.title === "Satisfied Customers" ||
								item.title === "Services Completed"
									? "+"
									: ""}
							</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
