"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
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

export default function AddServicePage() {
  const [services, setServices] = useState([]);
  const [service, setService] = useState({ name: "", description: "", price: "", category: "", duration: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const admin = localStorage.getItem("admin");
        const { token } = JSON.parse(admin);
        if (!token) throw new Error("No authentication token found.");

        const response = await axios.get("http://localhost:3000/api/service", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setServices(response.data);
      } catch (error) {
        console.error("Error fetching services:", error.message);
      }
    };

    fetchServices();
  }, []);

  const handleInputChange = (e) => {
    setService({ ...service, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const admin = localStorage.getItem("admin");
      const { token } = JSON.parse(admin);
      if (!token) throw new Error("No authentication token found.");

      const response = await axios.post("http://localhost:3000/api/service/add", service, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 201) {
        setServices([...services, response.data]);
        setService({ name: "", description: "", price: "", category: "", duration: "" });
        setMessage("Service added successfully!");
      }
    } catch (error) {
      setMessage("Failed to add service.");
      console.error(error.message);
    }

    setLoading(false);
  };

  return (
    <>
      {/* Header */}
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

      {/* Add Service Form */}
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={(value) => setService({ ...service, category: value })} value={service.category}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cleaning">Cleaning</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input id="price" name="price" type="number" placeholder="Enter service price" value={service.price} onChange={handleInputChange} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (in hours)</Label>
              <Input id="duration" name="duration" type="number" placeholder="Enter service duration" value={service.duration} onChange={handleInputChange} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Cancel</Button>
            <Button onClick={handleSubmit} disabled={loading}>{loading ? "Adding..." : "Add Service"}</Button>
          </CardFooter>
        </Card>
      </div>

      {/* Services List */}
      {services.length > 0 && (
        <div className="p-6 space-y-6">
          <h1 className="text-3xl font-bold">Existing Services</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card key={service._id}>
                <CardHeader>
                  <CardTitle>{service.name}</CardTitle>
                  <CardDescription>{service.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{service.description}</p>
                  <p className="font-semibold mt-2">Price: ₹{service.price}</p>
                  {service.duration && <p>Duration: {service.duration} hours</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
