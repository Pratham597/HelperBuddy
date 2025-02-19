"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import toast from "react-hot-toast";
import axios from "axios";

export default function ContactSection() {
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		message: "",
	});

	const handleChange = (e
	) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({ ...prevData, [name]: value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const { firstName, lastName, email, message } = formData;
		
		async function sendComplaint() {
			try {
				const { data } = await axios.post("/api/user/complaint", {
					firstName,
					lastName,
					email,
					message,
				});
				toast.success("Submitted successfully");
				setFormData({ firstName: "", lastName: "", email: "", message: "" });
			} catch (error) {
				// console.log(error);
				toast.error("Something went wrong");
			}
		}
		sendComplaint();
	};

	return (
		<section className="py-20 px-4 md:px-8 lg:px-16 bg-gradient-to-b from-gray-100 to-white">
			<div className="max-w-6xl mx-auto">
				<h2 className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
					Contact Us
				</h2>
				<div className="flex flex-col md:flex-row gap-12">
					<motion.div
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8 }}
						className="w-full md:w-1/2"
					>
						<form onSubmit={handleSubmit} className="space-y-6">
							<div className="flex gap-4">
								<div className="w-1/2">
									<label
										htmlFor="firstName"
										className="block mb-2 font-semibold text-gray-700"
									>
										First Name
									</label>
									<input
										type="text"
										id="firstName"
										name="firstName"
										value={formData.firstName}
										onChange={handleChange}
										required
										className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
									/>
								</div>
								<div className="w-1/2">
									<label
										htmlFor="lastName"
										className="block mb-2 font-semibold text-gray-700"
									>
										Last Name
									</label>
									<input
										type="text"
										id="lastName"
										name="lastName"
										value={formData.lastName}
										onChange={handleChange}
										className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
									/>
								</div>
							</div>
							<div>
								<label
									htmlFor="email"
									className="block mb-2 font-semibold text-gray-700"
								>
									Email
								</label>
								<input
									type="email"
									id="email"
									name="email"
									value={formData.email}
									onChange={handleChange}
									required
									className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
								/>
							</div>
							<div>
								<label
									htmlFor="message"
									className="block mb-2 font-semibold text-gray-700"
								>
									Message
								</label>
								<textarea
									id="message"
									name="message"
									value={formData.message}
									onChange={handleChange}
									required
									rows={5}
									className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
								></textarea>
							</div>
							<motion.button
								type="submit"
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-md font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
							>
								Send Message
							</motion.button>
						</form>
					</motion.div>
					<motion.div
						initial={{ opacity: 0, y: 50 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.2 }}
						className="w-full md:w-1/2"
					>
						<div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
							<h3 className="text-2xl font-bold mb-6 text-blue-600">
								Get in Touch
							</h3>
							<div className="space-y-4">
                                    <Link
                                        href={
                                            "https://www.google.com/maps/search/Amroli+Cross+Rd,+near+Santosh+Electronics,+Bhagu+Nagar-1,+Amroli,+Surat,+Gujarat+394107/@21.239819,72.85002,13z/data=!5m1!1e4?hl=en-US&entry=ttu&g_ep=EgoyMDI1MDIxMi4wIKXMDSoASAFQAw%3D%3D"
                                        }
                                        target="_blank"
                                    >
								<p className="flex items-center text-gray-700">
									<svg
										className="w-6 h-6 mr-4 text-blue-500"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
										></path>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
										></path>
									</svg>
										Amroli Cross Rd, near Santosh
										Electronics,Bhagu Nagar-1, Amroli,
										Surat, Gujarat 394107
								</p>
									</Link>
								<p className="flex items-center text-gray-700">
									<svg
										className="w-6 h-6 mr-4 text-blue-500"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
										></path>
									</svg>
									+91 63593 98479
								</p>
								<p className="flex items-center text-gray-700">
									<svg
										className="w-6 h-6 mr-4 text-blue-500"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
										></path>
									</svg>
									hello@helperbuddy.in
								</p>
							</div>
							<div className="mt-8">
								<h4 className="text-xl font-semibold mb-4 text-blue-600">
									Business Hours
								</h4>
								<ul className="space-y-2 text-gray-700">
									<li>Monday - Friday: 9:00 AM - 6:00 PM</li>
									<li>Saturday: 10:00 AM - 4:00 PM</li>
									<li>Sunday: Closed</li>
								</ul>
							</div>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
