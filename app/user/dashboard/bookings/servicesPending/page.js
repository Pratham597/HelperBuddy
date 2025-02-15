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
  const [orders, setOrders] = useState([])
  const [expandedOrders, setExpandedOrders] = useState({})

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"))
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

        const servicePending = axios.post(`${process.env.NEXT_PUBLIC_URL}/api/user/servicesPending`, {}, { headers })

        const responses = await Promise.all([servicePartnerAccepted, servicePending])
        let count = 0

        const allOrders = [
          ...responses[0].data.serviceOrder.map((order) => ({
            id: order._id,
            status: "Partner Assigned",
            key: count++,
            service: order.service,
            address: order.address,
            pincode: order.pincode,
            timeline: order.timeline,
            userCode: order.userCode,
          })),
          ...responses[1].data.serviceOrder.map((order) => ({
            id: order._id,
            status: "Paid",
            key: count++,
            service: order.service,
            address: order.address,
            pincode: order.pincode,
            timeline: order.timeline,
            userCode: order.userCode,
          })),
        ]

        setOrders(allOrders)
      } catch (error) {
        console.error(error)
      }
    }

    fetchOrders()
  }, [])

  const toggleDetails = (id) => {
    setExpandedOrders((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const statusPercentages = {
    Paid: 15,
    "Partner Assigned": 50,
    Completed: 100,
  }

  const bookingStages = ["Paid", "Partner Assigned", "Completed"]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <SidebarTrigger className="mr-4 text-gray-500 hover:text-gray-700" />
              <Separator orientation="vertical" className="h-6 mx-2" />
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

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Order Progress</h1>

          {orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order) => {
                const progressPercentage = statusPercentages[order.status] || 0
                const isExpanded = expandedOrders[order.id]

                return (
                  <Card key={order.key} className="overflow-hidden">
                    <CardHeader className="bg-white px-4 py-5 sm:px-6">
                      <div className="flex items-center justify-between flex-wrap sm:flex-nowrap">
                        <div>
                          <CardTitle className="text-lg leading-6 font-medium text-gray-900">
                            Order #{order.id.slice(-6)}
                          </CardTitle>
                          <CardDescription className="mt-1 text-sm text-gray-500">{order.status}</CardDescription>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <Button
                            onClick={() => toggleDetails(order.id)}
                            variant="outline"
                            size="sm"
                            className="flex items-center"
                          >
                            {isExpanded ? "Hide" : "View"} Details
                            {isExpanded ? (
                              <ChevronUp className="ml-2 h-4 w-4" />
                            ) : (
                              <ChevronDown className="ml-2 h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="px-4 py-5 sm:p-6">
                      <div className="space-y-6">
                        <div>
                          <div className="relative">
                            <Progress value={progressPercentage} className="h-2" />
                            <div className="absolute top-1/2 left-0 w-full flex justify-between transform -translate-y-1/2">
                              {bookingStages.map((status, index) => (
                                <div key={status} className="relative">
                                  <div
                                    className={`w-4 h-4 rounded-full border-2 ${
                                      status === order.status
                                        ? "bg-primary border-primary"
                                        : "bg-gray-200 border-gray-300"
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
                                className={`w-1/3 text-center ${
                                  status === order.status ? "text-primary font-medium" : "text-gray-500"
                                }`}
                              >
                                {status}
                              </div>
                            ))}
                          </div>
                        </div>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <div className="mt-6 border-t border-gray-200 pt-6">
                                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                                  <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500">Service</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{order.service?.name || "N/A"}</dd>
                                  </div>
                                  <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500">Category</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{order.service?.category || "N/A"}</dd>
                                  </div>
                                  <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500">Price</dt>
                                    <dd className="mt-1 text-sm text-gray-900">₹{order.service?.price || "N/A"}</dd>
                                  </div>
                                  <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500">Timeline</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{order.timeline || "N/A"}</dd>
                                  </div>
                                  <div className="sm:col-span-2">
                                    <dt className="text-sm font-medium text-gray-500">Address</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{order.address || "N/A"}</dd>
                                  </div>
                                  <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500">Pincode</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{order.pincode || "N/A"}</dd>
                                  </div>
                                  <div className="sm:col-span-1">
                                    <dt className="text-sm font-medium text-gray-500">User Code</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{order.userCode || "N/A"}</dd>
                                  </div>
                                </dl>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <ShoppingBag className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No orders</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new order.</p>
                <div className="mt-6">
                  <Button>Place Order</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}

