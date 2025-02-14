"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import toast from "react-hot-toast";

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const partner = JSON.parse(localStorage.getItem("partner"));
      if (!partner || !partner.token) throw new Error("No authentication token found.");

      const response = await axios.post("/api/partner/fetchOrder", {}, {
        headers: { Authorization: `Bearer ${partner.token}` },
      });

      setOrders(response.data.serviceOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOrder = async (orderId) => {
    const partner = JSON.parse(localStorage.getItem("partner"));
    if (!partner || !partner.token) throw new Error("No authentication token found.");
    try {
      await axios.post(`/api/partner/acceptOrder`, { serviceorder_id: orderId }, {
        headers: {
          Authorization: `Bearer ${partner.token}`
        }
      });
      toast.success("Order accepted successfully");
      fetchOrders(); // Refresh the list
      setSelectedOrder(null); // Close dialog
    } catch (error) {
      console.error("Error accepting order:", error);
      toast.error("Error accepting order");
    }
  };

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
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Orders</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold">Pending Orders</h1>
        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
            <CardDescription>Review and accept service orders.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <p>Loading...</p>
            ) : orders.length === 0 ? (
              <p className="text-gray-600">No pending orders.</p>
            ) : (
              orders.map((order) => (
                <div key={order._id} className="p-4 bg-black text-white rounded-lg flex justify-between items-center">
                  <p className="font-medium">{order.service.name}</p>
                  <Button className="text-black" variant="outline" onClick={() => setSelectedOrder(order)}>
                    View Details
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {selectedOrder && (
        <Dialog open={true} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Order Details</DialogTitle>
            </DialogHeader>
            <p><strong>Service:</strong> {selectedOrder.service.name}</p>
            <p><strong>Timeline:</strong> {selectedOrder.timeline}</p>
            <p><strong>Pincode:</strong> {selectedOrder.pincode}</p>
            <p><strong>Address:</strong> {selectedOrder.address}</p>
            {selectedOrder.remarks && <p><strong>Remarks:</strong> {selectedOrder.remarks}</p>}
            <DialogFooter className="flex justify-end gap-2">
              <Button variant="default" onClick={() => handleAcceptOrder(selectedOrder._id)}>
                Accept Order
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
