"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { useEffect } from "react";
import axios from "axios";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Action } from "@radix-ui/react-toast";

export default function Page() {
  const [pendingPartners, setPendingPartners] = useState([]);

  const [selectedPartner, setSelectedPartner] = useState(null);

  const handleClick = (partner) => {
    setSelectedPartner(partner); // Store the clicked partner's details
  };

  const handleAction = async (id, action) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found.");

    try {
      const response = await axios.post(`http://localhost:3000/api/partner/${id}/approve`, { isApproved: action }, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.log(error)
    }

    setPendingPartners((prev) => prev.filter((partner) => partner._id !== id));
    setSelectedPartner(null); // Close modal after action
  };

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No authentication token found.");

        const response = await axios.get("http://localhost:3000/api/partner", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data)
        setPendingPartners(response.data.filter((partner) => {
          return partner.isApproved === "0"
        }));
      } catch (err) {
        console.log(err.response?.data?.error || err.message);
      }
    };

    fetchPartners();
  }, []);

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
                <BreadcrumbPage>Add Partner</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      {/* Pending Partners Section */}
      <div className="m-2 sm:m-2 md:m-4 lg:m-10 p-6 bg-white shadow-lg rounded-lg border border-black relative">
        <h2 className="text-2xl font-semibold text-black mb-4">Pending Partner Approvals</h2>

        {pendingPartners.length === 0 ? (
          <p className="text-gray-600">No pending partners.</p>
        ) : (
          <ul className="space-y-4">
            {pendingPartners.map((partner, id) => (
              <li key={id} className="p-4 bg-black text-white rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-medium">{partner.name}</p>
                </div>
                <button
                  onClick={() => handleClick(partner)}
                  className="px-4 py-2 bg-white text-black border border-black rounded-md hover:bg-gray-100 transition"
                >
                  View Details
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Pop-up (Modal) - Centered Inside the Div */}
      {selectedPartner && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-60">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 border border-black relative">
            {/* Close (X) Button */}
            <button
              onClick={() => setSelectedPartner(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-black transition text-xl"
            >
              ✕
            </button>

            {/* Partner Details */}
            <h3 className="text-xl font-semibold mb-4 text-black text-center">Partner Details</h3>
            <p className="text-black"><strong>Name:</strong> {selectedPartner.name}</p>
            <p className="text-black"><strong>Email:</strong> {selectedPartner.email}</p>
            <p className="text-black"><strong>Phone:</strong> {selectedPartner.phone}</p>

            {/* Action Buttons */}
            <div className="flex justify-between mt-4">
              <button
                onClick={() => handleAction(selectedPartner._id, 1)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
              >
                Accept
              </button>
              <button
                onClick={() => handleAction(selectedPartner._id, -1)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
