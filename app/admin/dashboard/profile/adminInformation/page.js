"use client";

import { useState, useEffect } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function AdminProfilePage() {
  const [profile, setProfile] = useState(null);

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
    <div className="min-h-screen bg-white">
      <header className="flex h-16 items-center gap-4 px-6 border-b">
        <SidebarTrigger className="text-gray-700 hover:text-gray-900" />
        <Separator orientation="vertical" className="h-6" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <Link href="/admin/dashboard" className="text-gray-700 hover:text-gray-900">
                Admin
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-medium">Admin Information</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <Card className="shadow-md border border-gray-200">
          <CardHeader className="border-b p-4">
            <CardTitle className="text-lg font-semibold">Admin Profile</CardTitle>
            <CardDescription>Your personal information</CardDescription>
          </CardHeader>
          {profile ? (
            <CardContent className="space-y-4 p-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input id="name" name="name" value={profile.name} disabled />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input id="email" name="email" type="email" value={profile.email} disabled />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input id="phone" name="phone" type="tel" value={profile.phone} disabled />
              </div>
            </CardContent>
          ) : (
            <div className="p-6 space-y-6">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}
