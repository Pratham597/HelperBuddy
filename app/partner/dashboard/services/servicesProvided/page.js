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
    const fetchServices = async () => {
      const { data } = await axios.get("/api/service");
      if (Array.isArray(data)) {
        setAvailableServices(data);
      }

      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No authentication token found");
        return;
      }

      try {
        const { data } = await axios.get("/api/partner/service", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(data.services)
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
  }, []);

  // Add Service Handler
  const handleAddService = async (e) => {
    e.preventDefault();
    if (!selectedService || !pincode) {
      console.log("all fields are required")
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No authentication token found");
      return;
    }

    try {
      const { data } = await axios.post(
        "/api/partner/service",
        { serviceId: selectedService, pincode },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setServicesProvided([...servicesProvided, data.services[0]]);
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
              <Link href={"/partner/dashboard"}>Partner</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Services Provided</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <div className="m-2 sm:m-3 md:m-4 lg:m-10 p-6 bg-white shadow-lg rounded-lg border border-black">
        <h2 className="text-2xl font-semibold text-black mb-6">Service Management</h2>

        {/* Add Service Form */}
        <form onSubmit={handleAddService} className="bg-white p-4 rounded-lg mb-6 w-full shadow-sm border border-black">
          <h3 className="text-lg font-medium text-black mb-3">Add a New Service</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Service Selection */}
            <div className="flex flex-col">
              <label className="text-black font-medium">Service</label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full p-2 border border-black rounded-md bg-white text-black focus:outline-none focus:ring-1 focus:ring-black"
              >
                <option value="">Select a service</option>
                {availableServices.map((service) => (
                  <option key={service._id} value={service._id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Pincode Input */}
            <div className="flex flex-col">
              <label className="text-black font-medium">Pincode</label>
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Enter pincode"
                className="w-full p-1.5 border border-black rounded-md bg-white text-black focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>
          </div>

          <button type="submit" className="w-36 mt-4 py-2 bg-black text-white rounded-md text-md font-normal hover:bg-gray-800 transition">
            Add Service
          </button>
        </form>

        {/* Provided Services */}
        <div className="bg-gray-100 p-4 rounded-lg border border-black">
          <h3 className="text-lg font-semibold mb-3 text-black">Services You Provide</h3>
          {servicesProvided.length === 0 ? (
            <p className="text-gray-500">You have not added any services yet.</p>
          ) : (
            <ul className="space-y-3">
              {servicesProvided.map((service, id) => (
                <li
                  key={id}
                  className={`p-3 rounded-md flex justify-between items-center border border-black ${removeMode && selectedForRemoval.includes(service.service.name) ? "bg-gray-300" : "bg-white"
                    }`}
                  onClick={() => removeMode && toggleServiceSelection(service.service.name)}
                >
                  <span className="text-black">{service.service.name}</span>
                  {removeMode && (
                    <input type="checkbox" checked={selectedForRemoval.includes(service.service.name)} readOnly className="h-4 w-4 border-black" />
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Remove Mode Buttons */}
        <div className="mt-4 flex gap-3">
          {!removeMode ? (
            <button className="px-4 py-2 bg-black text-white rounded-md" onClick={() => setRemoveMode(true)}>
              Remove Services
            </button>
          ) : (
            <>
              <button className="px-4 py-2 bg-gray-500 text-white rounded-md" onClick={() => setRemoveMode(false)}>
                Cancel
              </button>
              <button className="px-4 py-2 bg-black text-white rounded-md" onClick={handleRemoveServices}>
                Confirm Removal
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}