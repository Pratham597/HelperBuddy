"use client"

import * as React from "react"
import {
  GalleryVerticalEnd,
  User,
  ShoppingBag,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

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
      title: "Bookings",
      url: "#",
      icon: ShoppingBag,
      isActive: true,
      items: [
        {
          title: "Service Pending",
          url: "/user/dashboard/bookings/servicesPending",
        },
        {
          title: "History",
          url: "/user/dashboard/bookings/history",
        },
      ],
    },
    {
      title: "Profile",
      url: "#",
      icon: User,
      isActive: false,
      items: [
        { title: "Information", url: "/user/dashboard/profile/userInformation" },
        { title: "Wallet", url: "/user/dashboard/profile/wallet" },
      ],
    },
  ],
}

export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
