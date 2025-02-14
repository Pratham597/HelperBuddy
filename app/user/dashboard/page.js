"use client"

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export default function Page() {
	// Hardcoded orders
	const orders = [
		{ id: 1, status: "Paid" },
		{ id: 2, status: "Partner Assigned" },
	]

	const statusPercentages = {
		0: 15,
		1: 50,
		2: 100,
	}

	const bookingStages = ["Paid", "Partner Assigned", "Completed"]

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

			<div className="space-y-6 p-6">
				<h1 className="text-3xl font-bold">Order Progress</h1>

				{orders.length > 0 ? (
					orders.map((order) => {
						const currentStatusIndex = bookingStages.indexOf(order.status)
						const progressPercentage = statusPercentages[currentStatusIndex]

						return (
							<Card key={order.id} className="p-4">
								<CardHeader>
									<CardTitle>Order #{order.id}</CardTitle>
									<CardDescription>Track the progress of your order</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										<Progress value={progressPercentage} className="w-full" />
										<div className="flex justify-between text-xs sm:text-sm">
											{bookingStages.map((status, index) => (
												<div
													key={status}
													className={`w-1/3 text-center ${index <= currentStatusIndex ? "text-primary" : "text-gray-400"}`}
												>
													{status}
												</div>
											))}
										</div>
									</div>
								</CardContent>
							</Card>
						)
					})
				) : (
					<div className="text-center">
						<p className="mb-4">No active orders. Start a new one!</p>
						<Button>Place Order</Button>
					</div>
				)}
			</div>
		</>
	)
}
