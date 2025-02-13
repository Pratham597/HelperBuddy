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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function PendingPartnersPage() {
  const [pendingPartners, setPendingPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 2;

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const admin = localStorage.getItem("admin");
        const { token } = JSON.parse(admin);
        if (!token) throw new Error("No authentication token found.");

        const response = await axios.get("http://localhost:3000/api/partner", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPendingPartners(response.data.filter((partner) => partner.isApproved === "1"));
      } catch (err) {
        console.log(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  const totalPages = Math.ceil(pendingPartners.length / pageSize);
  const paginatedData = pendingPartners.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <>
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
                <BreadcrumbPage>Accepted Partners</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold">Accepted Partners</h1>
        <Card>
          <CardHeader>
            <CardTitle>Accepted Approvals</CardTitle>
            <CardDescription>Review pending partner requests.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <p>Loading...</p>
            ) : paginatedData.length === 0 ? (
              <p className="text-gray-600">No pending partners.</p>
            ) : (
              paginatedData.map((partner) => (
                <div key={partner._id} className="p-4 bg-black text-white rounded-lg flex justify-between items-center">
                  <p className="font-medium">{partner.name}</p>
                  <Button className="text-black" variant="outline" onClick={() => setSelectedPartner(partner)}>
                    View Details
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
          </PaginationItem>
          {Array.from({ length: totalPages }, (_, index) => (
            <PaginationItem key={index}>
              <PaginationLink onClick={() => setCurrentPage(index + 1)} isActive={currentPage === index + 1}>
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {selectedPartner && (
        <Dialog open={true} onOpenChange={() => setSelectedPartner(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Partner Details</DialogTitle>
            </DialogHeader>
            <p><strong>Name:</strong> {selectedPartner.name}</p>
            <p><strong>Email:</strong> {selectedPartner.email}</p>
            <p><strong>Phone:</strong> {selectedPartner.phone}</p>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
