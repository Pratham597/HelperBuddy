"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const images = [
	"https://cdn.zyrosite.com/cdn-cgi/image/format=auto,w=656,h=492,fit=crop/cdn-ecommerce/store_01JCYZKF09EKDA2HS3ZXYAX2G1%2Fassets%2F1734724269763-washing-machine-installation-services.webp",
	"https://cdn.zyrosite.com/cdn-cgi/image/format=auto,w=656,h=369,fit=crop,q=100/cdn-ecommerce/store_01JCYZKF09EKDA2HS3ZXYAX2G1%2Fassets%2F1734720389613-How_to_Deep-Clean_Removable_Couch_Cushions.webp",
	"https://cdn.zyrosite.com/cdn-cgi/image/format=auto,w=656,h=369,fit=crop,q=100/cdn-ecommerce/store_01JCYZKF09EKDA2HS3ZXYAX2G1%2Fassets%2F1734724488179-65ce57f83f48efe3c9ba6b20_AoIz5KCqLw88GZDa3lkcEH1mTa5tZEnYPaibiYi-Ur70UUVHzLg-y9b-8G67fZ53pov8cGxVNyCpImxyFoH5PpHbmabxUQaxbs4cYsPXXu9u00pIhjwzUhzdU-WyZC4jEp1J0WsA_djRYO47GeEjlXM.jpeg",
	"https://cdn.zyrosite.com/cdn-cgi/image/format=auto,w=656,h=369,fit=crop,q=100/cdn-ecommerce/store_01JCYZKF09EKDA2HS3ZXYAX2G1%2Fassets%2F1734725128994-refrigerator-repair-in-kolkata-quick2service-1-768x5121.webp",
];

export default function ImageCollage() {
	return (
		<div className="grid grid-cols-2 gap-5 p-5">
			{images.map((src, index) => (
				<motion.div
					key={src}
					className="relative overflow-hidden rounded-lg shadow-lg aspect-[4/3]"
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.4, delay: index * 0.1 }}
					whileHover={{ scale: 1.03 }}
				>
					<Image
						src={src || "/placeholder.svg"}
						alt={`Service ${index + 1}`}
						width={400}
						height={300}
						className="object-cover w-full h-full"
					/>
				</motion.div>
			))}
		</div>
	);
}
