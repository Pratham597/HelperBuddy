"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import SearchBar from "./SearchBar"


const MobileMenu = ({ isOpen, isLoggedIn }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const pathname = usePathname()

	const isActive = (path) => pathname === path
	
	const [cartCount, setCartCount] = useState(0); 
		
		useEffect(() => {
				const updateCartCount = () => {
					if (typeof window !== "undefined") {
						const cart = JSON.parse(localStorage.getItem("cart")) || [];
						setCartCount(cart.length);
					}
				};
		
			updateCartCount(); 
			console.log(cartCount);
			
		
				window.addEventListener("storage", updateCartCount);
		
				return () => {
					window.removeEventListener("storage", updateCartCount);
				};
			});

  if (!isOpen) return null

  return (
		<div className="md:hidden">
			<div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
				{isSearchOpen ? (
					<SearchBar />
				) : (
					<button
						onClick={() => setIsSearchOpen(true)}
						className="w-full text-left text-slate-100 hover:text-gray-600 block px-3 py-2 rounded-md text-base font-medium"
					>
						<svg
							className="h-6 w-6 inline mr-2"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							/>
						</svg>
						Search
					</button>
				)}
				<Link
					href="/services"
					className={`text-slate-100 hover:text-gray-600 block px-3 py-2 rounded-md text-base font-medium ${
						isActive("/services")
							? "bg-gray-100 text-slate-950"
							: ""
					}`}
				>
					Services
				</Link>
				<Link
					href="/blogs"
					className={`text-slate-100 hover:text-gray-600 block px-3 py-2 rounded-md text-base font-medium ${
						isActive("/blogs") ? "bg-gray-100" : ""
					}`}
				>
					Blogs
				</Link>
				<Link
					href="/user/cart"
					className={`text-slate-100 hover:text-gray-600 block px-3 py-2 rounded-md text-base font-medium ${
						isActive("/cart") ? "bg-gray-100" : ""
					}`}
				>
					Cart
				</Link>
				{cartCount > 0 && (
					<span className="absolute top-52 right-5 bg-red-500 text-white cartNumber py-2 px-3 rounded-full">
						{cartCount}
					</span>
				)}
				{isLoggedIn ? (
					<>
						<Link
							href="/user/dashboard/notifications"
							className={`text-slate-100 hover:text-gray-600 block px-3 py-2 rounded-md text-base font-medium ${
								isActive("/notifications") ? "bg-gray-100" : ""
							}`}
						>
							Notifications
						</Link>
						<Link
							href="/user/dashboard"
							className={`text-slate-100 hover:text-gray-600 block px-3 py-2 rounded-md text-base font-medium ${
								isActive("/profile") ? "bg-gray-100" : ""
							}`}
						>
							Profile
						</Link>
					</>
				) : (
					<Link
						href="/user/login"
						className="w-full text-left bg-black text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-800"
					>
						Get Started
					</Link>
				)}
			</div>
		</div>
  );
}

export default MobileMenu

