// pages/privacy-policy.js
"use client";
import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/home/Footer";

export default function PrivacyPolicy() {
	const [showBackToTop, setShowBackToTop] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 300) {
				setShowBackToTop(true);
			} else {
				setShowBackToTop(false);
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	return (
        <>
			<Navbar />
			<div className="mt-14"></div>
			<Head>
				<title>Privacy Policy | Your Company</title>
				<meta
					name="description"
					content="Privacy policy outlining how we collect, use, and protect your data"
				/>
			</Head>

			<main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold text-gray-900 mb-4 relative inline-block">
						Privacy Policy
						<span className="absolute w-1/2 h-1 bg-gradient-to-r from-indigo-600 to-transparent bottom-0 left-1/4"></span>
					</h1>
					<p className="text-lg text-gray-600 max-w-2xl mx-auto">
						This policy outlines how we collect, use, and protect
						your personal information.
					</p>
				</div>

				<p className="text-center italic text-gray-500 mb-12">
					Last Updated: March 30, 2025
				</p>

				<div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
					{/* Table of Contents - Sticky Sidebar */}
					<div className="lg:col-span-1">
						<div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
							<h3 className="text-xl mt-8 font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200 relative">
								Table of Contents
								<span className="absolute bottom-0 left-0 w-10 h-1 bg-indigo-600"></span>
							</h3>
							<ul className="space-y-3">
								<li>
									<a
										href="#introduction"
										className="text-gray-700 hover:text-indigo-600 hover:pl-1 transition-all duration-200 block"
									>
										1. Introduction
									</a>
								</li>
								<li>
									<a
										href="#information"
										className="text-gray-700 hover:text-indigo-600 hover:pl-1 transition-all duration-200 block"
									>
										2. Information We Collect
									</a>
								</li>
								<li>
									<a
										href="#usage"
										className="text-gray-700 hover:text-indigo-600 hover:pl-1 transition-all duration-200 block"
									>
										3. How We Use Information
									</a>
								</li>
								<li>
									<a
										href="#sharing"
										className="text-gray-700 hover:text-indigo-600 hover:pl-1 transition-all duration-200 block"
									>
										4. Information Sharing
									</a>
								</li>
								<li>
									<a
										href="#cookies"
										className="text-gray-700 hover:text-indigo-600 hover:pl-1 transition-all duration-200 block"
									>
										5. Cookies & Technologies
									</a>
								</li>
								<li>
									<a
										href="#security"
										className="text-gray-700 hover:text-indigo-600 hover:pl-1 transition-all duration-200 block"
									>
										6. Data Security
									</a>
								</li>
								<li>
									<a
										href="#retention"
										className="text-gray-700 hover:text-indigo-600 hover:pl-1 transition-all duration-200 block"
									>
										7. Data Retention
									</a>
								</li>
								<li>
									<a
										href="#rights"
										className="text-gray-700 hover:text-indigo-600 hover:pl-1 transition-all duration-200 block"
									>
										8. Your Rights
									</a>
								</li>
								<li>
									<a
										href="#children"
										className="text-gray-700 hover:text-indigo-600 hover:pl-1 transition-all duration-200 block"
									>
										9. Children's Privacy
									</a>
								</li>
								<li>
									<a
										href="#international"
										className="text-gray-700 hover:text-indigo-600 hover:pl-1 transition-all duration-200 block"
									>
										10. International Transfers
									</a>
								</li>
								<li>
									<a
										href="#changes"
										className="text-gray-700 hover:text-indigo-600 hover:pl-1 transition-all duration-200 block"
									>
										11. Changes to Policy
									</a>
								</li>
								<li>
									<a
										href="#contact"
										className="text-gray-700 hover:text-indigo-600 hover:pl-1 transition-all duration-200 block"
									>
										12. Contact Us
									</a>
								</li>
							</ul>
						</div>
					</div>

					{/* Main Content */}
					<div className="lg:col-span-3 space-y-6">
						<section
							id="introduction"
							className="bg-white rounded-lg shadow-md p-8 relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
						>
							<div className="absolute left-0 top-0 w-1.5 h-full bg-indigo-600"></div>
							<h2 className="flex items-center text-2xl font-bold text-gray-900 mb-4">
								<span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white text-sm mr-3">
									1
								</span>
								Introduction
							</h2>
							<p className="text-gray-700 mb-4">
								Welcome to Your Company's Privacy Policy. At
								Your Company ("we," "us," or "our"), we respect
								your privacy and are committed to protecting
								your personal data. This privacy policy will
								inform you about how we look after your personal
								data when you visit our website and tell you
								about your privacy rights and how the law
								protects you.
							</p>
							<p className="text-gray-700">
								This privacy policy applies to all information
								collected through our website, as well as any
								related services, sales, marketing, or events.
							</p>
							<div className="bg-indigo-50 border-l-4 border-indigo-600 p-5 rounded mt-4">
								<p className="text-gray-700">
									Please read this privacy policy carefully as
									it will help you understand what we do with
									the information that we collect.
								</p>
							</div>
						</section>

						<section
							id="information"
							className="bg-white rounded-lg shadow-md p-8 relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
						>
							<div className="absolute left-0 top-0 w-1.5 h-full bg-indigo-600"></div>
							<h2 className="flex items-center text-2xl font-bold text-gray-900 mb-4">
								<span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white text-sm mr-3">
									2
								</span>
								Information We Collect
							</h2>
							<p className="text-gray-700 mb-4">
								We collect personal information that you
								voluntarily provide to us when you register on
								our website, express an interest in obtaining
								information about us or our products and
								services, participate in activities on the
								website, or otherwise contact us.
							</p>
							<h3 className="text-xl font-semibold text-gray-800 mb-2 mt-6">
								Personal Information Provided by You
							</h3>
							<p className="text-gray-700 mb-4">
								The personal information that we collect depends
								on the context of your interactions with us and
								the website, the choices you make, and the
								products and features you use. The personal
								information we collect may include:
							</p>
							<ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
								<li>
									Names and contact details (email addresses,
									phone numbers, etc.)
								</li>
								<li>
									Account credentials (usernames, passwords,
									etc.)
								</li>
								<li>
									Profile information (profile picture,
									preferences, etc.)
								</li>
								<li>
									Payment information (credit card details,
									billing addresses, etc.)
								</li>
								<li>
									Usage data (how you use our website,
									products, services)
								</li>
							</ul>
							<h3 className="text-xl font-semibold text-gray-800 mb-2 mt-6">
								Information Automatically Collected
							</h3>
							<p className="text-gray-700">
								We automatically collect certain information
								when you visit, use, or navigate the website.
								This information does not reveal your specific
								identity (like your name or contact information)
								but may include device and usage information,
								such as your IP address, browser and device
								characteristics, operating system, language
								preferences, referring URLs, device name,
								country, location, information about how and
								when you use our website, and other technical
								information.
							</p>
						</section>

						<section
							id="usage"
							className="bg-white rounded-lg shadow-md p-8 relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
						>
							<div className="absolute left-0 top-0 w-1.5 h-full bg-indigo-600"></div>
							<h2 className="flex items-center text-2xl font-bold text-gray-900 mb-4">
								<span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white text-sm mr-3">
									3
								</span>
								How We Use Your Information
							</h2>
							<p className="text-gray-700 mb-4">
								We use personal information collected via our
								website for a variety of business purposes
								described below. We process your personal
								information for these purposes in reliance on
								our legitimate business interests, in order to
								enter into or perform a contract with you, with
								your consent, and/or for compliance with our
								legal obligations.
							</p>
							<p className="text-gray-700 mb-4">
								We use the information we collect or receive:
							</p>
							<ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
								<li>
									<span className="font-medium">
										To facilitate account creation and login
										process.
									</span>{" "}
									If you choose to link your account with us
									to a third-party account (such as your
									Google or Facebook account), we use the
									information you allowed us to collect from
									those third parties to facilitate account
									creation and the login process.
								</li>
								<li>
									<span className="font-medium">
										To deliver and facilitate delivery of
										services to the user.
									</span>{" "}
									We may use your information to provide you
									with the requested service.
								</li>
								<li>
									<span className="font-medium">
										To respond to user inquiries/offer
										support to users.
									</span>{" "}
									We may use your information to respond to
									your inquiries and solve any potential
									issues you might have with the use of our
									services.
								</li>
								<li>
									<span className="font-medium">
										To send you marketing and promotional
										communications.
									</span>{" "}
									We and/or our third-party marketing partners
									may use the personal information you send to
									us for our marketing purposes, if this is in
									accordance with your marketing preferences.
								</li>
								<li>
									<span className="font-medium">
										To improve our website and services.
									</span>{" "}
									We may use your information to improve our
									website and services.
								</li>
							</ul>
						</section>

						<section
							id="sharing"
							className="bg-white rounded-lg shadow-md p-8 relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
						>
							<div className="absolute left-0 top-0 w-1.5 h-full bg-indigo-600"></div>
							<h2 className="flex items-center text-2xl font-bold text-gray-900 mb-4">
								<span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white text-sm mr-3">
									4
								</span>
								Information Sharing
							</h2>
							<p className="text-gray-700 mb-4">
								We only share information with your consent, to
								comply with laws, to provide you with services,
								to protect your rights, or to fulfill business
								obligations.
							</p>
							<p className="text-gray-700 mb-4">
								We may process or share your data that we hold
								based on the following legal basis:
							</p>
							<ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
								<li>
									<span className="font-medium">
										Consent:
									</span>{" "}
									We may process your data if you have given
									us specific consent to use your personal
									information for a specific purpose.
								</li>
								<li>
									<span className="font-medium">
										Legitimate Interests:
									</span>{" "}
									We may process your data when it is
									reasonably necessary to achieve our
									legitimate business interests.
								</li>
								<li>
									<span className="font-medium">
										Performance of a Contract:
									</span>{" "}
									Where we have entered into a contract with
									you, we may process your personal
									information to fulfill the terms of our
									contract.
								</li>
								<li>
									<span className="font-medium">
										Legal Obligations:
									</span>{" "}
									We may disclose your information where we
									are legally required to do so in order to
									comply with applicable law, governmental
									requests, a judicial proceeding, court
									order, or legal process, such as in response
									to a court order or a subpoena.
								</li>
								<li>
									<span className="font-medium">
										Vital Interests:
									</span>{" "}
									We may disclose your information where we
									believe it is necessary to investigate,
									prevent, or take action regarding potential
									violations of our policies, suspected fraud,
									situations involving potential threats to
									the safety of any person and illegal
									activities, or as evidence in litigation in
									which we are involved.
								</li>
							</ul>
						</section>

						<section
							id="cookies"
							className="bg-white rounded-lg shadow-md p-8 relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
						>
							<div className="absolute left-0 top-0 w-1.5 h-full bg-indigo-600"></div>
							<h2 className="flex items-center text-2xl font-bold text-gray-900 mb-4">
								<span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white text-sm mr-3">
									5
								</span>
								Cookies and Tracking Technologies
							</h2>
							<p className="text-gray-700 mb-4">
								We may use cookies and similar tracking
								technologies (like web beacons and pixels) to
								access or store information. Specific
								information about how we use such technologies
								and how you can refuse certain cookies is set
								out in our Cookie Policy.
							</p>
							<div className="bg-indigo-50 border-l-4 border-indigo-600 p-5 rounded">
								<p className="text-gray-700">
									You can choose to disable cookies through
									your individual browser options. To know
									more detailed information about cookie
									management with specific web browsers, it
									can be found at the browsers' respective
									websites.
								</p>
							</div>
						</section>

						<section
							id="security"
							className="bg-white rounded-lg shadow-md p-8 relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
						>
							<div className="absolute left-0 top-0 w-1.5 h-full bg-indigo-600"></div>
							<h2 className="flex items-center text-2xl font-bold text-gray-900 mb-4">
								<span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white text-sm mr-3">
									6
								</span>
								Data Security
							</h2>
							<p className="text-gray-700 mb-4">
								We have implemented appropriate technical and
								organizational security measures designed to
								protect the security of any personal information
								we process. However, despite our safeguards and
								efforts to secure your information, no
								electronic transmission over the Internet or
								information storage technology can be guaranteed
								to be 100% secure, so we cannot promise or
								guarantee that hackers, cybercriminals, or other
								unauthorized third parties will not be able to
								defeat our security, and improperly collect,
								access, steal, or modify your information.
							</p>
							<p className="text-gray-700">
								Although we will do our best to protect your
								personal information, transmission of personal
								information to and from our website is at your
								own risk. You should only access the website
								within a secure environment.
							</p>
						</section>

						<section
							id="retention"
							className="bg-white rounded-lg shadow-md p-8 relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
						>
							<div className="absolute left-0 top-0 w-1.5 h-full bg-indigo-600"></div>
							<h2 className="flex items-center text-2xl font-bold text-gray-900 mb-4">
								<span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white text-sm mr-3">
									7
								</span>
								Data Retention
							</h2>
							<p className="text-gray-700 mb-4">
								We will only keep your personal information for
								as long as it is necessary for the purposes set
								out in this privacy policy, unless a longer
								retention period is required or permitted by law
								(such as tax, accounting or other legal
								requirements). No purpose in this policy will
								require us keeping your personal information for
								longer than the period of time in which users
								have an account with us.
							</p>
							<p className="text-gray-700">
								When we have no ongoing legitimate business need
								to process your personal information, we will
								either delete or anonymize such information, or,
								if this is not possible (for example, because
								your personal information has been stored in
								backup archives), then we will securely store
								your personal information and isolate it from
								any further processing until deletion is
								possible.
							</p>
						</section>

						<section
							id="rights"
							className="bg-white rounded-lg shadow-md p-8 relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
						>
							<div className="absolute left-0 top-0 w-1.5 h-full bg-indigo-600"></div>
							<h2 className="flex items-center text-2xl font-bold text-gray-900 mb-4">
								<span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white text-sm mr-3">
									8
								</span>
								Your Privacy Rights
							</h2>
							<p className="text-gray-700 mb-4">
								In some regions (like the European Economic
								Area), you have certain rights under applicable
								data protection laws. These may include the
								right (i) to request access and obtain a copy of
								your personal information, (ii) to request
								rectification or erasure; (iii) to restrict the
								processing of your personal information; and
								(iv) if applicable, to data portability. In
								certain circumstances, you may also have the
								right to object to the processing of your
								personal information. To make such a request,
								please use the contact details provided at the
								end of this privacy policy.
							</p>
							<p className="text-gray-700 mb-4">
								If we are relying on your consent to process
								your personal information, you have the right to
								withdraw your consent at any time. Please note
								however that this will not affect the lawfulness
								of the processing before its withdrawal, nor
								will it affect the processing of your personal
								information conducted in reliance on lawful
								processing grounds other than consent.
							</p>
							<p className="text-gray-700">
								If you are a resident in the European Economic
								Area and you believe we are unlawfully
								processing your personal information, you also
								have the right to complain to your local data
								protection supervisory authority.
							</p>
						</section>

						<section
							id="children"
							className="bg-white rounded-lg shadow-md p-8 relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
						>
							<div className="absolute left-0 top-0 w-1.5 h-full bg-indigo-600"></div>
							<h2 className="flex items-center text-2xl font-bold text-gray-900 mb-4">
								<span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white text-sm mr-3">
									9
								</span>
								Children's Privacy
							</h2>
							<p className="text-gray-700 mb-4">
								Our website is not intended for children under
								16 years of age. No one under age 16 may provide
								any information to or on the website. We do not
								knowingly collect personal information from
								children under 16. If you are under 16, do not
								use or provide any information on this website
								or on or through any of its features/register on
								the website, make any purchases through the
								website, use any of the interactive or public
								comment features of this website or provide any
								information about yourself to us, including your
								name, address, telephone number, email address,
								or any screen name or user name you may use.
							</p>
							<p className="text-gray-700">
								If we learn we have collected or received
								personal information from a child under 16
								without verification of parental consent, we
								will delete that information. If you believe we
								might have any information from or about a child
								under 16, please contact us using the contact
								information provided below.
							</p>
						</section>

						<section
							id="international"
							className="bg-white rounded-lg shadow-md p-8 relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
						>
							<div className="absolute left-0 top-0 w-1.5 h-full bg-indigo-600"></div>
							<h2 className="flex items-center text-2xl font-bold text-gray-900 mb-4">
								<span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white text-sm mr-3">
									10
								</span>
								International Data Transfers
							</h2>
							<p className="text-gray-700 mb-4">
								Our servers are located in [Location]. If you
								are accessing our website from outside
								[Location], please be aware that your
								information may be transferred to, stored, and
								processed by us in our facilities and by those
								third parties with whom we may share your
								personal information, in [Location] and other
								countries.
							</p>
							<p className="text-gray-700">
								If you are a resident in the European Economic
								Area, then these countries may not necessarily
								have data protection laws or other similar laws
								as comprehensive as those in your country. We
								will however take all necessary measures to
								protect your personal information in accordance
								with this privacy policy and applicable law.
							</p>
						</section>

						<section
							id="changes"
							className="bg-white rounded-lg shadow-md p-8 relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
						>
							<div className="absolute left-0 top-0 w-1.5 h-full bg-indigo-600"></div>
							<h2 className="flex items-center text-2xl font-bold text-gray-900 mb-4">
								<span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white text-sm mr-3">
									11
								</span>
								Changes to this Privacy Policy
							</h2>
							<p className="text-gray-700 mb-4">
								We may update this privacy policy from time to
								time. The updated version will be indicated by
								an updated "Last Updated" date and the updated
								version will be effective as soon as it is
								accessible. If we make material changes to this
								privacy policy, we may notify you either by
								prominently posting a notice of such changes or
								by directly sending you a notification. We
								encourage you to review this privacy policy
								frequently to be informed of how we are
								protecting your information.
							</p>
							<div className="bg-indigo-50 border-l-4 border-indigo-600 p-5 rounded">
								<p className="text-gray-700">
									It is important that you check back often
									for updates to the Privacy Policy. If we
									make material changes to the Privacy Policy,
									we may notify you by email or by means of a
									notice on our website.
								</p>
							</div>
						</section>

						<section
							id="contact"
							className="bg-white rounded-lg shadow-md p-8 relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
						>
							<div className="absolute left-0 top-0 w-1.5 h-full bg-indigo-600"></div>
							<h2 className="flex items-center text-2xl font-bold text-gray-900 mb-4">
								<span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white text-sm mr-3">
									12
								</span>
								Contact Us
							</h2>
							<p className="text-gray-700 mb-4">
								If you have any questions or concerns about this
								privacy policy or our practices with regards to
								your personal information, please contact us at:
							</p>
							<div className="bg-gray-50 p-5 rounded">
								<p className="text-gray-700 mb-2">
									Your Company
								</p>
								<p className="text-gray-700 mb-2">
									Email: privacy@yourcompany.com
								</p>
								<p className="text-gray-700 mb-2">
									Phone: (555) 123-4567
								</p>
								<p className="text-gray-700">
									Address: 123 Main Street, Anytown, AN 12345
								</p>
							</div>
						</section>
					</div>
				</div>

				<button
					onClick={scrollToTop}
					className={`fixed bottom-8 right-8 w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg transition-all duration-300 ${
						showBackToTop
							? "opacity-100"
							: "opacity-0 pointer-events-none"
					} hover:bg-indigo-700 hover:-translate-y-1`}
					aria-label="Back to top"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M5 15l7-7 7 7"
						/>
					</svg>
				</button>
            </main>
            <Footer/>
		</>
	);
}
