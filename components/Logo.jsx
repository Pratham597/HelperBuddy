import Link from "next/link";
// font from next/font/google
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: "700" }); 


const Logo = () => {
	return (
		<Link href="/" className="flex items-center space-x-6">
			<img
				src="logo.png"
				alt=""
				className=" h-9
            "
			/>
			<span className={`${inter.className} font-bold text-2xl inter text-slate-100`}>
				HelperBuddy
			</span>
		</Link>
	);
};

export default Logo;
