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
import Cookies from "js-cookie"

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
			const res = await fetch("/api/admin/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(Form),
			});

			if (res.ok) {
				const data = await res.json();
				// Save token in local storage
				localStorage.setItem("admin", JSON.stringify(data));
				const salt = crypto.randomBytes(16).toString("hex");

				// Hash the role
				const hashedRole = hashRole("admin", salt);

				// Store in cookies
				Cookies.remove("salt");
				Cookies.remove("role");
				Cookies.set("salt", salt, { expires: 7 });
				Cookies.set("role", hashedRole, { expires: 7 });
				router.push("/admin/dashboard");
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
			</CardContent>
		</Card>
	);
}
