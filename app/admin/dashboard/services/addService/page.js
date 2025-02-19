"use client";

import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { toast } from "react-hot-toast";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function AddServicePage() {
  const [service, setService] = useState({ name: "", description: "", price: "", category: "", image: "", threshold: "" });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setService({ ...service, [e.target.name]: e.target.value });
  };

  const validateFields = () => {
    if (!service.name || !service.description || !service.price || !service.category || !service.threshold) {
      toast.error("Please fill in all required fields.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;
    setLoading(true);

    try {
      const admin = localStorage.getItem("admin");
      const { token } = JSON.parse(admin);
      if (!token) throw new Error("No authentication token found.");
      const response = await axios.post("/api/service", service, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setService({ name: "", description: "", price: "", category: "", image: "", threshold: "" });
        toast.success("Service added successfully!");
      }
    } catch (error) {
      toast.error("Failed to add service. Please try again.");
      console.error(error.message);
    }
    setLoading(false);
  };

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2">
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
                <BreadcrumbPage>Add Service</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold">Add Service</h1>
        <Card>
          <CardHeader>
            <CardTitle>Service Information</CardTitle>
            <CardDescription>Enter the details of the new service.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Service Name</Label>
              <Input id="name" name="name" placeholder="Enter service name" value={service.name} onChange={handleInputChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" placeholder="Enter service description" value={service.description} onChange={handleInputChange} required />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" name="category" placeholder="Enter service category" value={service.category} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input id="price" name="price" type="number" placeholder="Enter service price" value={service.price} onChange={handleInputChange} required />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="threshold">Threshold Period (hours)</Label>
                <Input id="threshold" name="threshold" type="number" placeholder="Enter threshold period" value={service.threshold} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <Input id="image" name="image" type="text" placeholder="Enter image URL" value={service.image} onChange={handleInputChange} />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-between gap-2">
            <Button onClick={handleSubmit} disabled={loading}>{loading ? "Adding..." : "Add Service"}</Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
