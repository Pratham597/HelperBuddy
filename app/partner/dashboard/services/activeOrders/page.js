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
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";

export default function ActiveOrders() {
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedOrder, setSelectedOrder] = useState(null);
	const [verificationCode, setVerificationCode] = useState("");

	useEffect(() => {
		fetchOrders();
	}, []);

	const fetchOrders = async () => {
		try {
            const partner = JSON.parse(localStorage.getItem("partner"));
			if (!partner || !partner.token )
				throw new Error("No authentication token found.");

			const response = await axios.post(
				"/api/partner/fetchOrder",
				{},
				{
					headers: {
						Authorization: `Bearer ${partner.token}`,
						userId: partner.userId,
					},
				}
			);

			setOrders(response.data.serviceOrders);
		} catch (error) {
			console.error("Error fetching active orders:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleVerifyCode = async (orderId) => {
		try {
			const partner = JSON.parse(localStorage.getItem("partner"));
			if (!partner || !partner.token)
				throw new Error("No authentication token found.");

			await axios.post(
				"/api/partner/acceptOrder/verifyUserCode",
				{ orderId, code: verificationCode },
				{
					headers: { Authorization: `Bearer ${partner.token}` },
				}
			);

			toast.success("Order verified successfully");
			setOrders((prevOrders) =>
				prevOrders.filter((order) => order._id !== orderId)
			);
			setSelectedOrder(null);
		} catch (error) {
			console.error("Error verifying order:", error);
			toast.error("Invalid verification code");
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
								<BreadcrumbPage>Active Orders</BreadcrumbPage>
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
						<CardDescription>
							Verify service completion.
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
						) :!orders ? (
							<p className="text-gray-600">No active orders.</p>
						) :  (
							orders.map((order) => (
								<div
									key={order._id}
									className="p-4 bg-black text-white rounded-lg flex justify-between items-center"
								>
									<p className="font-medium">
										{order.service.name}
									</p>
									<Button
										className="text-black"
										variant="outline"
										onClick={() => setSelectedOrder(order)}
									>
										Verify Code
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
							<DialogTitle>Verify Order</DialogTitle>
						</DialogHeader>
						<p>
							<strong>Service:</strong>{" "}
							{selectedOrder.service.name}
						</p>
						<p>
							<strong>Timeline:</strong> {selectedOrder.timeline}
						</p>
						<p>
							<strong>Pincode:</strong> {selectedOrder.pincode}
						</p>
						<p>
							<strong>Address:</strong> {selectedOrder.address}
						</p>
						<input
							type="text"
							placeholder="Enter verification code"
							value={verificationCode}
							onChange={(e) =>
								setVerificationCode(e.target.value)
							}
							className="w-full p-2 border rounded-md mt-2 text-black"
						/>
						<DialogFooter className="flex justify-end gap-2">
							<Button
								variant="default"
								onClick={() =>
									handleVerifyCode(selectedOrder._id)
								}
							>
								Verify Code
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			)}
		</>
	);
}
