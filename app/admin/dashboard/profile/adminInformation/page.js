import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Mail, Phone, MapPin, Calendar } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link";

export default function Page() {
  const adminInfo = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Admin St, City, Country",
    role: "Super Admin",
    joinDate: "January 1, 2023",
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
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
                <BreadcrumbPage>Admin Information</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold">Admin Information</h1>
        <Card>
          <CardHeader className="flex flex-row items-center space-x-4 pb-2">
            <Avatar className="h-20 w-20">
              <AvatarImage src="/avatars/01.png" alt={adminInfo.name} />
              <AvatarFallback>
                {adminInfo.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{adminInfo.name}</CardTitle>
              <CardDescription>{adminInfo.role}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center space-x-4">
              <Mail className="h-4 w-4 opacity-70" />
              <span>{adminInfo.email}</span>
            </div>
            <div className="flex items-center space-x-4">
              <Phone className="h-4 w-4 opacity-70" />
              <span>{adminInfo.phone}</span>
            </div>
            <div className="flex items-center space-x-4">
              <MapPin className="h-4 w-4 opacity-70" />
              <span>{adminInfo.address}</span>
            </div>
            <div className="flex items-center space-x-4">
              <Calendar className="h-4 w-4 opacity-70" />
              <span>Joined on {adminInfo.joinDate}</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Edit Profile</Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}