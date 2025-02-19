"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Star, TruckIcon } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Progress } from "@/components/ui/progress";
import axios from "axios";

export default function PartnerDashboard() {
  const [analytics, setAnalytics] = useState({
    completedOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    avgRating: 0,
  });

  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([])

  useEffect(() => {
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
        console.log(response.data.serviceOrders)
        setHistory(response.data.serviceOrders || [])
      } catch (error) {
        console.error("Error fetching order history:", error)
        toast.error("Error fetching order history")
      } finally {
        setLoading(false)
      }
    }

    async function fetchAnalytics() {
      try {
        const partner = JSON.parse(localStorage.getItem("partner"))
        if (!partner || !partner.token) throw new Error("No authentication token found.")
        const res = await axios.post(
          "/api/partner/analytics",
          {},
          {
            headers: { Authorization: `Bearer ${partner.token}` },
          },
        )
        setAnalytics(res.data);
      } catch (error) {
        console.error("Error fetching partner analytics:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
    fetchOrderHistory();
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="flex h-16 items-center gap-2 px-4 sm:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbPage className="font-medium">Partner</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold">Partner Dashboard</h1>
          <Select defaultValue="today">
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="last7days">Last 7 days</SelectItem>
              <SelectItem value="last30days">Last 30 days</SelectItem>
              <SelectItem value="thismonth">This month</SelectItem>
              <SelectItem value="lastmonth">Last month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Performance Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">Total Orders Delivered</CardTitle>
              <TruckIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{loading ? "Loading..." : analytics.completedOrders}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">Total Revenue Earned</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{loading ? "Loading..." : `₹${analytics.totalRevenue}`}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{loading ? "Loading..." : analytics.avgRating}</div>
            </CardContent>
          </Card>
        </div>

        {/* Orders Summary */}
        <div className="mt-8">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">Orders Summary</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Count</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Completed</TableCell>
                <TableCell>{loading ? "Loading..." : analytics.completedOrders}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Pending</TableCell>
                <TableCell>{loading ? "Loading..." : analytics.pendingOrders}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        {/* Order History */}
        <div className="mt-8 overflow-x-auto">
          <h2 className="text-2xl font-semibold mb-4">Order History</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden sm:table-cell">Order ID</TableHead>
                <TableHead>Service</TableHead>
                <TableHead className="hidden sm:table-cell">Payment Method</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((order) => (
                <TableRow key={order._id}>
                  <TableCell className="hidden sm:table-cell">{order._id.slice(0, 6)}</TableCell>
                  <TableCell>{order.service.name}</TableCell>
                  <TableCell className="hidden sm:table-cell">{order.payment.paymentMethod}</TableCell>
                  <TableCell>₹{order.service.price}</TableCell>
                  <TableCell>{order.timeline}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}
