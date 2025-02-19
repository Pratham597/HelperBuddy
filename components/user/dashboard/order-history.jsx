"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { ChevronDown, ChevronUp, Star, Store, MessageSquare, Package, Calendar } from "lucide-react"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "react-hot-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format, isSameDay, parseISO } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

const OrderSkeleton = () => (
  <Card className="border-0 shadow-lg overflow-hidden mb-4">
    <CardHeader className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700">
      <div className="space-y-2">
        <Skeleton className="h-6 w-32 bg-gray-700" />
        <Skeleton className="h-4 w-24 bg-gray-700" />
        <Skeleton className="h-4 w-40 bg-gray-700" />
      </div>
    </CardHeader>
    <CardContent className="p-6 space-y-4">
      <div className="space-y-4">
        <Skeleton className="h-6 w-48" />
        <div className="flex justify-between">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
        </div>
      </div>
    </CardContent>
  </Card>
)

export default function OrderHistory() {
  const [orders, setOrders] = useState([])
  const [expandedOrders, setExpandedOrders] = useState({})
  const [feedbackOrders, setFeedbackOrders] = useState({})
  const [ratings, setRatings] = useState({})
  const [feedbacks, setFeedbacks] = useState({})
  const [isHovering, setIsHovering] = useState({})
  const [dateFilter, setDateFilter] = useState("all")
  const [customDate, setCustomDate] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState({})
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setIsLoading(true)
    try {
      const user = JSON.parse(localStorage.getItem("user"))
      if (!user || !user.token) return

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      }

      const response = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/user/serviceDone`, {}, { headers })
      // console.log(response.data)

      // Group service orders by booking ID
      const groupedOrders = response.data.serviceOrder.reduce((acc, order) => {
        const bookingId = order.payment._id
        if (!acc[bookingId]) {
          acc[bookingId] = {
            bookingDetails: {
              _id: order.payment._id,
              totalAmount: order.payment.totalAmount,
              orderId: order.payment.orderId,
              paymentMethod: order.payment.paymentMethod,
              createdAt: order.payment.createdAt,
              walletUsed: order.payment.walletUsed,
            },
            services: [],
          }
        }
        acc[bookingId].services.push({
          id: order._id,
          service: order.service,
          address: order.address,
          pincode: order.pincode,
          timeline: order.timeline,
          userCode: order.userCode,
          remarks: order.remarks,
          rating: order.rating,
          key: order._id,
        })
        return acc
      }, {})

      // Convert grouped object to array and sort by date
      const allOrders = Object.values(groupedOrders).sort(
        (a, b) => new Date(b.bookingDetails.createdAt) - new Date(a.bookingDetails.createdAt),
      )

      setOrders(allOrders)

      const initialRatings = {}
      const initialFeedbacks = {}
      allOrders.forEach((group) => {
        group.services.forEach((service) => {
          initialRatings[service.id] = service.rating || 5
          initialFeedbacks[service.id] = service.remarks || ""
        })
      })
      setRatings(initialRatings)
      setFeedbacks(initialFeedbacks)
    } catch (error) {
      console.error(error)
      toast.error("Failed to fetch orders. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const toggleDetails = (id) => {
    setExpandedOrders((prev) => ({ ...prev, [id]: !prev[id] }))
    if (!expandedOrders[id]) {
      setFeedbackOrders((prev) => ({ ...prev, [id]: false }))
    }
  }

  const toggleFeedback = (id) => {
    setFeedbackOrders((prev) => ({ ...prev, [id]: !prev[id] }))
    if (!feedbackOrders[id]) {
      setExpandedOrders((prev) => ({ ...prev, [id]: false }))
    }
  }

  const handleFeedback = async (id) => {
    setIsSubmitting((prev) => ({ ...prev, [id]: true }))
    const user = JSON.parse(localStorage.getItem("user"))
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_URL}/api/user/checkout/remark`,
        {
          serviceid: id,
          rating: ratings[id],
          remarks: feedbacks[id],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        },
      )

      if (response.data.success) {
        toast.success("Feedback submitted successfully!")
        setOrders((prevOrders) =>
          prevOrders.map((group) => ({
            ...group,
            services: group.services.map((service) =>
              service.id === id ? { ...service, remarks: feedbacks[id], rating: ratings[id] } : service,
            ),
          })),
        )
      } else {
        throw new Error(response.data.error || "Failed to submit feedback")
      }
    } catch (error) {
      console.error(error)
      toast.error("Failed to submit feedback. Please try again.")
    } finally {
      setIsSubmitting((prev) => ({ ...prev, [id]: false }))
    }
  }

  const filterOrders = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
    const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 6, 1)

    return orders.filter((group) => {
      if (!group?.bookingDetails?.createdAt) {
        console.warn("Order found without valid booking details:", group)
        return false
      }
      if (searchQuery && !group.bookingDetails._id.includes(searchQuery)) {
        return false
      }
      const orderDate = new Date(group.bookingDetails.createdAt)
      switch (dateFilter) {
        case "today":
          return orderDate >= today
        case "yesterday":
          return orderDate >= yesterday && orderDate < today
        case "thisMonth":
          return orderDate >= thisMonth
        case "lastMonth":
          return orderDate >= lastMonth && orderDate < thisMonth
        case "last6Months":
          return orderDate >= sixMonthsAgo
        case "custom":
          return customDate && isSameDay(orderDate, customDate)
        default:
          return true
      }
    })
  }

  const groupOrdersByDate = (orders) => {
    const groupedOrders = orders.reduce((acc, order) => {
      const date = format(parseISO(order.bookingDetails.createdAt), "yyyy-MM-dd")
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(order)
      return acc
    }, {})

    return Object.entries(groupedOrders).sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
  }

  const filteredOrders = filterOrders()
  const groupedFilteredOrders = groupOrdersByDate(filteredOrders)

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = groupedFilteredOrders.slice(indexOfFirstItem, indexOfLastItem)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

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
                  <Link href={"/user/dashboard/profile/userInformation"}>User</Link>
                </BreadcrumbPage>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="flex items-center gap-2">
                  Order History
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-4 sm:mt-0 w-full sm:w-auto sm:ml-auto">
          <input
            type="text"
            placeholder="Search by Booking ID"
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
      </header>

      <ScrollArea className="h-[calc(100vh-4rem)] w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-6">Completed Orders</h1>
          <AnimatePresence>
            {isLoading ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                {[1, 2, 3].map((n) => (
                  <OrderSkeleton key={n} />
                ))}
              </motion.div>
            ) : currentItems.length > 0 ? (
              currentItems.map(([date, ordersForDate]) => (
                <motion.div
                  key={date}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
                    {format(parseISO(date), "EEEE, MMMM d, yyyy")}
                  </h2>
                  {ordersForDate.map((group) => (
                    <Card
                      key={group.bookingDetails._id}
                      className="border-0 shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl mb-4"
                    >
                      <CardHeader className="flex flex-col justify-between items-start space-y-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 text-white p-4 sm:p-6">
                        <div className="w-full">
                          <CardTitle className="text-lg sm:text-xl font-bold mb-2">
                            Order {group.bookingDetails._id.slice(-6)}
                          </CardTitle>
                          <CardDescription className="text-blue-100 text-sm mb-1">
                            Total: ₹{group.bookingDetails.totalAmount}
                            {group.bookingDetails.walletUsed > 0 && ` (Wallet: ₹${group.bookingDetails.walletUsed})`}
                          </CardDescription>
                          <CardDescription className="text-blue-100 text-sm mb-1">
                            Booking ID: {group.bookingDetails._id}
                          </CardDescription>
                          <CardDescription className="text-blue-100 text-sm">
                            Payment Method: {group.bookingDetails.paymentMethod}
                          </CardDescription>
                        </div>
                        <Badge variant="secondary" className="text-xs px-2 py-1 self-end">
                          {format(parseISO(group.bookingDetails.createdAt), "h:mm a")}
                        </Badge>
                      </CardHeader>

                      {group.services.map((service) => (
                        <CardContent
                          key={service.key}
                          className="p-4 sm:p-6 space-y-4 border-t border-gray-200 dark:border-gray-700"
                        >
                          <div className="space-y-2">
                            <h3 className="text-base sm:text-lg font-semibold">{service.service.name}</h3>
                            <div className="flex flex-wrap gap-2 justify-between items-center">
                              <div className="flex items-center gap-2">
                                <Store className="w-4 h-4 text-gray-500" />
                                <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                                  {service.service.category}
                                </span>
                              </div>
                              <span className="font-semibold text-green-600 dark:text-green-400">
                                ₹{service.service.price}
                              </span>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2 w-full">
                              <Button
                                onClick={() => toggleDetails(service.id)}
                                className={`flex-1 items-center justify-center gap-2 text-xs sm:text-sm ${expandedOrders[service.id]
                                  ? "bg-gray-700 hover:bg-gray-800"
                                  : "bg-blue-600 hover:bg-blue-700"
                                  }`}
                              >
                                {expandedOrders[service.id] ? "Hide Details" : "View Details"}
                                {expandedOrders[service.id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                              </Button>
                              <Button
                                onClick={() => toggleFeedback(service.id)}
                                className={`flex-1 items-center justify-center gap-2 text-xs sm:text-sm ${feedbackOrders[service.id]
                                  ? "bg-gray-700 hover:bg-gray-800"
                                  : "bg-green-600 hover:bg-green-700"
                                  }`}
                              >
                                {feedbackOrders[service.id] ? "Hide Feedback" : "Give Feedback"}
                                <MessageSquare size={16} />
                              </Button>
                            </div>

                            <AnimatePresence>
                              {expandedOrders[service.id] && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-4">
                                    <h3 className="text-base sm:text-lg font-semibold">Order Details</h3>
                                    <div className="grid grid-cols-1 gap-4">
                                      <div>
                                        <h4 className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                                          Delivery Address
                                        </h4>
                                        <p className="mt-1 text-xs sm:text-sm">{service.address}</p>
                                        <p className="mt-1 text-xs sm:text-sm">Pincode: {service.pincode}</p>
                                      </div>
                                      <div>
                                        <h4 className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">
                                          Service Info
                                        </h4>
                                        <p className="mt-1 text-xs sm:text-sm">Category: {service.service.category}</p>
                                        <p className="mt-1 text-xs sm:text-sm">Timeline: {service.timeline}</p>
                                      </div>
                                    </div>
                                  </div>
                                </motion.div>
                              )}

                              {feedbackOrders[service.id] && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-4">
                                    <h3 className="text-base sm:text-lg font-semibold">Your Feedback</h3>
                                    {service.remarks && service.rating ? (
                                      <div>
                                        <p className="text-xs sm:text-sm">Rating: {service.rating} / 5</p>
                                        <p className="text-xs sm:text-sm">Remarks: {service.remarks}</p>
                                      </div>
                                    ) : (
                                      <>
                                        <div className="space-y-2">
                                          <label className="text-xs sm:text-sm font-medium">Rating</label>
                                          <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                              <Star
                                                key={star}
                                                className={`w-5 h-5 sm:w-6 sm:h-6 cursor-pointer transition-all duration-200 ${star <= (isHovering[service.id] || ratings[service.id])
                                                  ? "text-yellow-400 fill-yellow-400"
                                                  : "text-gray-300"
                                                  } ${star <= isHovering[service.id] ? "scale-110" : "scale-100"}`}
                                                onClick={() => setRatings((prev) => ({ ...prev, [service.id]: star }))}
                                                onMouseEnter={() =>
                                                  setIsHovering((prev) => ({ ...prev, [service.id]: star }))
                                                }
                                                onMouseLeave={() =>
                                                  setIsHovering((prev) => ({ ...prev, [service.id]: null }))
                                                }
                                              />
                                            ))}
                                            <span className="text-xs sm:text-sm text-gray-500 ml-2">
                                              {ratings[service.id]} out of 5
                                            </span>
                                          </div>
                                        </div>
                                        <div className="space-y-2">
                                          <label className="text-xs sm:text-sm font-medium">Comments</label>
                                          <Textarea
                                            value={feedbacks[service.id]}
                                            onChange={(e) =>
                                              setFeedbacks((prev) => ({
                                                ...prev,
                                                [service.id]: e.target.value,
                                              }))
                                            }
                                            placeholder="Tell us about your experience..."
                                            className="min-h-[80px] sm:min-h-[100px] text-xs sm:text-sm resize-none"
                                          />
                                        </div>
                                        <Button
                                          onClick={() =>
                                            handleFeedback(service.id, ratings[service.id], feedbacks[service.id])
                                          }
                                          className={`flex-1 items-center justify-center gap-2 text-xs sm:text-sm ${isSubmitting[service.id]
                                            ? "opacity-75 cursor-not-allowed"
                                            : feedbackOrders[service.id]
                                              ? "bg-gray-700 hover:bg-gray-800"
                                              : "bg-green-600 hover:bg-green-700"
                                            }`}
                                          disabled={isSubmitting[service.id]}
                                        >
                                          {isSubmitting[service.id] ? (
                                            <div className="flex items-center gap-2">
                                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                              Submitting...
                                            </div>
                                          ) : (
                                            <>
                                              {feedbackOrders[service.id] ? "Submit Feedback" : "Give Feedback"}
                                              <MessageSquare size={16} />
                                            </>
                                          )}
                                        </Button>
                                      </>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </CardContent>
                      ))}
                    </Card>
                  ))}
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="text-center p-6">
                  <CardContent>
                    <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      No completed orders found for the selected date range.
                    </p>
                    <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setDateFilter("all")}>
                      Show All Orders
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Pagination */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {Array.from({ length: Math.ceil(groupedFilteredOrders.length / itemsPerPage) }, (_, i) => (
              <Button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={`px-3 py-1 text-sm rounded-lg ${currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
                  }`}
              >
                {i + 1}
              </Button>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}