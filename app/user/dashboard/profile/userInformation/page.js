"use client"

import * as React from "react"
import Link from "next/link"
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
	SidebarTrigger,
} from "@/components/ui/sidebar"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ProfilePage() {
	const [profile, setProfile] = useState({
		name: "John Doe",
		email: "john.doe@example.com",
		phone: "+1234567890",
	})

	const handleChange = (event) => {
		const { name, value } = event.target
		setProfile((prevProfile) => ({
			...prevProfile,
			[name]: value,
		}))
	}

	const handleSubmit = (event) => {
		event.preventDefault()
		// Handle form submission here
		console.log("Profile updated:", profile)
	}

	return (
		<>
			<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
				<div className="flex items-center gap-2 px-4">
					<SidebarTrigger className="-ml-1" />
					<Separator orientation="vertical" className="mr-2 h-4" />
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem className="hidden md:block">
								<Link href={`/user/dashboard`}>User</Link>
							</BreadcrumbItem>
							<BreadcrumbSeparator className="hidden md:block" />
							<BreadcrumbItem>
								<BreadcrumbPage>User Information</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</div>
			</header>
			<div className="space-y-6 px-6 py-4"> {/* Added padding */}
				<h1 className="text-3xl font-bold">Your Profile</h1>
				<Card>
					<CardHeader>
						<CardTitle>Edit Profile</CardTitle>
						<CardDescription>Update your personal information</CardDescription>
					</CardHeader>
					<form onSubmit={handleSubmit}>
						<CardContent className="space-y-4 px-6 py-4"> {/* Added padding */}
							<div className="space-y-2">
								<Label htmlFor="name">Name</Label>
								<Input
									id="name"
									name="name"
									value={profile.name}
									onChange={handleChange}
									required />
							</div>
							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<Input
									id="email"
									name="email"
									type="email"
									value={profile.email}
									onChange={handleChange}
									required />
							</div>
							<div className="space-y-2">
								<Label htmlFor="phone">Phone</Label>
								<Input
									id="phone"
									name="phone"
									type="tel"
									value={profile.phone}
									onChange={handleChange}
									required />
							</div>
						</CardContent>
						<CardFooter className="px-6 py-4"> {/* Added padding */}
							<Button type="submit">Update Profile</Button>
						</CardFooter>
					</form>
				</Card>
			</div>
		</>
	)
}

