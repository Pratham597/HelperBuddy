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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function AdminProfilePage() {
  const [profile, setProfile] = useState(null);
  const [isChanged, setIsChanged] = useState(false);
  const [originalProfile, setOriginalProfile] = useState(null);

  useEffect(() => {
    const storedProfile = JSON.parse(localStorage.getItem("admin"));
    if (storedProfile) {
      setProfile({
        name: storedProfile.name || "",
        email: storedProfile.email || "",
        phone: storedProfile.phone || "",
      });
      setOriginalProfile({ ...storedProfile });
    }
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
    setIsChanged(value !== originalProfile[name]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    localStorage.setItem("admin", JSON.stringify(profile));
    setIsChanged(false);
    setOriginalProfile({ ...profile });
  };

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
            <CardTitle className="text-lg font-semibold">Edit Profile</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          {profile ? (
            <form onSubmit={handleSubmit} className="space-y-4 p-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input id="name" name="name" value={profile.name} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input id="email" name="email" type="email" value={profile.email} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input id="phone" name="phone" type="tel" value={profile.phone} onChange={handleChange} required />
              </div>
              <CardFooter className="flex justify-end border-t p-4">
                <Button type="submit" disabled={!isChanged} className="bg-black">
                  Update Profile
                </Button>
              </CardFooter>
            </form>
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