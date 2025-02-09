"use client"

import * as React from "react"
import Link from "next/link"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Bell, Terminal } from "lucide-react"


export default function NotificationsPage() {
  const [notifications, setNotifications] = React.useState([
    { id: 1, title: "New Message", message: "You have a new message from support.", read: false },
    { id: 2, title: "Update Available", message: "A new version of the app is available.", read: true },
    { id: 3, title: "Payment Received", message: "Your payment of $50 has been processed.", read: false },
    { id: 4, title: "Subscription Reminder", message: "Your subscription expires soon.", read: true },
  ])

  const toggleReadStatus = (id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        !notification.read && notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    )
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
                <BreadcrumbPage>Notifications</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="w-full max-w-6xl mx-auto mt-6 p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <Bell className="size-5 text-gray-600" />
          Notifications
        </h2>

        <div className="space-y-4">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => toggleReadStatus(notification.id)}
                className={`p-4 border rounded-lg transition ${notification.read
                  ? "bg-gray-100 border-gray-300 text-gray-500"
                  : "bg-blue-50 border-blue-500 text-blue-900"
                  }`}
              >
                <h3 className="font-semibold">{notification.title}</h3>
                <p className="text-sm">{notification.message}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No new notifications</p>
          )}
        </div>
      </div>
    </>
  )
}
