"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { ChevronDown, ChevronUp, ShoppingBag, Loader2, Calendar, Package } from "lucide-react"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
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

export default function ServicePending() {
  const [dateGroups, setDateGroups] = useState([])
  const [expandedOrders, setExpandedOrders] = useState({})
  const [expandedServices, setExpandedServices] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [dateFilter, setDateFilter] = useState("all")
  const [customDate, setCustomDate] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const ordersPerPage = 5

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
    const fetchOrders = async () => {
      setIsLoading(true)
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}")
        if (!user || !user.token) return

        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        }

        const servicePartnerAccepted = axios.post(
          `${process.env.NEXT_PUBLIC_URL}/api/user/servicePartnerAccepted`,
          {},
          { headers },
        )

        const servicePending = axios.post(
          `${process.env.NEXT_PUBLIC_URL}/api/user/servicesPending`,
          {},
          { headers }
        )

        const responses = await Promise.all([servicePartnerAccepted, servicePending])

        const processOrders = (response, status) => {
          const { serviceOrder } = response;

          return serviceOrder.reduce((acc, order) => {
            const date = order.createdAt.split("T")[0]; // Extract only the date part

            if (!acc[date]) {
              acc[date] = [];
            }

            if (status === "Partner Assigned" && order.partner) {  // Fixed condition
              acc[date].push({
                id: order._id,
                status,
                service: {
                  name: order.service.name,
                  category: order.service.category,
                  price: order.service.price,
                  description: order.service.description,
                  image: order.service.image
                },
                timeline: order.timeline,
                pincode: order.pincode,
                address: order.address,
                userCode: order.userCode,
                userApproved: order.userApproved,
                rating: order.rating,
                isPaid: order.isPaid,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt
              });
            } else if (status === "Paid" && order.isPaid) {  // Fixed undefined variable
              acc[date].push({
                id: order._id,
                status,
                service: {
                  name: order.service.name,
                  category: order.service.category,
                  price: order.service.price,
                  description: order.service.description,
                  image: order.service.image
                },
                timeline: order.timeline,
                pincode: order.pincode,
                address: order.address,
                userCode: order.userCode,
                userApproved: order.userApproved,
                rating: order.rating,
                isPaid: order.isPaid,
                createdAt: order.createdAt,
                updatedAt: order.updatedAt
              });
            }

            return acc;
          }, {});
        };

        // Ensure responses exist before calling the function
        const acceptedGroups = responses[0] ? processOrders(responses[0].data, "Partner Assigned") : {};
        const pendingGroups = responses[1] ? processOrders(responses[1].data, "Paid") : {};

        console.log(acceptedGroups, pendingGroups);

        const allDates = [...new Set([
          ...Object.keys(acceptedGroups),
          ...Object.keys(pendingGroups)
        ])].sort((a, b) => new Date(b) - new Date(a))

        const groupedByDate = allDates.map(date => ({
          date,
          bookings: [
            ...(acceptedGroups[date] || []),
            ...(pendingGroups[date] || [])
          ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        }))

        setDateGroups(groupedByDate)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const toggleDetails = (bookingId) => {
    setExpandedOrders((prev) => ({ ...prev, [bookingId]: !prev[bookingId] }))
  }

  const toggleServiceDetails = (serviceId) => {
    setExpandedServices((prev) => ({ ...prev, [serviceId]: !prev[serviceId] }))
  }

  const statusPercentages = {
    Paid: 15,
    "Partner Assigned": 50,
    Completed: 100,
  }

  const bookingStages = ["Paid", "Partner Assigned", "Completed"]

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

        // Filter by date
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

        // If the group date doesn't match, exclude the entire group
        if (!dateMatch) return null

        // Filter bookings within the group based on searchQuery
        const filteredBookings = group.bookings.filter((booking) => {
          const bookingIdMatch = searchQuery
            ? booking.id.toLowerCase().includes(searchQuery.toLowerCase())
            : true

          return bookingIdMatch
        })

        // If no bookings match the search query, exclude the group
        if (filteredBookings.length === 0) return null

        // Return the group with filtered bookings
        return {
          ...group,
          bookings: filteredBookings,
        }
      })
      .filter((group) => group !== null) // Remove groups that were excluded
  }

  const filteredDateGroups = filterOrders()
  console.log(filteredDateGroups)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <header className="sticky top-0 z-10 flex flex-col sm:flex-row items-start sm:items-center gap-2 p-4 bg-white dark:bg-gray-800 shadow-sm">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4 hidden sm:block" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
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

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="sm:px-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-black mb-8">Order Progress</h1>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
            </div>
          ) : filteredDateGroups.length > 0 ? (
            <div className="space-y-8">
              {filteredDateGroups.map((dateGroup) => (
                <div key={dateGroup.date} className="space-y-6">
                  <h2 className="text-lg sm:text-xl font-semibold text-black border-b border-gray-200 pb-2">
                    {format(parseISO(dateGroup.date), "EEEE, MMMM d, yyyy")}
                  </h2>
                  <div className="space-y-4">
                    {dateGroup.bookings.map((booking, index) => (
                      <Card
                        key={booking.id}
                        className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <CardHeader className="bg-white px-4 sm:px-6 py-4 sm:py-5">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between sm:flex-nowrap">
                            <div>
                              <CardTitle className="text-base sm:text-lg font-semibold text-black">
                                Order {booking.id.slice(-6)}
                              </CardTitle>
                              <CardDescription className="mt-1 text-xs sm:text-sm text-gray-600">
                                Total Amount: ₹{booking.service.price.toLocaleString()}
                                <br />
                                Booking ID: {booking.id}
                              </CardDescription>
                            </div>
                            <Button
                              onClick={() => toggleDetails(booking.id)}
                              variant="outline"
                              size="sm"
                              className="mt-2 sm:mt-0 w-full sm:w-auto flex items-center justify-center border-gray-400 text-gray-800 hover:bg-gray-50 hover:text-black hover:border-gray-600"
                            >
                              {expandedOrders[booking.id] ? "Hide" : "View"} Details
                              {expandedOrders[booking.id] ? (
                                <ChevronUp className="ml-2 h-4 w-4" />
                              ) : (
                                <ChevronDown className="ml-2 h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </CardHeader>

                        <CardContent className="px-4 sm:px-6 py-4 sm:py-5">
                          <AnimatePresence>
                            {expandedOrders[booking.id] && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <div className="mb-4 sm:mb-6">
                                  <div className="relative">
                                    <Progress value={statusPercentages[booking.status]} className="h-2 bg-gray-100" />
                                    <div className="absolute top-1/2 left-0 w-full flex justify-between transform -translate-y-1/2">
                                      {bookingStages.map((status) => (
                                        <div key={status} className="relative">
                                          <div
                                            className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 ${status === booking.status
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
                                        className={`w-1/3 text-center ${status === booking.status ? "text-black font-medium" : "text-gray-500"
                                          }`}
                                      >
                                        {status}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <div className="mt-6 pt-6 border-t border-gray-200">
                                  <div className="flex items-center justify-between">
                                    <h3 className="text-base sm:text-lg font-medium text-black">
                                      Service {index + 1}: {booking.service.name}
                                    </h3>
                                    <Button
                                      onClick={() => toggleServiceDetails(booking.id)}
                                      variant="outline"
                                      size="sm"
                                      className="flex items-center my-2 border-gray-400 text-gray-800 hover:bg-gray-50 hover:text-black hover:border-gray-600"
                                    >
                                      {expandedServices[booking.id] ? (
                                        <ChevronUp className="h-4 w-4" />
                                      ) : (
                                        <ChevronDown className="h-4 w-4" />
                                      )}
                                    </Button>

                                  </div>
                                  <AnimatePresence>
                                    {expandedServices[booking.id] && (
                                      <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                      >
                                        <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 text-sm">
                                          <div className="sm:col-span-1">
                                            <dt className="font-medium text-gray-600">Status</dt>
                                            <dd className="mt-1 text-black">{booking.status}</dd>
                                          </div>
                                          <div className="sm:col-span-1">
                                            <dt className="font-medium text-gray-600">Category</dt>
                                            <dd className="mt-1 text-black">{booking.service.category}</dd>
                                          </div>
                                          <div className="sm:col-span-1">
                                            <dt className="font-medium text-gray-600">Price</dt>
                                            <dd className="mt-1 text-black">
                                              ₹{booking.service.price.toLocaleString()}
                                            </dd>
                                          </div>
                                          <div className="sm:col-span-1">
                                            <dt className="font-medium text-gray-600">Timeline</dt>
                                            <dd className="mt-1 text-black">{booking.timeline}</dd>
                                          </div>
                                          <div className="sm:col-span-2">
                                            <dt className="font-medium text-gray-600">Address</dt>
                                            <dd className="mt-1 text-black">{booking.address}</dd>
                                          </div>
                                          <div className="sm:col-span-1">
                                            <dt className="font-medium text-gray-600">Pincode</dt>
                                            <dd className="mt-1 text-black">{booking.pincode}</dd>
                                          </div>
                                          <div className="sm:col-span-1">
                                            <dt className="font-medium text-gray-600">User Code</dt>
                                            <dd className="mt-1 text-black">{booking.userCode}</dd>
                                          </div>
                                        </dl>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              </motion.div>

                            )}

                          </AnimatePresence>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Card className="text-center py-8 sm:py-12 border border-gray-200">
              <CardContent>
                <ShoppingBag className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-black">No orders</h3>
                <p className="mt-1 text-sm text-gray-600">Get started by creating a new order.</p>
                <div className="mt-6">
                  <Button className="bg-black text-white hover:bg-gray-800">Place Order</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}

