"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import axios from "axios"
import { format, parseISO } from "date-fns"
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
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Loader2, Filter } from 'lucide-react'
import { toast } from "react-hot-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

export default function OrderList() {
  // State management
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [accepting, setAccepting] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [timelineFilter, setTimelineFilter] = useState("all")

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders()
  }, [])

  // Fetch orders function
  const fetchOrders = async () => {
    setLoading(true)
    setError(null)
    try {
      const partner = JSON.parse(localStorage.getItem("partner"))
      if (!partner?.token) {
        throw new Error("Authentication token not found")
      }

      const response = await axios.post("/api/partner/fetchOrder", {}, {
        headers: { Authorization: `Bearer ${partner.token}` }
      })

      if (response.data?.serviceOrders) {
        setOrders(response.data.serviceOrders)
      } else {
        throw new Error("Invalid response format")
      }
    } catch (err) {
      setError(err.message || "Failed to fetch orders")
      toast.error("Failed to fetch orders")
    } finally {
      setLoading(false)
    }
  }

  // Accept order function
  const handleAcceptOrder = async (orderId) => {
    setAccepting(true)
    try {
      const partner = JSON.parse(localStorage.getItem("partner"))
      if (!partner?.token) {
        throw new Error("Authentication token not found")
      }

      await axios.post("/api/partner/acceptOrder", 
        { serviceorder_id: orderId },
        { headers: { Authorization: `Bearer ${partner.token}` }}
      )

      toast.success("Order accepted successfully")
      setOrders(prevOrders => prevOrders.filter(order => order._id !== orderId))
      setSelectedOrder(null)
    } catch (err) {
      toast.error(err.message || "Failed to accept order")
    } finally {
      setAccepting(false)
    }
  }

  // Memoized filters and grouping
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(orders.map(order => order.service?.category || 'Uncategorized'))]
    return ["all", ...uniqueCategories]
  }, [orders])

  const timelines = useMemo(() => {
    const uniqueTimelines = [...new Set(orders.map(order => order.timeline))]
    return ["all", ...uniqueTimelines]
  }, [orders])

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const categoryMatch = categoryFilter === "all" || order.service?.category === categoryFilter
      const statusMatch = statusFilter === "all" || order.status === statusFilter
      const timelineMatch = timelineFilter === "all" || order.timeline === timelineFilter
      return categoryMatch && statusMatch && timelineMatch
    })
  }, [orders, categoryFilter, statusFilter, timelineFilter])

  const groupedOrders = useMemo(() => {
    const groups = {}
    filteredOrders.forEach(order => {
      const date = format(parseISO(order.createdAt), "yyyy-MM-dd")
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(order)
    })
    return groups
  }, [filteredOrders])

  // Render functions
  const renderFilters = () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Filter Orders</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Category</Label>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Timeline</Label>
            <Select value={timelineFilter} onValueChange={setTimelineFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Select timeline" />
              </SelectTrigger>
              <SelectContent>
                {timelines.map(timeline => (
                  <SelectItem key={timeline} value={timeline}>
                    {timeline === "all" ? "All Timelines" : timeline}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )

  const renderOrderDetails = () => (
    <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
        </DialogHeader>
        {selectedOrder && (
          <>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Service</Label>
                <span className="col-span-3">{selectedOrder.service?.name}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Category</Label>
                <span className="col-span-3">{selectedOrder.service?.category || 'Uncategorized'}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Timeline</Label>
                <span className="col-span-3">{selectedOrder.timeline}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Address</Label>
                <span className="col-span-3">{selectedOrder.address}</span>
              </div>
              {selectedOrder.remarks && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Remarks</Label>
                  <span className="col-span-3">{selectedOrder.remarks}</span>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button 
                onClick={() => handleAcceptOrder(selectedOrder._id)} 
                disabled={accepting}
              >
                {accepting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Accept Order
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <Link href="/partner/dashboard">Partner</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Orders</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Order Requests</h1>
          {renderFilters()}
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))}
          </div>
        ) : error ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-red-600 text-center">{error}</p>
            </CardContent>
          </Card>
        ) : Object.keys(groupedOrders).length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-gray-600 text-center">No orders match the current filters.</p>
            </CardContent>
          </Card>
        ) : (
          Object.entries(groupedOrders).map(([date, dateOrders]) => (
            <Card key={date} className="overflow-hidden">
              <CardHeader className="bg-gray-100 py-3">
                <CardTitle>{format(parseISO(date), "MMMM d, yyyy")}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[300px] md:h-auto">
                  {dateOrders.map((order) => (
                    <div 
                      key={order._id} 
                      className="p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-center flex-wrap gap-4">
                        <div className="space-y-1">
                          <h3 className="font-semibold text-gray-900">
                            {order.service?.name}
                          </h3>
                          <div className="flex gap-2 items-center">
                            <Badge variant="secondary">
                              {order.service?.category || 'Uncategorized'}
                            </Badge>
                            <span className="text-sm text-gray-600">
                              Timeline: {order.timeline}
                            </span>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          onClick={() => setSelectedOrder(order)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {renderOrderDetails()}
    </>
  )
}