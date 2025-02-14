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
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";

export default function ActiveOrders() {
	const [orders, setOrders] = useState([
		{
			_id: "1",
			service: { name: "House Cleaning" },
			status: "In Progress",
			estimatedCompletion: "2025-02-20",
			pincode: "110001",
			address: "123 Street, City",
			remarks: "Handle delicate items with care.",
		},
		{
			_id: "2",
			service: { name: "AC Repair" },
			status: "Scheduled",
			estimatedCompletion: "2025-02-22",
			pincode: "110002",
			address: "456 Avenue, City",
		},
	]);
	const [loading, setLoading] = useState(false); // Set to false since we have initial data
	const [selectedOrder, setSelectedOrder] = useState(null);

	useEffect(() => {
		fetchActiveOrders();
	}, []);

	const fetchActiveOrders = async () => {
		try {
			const user = JSON.parse(localStorage.getItem("user"));
			if (!user || !user.token) throw new Error("No authentication token found.");

			const response = await axios.post("/api/user/activeOrders", {}, {
				headers: { Authorization: `Bearer ${user.token}` },
			});

			setOrders(response.data.activeOrders);
		} catch (error) {
			console.error("Error fetching active orders:", error);
			toast.error("Failed to load active orders.");
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
								<Link href={`/user/dashboard`}>User</Link>
							</BreadcrumbItem>
							<BreadcrumbSeparator className="hidden md:block" />
							<BreadcrumbItem>
								<BreadcrumbPage>Services pending</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</div>
			</header>

			<div className="p-6 space-y-6">
				<h1 className="text-3xl font-bold">Active Orders</h1>
				<Card>
					<CardHeader>
						<CardTitle>Orders</CardTitle>
						<CardDescription>Track your active service orders.</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{loading ? (
							Array.from({ length: 5 }).map((_, index) => (
								<Skeleton key={index} className="h-20 w-full rounded-lg" />
							))
						) : orders.length === 0 ? (
							<p className="text-gray-600">No active orders.</p>
						) : (
							orders.map((order) => (
								<div key={order._id} className="p-4 bg-black text-white rounded-lg flex justify-between items-center">
									<p className="font-medium">{order.service.name}</p>
									<Button className="text-black" variant="outline" onClick={() => setSelectedOrder(order)}>
										View Details
									</Button>
								</div>
							))
						)}
					</CardContent>
				</Card>
			</div>

			{selectedOrder && (
				<Dialog open={true} onOpenChange={() => setSelectedOrder(null)}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Order Progress</DialogTitle>
						</DialogHeader>
						<p><strong>Service:</strong> {selectedOrder.service.name}</p>
						<p><strong>Status:</strong> {selectedOrder.status}</p>
						<p><strong>Pincode:</strong> {selectedOrder.pincode}</p>
						<p><strong>Address:</strong> {selectedOrder.address}</p>
						<DialogFooter className="flex justify-end gap-2">
							<Button variant="outline" onClick={() => setSelectedOrder(null)}>Close</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			)}
		</>
	);
}
