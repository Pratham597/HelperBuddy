"use client";

import { useState, useEffect } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";
import MonthlySalesGraph from '@/components/analytics/monthly-sales';
export default function Page() {
  const [barData, setBarData] = useState([]); // Store bar chart data
  const [pieData, setPieData] = useState([]); // Store pie chart data
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/analytics/most-sold-services`);
        if (response.data.services) {
          const formattedBarData = response.data.services.map((service) => ({
            name: service.name,
            revenue: service.price * service.total_bookings,
          }));
          setBarData(formattedBarData);

          const pieResponse = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/analytics/sales`);
          const sortedServices = pieResponse.data.services.sort((a, b) => b.count - a.count);
          const topServices = sortedServices.slice(0, 5);
          const otherServices = sortedServices.slice(5);

          const formattedPieData = topServices.map((service) => ({
            name: service._id.name,
            value: service.count,
          }));

          if (otherServices.length > 0) {
            const othersCount = otherServices.reduce((sum, service) => sum + service.count, 0);
            formattedPieData.push({ name: "Others", value: othersCount });
          }

          setPieData(formattedPieData);
        }
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A020F0", "#808080"];

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <Link href={`/admin/dashboard`}>Admin</Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Analytics</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Service Analytics</h1>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Services</CardTitle>
              <CardDescription>Revenue from all services</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-96 bg-white rounded-lg">
                  <Loader2 className="animate-spin w-8 h-8 text-gray-700" />
                </div>
              ) : barData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="revenue" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-gray-500">No data available</p>
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Service Distribution</CardTitle>
              <CardDescription>Top 5 services and others</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-96 bg-white rounded-lg">
                  <Loader2 className="animate-spin w-8 h-8 text-gray-700" />
                </div>
              ) : pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-gray-500">No data available</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <MonthlySalesGraph />
    </>
  );
}
