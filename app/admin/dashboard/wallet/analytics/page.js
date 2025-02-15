"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export default function WalletStatistics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const {token}=JSON.parse(localStorage.getItem("admin"))
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
    <Card className="shadow-lg border border-gray-700 bg-black text-white rounded-lg">
      <CardHeader>
        <CardTitle className="text-lg font-medium text-white tracking-wide">
          Referral Wallet Statistics
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-48 w-full rounded-lg bg-gray-800" />
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-600 shadow-md">
            <Table className="w-full border-collapse">
              <TableHeader className="bg-gray-900 text-gray-300">
                <TableRow className="border-b border-gray-700">
                  <TableHead className="px-4 py-3 text-left font-medium uppercase tracking-wider">
                    Referrer Name
                  </TableHead>
                  <TableHead className="px-4 py-3 text-left font-medium uppercase tracking-wider">
                    Email
                  </TableHead>
                  <TableHead className="px-4 py-3 text-left font-medium uppercase tracking-wider">
                    Phone
                  </TableHead>
                  <TableHead className="px-4 py-3 text-center font-medium uppercase tracking-wider">
                    Referral Count
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-700">
                {stats?.topReferrers?.length > 0 ? (
                  stats.topReferrers.map((referrer, index) => (
                    <TableRow
                      key={index}
                      className="hover:bg-gray-800 transition duration-300"
                    >
                      <TableCell className="px-4 py-3 text-white">
                        {referrer.name}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-300">
                        {referrer.email}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-gray-300">
                        {referrer.phone}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-center font-semibold text-white bg-gray-900 rounded-md">
                        {referrer.referralCount}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-gray-400">
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
  );
}
