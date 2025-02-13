"use client"

import { Bell, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useState } from "react"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    { id: 1, title: "New Partner Request", description: "A new partner has requested to join.", status: "unread" },
    { id: 2, title: "Service Update", description: "The 'Cleaning' service has been updated.", status: "read" },
    { id: 3, title: "Admin Added", description: "A new admin has been added to the system.", status: "unread" },
  ]);

  const markAsRead = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id ? { ...notification, status: "read" } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) => ({ ...notification, status: "read" }))
    );
  };

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
                <BreadcrumbPage>Notifications</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Notifications</h1>
          <Button variant="outline" onClick={markAllAsRead}>
            <Bell className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Recent Notifications</CardTitle>
            <CardDescription>
              You have {notifications.filter((n) => n.status === "unread").length} unread notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              {notifications.map((notification, index) => (
                <div key={notification.id}>
                  <div className="flex items-start space-x-4 py-4">
                    {notification.status === "unread" ? (
                      <Bell className="mt-1 h-5 w-5 text-blue-500" />
                    ) : (
                      <CheckCircle className="mt-1 h-5 w-5 text-green-500" />
                    )}
                    <div className="space-y-1">
                      <p className="font-medium">{notification.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{notification.description}</p>
                    </div>
                    {notification.status === "unread" && (
                      <Button variant="ghost" size="sm" className="ml-auto" onClick={() => markAsRead(notification.id)}>
                        <XCircle className="h-4 w-4" />
                        <span className="sr-only">Mark as read</span>
                      </Button>
                    )}
                    <Button variant="ghost" size="sm">
                      <span className="sr-only">Dismiss</span>
                    </Button>
                  </div>
                  {index < notifications.length - 1 && <Separator />}
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

