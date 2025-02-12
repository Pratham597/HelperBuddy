"use client";

import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area";
import Fuse from "fuse.js";

const options = {
	keys: ["name"], // Search based on 'name'
	threshold: 0.3, // Controls fuzziness (lower is stricter, higher is looser)
	distance: 100, // How far in the string Fuse.js will look for matches
};


const SearchBar = () => {
	const [query, setQuery] = useState("");
	const [allServices, setAllServices] = useState([]); // Store all services
	const [filteredResults, setFilteredResults] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [showDropdown, setShowDropdown] = useState(false);
	const dropdownRef = useRef(null);

	useEffect(() => {
		const fetchServices = async () => {
			try {
				const response = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/service`); // Fetch all services once
				const data = await response.json();
				setAllServices(data);
			} catch (error) {
				console.error("Error fetching services:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchServices();
	}, []);

	useEffect(() => {
		if (query.length > 0) {
			const fuse = new Fuse(allServices, options);
			const results = fuse.search(query).map((result) => result.item);

			setFilteredResults(results);
			setShowDropdown(results.length > 0);
		} else {
			setFilteredResults([]);
			setShowDropdown(false);
		}
	}, [query, allServices]);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target)
			) {
				setShowDropdown(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<div className="relative" ref={dropdownRef}>
			<div className="relative">
				<input
					type="text"
					placeholder="Search services..."
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					className="w-full px-10 py-2 border  text-black border-gray-300 rounded-3xl focus:outline-none focus:ring-2 focus:ring-black"
				/>
				<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
			</div>
			{showDropdown && (
				<div className="absolute z-10 w-full mt-2  text-black bg-white border border-gray-300 rounded-3xl shadow-lg max-h-60 ">
					<ScrollArea className="h-60 border border-gray-200 rounded-3xl p-2 ">
						{isLoading ? (
							<div className="p-4 text-center">Loading...</div>
						) : filteredResults.length > 0 ? (
							filteredResults.map((service) => (
								<div
									key={service._id}
									className="p-4 border-b border-gray-200 hover:bg-gray-100"
								>
									<div className="flex items-center space-x-4">
										<img
											src={
												service.image ||
												"/placeholder.svg"
											}
											alt={service.name}
											className="w-12 h-12 object-cover rounded-md"
										/>
										<div>
											<h3 className="font-semibold">
												{service.name}
											</h3>
											<p className="text-sm text-gray-600">
												Rs. {service.price.toFixed(2)}
											</p>
										</div>
									</div>
								</div>
							))
						) : (
							<div className="p-4 text-center">
								No results found
							</div>
						)}
					</ScrollArea>
				</div>
			)}
		</div>
	);
};

export default SearchBar;
