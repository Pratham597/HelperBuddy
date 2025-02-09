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

export default function ServiceManagement() {
  const [availableServices, setAvailableServices] = useState([]);
  const [servicesProvided, setServicesProvided] = useState([]);
  const [selectedService, setSelectedService] = useState("");
  const [pincode, setPincode] = useState("");
  const [removeMode, setRemoveMode] = useState(false);
  const [selectedForRemoval, setSelectedForRemoval] = useState([]);

  // Fetch services on component mount
  useEffect(() => {
    const fetchAvailableServices = async () => {
      const { data } = await axios.get("/api/service");

      if (Array.isArray(data)) {
        setAvailableServices(data);
      }
    }

    const fetchServices = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authentication token found");
        return;
      }

      try {
        const { data } = await axios.get("/api/partner/service", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(data)
        if (Array.isArray(data.services)) {
          setServicesProvided(data.services);
        } else {
          setServicesProvided([]);
          console.error("Unexpected response format:", data);
        }
      } catch (error) {
        console.error("Error fetching services:", error.response?.data || error.message);
        setServicesProvided([]);
      }
    };

    fetchServices();
    fetchAvailableServices();
  }, []);

  // Add Service Handler
  const handleAddService = async (e) => {
    e.preventDefault();
    if (!selectedService || !pincode) {
      alert("All fields are required");
      return;
    }
    console.log(selectedService, pincode)
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No authentication token found");
      return;
    }

    try {
      const { data } = await axios.post(
        "/api/partner/service",
        { service: selectedService, pincode },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setServicesProvided([...servicesProvided, data]);
      setSelectedService("");
      setPincode("");
    } catch (error) {
      console.error("Error adding service:", error.response?.data || error.message);
    }
  };

  // Toggle service selection for removal
  const toggleServiceSelection = (serviceName) => {
    setSelectedForRemoval((prev) =>
      prev.includes(serviceName) ? prev.filter((s) => s !== serviceName) : [...prev, serviceName]
    );
  };

  // Remove Services Handler
  const handleRemoveServices = async () => {
    if (selectedForRemoval.length === 0) return;

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No authentication token found");
      return;
    }

    try {
      await axios.post(
        "/api/partner/services/remove",
        { services: selectedForRemoval },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setServicesProvided(servicesProvided.filter((s) => !selectedForRemoval.includes(s.name)));
      setSelectedForRemoval([]);
      setRemoveMode(false);
    } catch (error) {
      console.error("Error removing services:", error.response?.data || error.message);
    }
  };

  return (
    <>
      {/* Header */}
      <header className="flex h-16 items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <Link href={`/partner/dashboard`}>Partner</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Services Provided</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="mx-auto p-6 bg-white shadow-md rounded-lg max-w-screen-2xl">
        <h2 className="text-2xl font-semibold mb-6">Service Management</h2>

        {/* Add Service Form */}
        <form onSubmit={handleAddService} className="bg-gray-100 p-4 rounded-lg mb-6 w-full">
          <h3 className="text-lg font-medium mb-3">Add a New Service</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Service Selection */}
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium">Service</label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select a service</option>
                {availableServices.map((service) => (
                  <option key={service.name} value={service.name}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Pincode Input */}
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium">Pincode</label>
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Enter pincode"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <button type="submit" className="w-full mt-4 py-2 bg-blue-600 text-white rounded-md text-lg font-semibold hover:bg-blue-700 transition">
            Add Service
          </button>
        </form>

        {/* Provided Services */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-3">Services You Provide</h3>
          {servicesProvided.length === 0 ? (
            <p className="text-gray-500">You have not added any services yet.</p>
          ) : (
            <ul className="space-y-3">
              {servicesProvided.map((service) => (
                <li
                  key={service.name}
                  className={`p-3 rounded-md flex justify-between items-center ${removeMode && selectedForRemoval.includes(service.name) ? "bg-red-200" : "bg-white"
                    }`}
                  onClick={() => removeMode && toggleServiceSelection(service.name)}
                >
                  <span>{service.name} (Pincode: {service.pincode})</span>
                  {removeMode && (
                    <input type="checkbox" checked={selectedForRemoval.includes(service.name)} readOnly className="h-4 w-4" />
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Remove Mode Buttons */}
        <div className="mt-4 flex gap-3">
          {!removeMode ? (
            <button className="px-4 py-2 bg-red-600 text-white rounded-md" onClick={() => setRemoveMode(true)}>
              Remove Services
            </button>
          ) : (
            <>
              <button className="px-4 py-2 bg-gray-600 text-white rounded-md" onClick={() => setRemoveMode(false)}>
                Cancel
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-md" onClick={handleRemoveServices}>
                Confirm Removal
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}
