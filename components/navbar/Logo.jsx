import Link from "next/link";
import Image from "next/image";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: "700" });

const Logo = () => {
	return (
		<Link href="/" className="flex items-center space-x-6">
			<Image
				src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=656,h=651,fit=crop/AzGeNv8QxRTqXJan/img_20241225_095321_917-AMqlqLEqp3tk7qEe.webp" // Ensure logo.png is in the "public" folder
				alt="HelperBuddy Logo"
				width={56} // Adjust based on your design
				height={56}
				priority // Loads the image faster
			/>
			<span
				className={`${inter.className}  xxs:block hidden font-bold text-2xl inter text-slate-100`}
			>
				HelperBuddy
			</span>
		</Link>
	);
};

export default Logo;
