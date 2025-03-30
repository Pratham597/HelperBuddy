// pages/terms-and-conditions.js
"use client";
import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/home/Footer";

export default function TermsAndConditions() {
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
            <div className="mt-16"></div>
			<Head className="">
				<title>Terms and Conditions | HelperBuddy</title>
				<meta
					name="description"
					content="Terms and conditions for using our services"
				/>
			</Head>

			<main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
				<div className="text-center mb-8">
					<h1 className="text-4xl font-bold text-gray-900 mb-4 relative inline-block">
						Terms and Conditions
					</h1>
					<p className="text-lg text-gray-600 max-w-2xl mx-auto">
						Please read these terms and conditions carefully before
						using our service.
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
										href="#acceptance"
										className="text-gray-700 hover:text-indigo-600 hover:pl-1 transition-all duration-200 block"
									>
										1. Acceptance of Terms
									</a>
								</li>
								<li>
									<a
										href="#changes"
										className="text-gray-700 hover:text-indigo-600 hover:pl-1 transition-all duration-200 block"
									>
										2. Changes to Terms
									</a>
								</li>
								<li>
									<a
										href="#access"
										className="text-gray-700 hover:text-indigo-600 hover:pl-1 transition-all duration-200 block"
									>
										3. Access and Security
									</a>
								</li>
								<li>
									<a
										href="#content"
										className="text-gray-700 hover:text-indigo-600 hover:pl-1 transition-all duration-200 block"
									>
										4. User Content
									</a>
								</li>
								<li>
									<a
										href="#privacy"
										className="text-gray-700 hover:text-indigo-600 hover:pl-1 transition-all duration-200 block"
									>
										5. Privacy Policy
									</a>
								</li>
								<li>
									<a
										href="#intellectual"
										className="text-gray-700 hover:text-indigo-600 hover:pl-1 transition-all duration-200 block"
									>
										6. Intellectual Property
									</a>
								</li>
								<li>
									<a
										href="#prohibited"
										className="text-gray-700 hover:text-indigo-600 hover:pl-1 transition-all duration-200 block"
									>
										7. Prohibited Uses
									</a>
								</li>
								<li>
									<a
										href="#termination"
										className="text-gray-700 hover:text-indigo-600 hover:pl-1 transition-all duration-200 block"
									>
										8. Termination
									</a>
								</li>
								<li>
									<a
										href="#disclaimer"
										className="text-gray-700 hover:text-indigo-600 hover:pl-1 transition-all duration-200 block"
									>
										9. Disclaimer
									</a>
								</li>
								<li>
									<a
										href="#limitation"
										className="text-gray-700 hover:text-indigo-600 hover:pl-1 transition-all duration-200 block"
									>
										10. Limitation of Liability
									</a>
								</li>
								<li>
									<a
										href="#governing"
										className="text-gray-700 hover:text-indigo-600 hover:pl-1 transition-all duration-200 block"
									>
										11. Governing Law
									</a>
								</li>
								<li>
									<a
										href="#contact"
										className="text-gray-700 hover:text-indigo-600 hover:pl-1 transition-all duration-200 block"
									>
										12. Contact Information
									</a>
								</li>
							</ul>
						</div>
					</div>

					{/* Main Content */}
					<div className="lg:col-span-3 space-y-6">
						<section
							id="acceptance"
							className="bg-white rounded-lg shadow-md p-8 relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
						>
							<div className="absolute left-0 top-0 w-1.5 h-full bg-indigo-600"></div>
							<h2 className="flex items-center text-2xl font-bold text-gray-900 mb-4">
								<span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white text-sm mr-3">
									1
								</span>
								Acceptance of Terms
							</h2>
							<p className="text-gray-700 mb-4">
								By accessing or using our service, you agree to
								be bound by these Terms and Conditions and all
								applicable laws and regulations. If you do not
								agree with any of these terms, you are
								prohibited from using or accessing this site.
							</p>
							<div className="bg-indigo-50 border-l-4 border-indigo-600 p-5 rounded">
								<p className="text-gray-700">
									By using our services, you acknowledge that
									you have read and understood these Terms and
									Conditions and agree to be bound by them.
								</p>
							</div>
						</section>

						<section
							id="changes"
							className="bg-white rounded-lg shadow-md p-8 relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
						>
							<div className="absolute left-0 top-0 w-1.5 h-full bg-indigo-600"></div>
							<h2 className="flex items-center text-2xl font-bold text-gray-900 mb-4">
								<span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white text-sm mr-3">
									2
								</span>
								Changes to Terms
							</h2>
							<p className="text-gray-700 mb-4">
								We reserve the right to revise these terms at
								any time without notice. By using this website,
								you are agreeing to be bound by the current
								version of these Terms and Conditions.
							</p>
							<p className="text-gray-700">
								Any changes to these terms will be effective
								immediately upon posting on this page. It is
								your responsibility to review these Terms and
								Conditions periodically.
							</p>
						</section>

						<section
							id="access"
							className="bg-white rounded-lg shadow-md p-8 relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
						>
							<div className="absolute left-0 top-0 w-1.5 h-full bg-indigo-600"></div>
							<h2 className="flex items-center text-2xl font-bold text-gray-900 mb-4">
								<span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white text-sm mr-3">
									3
								</span>
								Access and Account Security
							</h2>
							<p className="text-gray-700 mb-4">
								When you create an account with us, you must
								provide accurate and complete information. You
								are solely responsible for the activity that
								occurs on your account, and you must keep your
								account password secure.
							</p>
							<p className="text-gray-700 mb-4">
								You must notify us immediately of any breach of
								security or unauthorized use of your account. We
								will not be liable for any losses caused by any
								unauthorized use of your account.
							</p>
							<div className="bg-indigo-50 border-l-4 border-indigo-600 p-5 rounded">
								<p className="text-gray-700">
									You are responsible for maintaining the
									confidentiality of your login credentials
									and for all activities that occur under your
									account.
								</p>
							</div>
						</section>

						<section
							id="content"
							className="bg-white rounded-lg shadow-md p-8 relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
						>
							<div className="absolute left-0 top-0 w-1.5 h-full bg-indigo-600"></div>
							<h2 className="flex items-center text-2xl font-bold text-gray-900 mb-4">
								<span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white text-sm mr-3">
									4
								</span>
								User Content
							</h2>
							<p className="text-gray-700 mb-4">
								Our service allows you to post, link, store,
								share and otherwise make available certain
								information, text, graphics, videos, or other
								material. You are responsible for the content
								that you post to the service, including its
								legality, reliability, and appropriateness.
							</p>
							<p className="text-gray-700">
								By posting content to the service, you grant us
								the right to use, reproduce, modify, perform,
								display, distribute, and otherwise disclose to
								third parties any such material.
							</p>
						</section>

						<section
							id="privacy"
							className="bg-white rounded-lg shadow-md p-8 relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
						>
							<div className="absolute left-0 top-0 w-1.5 h-full bg-indigo-600"></div>
							<h2 className="flex items-center text-2xl font-bold text-gray-900 mb-4">
								<span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white text-sm mr-3">
									5
								</span>
								Privacy Policy
							</h2>
							<p className="text-gray-700">
								Your use of our service is also governed by our
								Privacy Policy, which is incorporated into these
								Terms and Conditions by reference. Please review
								our Privacy Policy for more information on how
								we collect, use, and disclose information.
							</p>
						</section>

						<section
							id="intellectual"
							className="bg-white rounded-lg shadow-md p-8 relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
						>
							<div className="absolute left-0 top-0 w-1.5 h-full bg-indigo-600"></div>
							<h2 className="flex items-center text-2xl font-bold text-gray-900 mb-4">
								<span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white text-sm mr-3">
									6
								</span>
								Intellectual Property Rights
							</h2>
							<p className="text-gray-700 mb-4">
								The service and its original content, features,
								and functionality are and will remain the
								exclusive property of our company and its
								licensors. The service is protected by
								copyright, trademark, and other laws.
							</p>
							<p className="text-gray-700">
								Our trademarks and trade dress may not be used
								in connection with any product or service
								without the prior written consent of our
								company.
							</p>
						</section>

						<section
							id="prohibited"
							className="bg-white rounded-lg shadow-md p-8 relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
						>
							<div className="absolute left-0 top-0 w-1.5 h-full bg-indigo-600"></div>
							<h2 className="flex items-center text-2xl font-bold text-gray-900 mb-4">
								<span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white text-sm mr-3">
									7
								</span>
								Prohibited Uses
							</h2>
							<p className="text-gray-700 mb-4">
								You may use our service only for lawful purposes
								and in accordance with these Terms. You agree
								not to use our service:
							</p>
							<ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
								<li>
									In any way that violates any applicable
									federal, state, local, or international law
									or regulation.
								</li>
								<li>
									To transmit, or procure the sending of, any
									advertising or promotional material,
									including any "junk mail," "chain letter,"
									"spam," or any other similar solicitation.
								</li>
								<li>
									To impersonate or attempt to impersonate our
									company, a company employee, another user,
									or any other person or entity.
								</li>
								<li>
									To engage in any other conduct that
									restricts or inhibits anyone's use or
									enjoyment of the service, or which may harm
									our company or users of the service.
								</li>
							</ul>
						</section>

						<section
							id="termination"
							className="bg-white rounded-lg shadow-md p-8 relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
						>
							<div className="absolute left-0 top-0 w-1.5 h-full bg-indigo-600"></div>
							<h2 className="flex items-center text-2xl font-bold text-gray-900 mb-4">
								<span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white text-sm mr-3">
									8
								</span>
								Termination
							</h2>
							<p className="text-gray-700 mb-4">
								We may terminate or suspend your account and bar
								access to the service immediately, without prior
								notice or liability, under our sole discretion,
								for any reason whatsoever and without
								limitation, including but not limited to a
								breach of the Terms.
							</p>
							<p className="text-gray-700">
								All provisions of the Terms which by their
								nature should survive termination shall survive
								termination, including, without limitation,
								ownership provisions, warranty disclaimers,
								indemnity, and limitations of liability.
							</p>
						</section>

						<section
							id="disclaimer"
							className="bg-white rounded-lg shadow-md p-8 relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
						>
							<div className="absolute left-0 top-0 w-1.5 h-full bg-indigo-600"></div>
							<h2 className="flex items-center text-2xl font-bold text-gray-900 mb-4">
								<span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white text-sm mr-3">
									9
								</span>
								Disclaimer of Warranties
							</h2>
							<p className="text-gray-700 mb-4">
								Our service is provided "as is" and "as
								available" without any warranties of any kind,
								either express or implied. We disclaim all
								warranties, including but not limited to,
								implied warranties of merchantability, fitness
								for a particular purpose, and non-infringement.
							</p>
							<div className="bg-indigo-50 border-l-4 border-indigo-600 p-5 rounded">
								<p className="text-gray-700">
									We do not warrant that the service will be
									uninterrupted, secure, or error-free, or
									that defects will be corrected.
								</p>
							</div>
						</section>

						<section
							id="limitation"
							className="bg-white rounded-lg shadow-md p-8 relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
						>
							<div className="absolute left-0 top-0 w-1.5 h-full bg-indigo-600"></div>
							<h2 className="flex items-center text-2xl font-bold text-gray-900 mb-4">
								<span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white text-sm mr-3">
									10
								</span>
								Limitation of Liability
							</h2>
							<p className="text-gray-700 mb-4">
								In no event will our company, or its suppliers
								or licensors, be liable for any indirect,
								special, incidental, consequential, or punitive
								damages, including without limitation, loss of
								profits, data, use, goodwill, or other
								intangible losses, resulting from:
							</p>
							<ul className="list-disc pl-6 mb-4 text-gray-700 space-y-2">
								<li>
									Your access to or use of or inability to
									access or use the service;
								</li>
								<li>
									Any conduct or content of any third party on
									the service;
								</li>
								<li>
									Any content obtained from the service; and
								</li>
								<li>
									Unauthorized access, use, or alteration of
									your transmissions or content, whether based
									on warranty, contract, tort (including
									negligence), or any other legal theory.
								</li>
							</ul>
						</section>

						<section
							id="governing"
							className="bg-white rounded-lg shadow-md p-8 relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
						>
							<div className="absolute left-0 top-0 w-1.5 h-full bg-indigo-600"></div>
							<h2 className="flex items-center text-2xl font-bold text-gray-900 mb-4">
								<span className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white text-sm mr-3">
									11
								</span>
								Governing Law
							</h2>
							<p className="text-gray-700 mb-4">
								These Terms shall be governed and construed in
								accordance with the laws of [Your Jurisdiction],
								without regard to its conflict of law
								provisions.
							</p>
							<p className="text-gray-700">
								Our failure to enforce any right or provision of
								these Terms will not be considered a waiver of
								those rights. If any provision of these Terms is
								held to be invalid or unenforceable by a court,
								the remaining provisions of these Terms will
								remain in effect.
							</p>
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
								Contact Information
							</h2>
							<p className="text-gray-700 mb-4">
								If you have any questions about these Terms,
								please contact us at:
							</p>
							<div className="bg-gray-50 p-5 rounded">
								<p className="text-gray-700 mb-2">
									Email: support@yourcompany.com
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
            <Footer />
		</>
	);
}
