"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
	Card,
	CardHeader,
	CardContent,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";

export default function OrderHistory() {
	const [history, setHistory] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		fetchOrderHistory();
	}, []);

	const fetchOrderHistory = async () => {
		try {
			const partner = JSON.parse(localStorage.getItem("partner"));
			if (!partner || !partner.token)
				throw new Error("No authentication token found.");

			const response = await axios.post(
				"/api/partner/fetchOrderHistory",
				{},
				{
					headers: { Authorization: `Bearer ${partner.token}` },
				}
			);
			setHistory(response.data.serviceOrders || []);
		} catch (error) {
			console.error("Error fetching order history:", error);
			toast.error("Error fetching order history");
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<header className="flex h-16 shrink-0 items-center gap-2">
				<div className="flex items-center gap-2 px-4">
					<SidebarTrigger className="-ml-1" />
					<Separator orientation="vertical" className="mr-2 h-4" />
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem className="hidden md:block">
								<Link href={`/partner/dashboard`}>Partner</Link>
							</BreadcrumbItem>
							<BreadcrumbSeparator className="hidden md:block" />
							<BreadcrumbItem>
								<BreadcrumbPage>Order History</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</div>
			</header>

			<div className="p-6 space-y-6">
				<h1 className="text-3xl font-bold">Order History</h1>
				<Card>
					<CardHeader>
						<CardTitle>Completed Orders</CardTitle>
						<CardDescription>
							Review past service orders.
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{loading ? (
							Array.from({ length: 5 }).map((_, index) => (
								<Skeleton
									key={index}
									className="h-20 w-full rounded-lg"
								/>
							))
						) : history.length === 0 ? (
							<p className="text-gray-600">
								No past orders available.
							</p>
						) : (
							history.map((order) => (
								<div
									key={order._id}
									className="p-4 bg-black text-white rounded-lg flex justify-between items-center"
								>
									<p className="font-medium">
										{order.service.name}
									</p>
									<p className="text-sm text-gray-300">
										Completed on: {order.timeline.split(" ")[0]}
									</p>
								</div>
							))
						)}
					</CardContent>
				</Card>
			</div>
		</>
	);
}
