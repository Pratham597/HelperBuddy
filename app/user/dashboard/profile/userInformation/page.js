"use client"

import * as React from "react"
import Link from "next/link"
import axios from "axios"
import toast from "react-hot-toast"
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
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		const storedProfile = JSON.parse(localStorage.getItem("user"))
		if (storedProfile) {
			setProfile({
				id: storedProfile.id || "",
				name: storedProfile.name || "",
				email: storedProfile.email || "",
				phone: storedProfile.phone || "",
				token: storedProfile.token || "",
				referralCode: storedProfile.referralCode || "",
				wallet: storedProfile.wallet || "",
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

	const handleSubmit = async (event) => {
		event.preventDefault()
		setLoading(true)

		const storedProfile = JSON.parse(localStorage.getItem("user"))

		try {
			const response = await axios.patch(
				"/api/user/profile",
				profile,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${storedProfile.token}`
					},
				}
			)

			localStorage.setItem("user", JSON.stringify(response.data.user))
			setOriginalProfile(response.data.user)
			setIsChanged(false)
			toast.success("Profile updated successfully!")
		} catch (error) {
			toast.error(error.response?.data?.error || "Failed to update profile")
		} finally {
			setLoading(false)
		}
	}

	return (
		<>
			<header className="flex h-16 items-center gap-2 px-4">
				<SidebarTrigger className="-ml-1" />
				<Separator orientation="vertical" className="mr-2 h-4" />
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem className="hidden md:block">
							<Link href={`/user/dashboard/profile/userInformation`}>User</Link>
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
									<Input id="email" name="email" type="email" value={profile.email} disabled />
								</div>
								<div className="space-y-2">
									<Label htmlFor="phone">Phone</Label>
									<Input id="phone" name="phone" type="tel" value={profile.phone} onChange={handleChange} required />
								</div>
							</CardContent>
							<CardFooter className="px-6 py-4">
								<Button type="submit" disabled={!isChanged || loading}>
									{loading ? "Updating..." : "Update Profile"}
								</Button>
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
