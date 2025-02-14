"use client"

import * as React from "react"
import {
  GalleryVerticalEnd,
  User,
  ShoppingBag,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/partner/partner-nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { useState, useEffect } from "react"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
  },
  teams: [
    {
      name: "Helper Buddy",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Profile",
      url: "#",
      icon: User,
      isActive: false,
      items: [
        { title: "Information", url: "/partner/dashboard/profile/partnerInformation" },
        { title: "Services Provided", url: "/partner/dashboard/profile/servicesProvided" },
      ],
    },
    {
      title: "Orders",
      url: "#",
      icon: ShoppingBag,
      isActive: false,
      items: [
        {
          title: "Active Orders",
          url: "/partner/dashboard/services/activeOrders",
        },
        {
          title: "Order Requests",
          url: "/partner/dashboard/services/orderRequests",
        },
        {
          title: "History",
          url: "/partner/dashboard/services/history",
        },
      ],
    },

  ],
}

export function AppSidebar({ ...props }) {
  const [profile, setProfile] = useState({})

  useEffect(() => {
    const storedProfile = JSON.parse(localStorage.getItem("partner"));
    if (storedProfile) {
      setProfile({
        name: storedProfile.name || "",
        email: storedProfile.email || "",
        phone: storedProfile.phone || "",
      });
    }
  }, []);

  return (
    <Sidebar collapsible="icon" {...props}>
      <Link href={`/partner/dashboard`}>
        <SidebarHeader>
          <TeamSwitcher teams={data.teams} />
        </SidebarHeader>
      </Link>

      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={profile} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}