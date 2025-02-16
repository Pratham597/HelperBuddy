"use client";

import * as React from "react";
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

export default function WalletPage() {
  const [wallet, setWallet] = React.useState({ points: 0, referralCode: "" });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchWalletData = () => {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (userData) {
        setWallet({
          points: userData.wallet || 0,
          referralCode: userData.referralCode || "N/A",
        });
      }
      setLoading(false);
    };

    fetchWalletData();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(wallet.referralCode);
  };

  return (
    <>
      {/* Header Section */}
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <Link href={`/user/dashboard`}>User</Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Wallet</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      {/* Wallet Card Section */}
      <div className="w-full max-w-6xl mx-auto mt-6 p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold mb-6">Wallet Details</h2>

        {/* Loading State */}
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            {/* Wallet Points */}
            <div className="flex flex-col">
              <label className="font-medium text-gray-600">Wallet Points</label>
              <input
                type="text"
                value={wallet.points}
                readOnly
                className="p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
              />
            </div>

            {/* Referral Code */}
            <div className="flex flex-col">
              <label className="font-medium text-gray-600">Referral Code</label>
              <div className="flex items-center justify-between mt-1">
                <input
                  type="text"
                  value={wallet.referralCode}
                  readOnly
                  className="p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                />
                <button
                  onClick={handleCopy}
                  className="px-4 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
