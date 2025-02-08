"use client"

import * as React from "react"
import Link from "next/link"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export default function WalletPage() {
  const wallet = {
    points: 1500,
    referralCode: "ABC123XYZ",
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(wallet.referralCode)
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
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

      <div className="w-full max-w-6xl mx-auto mt-6 p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold mb-6">Wallet Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          {/* Wallet Points */}
          <div className="flex flex-col bg-gray-100 p-4 rounded-lg shadow">
            <span className="text-gray-600 font-medium">Wallet Points</span>
            <span className="text-lg font-semibold text-gray-800">{wallet.points}</span>
          </div>

          {/* Referral Code */}
          <div className="flex flex-col bg-gray-100 p-4 rounded-lg shadow">
            <span className="text-gray-600 font-medium">Referral Code</span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-lg font-semibold text-gray-800">{wallet.referralCode}</span>
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
  )
}
