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
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProfilePage() {
	const [profile, setProfile] = useState(null)
	const [isChanged, setIsChanged] = useState(false)
	const [originalProfile, setOriginalProfile] = useState(null)

	useEffect(() => {
		const storedProfile = JSON.parse(localStorage.getItem("user"))
		if (storedProfile) {
			setProfile({
				name: storedProfile.name || "",
				email: storedProfile.email || "",
				phone: storedProfile.phone || "",
			})
			setOriginalProfile({ ...storedProfile })
		}
	}, [])

	const handleChange = (event) => {
		const { name, value } = event.target
		setProfile((prevProfile) => ({
			...prevProfile,
			[name]: value,
		}))
		setIsChanged(value !== originalProfile[name])
	}

	const handleSubmit = (event) => {
		event.preventDefault()
		localStorage.setItem("user", JSON.stringify(profile))
		console.log("Profile updated:", profile)
		setIsChanged(false)
		setOriginalProfile({ ...profile })
	}

	return (
		<>
			<header className="flex h-16 items-center gap-2 px-4">
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
			</header>
			<div className="space-y-6 px-6 py-4">
				<h1 className="text-3xl font-bold">Your Profile</h1>
				<Card>
					<CardHeader>
						<CardTitle>Edit Profile</CardTitle>
						<CardDescription>Update your personal information</CardDescription>
					</CardHeader>
					{profile ? (
						<form onSubmit={handleSubmit}>
							<CardContent className="space-y-4 px-6 py-4">
								<div className="space-y-2">
									<Label htmlFor="name">Name</Label>
									<Input id="name" name="name" value={profile.name} onChange={handleChange} required />
								</div>
								<div className="space-y-2">
									<Label htmlFor="email">Email</Label>
									<Input id="email" name="email" type="email" value={profile.email} onChange={handleChange} required />
								</div>
								<div className="space-y-2">
									<Label htmlFor="phone">Phone</Label>
									<Input id="phone" name="phone" type="tel" value={profile.phone} onChange={handleChange} required />
								</div>
							</CardContent>
							<CardFooter className="px-6 py-4">
								<Button type="submit" disabled={!isChanged}>Update Profile</Button>
							</CardFooter>
						</form>
					) : (
						<div className="p-6 space-y-4">
							<Skeleton className="h-8 w-3/4" />
							<Skeleton className="h-8 w-3/4" />
							<Skeleton className="h-8 w-3/4" />
						</div>
					)}
				</Card>
			</div>
		</>
	)
}