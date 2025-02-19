"use client";

import React, { useEffect, useState } from "react";
import { User } from "lucide-react";
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

const PartnerAnalytics = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { token } = JSON.parse(localStorage.getItem("admin")) || {};
      if (!token) return;

      const response = await fetch("/api/analytics/top-service-partner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      setData(result);
    };

    fetchData();
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
      <div className="p-5 bg-gray-900 text-white rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-300 text-center mb-3">
          Total Service Partners:
          <span className="text-green-400 text-xl ml-2">
            {data ? data.totalPartners : "0"}
          </span>
        </h2>

        {/* Top Service Partners Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-700 text-sm text-gray-300">
            <thead className="bg-gray-800 text-xs text-gray-400 uppercase tracking-wide">
              <tr>
                <th className="border border-gray-700 px-3 py-2">#</th>
                <th className="border border-gray-700 px-3 py-2">Name</th>
                <th className="border border-gray-700 px-3 py-2">Email</th>
                <th className="border border-gray-700 px-3 py-2">Phone</th>
                <th className="border border-gray-700 px-3 py-2">Orders Completed</th>
              </tr>
            </thead>
            <tbody>
              {data?.topPartners?.length > 0 ? (
                data.topPartners.map((partner, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-800 transition-all border-b border-gray-800"
                  >
                    <td className="border border-gray-700 px-3 py-2 text-center text-gray-400">
                      {index + 1}
                    </td>
                    <td className="border border-gray-700 px-3 py-2 flex items-center gap-2 ">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300">{partner.name}</span>
                    </td>
                    <td className="border border-gray-700 px-3 py-2 text-gray-400 text-center">
                      {partner.email}
                    </td>
                    <td className="border border-gray-700 px-3 py-2 text-gray-400 text-center ">
                      {partner.phone}
                    </td>
                    <td className="border border-gray-700 px-3 py-2 text-green-400 text-sm font-semibold text-center">
                      {partner.completedOrders}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-3 text-gray-500">
                    No Data Available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default PartnerAnalytics;

