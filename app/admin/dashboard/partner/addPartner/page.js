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
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export default function Page() {
  const [pendingPartners, setPendingPartners] = useState([]);
  const [acceptedPartners, setAcceptedPartners] = useState([]);
  const [rejectedPartners, setRejectedPartners] = useState([]);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const admin = localStorage.getItem("admin");
        const { token } = JSON.parse(admin);
        if (!token) throw new Error("No authentication token found.");

        const response = await axios.get("http://localhost:3000/api/partner", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPendingPartners(response.data.filter((partner) => partner.isApproved === "0"));
        setAcceptedPartners(response.data.filter((partner) => partner.isApproved === "1"));
        setRejectedPartners(response.data.filter((partner) => partner.isApproved === "-1"));
      } catch (err) {
        console.log(err.response?.data?.error || err.message);
      }
    };

    fetchPartners();
  }, [flag]);

  const handleAction = async (id, action) => {
    try {
      const admin = localStorage.getItem("admin");
      const { token } = JSON.parse(admin);
      if (!token) throw new Error("No authentication token found.");

      const response = await axios.post(
        `http://localhost:3000/api/partner/${id}/approve`,
        { isApproved: action },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) setFlag((prev) => !prev);
    } catch (error) {
      console.log(error);
    }

    setSelectedPartner(null);
  };

  return (
    <>
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2">
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
                <BreadcrumbPage>Add Partner</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      {/* Pending Partners */}
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold">Pending Partners</h1>
        <Card>
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
            <CardDescription>Review and approve pending partner requests.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingPartners.length === 0 ? (
              <p className="text-gray-600">No pending partners.</p>
            ) : (
              pendingPartners.map((partner) => (
                <div key={partner._id} className="p-4 bg-black text-white rounded-lg flex justify-between items-center">
                  <p className="font-medium">{partner.name}</p>
                  <Button variant="outline" onClick={() => setSelectedPartner(partner)}>
                    View Details
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Partner Details Modal */}
      {selectedPartner && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-60">
          <Card className="w-96 border border-black shadow-lg">
            <CardHeader>
              <CardTitle>Partner Details</CardTitle>
              <CardDescription>Review partner details before approval.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><strong>Name:</strong> {selectedPartner.name}</p>
              <p><strong>Email:</strong> {selectedPartner.email}</p>
              <p><strong>Phone:</strong> {selectedPartner.phone}</p>
              <div className="space-y-2">
                <Label>Approval Status</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1" onClick={() => handleAction(selectedPartner._id, 1)}>Accept</SelectItem>
                    <SelectItem value="-1" onClick={() => handleAction(selectedPartner._id, -1)}>Reject</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setSelectedPartner(null)}>Close</Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Accepted Partners */}
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold">Accepted Partners</h1>
        <Card>
          <CardHeader>
            <CardTitle>Approved Partners</CardTitle>
            <CardDescription>List of approved partners.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {acceptedPartners.length === 0 ? (
              <p className="text-gray-600">No accepted partners.</p>
            ) : (
              acceptedPartners.map((partner) => (
                <div key={partner._id} className="p-4 bg-black text-white rounded-lg">
                  <p className="font-medium">{partner.name}</p>
                  <p className="text-gray-300">{partner.email}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Rejected Partners */}
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold">Rejected Partners</h1>
        <Card>
          <CardHeader>
            <CardTitle>Rejected Requests</CardTitle>
            <CardDescription>Partners who were not approved.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {rejectedPartners.length === 0 ? (
              <p className="text-gray-600">No rejected partners.</p>
            ) : (
              rejectedPartners.map((partner) => (
                <div key={partner._id} className="p-4 bg-black text-white rounded-lg">
                  <p className="font-medium">{partner.name}</p>
                  <p className="text-gray-300">{partner.email}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
