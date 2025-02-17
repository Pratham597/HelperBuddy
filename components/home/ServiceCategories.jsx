"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
	Sparkles,
	Zap,
	Hammer,
	Flame,
	Plug,
	Rss,
	Tool,
	Snowflake,
	Sofa,
	Waves,
	Droplet,
} from "lucide-react";
import Link from "next/link";

const categories = [
	{
		name: "AC Service",
		icon: Snowflake,
		bgImage:
			"https://cdn.zyrosite.com/cdn-cgi/image/format=auto,w=328,h=184,fit=crop,q=100/cdn-ecommerce/store_01JCYZKF09EKDA2HS3ZXYAX2G1%2Fassets%2F1734724456891-Untitled-design-24-1024x683.webp",
	},
	{
		name: "Bathroom and Kitchen Cleaning",
		icon: Sparkles,
		bgImage:
			"https://cdn.zyrosite.com/cdn-cgi/image/format=auto,w=328,h=184,fit=crop,q=100/cdn-ecommerce/store_01JCYZKF09EKDA2HS3ZXYAX2G1%2Fassets%2F1734723078544-store_01JCYZKF09EKDA2HS3ZXYAX2G1_assets_1733056060044-1000s.webp",
	},
	{
		name: "Carpenter",
		icon: Hammer,
		bgImage:
			"https://cdn.zyrosite.com/cdn-cgi/image/format=auto,w=328,h=184,fit=crop,q=100/cdn-ecommerce/store_01JCYZKF09EKDA2HS3ZXYAX2G1%2Fassets%2F1734718706127-d9R1UAvoDD.webp",
	},
	{
		name: "Plumbing",
		icon: Droplet,
		bgImage:
			"https://cdn.zyrosite.com/cdn-cgi/image/format=auto,w=328,h=184,fit=crop,q=100/cdn-ecommerce/store_01JCYZKF09EKDA2HS3ZXYAX2G1%2Fassets%2F1734719258828-how-to-change-.webp",
	},
	{
		name: "Electrician",
		icon: Zap,
		bgImage:
			"https://cdn.zyrosite.com/cdn-cgi/image/format=auto,w=328,h=184,fit=crop,q=100/cdn-ecommerce/store_01JCYZKF09EKDA2HS3ZXYAX2G1%2Fassets%2F1734717748083-545e2c_cbba41d9d4824a2db1bcaafae19e7267mv2.webp",
	},
	{
		name: "Refrigerator Repair",
		icon: Snowflake,
		bgImage:
			"https://cdn.zyrosite.com/cdn-cgi/image/format=auto,w=328,h=184,fit=crop,q=100/cdn-ecommerce/store_01JCYZKF09EKDA2HS3ZXYAX2G1%2Fassets%2F1734723764015-ezgif.com-gif-maker-4.webp",
	},
	{
		name: "Sofa and Carpet Cleaning",
		icon: Sofa,
		bgImage:
			"https://cdn.zyrosite.com/cdn-cgi/image/format=auto,w=328,h=184,fit=crop,q=100/cdn-ecommerce/store_01JCYZKF09EKDA2HS3ZXYAX2G1%2Fassets%2F1734721650441-bhg-how-to-clean-couch-cushions-7095970-hero-3x2-0117_1ZngdVVW4PxAArdBHBojUT-5de66a661071480d9b40b4782dcbea76.webp",
	},
	{
		name: "Washing Machine Repair",
		icon: Waves,
		bgImage:
			"https://cdn.zyrosite.com/cdn-cgi/image/format=auto,w=328,h=184,fit=crop,q=100/cdn-ecommerce/store_01JCYZKF09EKDA2HS3ZXYAX2G1%2Fassets%2F1734719510714-Washing-machine-repair-costs-explained-Featured-image-scaled1.webp",
	},
];

export default function ServiceCategories() {
	const router = useRouter();
	return (
		<section className="py-16 px-4 bg-gray-50 ">
			<div className="max-w-6xl mx-auto">
				<h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-gray-800 to-slate-700 bg-clip-text text-transparent">
					Our Services
				</h2>
				<Link href="/services">
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
						{categories.map((category, index) => {
							const IconComponent = category.icon;

							return (
								<motion.div
									key={category.name}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{
										duration: 0.5,
										delay: index * 0.1,
									}}
									className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
								>
									{/* Background Image */}
									<div
										className="absolute inset-0 bg-cover bg-center transition-all duration-300 group-hover:brightness-110"
										style={{
											backgroundImage: `url(${category.bgImage})`,
										}}
									></div>

									{/* Dark Overlay for Better Readability */}
									<div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-20 transition-all duration-300"></div>

									{/* Icon & Text */}
									<div className="relative p-6 flex flex-col items-center justify-center h-full">
										<motion.div
											whileHover={{
												scale: 1.2,
												rotate: 360,
											}}
											transition={{
												type: "spring",
												stiffness: 260,
												damping: 20,
											}}
											className="text-white mb-4"
										>
											<IconComponent size={48} />
										</motion.div>
										<h3 className="text-lg font-semibold text-white text-center group-hover:scale-110 transition-all duration-300">
											{category.name}
										</h3>
									</div>
								</motion.div>
							);
						})}
					</div>
				</Link>
			</div>
		</section>
	);
}
