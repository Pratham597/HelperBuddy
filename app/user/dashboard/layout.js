import { AppSidebar } from "@/components/user/user-app-sidebar"
import {
	SidebarInset,
	SidebarProvider,
} from "@/components/ui/sidebar"

export default function RootLayout({ children }) {
	return (
		<SidebarProvider >
			<AppSidebar />
			<SidebarInset>
				{children}
			</SidebarInset>
		</SidebarProvider>
	);
}