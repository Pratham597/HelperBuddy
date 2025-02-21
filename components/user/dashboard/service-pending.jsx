"use client"

import { useEffect, useState } from "react"
import Script from "next/script"
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
import { Alert, AlertDescription } from "@/components/ui/alert"
import PaymentStatusModal from "@/components/user/Cart/payment-status-modal";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link"
import toast from "react-hot-toast"

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
  const [paymentMethod, setPaymentMethod] = useState("")
  const [walletAmount, setWalletAmount] = useState(0)
  const [walletUsed, setWalletUsed] = useState(0)
  const [walletError, setWalletError] = useState("")
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"))
        if (user?.token) {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_URL}/api/user/wallet`,
            {},
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            }
          )
          setWalletAmount(response.data.wallet || 0)
        }
      } catch (error) {
        console.error("Error fetching wallet balance:", error)
      }
    }
    fetchWalletBalance()
  }, []);

  useEffect(() => {
    setWalletError("")
    setWalletUsed(0)
  }, [paymentMethod]);

  const validateWalletAmount = (amount, totalAmount) => {
    const numAmount = Number(amount)
    setWalletError("")

    if (numAmount > walletAmount) {
      setWalletError(`Amount cannot exceed wallet balance of ₹${walletAmount}`)
      return false
    }

    if (numAmount >= totalAmount) {
      setWalletError(
        `Amount must be less than total order amount. Maximum allowed: ₹${(
          totalAmount - 1
        ).toFixed(2)}`
      )
      return false
    }

    if (numAmount < 0) {
      setWalletError("Amount cannot be negative")
      return false
    }

    return true
  }

  const handleWalletAmountChange = (e) => {
    const amount = e.target.value
    setWalletUsed(amount)
    if (selectedBooking) {
      validateWalletAmount(amount, selectedBooking.service.price)
    }
  }

  const handlePayment = async (booking) => {
    try {
      setIsLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));
      const data = {
        totalAmount: booking.service.price,
        paymentMethod: paymentMethod,
        walletUsed: walletUsed,
        serviceOrderId: booking.id
      }

      if (paymentMethod === "COD") {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_URL}/api/user/checkout`,
          data,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        if (res.data.success) {
          setPaymentStatus("success");
          setIsModalOpen(true);
        }
      } else {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_URL}/api/user/checkout`,
          data,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        console.log(res);
        if (res.status === 200) {
          const { payment } = res.data;
          const orderId = payment.orderId;
          const options = {
            key: process.env.RAZORPAY_KEY_ID,
            amount: Number(booking.totalAmount) * 100,
            currency: "INR",
            name: `HelperBuddy Services`,
            description: "Order Payment",
            image: "./avatar.gif",
            order_id: orderId,
            prefill: {
              name: user.name,
              email: user.email,
              contact: user.phone,
            },
            notes: {
              address: "Razorpay Corporate Office",
            },
            theme: {
              color: "#3399cc",
            },
            handler: async (response) => {
              try {
                setPaymentStatus("processing");
                setIsModalOpen(true);

                const res = await fetch(
                  `${process.env.NEXT_PUBLIC_URL}/api/user/payment`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${user.token}`,
                    },
                    body: JSON.stringify({
                      razorpay_payment_id: response.razorpay_payment_id,
                      razorpay_order_id: response.razorpay_order_id,
                      razorpay_signature: response.razorpay_signature,
                    }),
                  }
                );

                const data = await res.json();
                if (data.success) {
                  setPaymentStatus("success");
                } else {
                  setPaymentStatus("error");
                }
              } catch (error) {
                console.error("Payment verification error:", error);
                setPaymentStatus("error");
              } finally {
                setIsLoading(false);
              }
            },
            modal: {
              ondismiss: () => {
                setIsLoading(false);
                setPaymentStatus("error");
                setIsModalOpen(true);
              },
            },
          };

          const rzp1 = new window.Razorpay(options);
          rzp1.open();
        } else {
          alert("Error Occurred! Try again later");
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error("Payment error:", error)

    }
  }


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
      setIsLoading(true);
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (!user || !user.token) return;

        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        };

        const [acceptedRes, pendingRes] = await Promise.all([
          axios.post(`${process.env.NEXT_PUBLIC_URL}/api/user/servicePartnerAccepted`, {}, { headers }),
          axios.post(`${process.env.NEXT_PUBLIC_URL}/api/user/servicesPending`, {}, { headers }),
        ]);

        const processOrders = (orders, status) => {
          return orders.reduce((acc, order) => {
            if (!order.service) return acc; // Ensure service exists

            const date = order.createdAt.split("T")[0]; // Extract date part

            if (!acc[date]) {
              acc[date] = [];
            }

            acc[date].push({
              id: order._id,
              status,
              service: {
                serviceId: order.service._id,
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
              isPaid: order.isPaid,
              createdAt: order.createdAt,
              updatedAt: order.updatedAt,
            });

            return acc;
          }, {});
        };

        // Extract data safely
        const acceptedOrders = acceptedRes?.data?.serviceOrder || [];
        const pendingOrders = pendingRes?.data?.serviceOrder || [];

        // Process orders based on their statuses
        const acceptedGroups = processOrders(
          acceptedOrders.filter(order => order.partner && !order.isPaid),
          "Partner Assigned"
        );

        const pendingGroups = processOrders(
          pendingOrders,
          "Order Received"
        );

        const paymentDoneGroups = processOrders(
          acceptedOrders.filter(order => order.isPaid),
          "Payment Completed"
        );

        console.log(acceptedGroups, pendingGroups, paymentDoneGroups);

        // Combine and sort dates
        const allDates = [...new Set([
          ...Object.keys(acceptedGroups),
          ...Object.keys(pendingGroups),
          ...Object.keys(paymentDoneGroups),
        ])].sort((a, b) => new Date(b) - new Date(a));

        // Format grouped data
        const groupedByDate = allDates.map(date => ({
          date,
          bookings: [
            ...(acceptedGroups[date] || []),
            ...(pendingGroups[date] || []),
            ...(paymentDoneGroups[date] || []),
          ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)), // Sort by createdAt
        }));

        setDateGroups(groupedByDate);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);


  const toggleDetails = (bookingId) => {
    setExpandedOrders((prev) => ({ ...prev, [bookingId]: !prev[bookingId] }))
  }

  const toggleServiceDetails = (serviceId) => {
    setExpandedServices((prev) => ({ ...prev, [serviceId]: !prev[serviceId] }))
  }

  const statusPercentages = {
    "Order Received": 15,
    "Partner Assigned": 33,
    "Payment Completed": 67,
    "Service Completed": 100,
  }

  const bookingStages = ["Order Received", "Partner Assigned", "Payment Completed", "Service Completed"]

  const renderPaymentButton = (booking) => {
    if (booking.status === "Partner Assigned" && !booking.isPaid) {
      return (
        <Button
          onClick={() => handlePayment(booking.id)}
          className="mt-4 w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
        >

          Proceed to Payment
        </Button>
      )
    }
    return null
  }

  const renderStatusAlert = (booking) => {
    if (booking.status === "Partner Assigned" && !booking.isPaid) {
      return (
        <Alert className="mt-4 bg-blue-50 border-blue-200">
          <AlertDescription className="text-blue-800">
            A partner has been assigned to your service request. Please proceed with the payment to confirm your booking.
          </AlertDescription>
        </Alert>
      )
    }
    return null
  }

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

  const handleCancelOrder = async (serviceOrderId) => {
    const user = JSON.parse(localStorage.getItem("user"))
    if (!user || !user.token) {
      console.error("Error: No auth token found")
      return
    }

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_URL}/api/user/servicesPending/cancelOrder`,
        { serviceOrderId },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
      console.log("Order cancelled successfully:", response.data)
      toast.success("Service cancelled successfully")
    } catch (error) {
      toast.error(error.response?.data.error)
      console.error("Error cancelling order:", error.response?.data)
    }
  }

  const filteredDateGroups = filterOrders()
  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <header className="sticky top-0 z-10 flex flex-col sm:flex-row items-start sm:items-center gap-2 p-4 bg-white dark:bg-gray-800 shadow-sm">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="h-4 hidden sm:block" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="flex items-center gap-2">
                    <Link href={`/user/dashboard/profile/userInformation`}>User</Link>
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
          <PaymentStatusModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setPaymentStatus(null);
            }}
            status={paymentStatus}
            onComplete={() => router.push("/user/dashboard/booking/servicesPending")}
          />
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
                                              className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 ${bookingStages.indexOf(status) <= bookingStages.indexOf(booking.status)
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
                                          className={`w-1/3 text-center ${bookingStages.indexOf(status) <= bookingStages.indexOf(booking.status)
                                            ? "text-black font-medium"
                                            : "text-gray-500"
                                            }`}
                                        >
                                          {status}
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {renderStatusAlert(booking)}
                                  {renderPaymentButton(booking) && (<>
                                    <Card className="shadow-lg rounded-lg bg-white p-6 transition-all duration-300 hover:shadow-xl mt-4">
                                      <h2 className="text-2xl font-semibold mb-4">Payment Method</h2>
                                      <div className="space-y-4">
                                        <Select onValueChange={setPaymentMethod} value={paymentMethod}>
                                          <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select payment method" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="COD">Cash on Delivery</SelectItem>
                                            <SelectItem value="Online">Online Payment</SelectItem>
                                            {walletAmount > 0 && (
                                              <SelectItem value="Wallet+Online">Wallet + Online Payment (Balance: ₹{walletAmount})</SelectItem>
                                            )}
                                          </SelectContent>
                                        </Select>

                                        {paymentMethod === "Wallet+Online" && (
                                          <div className="space-y-2">
                                            <label className="text-sm text-gray-600">Enter amount to use from wallet</label>
                                            <Input
                                              type="number"
                                              value={walletUsed}
                                              onChange={handleWalletAmountChange}
                                              max={Math.min(walletAmount, calculateTotal())}
                                              min={0}
                                              className="w-full"
                                            />
                                            {walletError && (
                                              <Alert variant="destructive">
                                                <AlertDescription>{walletError}</AlertDescription>
                                              </Alert>
                                            )}
                                          </div>
                                        )}

                                        {paymentMethod === "Wallet+Online" && (
                                          <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                              <span>Total Amount:</span>
                                              <span>₹{calculateTotal()}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                              <span>Wallet Amount Used:</span>
                                              <span>₹{walletUsed}</span>
                                            </div>
                                            <Separator />
                                            <div className="flex justify-between font-semibold">
                                              <span>Amount to Pay Online:</span>
                                              <span>₹{calculateTotal() - walletUsed}</span>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </Card>
                                    <Button
                                      onClick={() => handlePayment(booking)}
                                      className="mt-4 w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
                                    >
                                      Proceed to Payment
                                    </Button>
                                  </>
                                  )}
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
                                            {!booking.isPaid && <div className="sm:col-span-1">
                                              <Button variant="destructive" onClick={() => handleCancelOrder(booking.id)}>
                                                Cancel Order
                                              </Button>
                                            </div>}
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
    </>
  )
}
