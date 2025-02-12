"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";
import MobileMenu from "./MobileMenu";

const Navbar = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const pathname = usePathname();

	// Simulating a login check
	useEffect(() => {
		// Replace this with your actual authentication check
		const checkLoginStatus = () => {
			const user = localStorage.getItem("user");
			setIsLoggedIn(!!user);
		};

		checkLoginStatus();
	});

	return (
		<nav className="sticky top-2 z-50 bg-slate-950 text-white shadow-md md:rounded-full rounded-xl m-2"> 
			<div className=" mx-auto px-4 sm:px-6 lg:px-8  ">
				<div className="flex justify-between items-center h-[4.5rem]">
					<div className="flex items-center">
						<Logo />
					</div>
					<div className="hidden md:block flex-1 mx-4 max-w-md ">
						<SearchBar />
					</div>
					<div className="hidden md:flex items-center space-x-5">
						<UserMenu isLoggedIn={isLoggedIn} />
					</div>
					<div className="md:hidden flex items-center">
						<button
							onClick={() =>
								setIsMobileMenuOpen(!isMobileMenuOpen)
							}
							className="text-slate-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-black"
						>
							<span className="sr-only">Open main menu</span>
							{isMobileMenuOpen ? (
								<svg
									className="h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							) : (
								<svg
									className="h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M4 6h16M4 12h16M4 18h16"
									/>
								</svg>
							)}
						</button>
					</div>
				</div>
			</div>
			<MobileMenu isOpen={isMobileMenuOpen} isLoggedIn={isLoggedIn} />
		</nav>
	);
};

export default Navbar;
