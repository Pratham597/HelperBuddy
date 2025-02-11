"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, Menu, Search, ShoppingCart, User, X } from "lucide-react";

const UserNavbar = () => {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [menuOpen, setMenuOpen] = useState(false);
	const [searchOpen, setSearchOpen] = useState(false);
	const [searchValue, setSearchValue] = useState("");
	const [cartCount, setCartCount] = useState(0); 

	useEffect(() => {
		if (typeof window !== "undefined") {
			const user = localStorage.getItem("user");
			if (user) {
				setIsLoggedIn(true);
			}
		}
	}, []);

	useEffect(() => {
		const updateCartCount = () => {
			if (typeof window !== "undefined") {
				const cart = JSON.parse(localStorage.getItem("cart")) || [];
				setCartCount(cart.length);
			}
		};

		updateCartCount(); 

		window.addEventListener("storage", updateCartCount);

		return () => {
			window.removeEventListener("storage", updateCartCount);
		};
	});

	return (
		<nav className="bg-black text-white p-4">
			<div className="container mx-auto flex justify-between items-center">
				<div className="flex items-center space-x-3">
					<img src="/logo.png" alt="logo" className="h-10" />
					<h1 className="hidden md:block text-xl font-bold">
						HelperBuddy
					</h1>
				</div>
				<div className="hidden md:flex w-1/3 relative">
					<Search
						className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white"
						size={20}
					/>
					<input
						type="text"
						placeholder="Search..."
						value={searchValue}
						onChange={(e) => setSearchValue(e.target.value)}
						className="w-full bg-black text-white p-2 pl-10 rounded focus:outline-none focus:ring-1 border-2 border-gray-500"
					/>
				</div>

				<div className="hidden md:flex items-center space-x-6">
					<Link href="/services">Services</Link>
					<Link href="/blogs">Blogs</Link>
					{isLoggedIn ? (
						<>
							<Link href="/user/cart" className="relative">
								<ShoppingCart />
								{cartCount > 0 && (
									<span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-[1.5] py-1 rounded-full">
										{cartCount}
									</span>
								)}
							</Link>
							<button>
								<Bell />
							</button>
							<Link href="/profile">
								<User />
							</Link>
						</>
					) : (
						<Link
							href="/user/login"
							className="px-4 py-2 border rounded-3xl"
						>
							Get Started
						</Link>
					)}
				</div>
				<div className="md:hidden flex items-center space-x-3">
					<button onClick={() => setSearchOpen(!searchOpen)}>
						<Search />
					</button>
					<button onClick={() => setMenuOpen(!menuOpen)}>
						{menuOpen ? <X /> : <Menu />}
					</button>
				</div>
			</div>

			{searchOpen && (
				<div className="md:hidden mt-2 px-4">
					<input
						type="text"
						placeholder="Search..."
						value={searchValue}
						onChange={(e) => setSearchValue(e.target.value)}
						className="w-full p-2 rounded bg-white text-black"
					/>
				</div>
			)}

			{menuOpen && (
				<div className="md:hidden flex flex-col mt-2 space-y-2 p-4 bg-gray-900">
					<Link href="/services">Services</Link>
					<Link href="/blogs">Blogs</Link>
					{isLoggedIn ? (
						<>
							<Link href="/user/cart" className="relative">
								Cart
								{cartCount > 0 && (
									<span className="ml-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
										{cartCount}
									</span>
								)}
							</Link>
							<button>Notifications</button>
							<Link href="/profile">Profile</Link>
						</>
					) : (
						<Link
							href="/user/login"
							className="px-4 py-2 border rounded"
						>
							Get Started
						</Link>
					)}
				</div>
			)}
		</nav>
	);
};

export default UserNavbar;
