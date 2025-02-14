import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";

const MonthlySalesGraph = () => {
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );

  // Generate an array of the last 5 years
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString());

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        setLoading(true);
        const admin = JSON.parse(localStorage.getItem("admin"));
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_URL}/api/analytics/sales/yearly`,
          { year: parseInt(selectedYear) },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${admin.token}`,
            },
          }
        );
        if (response.data.success) {
          setSalesData(
            response.data.monthlySales.map((item) => ({
              name: item.month.substring(0, 3),
              sales: item.totalSales,
              bookings: item.totalBookings,
            }))
          );
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching sales data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSalesData();
  }, [selectedYear]);

  if (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Monthly Sales Trends</CardTitle>
          <CardDescription>Error loading sales data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center h-[300px] text-red-500 text-center">
            {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 pb-4">
        <div className="text-center sm:text-left">
          <CardTitle>Monthly Sales Trends</CardTitle>
          <CardDescription>Revenue and booking trends for {selectedYear}</CardDescription>
        </div>
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-[120px] sm:w-[140px] text-sm">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-[300px]">
            <Loader2 className="animate-spin w-8 h-8 text-gray-700" />
          </div>
        ) : (
          <div className="w-full h-[250px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="sales"
                  stroke="#8884d8"
                  name="Total Sales (₹)"
                  dot={{ r: 4 }}
                  activeDot={{ r: 8 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="bookings"
                  stroke="#82ca9d"
                  name="Total Bookings"
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MonthlySalesGraph;
