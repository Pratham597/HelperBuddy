"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Page() {
    const [orders, setOrders] = useState([]);
    const [expandedOrders, setExpandedOrders] = useState({});

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const user = JSON.parse(localStorage.getItem("user"));
                if (!user || !user.token) return;

                const headers = {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                };

                const serviceDone = await axios.post(
                    `${process.env.NEXT_PUBLIC_URL}/api/user/serviceDone`,
                    {},
                    { headers }
                );
                console.log(serviceDone);
                const responses = await Promise.all([serviceDone]);
                let count = 0;

                const allOrders = [
                    ...responses[0].data.serviceOrder.map((order) => ({
                        id: order._id,
                        service: order.service,
                        address: order.address,
                        pincode: order.pincode,
                        timeline: order.timeline,
                        userCode: order.userCode,
                        key: count++,
                    })),
                ];
                console.log(allOrders);
                setOrders(allOrders);
            } catch (error) {
                console.error(error);
            }
        };

        fetchOrders();
    }, []);

    const toggleDetails = (id) => {
        setExpandedOrders((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <>
            <header className="flex h-16 items-center gap-2 px-4 transition-all ease-linear">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="h-4" />
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbPage>User</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </header>

            <div className="space-y-6 p-4 sm:p-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Orders Completed</h1>

                {orders.length > 0 ? (
                    orders.map((order) => {
                        const isExpanded = expandedOrders[order.id];

                        return (
                            <Card key={order.key} className="p-4 bg-white shadow-md rounded-xl">
                                <CardHeader className="flex flex-col sm:flex-row justify-between items-center">
                                    <div className="w-full">
                                        <CardTitle className="text-lg sm:text-xl text-gray-900">
                                            Order #{order.id}
                                        </CardTitle>
                                        <CardDescription className="text-sm sm:text-base text-gray-600">
                                            View your completed order details
                                        </CardDescription>
                                    </div>
                                    <Button
                                        onClick={() => toggleDetails(order.id)}
                                        className="mt-2 sm:mt-0 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all"
                                    >
                                        {isExpanded ? "Hide Details" : "View Details"}
                                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                    </Button>
                                </CardHeader>

                                {isExpanded && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="mt-4 bg-gray-100 rounded-lg p-4"
                                    >
                                        {/* Service Details */}
                                        {order.service ? (
                                            <div className="space-y-2">
                                                <h3 className="text-lg font-semibold text-gray-800">Service Details</h3>
                                                <p><strong>Name:</strong> {order.service.name || "N/A"}</p>
                                                <p><strong>Category:</strong> {order.service.category || "N/A"}</p>
                                                <p><strong>Description:</strong> {order.service.description || "N/A"}</p>
                                                <p><strong>Price:</strong> ₹{order.service.price || "N/A"}</p>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500">No service details available.</p>
                                        )}

                                        {/* Additional Order Details */}
                                        <div className="mt-4 space-y-2 border-t border-gray-300 pt-4">
                                            <h3 className="text-lg font-semibold text-gray-800">Order Details</h3>
                                            <p><strong>Address:</strong> {order.address || "N/A"}</p>
                                            <p><strong>Pincode:</strong> {order.pincode || "N/A"}</p>
                                            <p><strong>Timeline:</strong> {order.timeline || "N/A"}</p>
                                            <p><strong>User Code:</strong> {order.userCode || "N/A"}</p>
                                        </div>
                                    </motion.div>
                                )}
                            </Card>
                        );
                    })
                ) : (
                    <div className="text-center">
                        <p className="mb-4 text-gray-600">No Completed orders. Start a new one!</p>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                            Place Order
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
}
