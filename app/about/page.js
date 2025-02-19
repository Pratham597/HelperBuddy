import AboutSection from "@/components/AboutSection.jsx";
import ContactSection from "@/components/ContactSection.jsx";
import Footer from "@/components/home/Footer.jsx";
import Navbar from "@/components/navbar/Navbar.jsx";
import React from "react";

export const metadata = {
	title: "About Us | Helper Buddy",
	description:
		"Learn more about Helper Buddy, your trusted platform for connecting with skilled professionals for all your service needs.",
	keywords: [
		"Helper Buddy",
		"about us",
		"service platform",
		"home repairs",
		"cleaning services",
		"trusted professionals",
	],
	openGraph: {
		title: "About Us - Helper Buddy",
		description:
			"Learn more about Helper Buddy, your trusted platform for connecting with skilled professionals for all your service needs.",
		url: `/about`,
		type: "website",
		images: [
			{
				url: "/logo.png",
				width: 1200,
				height: 630,
				alt: "About Helper Buddy",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "About Us - Helper Buddy",
		description:
			"Learn more about Helper Buddy, your trusted platform for connecting with skilled professionals for all your service needs.",
	},
};

const p = [
	"Helper Buddy is your one-stop solution for all your service needs. We connect skilled professionals with customers looking for quality services, making everyday tasks easier and more efficient.",
	"Our mission is to revolutionize the service industry by providing a platform that values quality, reliability, and customer satisfaction above all else.",
	"With a wide range of services from home repairs to Cleaning Services, Helper Buddy ensures that you always have a trusted professional at your fingertips.",
];

const page = () => {
	return (
		<div>
			<Navbar />
			<AboutSection {...p} />
			<ContactSection />
			<Footer />
		</div>
	);
};

export default page;
