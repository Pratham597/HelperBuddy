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
import { toast } from 'react-hot-toast'
import axios from "axios";
import { useState, useEffect } from "react";

export default function WalletPage({ }) {
    const [wallet, setWallet] = useState(0);
    const [referralCode, setReferralCode] = useState("");

    const fetchWallet = async () => {
        const user = JSON.parse(localStorage.getItem("user"));
        const walletData = await axios.post(`${process.env.NEXT_PUBLIC_URL}/api/user/wallet`, {}, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`
            }
        });
        setWallet(walletData.data.wallet);
        setReferralCode(walletData.data.referralCode);
    }
    useEffect(() => {
        fetchWallet();
    });

    const handleCopy = () => {
        navigator.clipboard.writeText(wallet.referralCode);
        toast.success("Referral code copied to clipboard");
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
                                <Link href={`/user/dashboard/profile/userInformation`}>User</Link>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                    {/* Wallet Points */}
                    <div className="flex flex-col">
                        <label className="font-medium text-gray-600">Wallet Points</label>
                        <input
                            type="text"
                            value={wallet}
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
                                value={referralCode}
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
            </div>
        </>
    );
}