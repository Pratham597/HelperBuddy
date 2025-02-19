"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import crypto from "crypto";
import Cookies from "js-cookie";

const SECRET_KEY = process.env.NEXT_PUBLIC_ROLE_KEY;

const hashRole = (role, salt) => {
	return crypto
		.createHmac("sha256", SECRET_KEY)
		.update(role + salt)
		.digest("hex");
};

const colors = {
	primary: "#060606",
	secondary: "#E0E0E0",
	disabled: "#D9D9D9",
};

export default function LoginForm({ isLogin, setIsLogin, isAdmin }) {
	const router = useRouter();

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [Form, setForm] = useState({
		email: "",
		password: "",
	});

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);

		if (!Form.email || !Form.password) {
			toast.error("All fields are required.");
			setIsSubmitting(false);
			return;
		}

		if (!/\S+@\S+\.\S+/.test(Form.email)) {
			toast.error("Email is invalid.");
			setIsSubmitting(false);
			return;
		}

		// if (Form.password.length < 8) {
		// 	toast.error("Password must be at least 8 characters long.");
		// 	setIsSubmitting(false);
		// 	return;
		// }

		// API call to login

		try {
			const res = await fetch("/api/partner/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(Form),
			});

			if (res.ok) {
				const data = await res.json();
				// Save token in local storage
				localStorage.setItem("partner", JSON.stringify(data));
				const salt = crypto.randomBytes(16).toString("hex");

				// Hash the role
				const hashedRole = hashRole("partner", salt);

				// Store in cookies
				Cookies.remove("salt");
				Cookies.remove("role");
				Cookies.set("salt", salt, { expires: 7 });
				Cookies.set("role", hashedRole, { expires: 7 });
				
				router.push("/partner/dashboard");
				toast.success("Logged in successfully");
			}

			if (res.status === 400) {
				toast.error("Invalid credentials");
			}

			setIsSubmitting(false);
		} catch (error) {
			console.error(error);
			toast.error("Something went wrong");
			setIsSubmitting(false);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Card className="w-full max-w-md">
			<CardHeader className="space-y-1 text-center">
				<CardTitle className="text-3xl font-bold">
					HelperBuddy
				</CardTitle>
				<p className="text-sm text-muted-foreground">
					Enter your credentials to login
				</p>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						type="email"
						placeholder="example@email.com"
						value={Form.email}
						onChange={(e) =>
							setForm({
								...Form,
								email: e.target.value,
							})
						}
					/>
				</div>
				<div className="space-y-2 relative">
					<Label htmlFor="password">Password</Label>
					<Input
						id="password"
						type={showPassword ? "text" : "password"}
						placeholder="• • • • • • • •"
						value={Form.password}
						onChange={(e) =>
							setForm({
								...Form,
								password: e.target.value,
							})
						}
					/>
					<button
						type="button"
						className="absolute right-3 top-11 transform -translate-y-1/2 text-gray-500"
						onClick={() => setShowPassword(!showPassword)}
					>
						{showPassword ? (
							<EyeOff className="size-5 text-gray-500" />
						) : (
							<Eye className="size-5 text-gray-500" />
						)}
					</button>
				</div>

				<Button
					className="w-full"
					onClick={handleSubmit}
					disabled={isSubmitting}
					style={{ backgroundColor: colors.primary }}
				>
					{isSubmitting ? (
						<>
							<Loader2 className="size-7 animate-spin" /> Logging
							in....
						</>
					) : (
						"Login"
					)}
				</Button>

				{/* Render only if isAdmin is false */}
				{!isAdmin && (
					<>
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<div className="w-full border-t border-gray-200" />
							</div>
							<div className="relative flex justify-center text-sm">
								<span className="bg-white px-2 text-muted-foreground">
									or
								</span>
							</div>
						</div>
						<Button variant="outline" className="w-full">
							<svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
								<path
									d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
									fill="#4285F4"
								/>
								<path
									d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
									fill="#34A853"
								/>
								<path
									d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
									fill="#FBBC05"
								/>
								<path
									d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
									fill="#EA4335"
								/>
							</svg>
							Continue with Google
						</Button>
						<div className="text-center text-sm">
							Don&apos;t have an account?{" "}
							<button
								onClick={() => setIsLogin(false)}
								className="underline hover:text-primary"
							>
								Create one
							</button>
						</div>
					</>
				)}
			</CardContent>
		</Card>
	);
}
