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

export default function ProfilePage() {
	const [user, setUser] = React.useState({
		name: "John Doe",
		email: "johndoe@example.com",
		phone: "+1 (123) 456-7890",
		address: "123 Main St, Springfield, USA",
		joined: "January 15, 2023",
	})

	const handleChange = (e) => {
		setUser({ ...user, [e.target.name]: e.target.value })
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		console.log("Updated Profile:", user)
		alert("Profile updated successfully!")
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
			<div className="w-full max-w-6xl mx-auto mt-6 p-6 bg-white shadow-md rounded-lg">

				<h2 className="text-2xl font-semibold mb-6">Update Profile</h2>
				<form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">

					<div className="flex flex-col">
						<label className="font-medium text-gray-600">Full Name</label>
						<input
							type="text"
							name="name"
							value={user.name}
							onChange={handleChange}
							placeholder="Enter your name"
							className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					<div className="flex flex-col">
						<label className="font-medium text-gray-600">Email</label>
						<input
							type="email"
							name="email"
							value={user.email}
							onChange={handleChange}
							placeholder="Enter your email"
							className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					<div className="flex flex-col">
						<label className="font-medium text-gray-600">Phone</label>
						<input
							type="tel"
							name="phone"
							value={user.phone}
							onChange={handleChange}
							placeholder="Enter your phone number"
							className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					<div className="flex flex-col">
						<label className="font-medium text-gray-600">Address</label>
						<input
							type="text"
							name="address"
							value={user.address}
							onChange={handleChange}
							placeholder="Enter your address"
							className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					<div className="flex flex-col md:col-span-2">
						<label className="font-medium text-gray-600">Joined</label>
						<input
							type="text"
							value={user.joined}
							readOnly
							className="p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
						/>
					</div>

					<div className="md:col-span-2 flex justify-start">
						<button
							type="submit"
							className="px-6 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
						>
							Save Changes
						</button>
					</div>
				</form>
			</div>
		</>
	)
}
