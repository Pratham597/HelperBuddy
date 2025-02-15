"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { ChevronDown, ChevronUp, Star, Send, Store, MessageSquare, Package } from "lucide-react"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "react-hot-toast";

export default function Page() {
  const [orders, setOrders] = useState([])
  const [expandedOrders, setExpandedOrders] = useState({})
  const [feedbackOrders, setFeedbackOrders] = useState({})
  const [ratings, setRatings] = useState({})
  const [feedbacks, setFeedbacks] = useState({})
  const [isHovering, setIsHovering] = useState({})
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"))
        if (!user || !user.token) return

        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        }

        const response = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/user/serviceDone`, {}, { headers })

        const allOrders = response.data.serviceOrder.map((order, index) => ({
          id: order._id,
          service: order.service,
          address: order.address,
          pincode: order.pincode,
          timeline: order.timeline,
          userCode: order.userCode,
          remarks: order.remarks,
          rating: order.rating,
          key: index,
        }))

        setOrders(allOrders)

        const initialRatings = {}
        const initialFeedbacks = {}
        allOrders.forEach((order) => {
          initialRatings[order.id] = order.rating || 5
          initialFeedbacks[order.id] = order.remarks || ""
        })
        setRatings(initialRatings)
        setFeedbacks(initialFeedbacks)
      } catch (error) {
        console.error(error)
        toast.error("Failed to fetch orders. Please try again.")
      }
    }

    fetchOrders()
  }, [])

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
        // Update the local state to reflect the submitted feedback
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === id ? { ...order, remarks: feedbacks[id], rating: ratings[id] } : order,
          ),
        )
      } else {
        throw new Error(response.data.error || "Failed to submit feedback")
      }
    } catch (error) {
      console.error(error)
      toast.error("Failed to submit feedback. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-2 px-4 bg-white dark:bg-gray-800 shadow-sm">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="h-4" />
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
      </header>

      <ScrollArea className="h-[calc(100vh-4rem)] w-full">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Completed Orders</h1>

          <AnimatePresence>
            {orders.length > 0 ? (
              orders.map((order) => (
                <motion.div
                  key={order.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="border-0 shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
                    <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 text-white">
                      <div>
                        <CardTitle className="text-xl font-bold">{order.service.name}</CardTitle>
                        <CardDescription className="text-blue-100">Order #{order.id.slice(-6)}</CardDescription>
                      </div>
                      <Badge variant="secondary" className="text-xs px-2 py-1">
                        {order.timeline}
                      </Badge>
                    </CardHeader>

                    <CardContent className="p-6 space-y-4">
                      <div className="flex flex-wrap gap-2 justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Store className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">{order.service.category}</span>
                        </div>
                        <span className="font-semibold text-green-600 dark:text-green-400">₹{order.service.price}</span>
                      </div>

                      <div className="flex gap-2 w-full">
                        <Button
                          onClick={() => toggleDetails(order.id)}
                          className={`flex-1 items-center gap-2 ${expandedOrders[order.id] ? "bg-gray-700 hover:bg-gray-800" : "bg-blue-600 hover:bg-blue-700"
                            }`}
                        >
                          {expandedOrders[order.id] ? "Hide Details" : "View Details"}
                          {expandedOrders[order.id] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </Button>
                        <Button
                          onClick={() => toggleFeedback(order.id)}
                          className={`flex-1 items-center gap-2 ${feedbackOrders[order.id]
                            ? "bg-gray-700 hover:bg-gray-800"
                            : "bg-green-600 hover:bg-green-700"
                            }`}
                        >
                          {feedbackOrders[order.id] ? "Hide Feedback" : "Give Feedback"}
                          <MessageSquare size={18} />
                        </Button>
                      </div>

                      <AnimatePresence>
                        {expandedOrders[order.id] && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-4">
                              <h3 className="text-lg font-semibold">Order Details</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Delivery Address
                                  </h4>
                                  <p className="mt-1">{order.address}</p>
                                  <p className="mt-1">Pincode: {order.pincode}</p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Service Info</h4>
                                  <p className="mt-1">Category: {order.service.category}</p>
                                  <p className="mt-1">Timeline: {order.timeline}</p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {feedbackOrders[order.id] && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-4">
                              <h3 className="text-lg font-semibold">Your Feedback</h3>
                              {order.remarks && order.rating ? (
                                <div>
                                  <p>Rating: {order.rating} / 5</p>
                                  <p>Remarks: {order.remarks}</p>
                                </div>
                              ) : (
                                <>
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">Rating</label>
                                    <div className="flex gap-1">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                          key={star}
                                          className={`w-6 h-6 cursor-pointer transition-all duration-200 ${star <= (isHovering[order.id] || ratings[order.id])
                                              ? "text-yellow-400 fill-yellow-400"
                                              : "text-gray-300"
                                            } ${star <= isHovering[order.id] ? "scale-110" : "scale-100"}`}
                                          onClick={() => setRatings((prev) => ({ ...prev, [order.id]: star }))}
                                          onMouseEnter={() => setIsHovering((prev) => ({ ...prev, [order.id]: star }))}
                                          onMouseLeave={() => setIsHovering((prev) => ({ ...prev, [order.id]: null }))}
                                        />
                                      ))}
                                      <span className="text-sm text-gray-500 ml-2">{ratings[order.id]} out of 5</span>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium">Comments</label>
                                    <Textarea
                                      value={feedbacks[order.id]}
                                      onChange={(e) =>
                                        setFeedbacks((prev) => ({
                                          ...prev,
                                          [order.id]: e.target.value,
                                        }))
                                      }
                                      placeholder="Tell us about your experience..."
                                      className="min-h-[100px] resize-none"
                                    />
                                  </div>
                                  <Button
                                    onClick={() => handleFeedback(order.id)}
                                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                                  >
                                    <Send className="w-4 h-4 mr-2" />
                                    Submit Feedback
                                  </Button>
                                </>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
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
                    <p className="text-gray-600 dark:text-gray-400 mb-4">No completed orders yet. Start a new one!</p>
                    <Button className="bg-blue-600 hover:bg-blue-700">Place Order</Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  )
}

