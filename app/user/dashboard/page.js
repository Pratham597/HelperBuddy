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
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { verifyUser } from "@/middlewares/roleVerify";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Page() {
    const [orders, setOrders] = useState([]);
    const [expandedOrders, setExpandedOrders] = useState({});

    const router = useRouter();
    useEffect(() => {
        if (!verifyUser()) {
            toast.error("You are not authorized to view this page.");
            // DELETE THE USER FROM LOCAL STORAGE
            localStorage.removeItem("user");
			router.push("/user/login");
		}
    }, []);
    
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const user = JSON.parse(localStorage.getItem("user"));
                if (!user || !user.token) return;

                const headers = {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                };

                const servicePartnerAccepted = axios.post(
                    `${process.env.NEXT_PUBLIC_URL}/api/user/servicePartnerAccepted`,
                    {},
                    { headers }
                );

                const servicePending = axios.post(
                    `${process.env.NEXT_PUBLIC_URL}/api/user/servicesPending`,
                    {},
                    { headers }
                );

                const responses = await Promise.all([servicePartnerAccepted, servicePending]);
                let count = 0;

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
                ];

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

    const statusPercentages = {
        "Paid": 15,
        "Partner Assigned": 50,
        "Completed": 100,
    };

    const bookingStages = ["Paid", "Partner Assigned", "Completed"];

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

                 
        </>
    );
}
