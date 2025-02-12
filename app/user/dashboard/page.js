"use client"

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
	SidebarTrigger,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export default function Page() {
	const userData = {
		username: "John Doe",
		hasActiveBooking: true,
		bookingStatus: "Processing", // Could be "Ordered", "Processing", "Shipped", or "Delivered"
	}

	const bookingStatuses = ["Ordered", "Processing", "Shipped", "Delivered"]
	const currentStatusIndex = bookingStatuses.indexOf(userData.bookingStatus)
	const progressPercentage = ((currentStatusIndex + 1) / bookingStatuses.length) * 100

	return (
		<>
			<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
				<div className="flex items-center gap-2 px-4">
					<SidebarTrigger className="-ml-1" />
					<Separator orientation="vertical" className="mr-2 h-4" />
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem>
								<BreadcrumbPage>User</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</div>
			</header>
			<div className="space-y-6">
				<h1 className="text-3xl font-bold">Welcome, {userData.username}!</h1>

				<Card>
					<CardHeader>
						<CardTitle>Booking Status</CardTitle>
						<CardDescription>
							{userData.hasActiveBooking
								? "Track the progress of your current booking"
								: "You don't have any active bookings"}
						</CardDescription>
					</CardHeader>
					<CardContent>
						{userData.hasActiveBooking ? (
							<div className="space-y-4">
								<Progress value={progressPercentage} className="w-full" />
								<div className="flex justify-between">
									{bookingStatuses.map((status, index) => (
										<div
											key={status}
											className={`text-sm ${index <= currentStatusIndex ? "text-primary" : "text-gray-400"}`}
										>
											{status}
										</div>
									))}
								</div>
							</div>
						) : (
							<div className="text-center">
								<p className="mb-4">No current bookings. Start a new one!</p>
								<Button>Start New Booking</Button>
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</>
	)
}
