"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Star, TruckIcon } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList } from "@/components/ui/breadcrumb";
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

  useEffect(() => {
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
  }, []);

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <Link href={`/partner/dashboard`}>Partner</Link>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex min-h-screen flex-col">
        <main className="flex-1">
          <div className="container mx-auto p-4 md:p-6 lg:p-8">
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <h1 className="text-3xl font-bold tracking-tight">Partner Dashboard</h1>
              <Select defaultValue="today">
                <SelectTrigger className="w-[180px]">
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
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders Delivered</CardTitle>
                  <TruckIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{loading ? "Loading..." : analytics.completedOrders}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue Earned</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{loading ? "Loading..." : `₹${analytics.totalRevenue}`}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{loading ? "Loading..." : analytics.avgRating}</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Orders */}
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">Orders Summary</h2>
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

            {/* Earnings Breakdown */}
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">Earnings Breakdown</h2>
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm">Service Earnings</p>
                    <p className="text-sm font-semibold">{loading ? "Loading..." : `₹${(analytics.totalRevenue * 0.8).toFixed(2)}`}</p>
                  </div>
                  <Progress value={80} className="mb-4" />

                  <div className="flex justify-between items-center mb-2">
                    <p className="text-sm">Bonuses</p>
                    <p className="text-sm font-semibold">₹150</p>
                  </div>
                  <Progress value={50} className="mb-4" />

                  <div className="flex justify-between items-center">
                    <p className="text-sm">Tips</p>
                    <p className="text-sm font-semibold">₹39.50</p>
                  </div>
                  <Progress value={20} className="mb-4" />
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
