"use client"

import * as React from "react"
import {
  GalleryVerticalEnd,
  User,
  ShoppingBag,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/user/user-nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import Link from "next/link"

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
        { title: "Information", url: "/user/dashboard/profile/userInformation" },
        { title: "Wallet", url: "/user/dashboard/profile/wallet" },
      ],
    },
    {
      title: "Bookings",
      url: "#",
      icon: ShoppingBag,
      isActive: false,
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

  ],
}

export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <Link href={`/user/dashboard`}>
        <SidebarHeader>
          <TeamSwitcher teams={data.teams} />
        </SidebarHeader>
      </Link>

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
