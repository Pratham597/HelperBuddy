import React from "react";
import { Star, ChevronRight, CheckCircle, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Link from "next/link";

const HomePage = () => {
  
	const serviceCategories = [
		{ icon: "🛠️", name: "Home Repairs" },
		{ icon: "🏠", name: "Cleaning Services" },
		{ icon: "💆", name: "Beauty & Wellness" },
		{ icon: "🚗", name: "Car Services" },
		{ icon: "💼", name: "Freelance Work" },
		{ icon: "👨‍🍳", name: "Personal Chef" },
		{ icon: "🎨", name: "Interior Design" },
		{ icon: "🌿", name: "Landscaping" },
		{ icon: "📚", name: "Tutoring" },
	];

	const features = [
		{
			icon: <CheckCircle className="w-8 h-8" />,
			title: "Verified Professionals",
			description: "All service providers are thoroughly vetted",
		},
		{
			icon: <CheckCircle className="w-8 h-8" />,
			title: "Affordable Pricing",
			description: "Competitive rates for quality service",
		},
		{
			icon: <CheckCircle className="w-8 h-8" />,
			title: "Instant Booking",
			description: "Book services with just a few clicks",
		},
		{
			icon: <CheckCircle className="w-8 h-8" />,
			title: "Customer Reviews",
			description: "Make informed decisions with real feedback",
		},
	];

	const testimonials = [
		{
			name: "Sarah M.",
			rating: 5,
			text: "Exceptional service! Found a great house cleaner within minutes.",
		},
		{
			name: "James R.",
			rating: 5,
			text: "The platform is so easy to use. Highly recommended!",
		},
		{
			name: "Emily T.",
			rating: 5,
			text: "Professional service providers and great customer support.",
		},
	];

	return (
		<>
			<Navbar />
			<div className="min-h-screen bg-white">
				{/* Hero Section */}
				<div className="relative m-10 max-h-dvh rounded-sm h-screen flex items-center justify-center hero-section bg-gray-100">
					<div className="container mx-auto px-6 text-center">
						<h1 className="text-5xl md:text-6xl bg-opacity-50 font-bold mb-8 text-gray-900">
							Reliable, Fast & Affordable Services – Your Helper
							Buddy is Just a Click Away
						</h1>
						{/* <p className="text-xl md:text-2xl mb-12 text-gray-800">
							Connect with trusted professionals for all your
							service needs
						</p> */}
						<Link
							href="/services"
							className="bg-black text-white px-8 py-4 rounded-lg text-lg font-semibold transform transition hover:scale-105"
						>
							Browse Services
						</Link>
					</div>
				</div>

				{/* Service Categories Grid */}
				<section className="py-20 bg-white">
					<div className="container mx-auto px-6">
						<h2 className="text-4xl font-bold mb-12 text-center">
							Our Services
						</h2>
						<div className="grid grid-cols-2 md:grid-cols-3 gap-6">
							{serviceCategories.map((category, index) => (
								<div
									key={index}
									className="p-6 border border-gray-200 rounded-lg transition-shadow hover:shadow-lg cursor-pointer"
								>
									<div className="text-4xl mb-4">
										{category.icon}
									</div>
									<h3 className="text-xl font-semibold">
										{category.name}
									</h3>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* Featured Services Carousel */}
				<section className="py-20 bg-gray-50">
					<div className="container mx-auto px-6">
						<h2 className="text-4xl font-bold mb-12 text-center">
							Featured Services
						</h2>
						<div className="flex overflow-x-auto gap-6 pb-6">
							{[1, 2, 3, 4].map((item) => (
								<div
									key={item}
									className="flex-none w-72 bg-white p-6 rounded-lg shadow-md"
								>
									<div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
									<div className="flex items-center mb-2">
										<Star className="w-5 h-5 text-black" />
										<span className="ml-2">
											4.8 (120 reviews)
										</span>
									</div>
									<p className="font-bold">
										Starting from $25/hr
									</p>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* Why Choose Helper Buddy */}
				<section className="py-20 bg-white">
					<div className="container mx-auto px-6">
						<h2 className="text-4xl font-bold mb-12 text-center">
							Why Choose Helper Buddy?
						</h2>
						<div className="grid md:grid-cols-4 gap-8">
							{features.map((feature, index) => (
								<div key={index} className="text-center">
									<div className="flex justify-center mb-4">
										{feature.icon}
									</div>
									<h3 className="text-xl font-semibold mb-2">
										{feature.title}
									</h3>
									<p className="text-gray-600">
										{feature.description}
									</p>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* Testimonials */}
				<section className="py-20 bg-gray-50">
					<div className="container mx-auto px-6">
						<h2 className="text-4xl font-bold mb-12 text-center">
							What Our Users Say
						</h2>
						<div className="grid md:grid-cols-3 gap-8">
							{testimonials.map((testimonial, index) => (
								<div
									key={index}
									className="bg-white p-6 rounded-lg shadow-md"
								>
									<div className="flex items-center mb-4">
										<div className="w-12 h-12 bg-gray-200 rounded-full"></div>
										<div className="ml-4">
											<h4 className="font-semibold">
												{testimonial.name}
											</h4>
											<div className="flex">
												{Array(testimonial.rating)
													.fill()
													.map((_, i) => (
														<Star
															key={i}
															className="w-4 h-4 text-black"
														/>
													))}
											</div>
										</div>
									</div>
									<p className="italic text-gray-600">
										{testimonial.text}
									</p>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* CTA Section */}
				<section className="py-20 bg-black text-white">
					<div className="container mx-auto px-6 text-center">
						<h2 className="text-4xl font-bold mb-8">
							Book Your First Service Now!
						</h2>
						<Link
							href="/services"
							className="bg-white text-black px-8 py-4 rounded-lg text-lg font-semibold transform transition hover:scale-105"
						>
							Get Started
						</Link>
					</div>
				</section>

				{/* Footer */}
				<footer className="bg-gray-900 text-white py-12">
					<div className="container mx-auto px-6">
						<div className="grid md:grid-cols-2 gap-8">
							<div>
								<h3 className="text-xl font-semibold mb-4">
									Quick Links
								</h3>
								<div className="grid grid-cols-2 gap-4">
									<a href="#" className="hover:underline">
										Services
									</a>
									<a href="#" className="hover:underline">
										About
									</a>
									<a href="#" className="hover:underline">
										Contact
									</a>
									<a href="#" className="hover:underline">
										Blog
									</a>
								</div>
							</div>
							<div className="text-right">
								<h3 className="text-xl font-semibold mb-4">
									Follow Us
								</h3>
								<div className="flex justify-end gap-4">
									{[
										"Twitter",
										"Facebook",
										"Instagram",
										"LinkedIn",
									].map((social, index) => (
										<a
											key={index}
											href="#"
											className="hover:opacity-75"
										>
											<div className="w-8 h-8 bg-white bg-opacity-20 rounded-full"></div>
										</a>
									))}
								</div>
							</div>
						</div>
						<div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
							© 2025 Helper Buddy. All rights reserved.
						</div>
					</div>
				</footer>
			</div>
		</>
	);
};

export default HomePage;
