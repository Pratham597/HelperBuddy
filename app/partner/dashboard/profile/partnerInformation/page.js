"use client";

import { useState, useEffect } from "react";
import axios from "axios";
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

export default function PartnerProfilePage() {
  const [profile, setProfile] = useState(null);
  const [isChanged, setIsChanged] = useState(false);
  const [originalProfile, setOriginalProfile] = useState(null);
  const [selectedPincode, setSelectedPincode] = useState("");
  const [pincodeList, setPincodeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedProfile = JSON.parse(localStorage.getItem("partner"));
    if (storedProfile) {
      setProfile({
        name: storedProfile.name || "",
        email: storedProfile.email || "",
        phone: storedProfile.phone || "",
        token: storedProfile.token || "",
      });
      setOriginalProfile({ ...storedProfile });
      setPincodeList(storedProfile.pincode || []);
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
    localStorage.setItem("partner", JSON.stringify({ ...profile, pincode: pincodeList }));
    setIsChanged(false);
    setOriginalProfile({ ...profile });
  };

  const handlePincodeChange = (event) => {
    setSelectedPincode(event.target.value);
  };

  const handlePincodeUpdate = async () => {
    if (!selectedPincode || pincodeList.includes(selectedPincode)) return;
    setLoading(true);
    setError("");

    try {
      const partner = JSON.parse(localStorage.getItem("partner"));
      if (!partner || !partner.token) throw new Error("No authentication token found.");

      const response = await axios.put("/api/partner/profile", {
        pincode: selectedPincode,
        function: "ADD",
      }, {
        headers: { Authorization: `Bearer ${partner.token}` },
      });

      const updatedPincodes = response.data.pincode || [];
      setPincodeList(updatedPincodes);
      localStorage.setItem("partner", JSON.stringify({ ...profile, pincode: updatedPincodes }));
      setSelectedPincode("");
    } catch (error) {
      setError(error.message || "Failed to add pincode");
    } finally {
      setLoading(false);
    }
  };

  const handlePincodeRemove = async (pincode) => {
    setLoading(true);
    setError("");

    try {
      const partner = JSON.parse(localStorage.getItem("partner"));
      if (!partner || !partner.token) throw new Error("No authentication token found.");
      console.log(partner.token)
      const response = await axios.put("/api/partner/profile", {
        pincode,
        function: "DELETE",
      }, {
        headers: { Authorization: `Bearer ${partner.token}` },
      });

      const updatedPincodes = response.data.pincode || [];
      setPincodeList(updatedPincodes);
      localStorage.setItem("partner", JSON.stringify({ ...profile, pincode: updatedPincodes }));
    } catch (error) {
      setError(error.response?.data?.error || error.message || "Failed to remove pincode"); // ✅ Fix applied
    } finally {
      setLoading(false);
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
              <BreadcrumbPage className="font-medium">Partner Information</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <Card className="shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-lg font-semibold text-gray-900">Edit Profile</CardTitle>
            <CardDescription className="text-gray-600">Update your personal information</CardDescription>
          </CardHeader>
          {profile ? (
            <form onSubmit={handleSubmit}>
              <CardContent className="p-6 space-y-6">
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
              </CardContent>
              <CardFooter className="p-6 border-t border-gray-100">
                <Button type="submit" disabled={!isChanged}>
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

        <Card className="shadow-sm mt-6">
          <CardHeader className="border-b border-gray-100">
            <CardTitle>Service Pincode</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <Input
              placeholder="Enter a pincode"
              value={selectedPincode}
              onChange={handlePincodeChange}
              className="w-full h-10 border border-gray-300 rounded-md"
            />
            <Button onClick={handlePincodeUpdate} disabled={!selectedPincode || loading}>
              {loading ? "Adding..." : "Add Pincode"}
            </Button>
            {error && <p className="text-red-500">{error}</p>}
            <ul className="mt-4 space-y-2">
              {pincodeList.map((pincode) => (
                <li key={pincode} className="flex justify-between">
                  <span>{pincode}</span>
                  <Button className="bg-black" onClick={() => handlePincodeRemove(pincode)} disabled={loading}>
                    {loading ? "Removing..." : "Remove"}
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
