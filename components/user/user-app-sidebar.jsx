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
import { useState, useEffect } from "react"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
  },
  teams: [
    {
      name: "Helper Buddy",
      logo: "/logo.png",
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
        {title: "Referrals",url:"/user/dashboard/profile/referrals"}
      ],
    },
    {
      title: "Bookings",
      url: "#",
      icon: ShoppingBag,
      isActive: false,
      items: [
        {
          title: "Active Orders",
          url: "/user/dashboard/bookings/servicesPending",
        },
        {
          title: "Order History",
          url: "/user/dashboard/bookings/history",
        }
      ],
    },

  ],
}

export function AppSidebar({ ...props }) {
  const [profile, setProfile] = useState({})

  useEffect(() => {
    const storedProfile = JSON.parse(localStorage.getItem("user"));
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
      <Link href={`/`}>
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
