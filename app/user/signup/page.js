"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const colors = {
	primary: "#060606",
	secondary: "#E0E0E0",
	disabled: "#D9D9D9",
};

const IMAGE_URL =
	"https://scrubnbubbles.com/wp-content/uploads/2022/05/cleaning-service.jpeg";

export default function Page() {
	return (
		<div className="flex h-screen ">
			{/* left signup side */}
			<div className="flex flex-col items-center justify-center w-full md:w-1/2 p-8">
				<Card className="w-full max-w-md">
					<CardHeader className="space-y-1 text-center">
						<CardTitle className="text-3xl font-bold">
							HelperBuddy
						</CardTitle>
						<p className="text-sm text-muted-foreground">
							Fill your details to create an account
						</p>
                    </CardHeader>
                    
                    <CardContent className="space-y-4">
                        
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								placeholder="example@email.com"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input id="password" type="password" />
						</div>
						<Button
							className="w-full"
							style={{ backgroundColor: colors.primary }}
						>
							Login
						</Button>
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
							<Link
								href="/user/signup"
								className="underline hover:text-primary"
							>
								Create one
							</Link>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* right image side */}
			<div className="hidden md:flex w-1/2 relative">
				<img
					src={IMAGE_URL}
					className="w-full h-full object-cover object-[60%]"
					alt="Cleaning Service"
				/>
				{/* Text Overlay */}
				<div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white px-6 text-center">
					<h1 className="text-4xl font-bold">
						Book Services with Ease!
					</h1>
					<p className="mt-2 text-base ">
						Quick, reliable, and hassle-free service booking for all
						your needs, at one place.
					</p>
				</div>
			</div>
		</div>
	);
}
