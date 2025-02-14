import Link from "next/link";
import Image from "next/image";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: "700" });

const Logo = () => {
	return (
		<Link href="/" className="flex items-center space-x-6">
			<Image
				src="/logo.png" // Ensure logo.png is in the "public" folder
				alt="HelperBuddy Logo"
				width={36} // Adjust based on your design
				height={36}
				priority // Loads the image faster
			/>
			<span
				className={`${inter.className} font-bold text-2xl inter text-slate-100`}
			>
				HelperBuddy
			</span>
		</Link>
	);
};

export default Logo;
