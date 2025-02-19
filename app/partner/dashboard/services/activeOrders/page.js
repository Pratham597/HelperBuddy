"use client"

import { DialogFooter } from "@/components/ui/dialog"
import { DialogTitle } from "@/components/ui/dialog"
import { DialogHeader } from "@/components/ui/dialog"
import { DialogContent } from "@/components/ui/dialog"
import { Dialog } from "@/components/ui/dialog"
import { useState, useEffect } from "react"
import axios from "axios"
import { ChevronDown, ChevronUp, ShoppingBag, Loader2, Calendar, Package } from "lucide-react"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { motion, AnimatePresence } from "framer-motion"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format, isSameDay, parseISO } from "date-fns"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import toast from "react-hot-toast"

export default function ActiveOrders() {
	const [dateGroups, setDateGroups] = useState([])
	const [expandedOrders, setExpandedOrders] = useState({})
	const [expandedServices, setExpandedServices] = useState({})
	const [isLoading, setIsLoading] = useState(true)
	const [dateFilter, setDateFilter] = useState("all")
	const [customDate, setCustomDate] = useState(null)
	const [searchQuery, setSearchQuery] = useState("")
	const [currentPage, setCurrentPage] = useState(1)
	const [verificationCode, setVerificationCode] = useState("")
	const [selectedOrder, setSelectedOrder] = useState(null)
	const ordersPerPage = 10

	const handlePageChange = (pageNumber) => {
		setCurrentPage(pageNumber)
	}

	const formatDate = (dateString) => {
		try {
			const date = new Date(dateString)
			if (isNaN(date.getTime())) {
				return new Date().toISOString().split("T")[0]
			}
			return date.toISOString().split("T")[0]
		} catch (error) {
			console.error("Date parsing error:", error)
			return new Date().toISOString().split("T")[0]
		}
	}

	useEffect(() => {
		fetchOrders()
	}, [])

	const fetchOrders = async () => {
		setIsLoading(true)
		try {
			const partner = JSON.parse(localStorage.getItem("partner") || "{}")
			if (!partner || !partner.token) throw new Error("No authentication token found.")

			const headers = {
				Authorization: `Bearer ${partner.token}`,
				userId: partner.userId,
			}

			const response = await axios.post("/api/partner/acceptedOrders", {}, { headers })

			const processedOrders = processOrders(response.data.serviceOrders)
			setDateGroups(processedOrders)
		} catch (error) {
			console.error("Error fetching active orders:", error)
		} finally {
			setIsLoading(false)
		}
	}

	const processOrders = (orders) => {
		const ordersByDate = orders.reduce((acc, order) => {
			const date = formatDate(order.timeline)
			if (!acc[date]) {
				acc[date] = []
			}
			acc[date].push(order)
			return acc
		}, {})

		return Object.entries(ordersByDate)
			.map(([date, orders]) => ({
				date,
				bookings: orders.map((order) => ({
					bookingId: order._id,
					orderId: order._id,
					totalAmount: order.service.price,
					isPaid: order.isPaid,
					paymentMethod: "Online",
					walletUsed: 0,
					date,
					orders: [
						{
							id: order._id,
							status: order.isPaid ? "Paid" : "Partner Assigned",
							service: {
								name: order.service.name,
								category: order.service.category,
								price: order.service.price,
								description: order.service.description,
								image: order.service.image,
							},
							timeline: order.timeline,
							pincode: order.pincode,
							address: order.address,
							userCode: order.userCode,
							userApproved: order.userApproved,
							rating: order.rating,
							createdAt: order.createdAt,
							updatedAt: order.updatedAt,
						},
					],
				})),
			}))
			.sort((a, b) => new Date(b.date) - new Date(a.date))
	}

	const toggleDetails = (bookingId) => {
		setExpandedOrders((prev) => ({ ...prev, [bookingId]: !prev[bookingId] }))
	}

	const toggleServiceDetails = (serviceId) => {
		setExpandedServices((prev) => ({ ...prev, [serviceId]: !prev[serviceId] }))
	}

	const statusPercentages = {
		"Partner Assigned": 15,
		"Paid": 50,
		Completed: 100,
	}

	const bookingStages = ["Partner Assigned", "Paid", "Completed"]

	const filterOrders = () => {
		const today = new Date()
		today.setHours(0, 0, 0, 0)
		const yesterday = new Date(today)
		yesterday.setDate(yesterday.getDate() - 1)
		const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1)
		const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
		const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 6, 1)

		return dateGroups
			.map((group) => {
				const groupDate = new Date(group.date)

				let dateMatch = true
				switch (dateFilter) {
					case "today":
						dateMatch = isSameDay(groupDate, today)
						break
					case "yesterday":
						dateMatch = isSameDay(groupDate, yesterday)
						break
					case "thisMonth":
						dateMatch = groupDate >= thisMonth
						break
					case "lastMonth":
						dateMatch = groupDate >= lastMonth && groupDate < thisMonth
						break
					case "last6Months":
						dateMatch = groupDate >= sixMonthsAgo
						break
					case "custom":
						dateMatch = customDate && isSameDay(groupDate, customDate)
						break
					default:
						dateMatch = true
				}

				if (!dateMatch) return null

				const filteredBookings = group.bookings.filter((booking) => {
					const bookingIdMatch = searchQuery
						? booking.bookingId.toLowerCase().includes(searchQuery.toLowerCase())
						: true

					return bookingIdMatch
				})

				if (filteredBookings.length === 0) return null

				return {
					...group,
					bookings: filteredBookings,
				}
			})
			.filter((group) => group !== null)
	}

	const filteredDateGroups = filterOrders()

	const handleVerifyCode = async (orderId) => {
		try {
			const partner = JSON.parse(localStorage.getItem("partner"))
			if (!partner || !partner.token) throw new Error("No authentication token found.")

			await axios.post(
				"/api/partner/acceptOrder/verifyUserCode",
				{ serviceorder_id: orderId, userCode: verificationCode },
				{
					headers: { Authorization: `Bearer ${partner.token}` },
				},
			)

			toast.success("Order verified successfully")
			fetchOrders() // Refresh orders after verification
			setSelectedOrder(null)
		} catch (error) {
			console.error("Error verifying order:", error)
			toast.error("Invalid verification code")
		}
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
			<header className="sticky top-0 z-10 flex flex-col sm:flex-row items-center gap-2 p-4 bg-white dark:bg-gray-800 shadow-sm">
				<div className="flex items-center w-full sm:w-auto">
					<SidebarTrigger className="-ml-1" />
					<Separator orientation="vertical" className="h-4 mx-2" />
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem>
								<BreadcrumbPage className="flex items-center gap-2">
									<Link href={"/partner/dashboard"}>partner</Link>
								</BreadcrumbPage>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbPage className="flex items-center gap-2">
									Active Orders
								</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</div>

				<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-4 sm:mt-0 w-full sm:w-auto sm:ml-auto">
					<input
						type="text"
						placeholder="Search by ID"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full sm:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
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
									<Calendar className="mr-2 h-2 w-4" />
									{customDate ? format(customDate, "PPP") : <span>Pick a date</span>}
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0">
								<CalendarComponent mode="single" selected={customDate} onSelect={setCustomDate} initialFocus />
							</PopoverContent>
						</Popover>
					)}
				</div>
			</header>

			<main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
				<div className="sm:px-0">
					<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
						<h1 className="text-3xl font-bold text-black">Active Orders</h1>
					</div>

					{isLoading ? (
						<div className="flex justify-center items-center h-64">
							<Loader2 className="w-8 h-8 animate-spin text-gray-500" />
						</div>
					) : filteredDateGroups.length > 0 ? (
						<div className="space-y-12">
							{(() => {
								const allBookings = filteredDateGroups.flatMap((dateGroup) =>
									dateGroup.bookings.map((booking) => ({
										...booking,
										groupDate: dateGroup.date,
									})),
								)

								const totalBookings = allBookings.length
								const totalPages = Math.ceil(totalBookings / ordersPerPage)

								const indexOfLastBooking = currentPage * ordersPerPage
								const indexOfFirstBooking = indexOfLastBooking - ordersPerPage
								const currentBookings = allBookings.slice(indexOfFirstBooking, indexOfLastBooking)

								const groupedBookings = currentBookings.reduce((acc, booking) => {
									const date = booking.groupDate
									if (!acc[date]) {
										acc[date] = []
									}
									acc[date].push(booking)
									return acc
								}, {})

								return (
									<>
										{Object.entries(groupedBookings).map(([date, bookings]) => (
											<div key={date} className="space-y-6">
												<h2 className="text-xl font-semibold text-black border-b border-gray-200 pb-2">
													{format(parseISO(date), "EEEE, MMMM d, yyyy")}
												</h2>
												<div className="space-y-4">
													{bookings.map((booking) => (
														<Card
															key={booking.bookingId}
															className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
														>
															<CardHeader className="bg-white px-6 py-5">
																<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between sm:flex-nowrap">
																	<div>
																		<CardTitle className="text-lg font-semibold text-black">
																			Order {booking.bookingId.slice(-6)}
																		</CardTitle>
																		<CardDescription className="mt-1 text-sm text-gray-600">
																			Total Amount: ₹{booking.totalAmount.toLocaleString()}
																			<br />
																			Booking ID: {booking.bookingId}
																		</CardDescription>
																	</div>
																	<div className="mt-4 sm:mt-0 sm:ml-4 flex-shrink-0">
																		<Button
																			onClick={() => toggleDetails(booking.bookingId)}
																			variant="outline"
																			size="sm"
																			className="flex items-center border-gray-400 text-gray-800 hover:bg-gray-50 hover:text-black hover:border-gray-600"
																		>
																			{expandedOrders[booking.bookingId] ? "Hide" : "View"} Details
																			{expandedOrders[booking.bookingId] ? (
																				<ChevronUp className="ml-2 h-4 w-4" />
																			) : (
																				<ChevronDown className="ml-2 h-4 w-4" />
																			)}
																		</Button>
																	</div>
																</div>
															</CardHeader>

															<CardContent className="px-6 py-5">
																<AnimatePresence>
																	{expandedOrders[booking.bookingId] && (
																		<motion.div
																			initial={{ opacity: 0, height: 0 }}
																			animate={{ opacity: 1, height: "auto" }}
																			exit={{ opacity: 0, height: 0 }}
																			transition={{ duration: 0.3 }}
																		>
																			{booking.orders.map((order, index) => (
																				<div
																					key={order.id}
																					className={index > 0 ? "mt-8 pt-8 border-t border-gray-200" : ""}
																				>
																					<div className="flex items-center justify-between">
																						<h3 className="text-lg font-medium text-black">
																							Service {index + 1}: {order.service.name}
																						</h3>
																						<Button
																							onClick={() => toggleServiceDetails(order.id)}
																							variant="outline"
																							size="sm"
																							className="flex items-center my-3 border-gray-400 text-gray-800 hover:bg-gray-50 hover:text-black hover:border-gray-600"
																						>
																							{expandedServices[order.id] ? (
																								<ChevronUp className=" h-4 w-4" />
																							) : (
																								<ChevronDown className="h-4 w-4" />
																							)}
																						</Button>
																					</div>
																					<div className="mb-6">
																						<div className="relative">
																							<Progress
																								value={statusPercentages[order.status]}
																								className="h-2 bg-gray-100"
																							/>
																							<div className="absolute top-1/2 left-0 w-full flex justify-between transform -translate-y-1/2">
																								{bookingStages.map((status) => (
																									<div key={status} className="relative">
																										<div
																											className={`w-4 h-4 rounded-full border-2 ${status === order.status
																												? "bg-black border-black"
																												: "bg-white border-gray-300"
																												}`}
																										></div>
																									</div>
																								))}
																							</div>
																						</div>
																						<div className="flex justify-between text-xs mt-2">
																							{bookingStages.map((status) => (
																								<div
																									key={status}
																									className={`w-1/3 text-center ${status === order.status ? "text-black font-medium" : "text-gray-500"
																										}`}
																								>
																									{status}
																								</div>
																							))}
																						</div>
																					</div>
																					<AnimatePresence>
																						{expandedServices[order.id] && (
																							<motion.div
																								initial={{ opacity: 0, height: 0 }}
																								animate={{ opacity: 1, height: "auto" }}
																								exit={{ opacity: 0, height: 0 }}
																								transition={{ duration: 0.3 }}
																							>
																								<dl className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
																									<div className="sm:col-span-1">
																										<dt className="text-sm font-medium text-gray-600">Category</dt>
																										<dd className="mt-1 text-sm text-black">
																											{order.service.category}
																										</dd>
																									</div>
																									<div className="sm:col-span-1">
																										<dt className="text-sm font-medium text-gray-600">Price</dt>
																										<dd className="mt-1 text-sm text-black">
																											₹{order.service.price.toLocaleString()}
																										</dd>
																									</div>
																									<div className="sm:col-span-1">
																										<dt className="text-sm font-medium text-gray-600">Timeline</dt>
																										<dd className="mt-1 text-sm text-black">{order.timeline}</dd>
																									</div>
																									<div className="sm:col-span-1">
																										<dt className="text-sm font-medium text-gray-600">Pincode</dt>
																										<dd className="mt-1 text-sm text-black">{order.pincode}</dd>
																									</div>
																									<div className="sm:col-span-2">
																										<dt className="text-sm font-medium text-gray-600">Address</dt>
																										<dd className="mt-1 text-sm text-black">{order.address}</dd>
																									</div>
																								</dl>
																								<div className="mt-4">
																									<Button
																										onClick={() => setSelectedOrder(order)}
																										variant="outline"
																										size="sm"
																									>
																										Verify Code
																									</Button>
																								</div>
																							</motion.div>
																						)}
																					</AnimatePresence>
																				</div>
																			))}
																		</motion.div>
																	)}
																</AnimatePresence>
															</CardContent>
														</Card>
													))}
												</div>
											</div>
										))}

										{/* Pagination Controls */}
										<div className="flex flex-wrap justify-center items-center gap-2">
											<Button
												variant="outline"
												size="sm"
												onClick={() => handlePageChange(currentPage - 1)}
												disabled={currentPage === 1}
											>
												Previous
											</Button>

											{[...Array(totalPages)].map((_, index) => (
												<Button
													key={index + 1}
													variant={currentPage === index + 1 ? "default" : "outline"}
													size="sm"
													onClick={() => handlePageChange(index + 1)}
													className={currentPage === index + 1 ? "bg-black text-white" : ""}
												>
													{index + 1}
												</Button>
											))}

											<Button
												variant="outline"
												size="sm"
												onClick={() => handlePageChange(currentPage + 1)}
												disabled={currentPage === totalPages}
											>
												Next
											</Button>
										</div>

										{/* Page information */}
										<div className="text-center text-sm text-gray-600 mt-2">
											Showing {indexOfFirstBooking + 1} to {Math.min(indexOfLastBooking, totalBookings)} of{" "}
											{totalBookings} orders
										</div>
									</>
								)
							})()}
						</div>
					) : (
						<Card className="text-center py-12 border border-gray-200">
							<CardContent>
								<ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
								<h3 className="mt-2 text-sm font-medium text-black">No active orders</h3>
								<p className="mt-1 text-sm text-gray-600">You currently have no active orders.</p>
							</CardContent>
						</Card>
					)}
				</div>
			</main>

			<Dialog open={selectedOrder !== null} onOpenChange={() => setSelectedOrder(null)}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Verify Order Code</DialogTitle>
					</DialogHeader>
					<Input
						type="text"
						placeholder="Enter verification code"
						value={verificationCode}
						onChange={(e) => setVerificationCode(e.target.value)}
					/>
					<DialogFooter>
						<Button onClick={() => handleVerifyCode(selectedOrder?.id)}>Verify</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	)
}

