import Link from "next/link";

const Logo = () => {
	return (
		<Link href="/" className="flex items-center space-x-6">
            <img src="logo.png" alt="" className=" h-9
            " />
			<span className="font-bold text-xl font-mono  text-slate-100">HelperBuddy</span>
		</Link>
	);
};

export default Logo;
