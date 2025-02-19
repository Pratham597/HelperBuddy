"use client";

import { Bell, ChevronsUpDown, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function NavUser({ user }) {
	const { isMobile } = useSidebar();
	const router = useRouter();
	const handleLogOut = () => {
		// deleting user from local storage and redirecting him to /

		localStorage.removeItem("admin");
		localStorage.removeItem("cart");

		Cookies.remove("role");
		Cookies.remove("salt");
		router.push("/"); // redirecting to home page
	};

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							<Avatar className="h-8 w-8 rounded-lg">
								<AvatarImage
									src={user.avatar}
									alt={user.name}
								/>
								<AvatarFallback className="rounded-lg">
									CN
								</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-semibold">
									{user.name}
								</span>
								<span className="truncate text-xs">
									{user.email}
								</span>
							</div>
							<ChevronsUpDown className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}
					>
						{/* <Link href={`/admin/dashboard/notifications`}>
							<DropdownMenuGroup>
								<DropdownMenuItem>
									<Bell />
									Notifications
								</DropdownMenuItem>
							</DropdownMenuGroup>
						</Link>
						<DropdownMenuSeparator /> */}
						<DropdownMenuItem onClick={handleLogOut}>
							<LogOut />
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
