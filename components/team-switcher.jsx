"use client"

import * as React from "react"
import { ChevronsUpDown, Plus } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import Link from "next/link"
import Image from "next/image"

export function TeamSwitcher({
  teams
}) {
  const { isMobile } = useSidebar()
  const [activeTeam, setActiveTeam] = React.useState(teams[0])

  return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
						>
							{/* <div
                className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <activeTeam.logo className="size-4" />
              </div> */}
							<Image
								src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=656,h=651,fit=crop/AzGeNv8QxRTqXJan/img_20241225_095321_917-AMqlqLEqp3tk7qEe.webp"
                width={56}
                height={56}
                alt="Team logo"
								className="h-14 w-14"
							/>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-semibold">
									{activeTeam.name}
								</span>
								<span className="truncate text-xs">
									{activeTeam.plan}
								</span>
							</div>
						</SidebarMenuButton>
					</DropdownMenuTrigger>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
  );
}
