"use client";

import { useState, useEffect } from "react";
import LoginForm from "@/components/partner/loginFormPartner.jsx";
import SignupForm from "@/components/partner/SignupFormPartner.jsx";
import LoginPageImage from "@/components/LoginPageImage.jsx";
import { useRouter } from "next/navigation"

const colors = {
	primary: "#060606",
	secondary: "#E0E0E0",
	disabled: "#D9D9D9",
};

const IMAGE_URL =
	"https://scrubnbubbles.com/wp-content/uploads/2022/05/cleaning-service.jpeg";
const Heading = "Grow Your Business with HelperBuddy!";
const SubHeading =
	"Join as a service provider and connect with customers instantly.";

export default function Page() {
	const router = useRouter();
	const [isLogin, setIsLogin] = useState(true);

	// to resolve some error it was giving upon reloading the page
	const [hydrated, setHydrated] = useState(false);
	// Ensure client-side rendering matches SSR output
	useEffect(() => {
		setHydrated(true);
		if (JSON.parse(localStorage.getItem("partner"))) {
			router.push("/partner/dashboard");
		}

	}, []);
	// Prevent mismatches by rendering only after hydration
	if (!hydrated) return null;

	return (
		<div className="flex h-screen">
			{/* Image Section - Changes position based on form type */}
			<div
				className={`hidden md:flex w-1/2 relative transition-all duration-500 }`}
			>
				<LoginPageImage
					IMAGE_URL={IMAGE_URL}
					Heading={Heading}
					SubHeading={SubHeading}
				/>
			</div>

			{/* Form Section */}
			<div className="flex flex-col items-center justify-center w-full md:w-1/2 p-8">
				{isLogin ? (
					<LoginForm
						isLogin={isLogin}
						setIsLogin={setIsLogin}
						isPartner={true}
					/>
				) : (
					<SignupForm isLogin={isLogin} setIsLogin={setIsLogin} />
				)}
			</div>
		</div>
	);
}
