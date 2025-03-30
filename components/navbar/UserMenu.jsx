"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react"; // Added import for React
import { useState, useEffect } from "react"; // Added import for useState and useEffect
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Added import for DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger

const UserMenu = ({ isLoggedIn }) => {
	const pathname = usePathname();
	const [cartCount, setCartCount] = useState(0);

	const isActive = (path) => pathname === path;

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
		<>
			<Link
				href="/services"
				className={`text-slate-100 hover:text-slate-400 px-3 py-2 text-lg font-medium ${
					isActive("/services") ? "border-b-2 border-slate-100" : ""
				}`}
			>
				Services
			</Link>
			<Link
				href="/blogs"
				className={`text-slate-100 hover:text-slate-400 px-3 py-2  text-lg font-medium ${
					isActive("/blogs") ? "border-b-2 border-slate-100" : ""
				}`}
			>
				Blogs
			</Link>
			<Link
				href="/about"
				className={`text-slate-100 hover:text-slate-400 px-3 py-2  text-lg font-medium ${
					isActive("/about") ? "border-b-2 border-slate-100" : ""
				}`}
			>
				About
			</Link>
			<Link
				href="/user/cart"
				className="text-slate-100 hover:text-slate-400 "
			>
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
						d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
					/>
				</svg>
			{cartCount > 0 && (
				<span className={`absolute top-4 ${isLoggedIn? "right-16" : "right-36"} bg-red-500 text-white cartNumber px-1 py-[.5] rounded-full`}>
					{cartCount}
				</span>
			)}
			</Link>
			{isLoggedIn ? (
				<>
					<Link
						href="/user/dashboard/profile/userInformation"
						className="text-slate-100 hover:text-slate-400"
					>
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
								d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
							/>
						</svg>
					</Link>
				</>
			) : (
				<div className="mr-4 bg-gray-800 p-2 rounded-md">
					<DropdownMenu className="">
						<DropdownMenuTrigger>Get Started</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuLabel>Continue as</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem>
								<Link href="/user/login">Customer</Link>
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
		</>
	);
};

export default UserMenu;
