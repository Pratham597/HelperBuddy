"use client";
import Link from "next/link";
import { useState } from "react";

export default function Footer() {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setMessage("");

		// check if email is valid or not
		if (!/\S+@\S+\.\S+/.test(email)) {
			setMessage("Email is invalid.");
			setLoading(false);
			return;
		}

		try {
			const res = await fetch("/api/newsletter", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email }),
			});

			const data = await res.json();
			if (res.ok) {
				setMessage(data.message);
				setEmail("");
			} else {
				setMessage(data.error);
			}
		} catch (error) {
			setMessage("Network error. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<footer className="bg-black text-white pt-10 pb-5 px-6">
			<div className="max-w-6xl mx-auto flex flex-wrap justify-between gap-8 text-sm">
				{/* Company*/}
				<div className="w-full md:w-auto">
					<h3 className="text-lg font-semibold mb-3">Company</h3>
					<ul className="space-y-2">
						<li>
							<Link
								href="/about"
								className="hover:text-gray-300 transition"
							>
								About Us
							</Link>
						</li>
						<li>
							<Link
								href="/terms"
								className="hover:text-gray-300 transition"
							>
								Terms & Conditions
							</Link>
						</li>
						<li>
							<Link
								href="/policies"
								className="hover:text-gray-300 transition"
							>
								Privacy Policy
							</Link>
						</li>
					</ul>
				</div>

				{/* User */}
				<div className="w-full md:w-auto">
					<h3 className="text-lg font-semibold mb-3">For Users</h3>
					<ul className="space-y-2">
						<li>
							<Link
								href="/services"
								className="hover:text-gray-300 transition"
							>
								Services
							</Link>
						</li>
						<li>
							<Link
								href="blogs"
								className="hover:text-gray-300 transition"
							>
								Blog
							</Link>
						</li>
						<li>
							<Link
								href="about"
								className="hover:text-gray-300 transition"
							>
								Contact Us
							</Link>
						</li>
					</ul>
				</div>

				{/* Partners*/}
				<div className="w-full md:w-auto">
					<h3 className="text-lg font-semibold mb-3">For Partners</h3>
					<ul className="space-y-2">
						<li>
							<Link
								href="/partner/login"
								className="hover:text-gray-300 transition"
							>
								Register as a Partner
							</Link>
						</li>
					</ul>
				</div>

				{/* Social Links (Moved Here) */}
				<div className="w-full md:w-auto">
					<h3 className="text-lg font-semibold mb-3">Follow Us</h3>
					<div className="flex space-x-5">
						{/* Facebook */}
						<Link
							href="https://www.facebook.com/profile.php?id=61566410515044"
							target="_blank"
							className="text-gray-400 hover:text-white transition"
						>
							<svg
								className="w-6 h-6"
								fill="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									fillRule="evenodd"
									d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
									clipRule="evenodd"
								/>
							</svg>
						</Link>
						{/* Instagram */}
						<Link
							href="https://www.instagram.com/helperbuddy.in"
							target="_blank"
							className="text-gray-400 hover:text-white transition"
						>
							<svg
								className="w-6 h-6"
								fill="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									fillRule="evenodd"
									d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
									clipRule="evenodd"
								/>
							</svg>
						</Link>

						{/* LinkedIn */}
						<Link
							href="https://www.linkedin.com/company/helperbuddy"
							target="_blank"
							className="text-gray-400 hover:text-white transition"
						>
							<svg
								fill="currentColor"
								className="w-5 h-5"
								viewBox="0 0 310 310"
							>
								<path
									id="XMLID_802_"
									d="M72.16,99.73H9.927c-2.762,0-5,2.239-5,5v199.928c0,2.762,2.238,5,5,5H72.16c2.762,0,5-2.238,5-5V104.73
		C77.16,101.969,74.922,99.73,72.16,99.73z"
								/>
								<path
									id="XMLID_803_"
									d="M41.066,0.341C18.422,0.341,0,18.743,0,41.362C0,63.991,18.422,82.4,41.066,82.4
		c22.626,0,41.033-18.41,41.033-41.038C82.1,18.743,63.692,0.341,41.066,0.341z"
								/>
								<path
									id="XMLID_804_"
									d="M230.454,94.761c-24.995,0-43.472,10.745-54.679,22.954V104.73c0-2.761-2.238-5-5-5h-59.599
		c-2.762,0-5,2.239-5,5v199.928c0,2.762,2.238,5,5,5h62.097c2.762,0,5-2.238,5-5v-98.918c0-33.333,9.054-46.319,32.29-46.319
		c25.306,0,27.317,20.818,27.317,48.034v97.204c0,2.762,2.238,5,5,5H305c2.762,0,5-2.238,5-5V194.995
		C310,145.43,300.549,94.761,230.454,94.761z"
								/>
							</svg>
						</Link>

						{/* twitter */}
						<Link
							target="_blank"
							href="https://twitter.com/helperbuddyin"
							className="text-gray-400 hover:text-white transition"
						>
							<svg
								className="w-6 h-6"
								fill="currentColor"
								viewBox="0 0 50 50"
							>
								<path d="M 5.9199219 6 L 20.582031 27.375 L 6.2304688 44 L 9.4101562 44 L 21.986328 29.421875 L 31.986328 44 L 44 44 L 28.681641 21.669922 L 42.199219 6 L 39.029297 6 L 27.275391 19.617188 L 17.933594 6 L 5.9199219 6 z M 9.7167969 8 L 16.880859 8 L 40.203125 42 L 33.039062 42 L 9.7167969 8 z"></path>
							</svg>
						</Link>
					</div>
				</div>

				{/* Newsletter */}
				<div className="w-full md:w-1/4">
					<h3 className="text-lg font-semibold mb-3">Stay Updated</h3>
					<p className="text-gray-400 mb-3">
						Subscribe to our newsletter for the latest updates and
						offers.
					</p>
					<div className="flex">
						<input
							type="email"
							placeholder="Enter your email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="px-3 py-2 w-full rounded-l-md bg-gray-800 text-white outline-none"
						/>
						<button
							className="px-4 py-2 bg-blue-600 hover:bg-blue-500 transition rounded-r-md"
							onClick={handleSubmit}
							disabled={loading}
						>
							{loading ? "Subscribing..." : "Subscribe"}
						</button>
					</div>
					{message && <p className="text-sm">{message}</p>}
				</div>
			</div>

			{/* Copyright */}
			<div className="mt-6 text-center text-xs text-gray-400">
				<p>© 2025 Helper Buddy. All rights reserved.</p>
			</div>
		</footer>
	);
}
