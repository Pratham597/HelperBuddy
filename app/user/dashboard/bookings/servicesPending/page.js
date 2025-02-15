"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { ChevronDown, ChevronUp, ShoppingBag } from "lucide-react"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { motion, AnimatePresence } from "framer-motion"

export default function Page() {
  const [dateGroups, setDateGroups] = useState([])
  const [expandedOrders, setExpandedOrders] = useState({})

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

        // Process both accepted and pending responses
        const processOrders = (response, status) => {
          const { booking, serviceOrder } = response.data

          // Create a map of bookings for quick lookup
          const bookingMap = new Map(booking.map(b => [b._id, b]))

          // Group service orders by booking ID
          const ordersByBooking = serviceOrder.reduce((acc, order) => {
            if (!order.booking) return acc

            const bookingId = order.booking
            const bookingDetails = bookingMap.get(bookingId)

            if (!bookingDetails) return acc

            const date = formatDate(bookingDetails.createdAt)

            if (!acc[date]) {
              acc[date] = []
            }

            // Find existing booking group or create new one
            let bookingGroup = acc[date].find(b => b.bookingId === bookingId)

            if (!bookingGroup) {
              bookingGroup = {
                bookingId,
                orderId: bookingDetails.orderId,
                totalAmount: bookingDetails.totalAmount,
                isPaid: bookingDetails.isPaid,
                date,
                orders: []
              }
              acc[date].push(bookingGroup)
            }

            bookingGroup.orders.push({
              id: order._id,
              status,
              service: order.service,
              address: order.address,
              pincode: order.pincode,
              timeline: order.timeline,
              userCode: order.userCode || '',
              rating: order.rating
            })

            return acc
          }, {})

          return ordersByBooking
        }

        const acceptedGroups = processOrders(responses[0], "Partner Assigned")
        const pendingGroups = processOrders(responses[1], "Paid")

        // Merge and sort date groups
        const allDates = [...new Set([
          ...Object.keys(acceptedGroups),
          ...Object.keys(pendingGroups)
        ])].sort((a, b) => new Date(b) - new Date(a))

        // Create final date-grouped structure
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
      }
    }

    fetchOrders()
  }, [])

  const toggleDetails = (bookingId) => {
    setExpandedOrders((prev) => ({ ...prev, [bookingId]: !prev[bookingId] }))
  }

  const statusPercentages = {
    Paid: 15,
    "Partner Assigned": 50,
    Completed: 100,
  }

  const bookingStages = ["Paid", "Partner Assigned", "Completed"]

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <SidebarTrigger className="mr-4 text-gray-800 hover:text-black" />
              <Separator orientation="vertical" className="h-6 mx-2 bg-gray-200" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbPage>User</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <h1 className="text-3xl font-bold text-black mb-8">Order Progress</h1>

          {dateGroups.length > 0 ? (
            <div className="space-y-12">
              {dateGroups.map((dateGroup) => (
                <div key={dateGroup.date} className="space-y-6">
                  <h2 className="text-xl font-semibold text-black border-b border-gray-200 pb-2">
                    {new Date(dateGroup.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </h2>
                  <div className="space-y-4">
                    {dateGroup.bookings.map((booking) => (
                      <Card key={booking.bookingId} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="bg-white px-6 py-5">
                          <div className="flex items-center justify-between flex-wrap sm:flex-nowrap">
                            <div>
                              <CardTitle className="text-lg font-semibold text-black">
                                Order {booking.orderId}
                              </CardTitle>
                              <CardDescription className="mt-1 text-sm text-gray-600">
                                Total Amount: ₹{booking.totalAmount.toLocaleString()}
                              </CardDescription>
                            </div>
                            <div className="ml-4 flex-shrink-0">
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
                                  <div key={order.id} className={index > 0 ? "mt-8 pt-8 border-t border-gray-200" : ""}>
                                    <h3 className="text-lg font-medium text-black mb-4">
                                      Service {index + 1}: {order.service.name}
                                    </h3>
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
                                    <dl className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
                                      <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-600">Status</dt>
                                        <dd className="mt-1 text-sm text-black">{order.status}</dd>
                                      </div>
                                      <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-600">Category</dt>
                                        <dd className="mt-1 text-sm text-black">{order.service.category}</dd>
                                      </div>
                                      <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-600">Price</dt>
                                        <dd className="mt-1 text-sm text-black">₹{order.service.price.toLocaleString()}</dd>
                                      </div>
                                      <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-600">Timeline</dt>
                                        <dd className="mt-1 text-sm text-black">{order.timeline}</dd>
                                      </div>
                                      <div className="sm:col-span-2">
                                        <dt className="text-sm font-medium text-gray-600">Address</dt>
                                        <dd className="mt-1 text-sm text-black">{order.address}</dd>
                                      </div>
                                      <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-600">Pincode</dt>
                                        <dd className="mt-1 text-sm text-black">{order.pincode}</dd>
                                      </div>
                                      <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-600">User Code</dt>
                                        <dd className="mt-1 text-sm text-black">{order.userCode}</dd>
                                      </div>
                                    </dl>
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
            </div>
          ) : (
            <Card className="text-center py-12 border border-gray-200">
              <CardContent>
                <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
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