"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { set } from "mongoose";
import { toast } from "react-hot-toast";
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

const colors = {
	primary: "#060606",
	secondary: "#E0E0E0",
	disabled: "#D9D9D9",
};

export default function Form({ isLogin, setIsLogin, isPartner }) {
	const router = useRouter();
	const [showPassword, setShowPassword] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [otpSent, setOtpSent] = useState(false);
	const [otpVerified, setOtpVerified] = useState(false);
	const [isSendingOtp, setIsSendingOtp] = useState(false);
	const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
	const [countdown, setCountdown] = useState(0);
	const [form, setForm] = useState({
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
		password: "",
		referralCode: "",
	});

	// Handle countdown timer
	useEffect(() => {
		let timer;
		if (countdown > 0) {
			timer = setTimeout(() => setCountdown(countdown - 1), 1000);
		}
		return () => {
			if (timer) clearTimeout(timer);
		};
	}, [countdown]);

	const validateEmail = (email) => {
		return /\S+@\S+\.\S+/.test(email);
	};

	const handleSendOtp = async () => {
		if (!form.email || !validateEmail(form.email)) {
			toast.error("Please enter a valid email address first");
			return;
		}

		setIsSendingOtp(true);
		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/user/send-otp`, {
				method: "POST",
				body: JSON.stringify({ email: form.email }),
				headers: {
				"Content-Type": "application/json",
				},
			});
			if (!res.ok) throw new Error("Failed to send OTP");
			toast.success("OTP sent to your email");
			setOtpSent(true);
			setCountdown(60); // 1 minutes in seconds
		} catch (error) {
			toast.error("Failed to send OTP");
			console.error(error);
		} finally {
			setIsSendingOtp(false);
		}
	};

	const handleVerifyOtp = async () => {
		if (!form.otp || form.otp.length !== 6) {
			toast.error("Please enter a valid 6-digit OTP");
			return;
		}

		setIsVerifyingOtp(true);
		try {
			
			const res = await fetch("/api/user/verify-otp", {
				method: "POST",
				body: JSON.stringify({ 
				email: form.email,
				otp: form.otp 
				}),
				headers: {
				"Content-Type": "application/json",
				},
			});
			if (!res.ok) throw new Error("Invalid OTP");
			toast.success("OTP verified successfully");
			setOtpVerified(true);
		} catch (error) {
			toast.error("Invalid OTP. Please try again.");
			console.error(error);
		} finally {
			setIsVerifyingOtp(false);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!otpVerified) {
			toast.error("Please verify your phone number with OTP first");
			return;
		}

		setIsSubmitting(true);

		if (!form.firstName || !form.email || !form.phone || !form.password) {
			toast.error("All fields are required.");
			setIsSubmitting(false);
			return;
		}

		if (!/\S+@\S+\.\S+/.test(form.email)) {
			toast.error("Email is invalid.");
			setIsSubmitting(false);
			return;
		}

		if (form.phone.length !== 10) {
			toast.error("Phone number must be 10 digits long.");
			setIsSubmitting(false);
			return;
		}

		if (form.password.length < 8) {
			toast.error("Password must be at least 8 characters long.");
			setIsSubmitting(false);
			return;
		}

		try {
			const res = await fetch("/api/user/sign-up", {
				method: "POST",
				body: JSON.stringify({
					name: `${form.firstName} ${form.lastName}`,
					email: form.email,
					phone: `+91${form.phone}`,
					password: form.password,
					referralCode: form.referralCode,
				}),
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			});
			const data = await res.json();
			if (!res.ok) {
				toast.error(data.error || "Signup failed.");
				setIsSubmitting(false);
				return;
			}

			localStorage.setItem("user", JSON.stringify(data));
			const salt = crypto.randomBytes(16).toString("hex");

			// Hash the role
			const hashedRole = hashRole("user", salt);

			// Store in cookies
			Cookies.remove("salt");
			Cookies.remove("role");
			Cookies.set("salt", salt, { expires: 7 });
			Cookies.set("role", hashedRole, { expires: 7 });

			router.push("/");
			toast.success("Signup successful!");
		} catch (error) {
			console.error(error);
			toast.error(error);
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
					Create your account
				</p>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label htmlFor="firstName">First Name</Label>
						<Input
							id="firstName"
							placeholder="John"
							value={form.firstName}
							onChange={(e) =>
								setForm({ ...form, firstName: e.target.value })
							}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="lastName">Last Name</Label>
						<Input
							id="lastName"
							placeholder="Doe"
							value={form.lastName}
							onChange={(e) =>
								setForm({ ...form, lastName: e.target.value })
							}
						/>
					</div>
				</div>
				<div className="space-y-2">
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						type="email"
						placeholder="example@email.com"
						value={form.email}
						onChange={(e) =>
							setForm({ ...form, email: e.target.value })
						}
					/>
				</div>

				{/* ✅ Fixed Phone Number Input */}
				<div className="space-y-2 relative">
					<Label htmlFor="phone">Phone No.</Label>
					<div className="relative">
						<span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
							+91
						</span>
						<Input
							id="phone"
							type="text"
							placeholder="Enter 10-digit number"
							value={form.phone}
							maxLength={10}
							onChange={(e) => {
								const numericValue = e.target.value.replace(
									/\D/g,
									""
								);
								if (numericValue.length <= 10) {
									setForm({ ...form, phone: numericValue });
								}
							}}
							className="pl-10"
						/>
					</div>
				</div>

				{/* OTP Input and Verification */}
				<div className="space-y-2">
					<div className="flex items-center justify-between">
						<Label htmlFor="otp">OTP Verification</Label>
						{otpVerified && (
							<span className="text-xs text-green-600">
								Verified
							</span>
						)}
					</div>
					<div className="flex gap-2">
						<Input
							id="otp"
							type="text"
							placeholder="Enter 6-digit OTP"
							value={form.otp}
							maxLength={6}
							onChange={(e) => {
								const numericValue = e.target.value.replace(
									/\D/g,
									""
								);
								setForm({ ...form, otp: numericValue });
							}}
							disabled={!otpSent || otpVerified}
						/>
						{!otpVerified ? (
							<Button
								type="button"
								onClick={
									otpSent ? handleVerifyOtp : handleSendOtp
								}
								disabled={
									(otpSent && isVerifyingOtp) ||
									(!otpSent &&
										(isSendingOtp ||
											!form.email ||
											!validateEmail(form.email)))
								}
								className="min-w-[120px]"
							>
								{isSendingOtp || isVerifyingOtp ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : otpSent ? (
									"Verify OTP"
								) : (
									"Send OTP"
								)}
							</Button>
						) : null}
					</div>
					{otpSent && !otpVerified && (
						<div className="flex justify-between items-center">
							<p className="text-xs text-muted-foreground">
								Enter the 6-digit OTP sent to your email
							</p>
							<button
								type="button"
								onClick={handleSendOtp}
								disabled={countdown > 0}
								className="text-xs text-primary disabled:text-muted-foreground"
							>
								{countdown > 0
									? `Resend in ${Math.floor(
											countdown / 60
									  )}:${(countdown % 60)
											.toString()
											.padStart(2, "0")}`
									: "Resend OTP"}
							</button>
						</div>
					)}
				</div>

				{/* Password Input */}
				<div className="space-y-2 relative">
					<Label htmlFor="password">Password</Label>
					<Input
						id="password"
						type={showPassword ? "text" : "password"}
						value={form.password}
						placeholder="• • • • • • • •"
						onChange={(e) =>
							setForm({ ...form, password: e.target.value })
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

				{/*  Referral Code */}
				<div className="space-y-2">
					<Label htmlFor="referralCode">Referral Code</Label>
					<Input
						id="referralCode"
						type="text"
						placeholder="(Optional)"
						value={form.referralCode}
						onChange={(e) =>
							setForm({ ...form, referralCode: e.target.value })
						}
					/>
				</div>

				{/* Submit Button */}
				<Button
					className="w-full flex items-center justify-center gap-2"
					style={{ backgroundColor: colors.primary }}
					onClick={handleSubmit}
					disabled={isSubmitting}
				>
					{isSubmitting ? (
						<>
							<Loader2 className="size-7 animate-spin" /> Signing
							up....
						</>
					) : (
						"Sign up"
					)}
				</Button>

				<div className="text-center text-sm">
					Already have an account?{" "}
					<button
						onClick={() => setIsLogin(true)}
						className="underline hover:text-primary"
					>
						Login
					</button>
				</div>
			</CardContent>
		</Card>
	);
}
