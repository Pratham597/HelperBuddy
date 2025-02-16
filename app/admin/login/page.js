"use client";

import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import crypto from "crypto";
import Cookies from "js-cookie";

const SECRET_KEY = process.env.NEXT_PUBLIC_ROLE_KEY;

const hashRole = (role, salt) => {
	return crypto
		.createHmac("sha256", SECRET_KEY)
		.update(role + salt)
		.digest("hex");
};

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(null);
	const router = useRouter();

	const handleLogin = async (event) => {
		event.preventDefault();
		setError(null);

		try {
			const response = await axios.post("/api/admin/login", {
				email,
				password,
			});
			// console.log(response)
			localStorage.setItem("admin", JSON.stringify(response.data));
			const salt = crypto.randomBytes(16).toString("hex");

			// Hash the role
			const hashedRole = hashRole("admin", salt);

			// Store in cookies
			Cookies.remove("salt");
			Cookies.remove("role");
			Cookies.set("salt", salt, { expires: 7 });
			Cookies.set("role", hashedRole, { expires: 7 });
			router.push("/admin/dashboard");
		} catch (err) {
			setError(
				err.response?.data?.message || "Login failed. Please try again."
			);
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
			<Card className="w-full max-w-md">
				<CardHeader>
					<CardTitle className="text-2xl text-center">
						Admin Login
					</CardTitle>
					<CardDescription className="text-center">
						Enter your credentials to access the admin dashboard
					</CardDescription>
				</CardHeader>
				<form onSubmit={handleLogin}>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="Enter your email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								required
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								placeholder="Enter your password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</div>
						{error && (
							<p className="text-red-500 text-sm">{error}</p>
						)}
					</CardContent>
					<CardFooter className="flex flex-col space-y-4">
						<Button type="submit" className="w-full">
							Log In
						</Button>
						<div className="text-sm text-center">
							<Link
								href="#"
								className="text-blue-500 hover:underline"
							>
								Forgot password?
							</Link>
						</div>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
