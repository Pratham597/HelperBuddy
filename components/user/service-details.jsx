"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";

export default function ServiceDetails({ service, onAddToCart }) {
	const [pincode, setPincode] = useState("");
	const [availabilityMessage, setAvailabilityMessage] = useState(null);
	const [loading, setLoading] = useState(false);
	const [faqs, setFaqs] = useState([]); // State for FAQs
	const [faqLoading, setFaqLoading] = useState(true); // FAQ loading state

	useEffect(() => {
		const fetchFAQs = async () => {
			if (!service?._id) return;

			try {
				const res = await fetch(`/api/service/faq?service=${service._id}`);
				const data = await res.json();
				if (res.ok && data.success) {
					setFaqs(data.faq);
				} else {
					setFaqs([]);
				}
			} catch (error) {
				console.error("Error fetching FAQs:", error);
				setFaqs([]);
			} finally {
				setFaqLoading(false);
			}
		};

		fetchFAQs();
	}, [service?._id]);

	const checkAvailability = async () => {
		setLoading(true)
		try {
		  const res = await fetch(`/api/service/${service._id}/available?pincode=${pincode}`)
		  if (!res.ok) {
			toast.error("Please enter pincode")
		  }
	
		  const data = await res.json()
	
		  if (data.error) {
			setAvailabilityMessage(data.error)
		  } else {
			setAvailabilityMessage(data.available ? "Service available in this area" : "Service not available in this area")
		  }
		} catch (error) {
		  console.error(error)
		  setAvailabilityMessage("Error checking availability")
		} finally {
		  setLoading(false)
		}
	  }

	const addToCart = () => {
		if (!service) return;
		const cart = JSON.parse(localStorage.getItem("cart")) || [];
		cart.push({
			id: service._id,
			name: service.name,
			price: service.price,
			image: service.image,
		});
		localStorage.setItem("cart", JSON.stringify(cart));
		window.dispatchEvent(new Event("storage"));
		onAddToCart();
	};

	return (
		<Card className="w-full max-w-6xl shadow-lg flex flex-col md:flex-row overflow-hidden mx-auto relative">
			<div className="w-full md:w-2/5 bg-gray-100 flex items-center justify-center p-4 md:p-6">
				<img
					src={service.image || "/placeholder.svg"}
					alt={service.name}
					className="w-full h-auto max-h-[300px] md:max-h-full object-cover rounded-lg shadow-md"
				/>
			</div>

			<ScrollArea className="w-full md:w-3/5 h-[60vh] md:h-[80vh] p-4 md:p-6">
				<div className="flex justify-between items-start mb-4">
					<h2 className="text-xl md:text-2xl font-semibold text-black">
						{service.name}
					</h2>
				</div>

				<p className="text-gray-600 text-sm mb-4">
					{service.description}
				</p>
				<p className="text-lg font-semibold text-black mb-4">
					₹{service.price}
				</p>

				<Separator className="my-4 bg-gray-200" />

				<div className="mb-4">
					<label className="block text-sm font-medium text-gray-700 mb-1">
						Check Availability:
					</label>
					<div className="flex items-center">
						<Input
							type="text"
							value={pincode}
							onChange={(e) => setPincode(e.target.value)}
							placeholder="Enter Pincode"
							className="border-gray-300 text-sm flex-grow mx-2"
							maxLength={6}
						/>
						<Button
							variant="outline"
							onClick={checkAvailability}
							disabled={loading}
							className="ml-2 bg-black text-white text-sm whitespace-nowrap hover:bg-gray-300 hover:border-black hover:text-black"
						>
							{loading ? (
								<Loader2 className="animate-spin w-4 h-4 mr-2" />
							) : (
								"Check"
							)}
						</Button>
					</div>
					{availabilityMessage && (
						<p
							className={`mt-2 text-sm ${availabilityMessage.includes("not")
									? "text-red-600"
									: "text-green-600"
								}`}
						>
							{availabilityMessage}
						</p>
					)}
				</div>

				<Separator className="my-4 bg-gray-200" />

				{/* Dynamic FAQs Section */}
				<div className="mb-4">
					<h3 className="text-lg font-semibold text-black mb-2">
						FAQs
					</h3>
					<ScrollArea className="h-40 border border-gray-200 rounded-md p-3">
						{faqLoading ? (
							<p className="text-gray-600 text-sm">
								Loading FAQs...
							</p>
						) : faqs.length > 0 ? (
							<ul className="space-y-2 text-gray-600 text-sm">
								{faqs.map((faq, index) => (
									<li key={index}>
										<strong>Q:</strong> {faq.question}
										<br />
										<strong>A:</strong> {faq.answer}
									</li>
								))}
							</ul>
						) : (
							<p className="text-gray-600 text-sm">
								No FAQs available.
							</p>
						)}
					</ScrollArea>
				</div>
				<div className="mb-4">
					<h3 className="text-lg font-semibold text-black mb-2">Customer Feedback</h3>
					<ScrollArea className="h-40 border border-gray-200 rounded-md p-3">
						<div className="space-y-2">
							{service.reviews && service.reviews.length > 0 ? (
								service.reviews.map((review, index) => (
									<Card key={index} className="bg-gray-50 border border-gray-200 p-3 rounded">
										<p className="text-gray-600 text-sm">"{review.review}"</p>
										<p className="text-right text-gray-500 text-xs">- {review.customerName}</p>
									</Card>
								))
							) : (
								<>
									<Card className="bg-gray-50 border border-gray-200 p-3 rounded">
										<p className="text-gray-600 text-sm">"Amazing service! The team was professional and on time."</p>
										<p className="text-right text-gray-500 text-xs">- Rohan M.</p>
									</Card>
									<Card className="bg-gray-50 border border-gray-200 p-3 rounded">
										<p className="text-gray-600 text-sm">"Very affordable and efficient! Highly recommended."</p>
										<p className="text-right text-gray-500 text-xs">- Priya K.</p>
									</Card>
									<Card className="bg-gray-50 border border-gray-200 p-3 rounded">
										<p className="text-gray-600 text-sm">"Excellent service quality. Will definitely use again!"</p>
										<p className="text-right text-gray-500 text-xs">- Amit S.</p>
									</Card>
									<Card className="bg-gray-50 border border-gray-200 p-3 rounded">
										<p className="text-gray-600 text-sm">"Prompt and courteous. Exceeded my expectations."</p>
										<p className="text-right text-gray-500 text-xs">- Neha R.</p>
									</Card>
									<Card className="bg-gray-50 border border-gray-200 p-3 rounded">
										<p className="text-gray-600 text-sm">"Great value for money. Highly satisfied with the results."</p>
										<p className="text-right text-gray-500 text-xs">- Vikram P.</p>
									</Card>
								</>
							)}
						</div>
					</ScrollArea>
				</div>

				<Separator className="my-4 bg-gray-200" />

				<div className="mt-6 flex justify-center">
					<Button
						onClick={addToCart}
						className="bg-black text-white text-sm px-6 py-2 hover:bg-gray-800"
					>
						Add to Cart
					</Button>
				</div>
			</ScrollArea>
		</Card>
	);
}
