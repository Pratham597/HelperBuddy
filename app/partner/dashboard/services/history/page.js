"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import axios from "axios"
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Calendar, Package } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format, isSameDay } from "date-fns"
import { motion, AnimatePresence } from "framer-motion"
import toast from "react-hot-toast"

export default function OrderHistory() {
	const [history, setHistory] = useState([])
	const [loading, setLoading] = useState(true)
	const [searchQuery, setSearchQuery] = useState("")
	const [dateFilter, setDateFilter] = useState("all")
	const [customDate, setCustomDate] = useState(null)
	const [expandedOrders, setExpandedOrders] = useState({})
	const [currentPage, setCurrentPage] = useState(1)
	const ordersPerPage = 5

	useEffect(() => {
		fetchOrderHistory()
	}, [])

	const fetchOrderHistory = async () => {
		try {
			const partner = JSON.parse(localStorage.getItem("partner"))
			if (!partner || !partner.token) throw new Error("No authentication token found.")

			const response = await axios.post(
				"/api/partner/fetchOrderHistory",
				{},
				{
					headers: { Authorization: `Bearer ${partner.token}` },
				},
			)
			setHistory(response.data.serviceOrders || [])
		} catch (error) {
			console.error("Error fetching order history:", error)
			toast.error("Error fetching order history")
		} finally {
			setLoading(false)
		}
	}

	const toggleDetails = (orderId) => {
		setExpandedOrders((prev) => ({ ...prev, [orderId]: !prev[orderId] }))
	}

	const filterOrders = () => {
		const today = new Date()
		today.setHours(0, 0, 0, 0)
		const yesterday = new Date(today)
		yesterday.setDate(yesterday.getDate() - 1)
		const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1)
		const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
		const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 6, 1)

		return history.filter((order) => {
			const orderDate = new Date(order.timeline.split(" ")[0])
			let dateMatch = true

			switch (dateFilter) {
				case "today":
					dateMatch = isSameDay(orderDate, today)
					break
				case "yesterday":
					dateMatch = isSameDay(orderDate, yesterday)
					break
				case "thisMonth":
					dateMatch = orderDate >= thisMonth
					break
				case "lastMonth":
					dateMatch = orderDate >= lastMonth && orderDate < thisMonth
					break
				case "last6Months":
					dateMatch = orderDate >= sixMonthsAgo
					break
				case "custom":
					dateMatch = customDate && isSameDay(orderDate, customDate)
					break
				default:
					dateMatch = true
			}

			const searchMatch = searchQuery
				? order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
				order.service.name.toLowerCase().includes(searchQuery.toLowerCase())
				: true

			return dateMatch && searchMatch
		})
	}

	const filteredOrders = filterOrders()
	const totalPages = Math.ceil(filteredOrders.length / ordersPerPage)
	const indexOfLastOrder = currentPage * ordersPerPage
	const indexOfFirstOrder = indexOfLastOrder - ordersPerPage
	const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder)

	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
			{/* Responsive Header */}
			<header className="sticky top-0 z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-white dark:bg-gray-800 shadow-sm">
				<div className="flex items-center gap-2 w-full sm:w-auto">
					<SidebarTrigger className="-ml-1" />
					<Separator orientation="vertical" className="h-4" />
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem className="hidden md:block">
								<Link href="/partner/dashboard">Partner</Link>
							</BreadcrumbItem>
							<BreadcrumbSeparator className="hidden md:block" />
							<BreadcrumbItem>
								<BreadcrumbPage className="flex items-center gap-2">
									Order History
								</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</div>

				{/* Responsive Search and Filter Controls */}
				<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto sm:ml-auto">
					<Input
						type="text"
						placeholder="Search orders..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full sm:w-48 md:w-64"
					/>
					<div className="flex gap-4 w-full sm:w-auto">
						<Select value={dateFilter} onValueChange={setDateFilter}>
							<SelectTrigger className="w-full sm:w-48">
								<SelectValue placeholder="Filter by date" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Orders</SelectItem>
								<SelectItem value="today">Today</SelectItem>
								<SelectItem value="yesterday">Yesterday</SelectItem>
								<SelectItem value="thisMonth">This Month</SelectItem>
								<SelectItem value="lastMonth">Last Month</SelectItem>
								<SelectItem value="last6Months">Last 6 Months</SelectItem>
								<SelectItem value="custom">Custom Date</SelectItem>
							</SelectContent>
						</Select>
						{dateFilter === "custom" && (
							<Popover>
								<PopoverTrigger asChild>
									<Button variant="outline" className="w-full sm:w-48">
										<Calendar className="mr-2 h-4 w-4" />
										{customDate ? format(customDate, "PPP") : <span>Pick a date</span>}
									</Button>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0">
									<CalendarComponent mode="single" selected={customDate} onSelect={setCustomDate} initialFocus />
								</PopoverContent>
							</Popover>
						)}
					</div>
				</div>
			</header>

			{/* Responsive Main Content */}
			<main className="container mx-auto py-8 px-4">
				<div className="max-w-7xl mx-auto">
					<div className="mb-8">
						<h1 className="text-2xl sm:text-3xl font-bold text-black">Completed Orders</h1>
					</div>

					{loading ? (
						<div className="space-y-4">
							{Array.from({ length: 5 }).map((_, index) => (
								<Skeleton key={index} className="h-20 w-full rounded-lg" />
							))}
						</div>
					) : currentOrders.length === 0 ? (
						<Card className="text-center py-8 sm:py-12 border border-gray-200">
							<CardContent>
								<Package className="mx-auto h-8 sm:h-12 w-8 sm:w-12 text-gray-400" />
								<h3 className="mt-2 text-sm font-medium text-black">No completed orders</h3>
								<p className="mt-1 text-sm text-gray-600">You have no completed orders in this period.</p>
							</CardContent>
						</Card>
					) : (
						<div className="space-y-4">
							{currentOrders.map((order) => (
								<Card key={order._id} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
									<CardHeader className="bg-white px-4 sm:px-6 py-4 sm:py-5">
										<div className="flex flex-col sm:flex-row items-start justify-between gap-4">
											<div className="w-full sm:w-auto">
												<CardTitle className="text-base sm:text-lg font-semibold text-black">
													Order {order._id.slice(-6)}
												</CardTitle>
												<CardDescription className="mt-1 text-sm text-gray-600">
													Service: {order.service.name}
													<br />
													Completed on: {order.timeline.split(" ")[0]}
												</CardDescription>
											</div>
											<Button
												onClick={() => toggleDetails(order._id)}
												variant="outline"
												size="sm"
												className="w-full sm:w-auto flex items-center justify-center border-gray-400 text-gray-800 hover:bg-gray-50 hover:text-black hover:border-gray-600"
											>
												{expandedOrders[order._id] ? "Hide" : "View"} Details
												{expandedOrders[order._id] ? (
													<ChevronUp className="ml-2 h-4 w-4" />
												) : (
													<ChevronDown className="ml-2 h-4 w-4" />
												)}
											</Button>
										</div>
									</CardHeader>
									<CardContent className="px-4 sm:px-6 py-4 sm:py-5">
										<AnimatePresence>
											{expandedOrders[order._id] && (
												<motion.div
													initial={{ opacity: 0, height: 0 }}
													animate={{ opacity: 1, height: "auto" }}
													exit={{ opacity: 0, height: 0 }}
													transition={{ duration: 0.3 }}
												>
													<dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
														<div>
															<dt className="text-sm font-medium text-gray-600">Category</dt>
															<dd className="mt-1 text-sm text-black">{order.service.category}</dd>
														</div>
														<div>
															<dt className="text-sm font-medium text-gray-600">Price</dt>
															<dd className="mt-1 text-sm text-black">₹{order.service.price.toLocaleString()}</dd>
														</div>
														<div>
															<dt className="text-sm font-medium text-gray-600">Timeline</dt>
															<dd className="mt-1 text-sm text-black">{order.timeline}</dd>
														</div>
														<div>
															<dt className="text-sm font-medium text-gray-600">Pincode</dt>
															<dd className="mt-1 text-sm text-black">{order.pincode}</dd>
														</div>
														<div className="sm:col-span-2">
															<dt className="text-sm font-medium text-gray-600">Address</dt>
															<dd className="mt-1 text-sm text-black break-words">{order.address}</dd>
														</div>
														{order.rating && (
															<div>
																<dt className="text-sm font-medium text-gray-600">Rating</dt>
																<dd className="mt-1 text-sm text-black">{order.rating} / 5</dd>
															</div>
														)}
													</dl>
												</motion.div>
											)}
										</AnimatePresence>
									</CardContent>
								</Card>
							))}
						</div>
					)}

					{/* Responsive Pagination */}
					{!loading && filteredOrders.length > 0 && (
						<div className="mt-8">
							<div className="flex flex-wrap justify-center items-center gap-2">
								<Button
									variant="outline"
									size="sm"
									onClick={() => setCurrentPage(currentPage - 1)}
									disabled={currentPage === 1}
								>
									Previous
								</Button>

								{[...Array(totalPages)].map((_, index) => (
									<Button
										key={index + 1}
										variant={currentPage === index + 1 ? "default" : "outline"}
										size="sm"
										onClick={() => setCurrentPage(index + 1)}
										className={`${currentPage === index + 1 ? "bg-black text-white" : ""} hidden sm:inline-flex`}
									>
										{index + 1}
									</Button>
								))}

								<span className="text-sm text-gray-600 sm:hidden">
									Page {currentPage} of {totalPages}
								</span>

								<Button
									variant="outline"
									size="sm"
									onClick={() => setCurrentPage(currentPage + 1)}
									disabled={currentPage === totalPages}
								>
									Next
								</Button>
							</div>

							<div className="text-center text-sm text-gray-600 mt-2">
								Showing {indexOfFirstOrder + 1} to {Math.min(indexOfLastOrder, filteredOrders.length)} of{" "}
								{filteredOrders.length} orders
							</div>
						</div>
					)}
				</div>
			</main>
		</div>
	)
}

