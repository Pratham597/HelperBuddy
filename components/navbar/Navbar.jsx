"use client";

import { useState, useEffect } from "react";
import Logo from "./Logo.jsx";
import SearchBar from "./SearchBar.jsx";
import UserMenu from "./UserMenu.jsx";
import MobileMenu from "./MobileMenu.jsx";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

const Navbar = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
		<>
			<div className="fixed w-full top-0 z-50">
				<nav
					className={" bg-black text-white shadow-md "
						//  isMobileMenuOpen ? "rounded-3xl" : "rounded-full" m-2
						}
				>
					<div className=" mx-auto px-4 sm:px-6 lg:px-8  ">
						<div className="flex justify-between items-center w-auto h-[4.5rem]">
							<div className="flex items-center">
								<Logo />
							</div>
							<div className="hidden lg:block flex-1 mx-4 max-w-md ">
								<SearchBar />
							</div>
							<div className="hidden lg:flex items-center space-x-5">
								<UserMenu isLoggedIn={isLoggedIn} />
							</div>

							<div className="lg:hidden flex items-center">
								{!isLoggedIn && (
									<div className=" lg:hidden mr-4 bg-gray-900 p-2 rounded-md">
										<DropdownMenu className="">
											<DropdownMenuTrigger>
												{" "}
												Get Started
											</DropdownMenuTrigger>
											<DropdownMenuContent>
												<DropdownMenuLabel>
													Continue as
												</DropdownMenuLabel>
												<DropdownMenuSeparator />
												<DropdownMenuItem>
													<Link href="/user/login">
														Customer
													</Link>
												</DropdownMenuItem>
												<DropdownMenuItem>
													<Link href="/partner/login">
														Service Partner
													</Link>
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
								)}
								<button
									onClick={() =>
										setIsMobileMenuOpen(!isMobileMenuOpen)
									}
									className="text-slate-100 hover:text-gray-600 "
								>
									<span className="sr-only">
										Open main menu
									</span>
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
					<MobileMenu
						isOpen={isMobileMenuOpen}
						isLoggedIn={isLoggedIn}
					/>
				</nav>
			</div>
		</>
	);
};

export default Navbar;
