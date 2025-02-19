"use client";

import React, { useEffect, useState } from "react";
import { Mail, Phone, Users, Gift, Copy } from "lucide-react";
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

const ReferralList = () => {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [referralCode, setReferralCode] = useState("");

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("user"));
        if (userData) {
          setReferralCode(userData.referralCode || "N/A");
          const response = await fetch("/api/user/referrals", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userData.token}`,
            },
          });

          const result = await response.json();
          setReferrals(result.referrals || []);
        }
      } catch (error) {
        console.error("Error fetching referrals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReferrals();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
  };

  return (
    <>
      <header className="flex h-16 items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <Link href={`/user/dashboard/profile/userInformation`}>User</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>User Information</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="p-6 bg-gradient-to-r from-gray-900 to-black text-white rounded-lg shadow-lg m-2">
        {/* Header Section */}
        <div className="mb-6 text-2xl font-bold text-center flex items-center justify-center gap-2">
          <Users className="w-7 h-7 text-blue-400" />
          <span>Your Referrals</span>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center text-gray-400 animate-pulse">
            Loading referrals...
          </div>
        )}

        {/* No Referrals Found */}
        {!loading && referrals.length === 0 && (
          <div className="text-center text-gray-300 p-6 rounded-lg bg-gray-800 shadow-md">
            <Gift className="w-10 h-10 mx-auto text-yellow-400" />
            <p className="mt-3 text-lg font-medium">
              You have no referrals yet! 🚀
            </p>
            <p className="mt-1 text-sm text-gray-400">
              Start referring your friends and earn bonus points in cash! 💰🔥
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <input
                type="text"
                value={referralCode}
                readOnly
                className="p-2 border border-gray-600 rounded-md bg-gray-700 text-white text-center w-44"
              />
              <button
                onClick={handleCopy}
                className="px-3 py-1 bg-blue-600 text-white rounded-md flex items-center gap-1 hover:bg-blue-700 transition"
              >
                <Copy className="w-4 h-4" />
                Copy Code
              </button>
            </div>
          </div>
        )}

        {/* Referral Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 ">
          {referrals.map((referral, index) => (
            <div
              key={index}
              className="relative bg-white p-5 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <div className="absolute top-2 right-2 text-xs text-black">
                #{index + 1}
              </div>
              <div className="flex flex-col items-start">
                <h3 className="text-lg font-semibold text-black ">
                  {referral.name}
                </h3>
                <div className="flex items-center gap-2 text-black text-sm mt-1">
                  <Mail className="w-4 h-4 text-blue-800" />
                  <span>{referral.email}</span>
                </div>
                <div className="flex items-center gap-2 text-black text-sm mt-1">
                  <Phone className="w-4 h-4 text-green-500" />
                  <span>{referral.phone}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ReferralList;

