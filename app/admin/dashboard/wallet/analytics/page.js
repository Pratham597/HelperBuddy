"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function WalletStatistics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { token } = JSON.parse(localStorage.getItem("admin"))
    async function fetchStats() {
      try {
        const response = await fetch("/api/analytics/wallet", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Adding Bearer token here
          },
        });
        const data = await response.json();
        if (data.success) {
          setStats(data.stats);
        }
      } catch (error) {
        console.error("Error fetching wallet statistics:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
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
                <Link href={`/admin/dashboard/profile/adminInformation`}>Admin</Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Partner Analytics</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <Card className="shadow-lg border border-black bg-black text-white rounded-lg m-4 sm:m-2">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-white tracking-wide">
            Referral Wallet Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-48 w-full rounded-lg bg-black" />
          ) : (
            <div className="overflow-hidden rounded-lg border border-white shadow-md">
              <Table className="w-full border-collapse">
                <TableHeader className="bg-black text-white">
                  <TableRow className="border-black">
                    <TableHead className="px-4 py-3 text-left text-white font-medium uppercase tracking-wider">
                      Referrer Name
                    </TableHead>
                    <TableHead className="px-4 py-3 text-left text-white font-medium uppercase tracking-wider">
                      Email
                    </TableHead>
                    <TableHead className="px-4 py-3 text-left text-white font-medium uppercase tracking-wider">
                      Phone
                    </TableHead>
                    <TableHead className="px-4 py-3 text-center text-white font-medium uppercase tracking-wider">
                      Referral Count
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-black">
                  {stats?.topReferrers?.length > 0 ? (
                    stats.topReferrers.map((referrer, index) => (
                      <TableRow
                        key={index}
                        className="hover:bg-black800 transition duration-300"
                      >
                        <TableCell className="px-4 py-3 text-white">
                          {referrer.name}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-white">
                          {referrer.email}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-white">
                          {referrer.phone}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-center font-semibold text-white bg-black rounded-md">
                          {referrer.referralCount}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4 text-white">
                        No referral transactions yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
