import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/home/Footer";
import Navbar from "@/components/navbar/Navbar";
import React from "react";

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
