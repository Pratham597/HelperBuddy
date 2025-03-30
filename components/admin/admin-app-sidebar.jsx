"use client";

import * as React from "react";
import { GalleryVerticalEnd, User, ShoppingBag, Mail, Wallet, HandshakeIcon, Newspaper } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/admin/admin-nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useEffect, useState } from "react";

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
				{
					title: "Information",
					url: "/admin/dashboard/profile/adminInformation",
				},
				{
					title: "Add Admin",
					url: "/admin/dashboard/profile/addAdmin",
				},
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
					title: "Manage Service",
					url: "/admin/dashboard/services/manageService",
				},
				{
					title: "Add FAQs",
					url: "/admin/dashboard/services/addFAQs",
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
			icon: HandshakeIcon,
			isActive: false,
			items: [
				{
					title: "Approve Partner",
					url: "/admin/dashboard/partner/addPartner",
				},
				{
					title: "Manage Partner",
					url: "/admin/dashboard/partner/managePartner",
				},
				{
					title: "Analytics",
					url: "/admin/dashboard/partner/analytics",
				},
			],
		},
		{
			title: "Wallet Analytics",
			url: "#",
			isActive: false,
			icon: Wallet,
			items: [
				{
					title: "Analytics",
					url: "/admin/dashboard/wallet/analytics",
				},
			],
		},
		{
			title: "Blogs",
			url: "#",
			isActive: false,
			icon: Newspaper,
			items: [
				{
					title: "Add a Blog",
					url: "/admin/dashboard/blogs/add",
				},
				{
					title: "Remove a Blog",
					url: "/admin/dashboard/blogs/remove",
				},
			],
		},
		{
			title: "User Engagement",
			url: "#",
			isActive: false,
			icon: Mail,
			items: [
				{
					title: "Newsletter Emails",
					url: "/admin/dashboard/user/emails",
				},
				{
					title: "Contact Us Messages",
					url: "/admin/dashboard/user/messages",
				},
			],
		},
	],
};

export function AppSidebar({ ...props }) {
	const [profile, setProfile] = useState({});

	useEffect(() => {
		const storedProfile = JSON.parse(localStorage.getItem("admin"));
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
			<Link href={`/admin/dashboard`}></Link>
			<SidebarHeader>
				<TeamSwitcher teams={data.teams} />
			</SidebarHeader>

			<SidebarContent>
				<NavMain items={data.navMain} />
			</SidebarContent>

			<SidebarFooter>
				<NavUser user={profile} />
			</SidebarFooter>

			<SidebarRail />
		</Sidebar>
	);
}
