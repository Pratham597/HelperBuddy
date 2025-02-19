"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "react-hot-toast";

export default function ServiceManagement() {
  const [availableServices, setAvailableServices] = useState([]);
  const [servicesProvided, setServicesProvided] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [removingServiceId, setRemovingServiceId] = useState(null); // Track which service is being removed

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await axios.get("/api/service");
        if (Array.isArray(data)) {
          setAvailableServices(data);
        }
        const partner = JSON.parse(localStorage.getItem("partner"));
        const { token } = partner;
        const res = await axios.get("/api/partner/service", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setServicesProvided(res.data.services || []);
      } catch (error) {
        toast.error("Error fetching services");
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const handleAddService = async () => {
    if (!selectedService) return;
    setButtonLoading(true);

    try {
      const partner = JSON.parse(localStorage.getItem("partner"));
      const { token } = partner;

      await axios.post(
        "/api/partner/service",
        { serviceId: selectedService },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Refresh services list after adding
      const res = await axios.get("/api/partner/service", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServicesProvided(res.data.services || []);

      // Reset selection
      setSelectedService("");
      toast.success("Service added Successfully");
    } catch (error) {
      toast.error(error.response?.data?.error || "Error adding service");
    } finally {
      setButtonLoading(false);
    }
  };

  const handleRemoveService = async (serviceId) => {
    setRemovingServiceId(serviceId); // Set the loading state for the specific service being removed

    try {
      const partner = JSON.parse(localStorage.getItem("partner"));
      const { token } = partner;

      await axios.delete("/api/partner/service", {
        data: { serviceId },
        headers: { Authorization: `Bearer ${token}` },
      });

      // Refresh services list after removing
      const res = await axios.get("/api/partner/service", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setServicesProvided(res.data.services || []);
      toast.success("Service removed successfully");
    } catch (error) {
      toast.error("Error removing service");
    } finally {
      setRemovingServiceId(null); // Reset loading state
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex h-16 items-center gap-4 px-6 bg-white border-b border-gray-200">
        <SidebarTrigger className="text-gray-600 hover:text-gray-900" />
        <Separator orientation="vertical" className="h-6" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <Link href="/partner/dashboard" className="text-gray-600 hover:text-gray-900">
                Partner
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-medium">Services Provided</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Service Management</h2>
          <p className="mt-2 text-gray-600">Add and manage the services you provide to customers.</p>
        </div>

        <Card className="shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-lg font-semibold text-gray-900">Add a New Service</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Service</Label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
              >
                <option value="">Select a service</option>
                {availableServices.map((service) => (
                  <option key={service._id} value={service._id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>
            <Button
              className="mt-6"
              onClick={handleAddService}
              disabled={!selectedService || buttonLoading}
            >
              {buttonLoading ? "Adding..." : "Add Service"}
            </Button>
          </CardContent>
        </Card>

        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Services You Provide</h3>
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-16 w-full rounded-lg" />
              <Skeleton className="h-16 w-full rounded-lg" />
              <Skeleton className="h-16 w-full rounded-lg" />
            </div>
          ) : servicesProvided.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-600">You have not added any services yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {servicesProvided.map((service) => (
                <div
                  key={service.service._id}
                  className="p-4 rounded-lg bg-white border border-gray-200 shadow-sm hover:border-gray-300 transition-colors flex justify-between items-center"
                >
                  <div>
                    <h4 className="font-medium text-gray-900">{service.service.name}</h4>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-gray-600"
                    onClick={() => handleRemoveService(service.service._id)}
                    disabled={removingServiceId === service.service._id}
                  >
                    {removingServiceId === service.service._id ? "Removing..." : "Remove"}
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
