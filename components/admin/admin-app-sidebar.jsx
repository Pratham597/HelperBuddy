"use client"

import * as React from "react"
import {
  GalleryVerticalEnd,
  User,
  ShoppingBag,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/admin/admin-nav-user"
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
        { title: "Information", url: "/admin/dashboard/profile/adminInformation" },
        { title: "Add Admin", url: "/admin/dashboard/profile/addAdmin" },
      ],
    },
    {
      title: "Services",
      url: "#",
      icon: ShoppingBag,
      isActive: false,
      items: [
        {
          title: "Add Service",
          url: "/admin/dashboard/services/addService",
        },
        {
          title: "Analytics",
          url: "/admin/dashboard/services/analytics",
        },
      ],
    },
    {
      title: "Partner",
      url: "#",
      icon: ShoppingBag,
      isActive: false,
      items: [
        {
          title: "Add Partner",
          url: "/admin/dashboard/partner/addPartner",
        },
        {
          title: "Analytics",
          url: "/admin/dashboard/partner/analytics",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <Link href={`/admin/dashboard`}></Link>
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