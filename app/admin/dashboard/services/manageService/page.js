"use client";

import { useState, useEffect } from "react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ManageServicePage() {
  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [service, setService] = useState({ name: "", description: "", price: "", category: "", image: "", threshold: "" });
  const [originalService, setOriginalService] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get("/api/service");
        setServices(response.data);
      } catch (error) {
        toast.error("Failed to fetch services");
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    if (selectedServiceId) {
      const selected = services.find((s) => s._id === selectedServiceId);
      setService(selected || { name: "", description: "", price: "", category: "", image: "", threshold: "" });
      setOriginalService(selected);
      setIsModified(false);
    }
  }, [selectedServiceId, services]);

  const handleInputChange = (e) => {
    const updatedService = { ...service, [e.target.name]: e.target.value };
    setService(updatedService);
    if (!selectedServiceId) {
      return;
    }
    setIsModified(JSON.stringify(updatedService) !== JSON.stringify(originalService));
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
    if (!validateFields() || !isModified) return;
    setLoading(true);

    try {
      const admin = localStorage.getItem("admin");
      const { token } = JSON.parse(admin);
      if (!token) throw new Error("No authentication token found.");
      await axios.put(`/api/service/${selectedServiceId}`, service, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Service updated successfully!");
      setOriginalService(service);
      setIsModified(false);
    } catch (error) {
      toast.error("Failed to update service. Please try again.");
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
                <BreadcrumbPage>Manage Service</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold">Manage Services</h1>
        <Card>
          <CardHeader>
            <CardTitle>Select Service</CardTitle>
            <CardDescription>Choose a service to edit.</CardDescription>
          </CardHeader>
          <CardContent>
            <Select onValueChange={setSelectedServiceId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((s, id) => (
                  <SelectItem key={id} value={s._id}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Edit Service</CardTitle>
            <CardDescription>Modify the details of the selected service.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Service Name</Label>
              <Input id="name" name="name" value={service.name} onChange={handleInputChange} placeholder="Service name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" value={service.description} onChange={handleInputChange} placeholder="Service description" required />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" name="category" value={service.category} onChange={handleInputChange} placeholder="Service category" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input id="price" name="price" type="number" value={service.price} onChange={handleInputChange} placeholder="Service price" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Image URL</Label>
              <Input id="image" name="image" type="text" value={service.image} onChange={handleInputChange} placeholder="Service image Url" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="threshold">Threshold Period</Label>
              <Input id="threshold" name="threshold" type="number" value={service.threshold} onChange={handleInputChange} placeholder="Enter threshold period" required />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-between gap-2">
            <Button onClick={handleSubmit} disabled={!isModified || loading}>{loading ? "Updating..." : "Edit Service"}</Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}